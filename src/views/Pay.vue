<template>
  <div class="pay">
    <van-nav-bar title="结算订单" left-text="返回" left-arrow @click-left="back" />
    <div class="pay-box">
      <div class="select-box">
        <div class="select">
          <div class="s-address" @click="showAddressList">选择地址</div>
          <van-icon name="arrow" />
        </div>
        <div class="address-box" v-if="currentAddress.aid">
          <div class="user-info">
            <div class="user-name">{{currentAddress.name}}</div>
            <div class="phone">{{currentAddress.tel}}</div>
            <div class="default" v-if="currentAddress.isDefault">默认</div>
          </div>
          <div class="address-detail">{{currentAddress.address}}</div>
        </div>
      </div>

      <div class="pay-info">
        <PayBox :pro-info="proInfo">
          <template #order-item>
            <OrderItem v-for="(item, index) in payShopbagData" :key="index" :product="item"></OrderItem>
          </template>
        </PayBox>
      </div>
    </div>

    <van-popup v-model="show" position="bottom" closeable>
      <div class="address-boxing">
        <van-address-list v-model="chosenAddressId" :list="list" default-tag-text="默认" @add="add" @select=selectAddress />
      </div>
    </van-popup>

    <div class="pay-btn">
      <van-button color="#0C34BA" block round @click="pay">立即结算</van-button>
    </div>
  </div>
</template>

<script>
import "../assets/less/pay.less";

import PayBox from "../components/PayBox.vue";
import OrderItem from "../components/OrderItem.vue";

import {mapState, mapMutations} from 'vuex';

export default {
  name: "Pay",

  data() {
    return {
      show: false,
      chosenAddressId: "",
      list: [],

      //当前地址信息
      currentAddress: {

      },

      //购物袋sid集合
      sids: [],

      //需要购买的购物袋商品数据
      payShopbagData: [],

      //商品总数量和总价
      proInfo: {
        count: 0,
        total: 0
      }
    };
  },

  components: {
    PayBox,
    OrderItem,
  },

  created() {
    //截取查询参数
    this.sids = this.$route.query.sids.split("-");

    this.getAddressListData();

    this.getShopbagDataByPay();
  },

  computed: {
    ...mapState(['shopbagCount'])
  },

  methods: {

    ...mapMutations(['changeShopbagCount']),

    back() {
      this.$router.go(-1);
    },

    //显示选择地址列表
    showAddressList() {
      this.show = true;
    },

    //跳转到新增地址页面
    add() {
      this.$router.push({name: 'Address'});
    },

    //选择地址
    selectAddress(item) {

      this.chosenAddressId = item.id;
      this.currentAddress = {...item};

      this.show = false;

    },

    //查询用户地址列表
    getAddressListData() {
      let tokenString = this.$cookies.get("tokenString");

      if (!tokenString) {
        
        return this.$router.push({ name: "Login" });
      }
      
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        //请求方式
        method: "GET",
        url: this.baseUrl + "/findAddress",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then((res) => {
          
          this.$toast.clear();

          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
            return this.$router.push({ name: "Login" });
          }

          if (res.data.code === 20000) {
            //添加address属性
            res.data.result.forEach(v => {
              v.address = `${v.province}${v.city}${v.county}${v.addressDetail}`;
              v.isDefault = Boolean(v.isDefault);
              if (v.isDefault) {
                this.chosenAddressId = v.id;
                this.currentAddress = {...v};
              }
            })

            this.list = res.data.result;

            

            // 
          } else {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
          }
          
          

        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //获取订单结算的购物袋商品数据
    getShopbagDataByPay() {
      let tokenString = this.$cookies.get("tokenString");

      if (!tokenString) {
        
        return this.$router.push({ name: "Login" });
      }
      
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        //请求方式
        method: "GET",
        url: this.baseUrl + "/commitShopcart",
        params: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(this.sids)
        }
      })
        .then((res) => {
          
          this.$toast.clear();

          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
            return this.$router.push({ name: "Login" });
          }

          if (res.data.code === 50000) {

            if (res.data.result.length === 0) {
              return this.$router.push({path: '/'});
            }

            res.data.result.forEach(v => {
              this.proInfo.count += v.count;
              this.proInfo.total += v.count * v.price;
            })

            this.payShopbagData = res.data.result;
          } else {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //结算订单
    pay() {

      //判断是否选择地址
      if (!this.currentAddress.aid) {
        return this.$toast({
          message: "选择收货地址",
          forbidClick: true,
          duration: 3000,
        });
      }

      let tokenString = this.$cookies.get("tokenString");

      if (!tokenString) {
        
        return this.$router.push({ name: "Login" });
      }

      //获取参数
      let data = {
        appkey: this.appkey,
        tokenString,
        sids: JSON.stringify(this.sids),
        phone: this.currentAddress.tel,
        address: this.currentAddress.address,
        receiver: this.currentAddress.name
      };

      this.axios({
        //请求方式
        method: "POST",
        url: this.baseUrl + "/pay",
        data
      })
        .then((res) => {
          
          this.$toast.clear();

          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
            return this.$router.push({ name: "Login" });
          }

          if (res.data.code === 60000) {

            //修改vuex的购物袋数量
            this.changeShopbagCount(this.shopbagCount - this.sids.length);

            //跳转到订单组件
            this.$router.push({name: 'Order'});
          } else {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    }
  },
};
</script>