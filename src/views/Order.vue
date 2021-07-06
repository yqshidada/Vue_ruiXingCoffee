<template>
  <div class="order">
    <van-nav-bar title="我的订单" left-text="返回" left-arrow @click-left="back" />
    <Bg>
      <van-tabs
        v-model="activeTabIndex"
        swipeable
        :line-height="2"
        color="#0C34BA"
        title-active-color="#0C34BA"
        title-inactive-color="#666"
        @change="changeOrderStatus"
      >
        <van-tab v-for="(item, index) in tabs" :key="index" :title="item.title">
          <div class="tab-content">
            <div v-if="orderData.length > 0">
              <div class="tab-box" v-for="(v1, i1) in orderData" :key="i1">
                <PayBox :pro-info="v1.proInfo">
                  <template #pay-title>
                    <div class="pay-title-box">
                      <div class="pay-t">{{v1.oid}}</div>
                      <div class="pay-s" v-if="v1.status === 2">
                        <div class="pay-text">已完成</div>
                        <div class="pay-icon" @click="removeOrder(v1.oid, i1)">
                          <van-icon name="delete-o" />
                        </div>
                      </div>
                      <div class="pay-s" v-if="v1.status === 1">
                        <div class="pay-text" @click="confirmOrder(v1, i1)">确认订单</div>
                      </div>
                    </div>
                  </template>
                  <template #order-item>
                    <OrderItem v-for="(v2, i2) in v1.data" :key="i2" :product="v2"></OrderItem>
                  </template>
                </PayBox>
              </div>
            </div>
            <div v-else>
              <van-empty description="没有该状态的订单" />
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </Bg>
  </div>
</template>

<script>
import "../assets/less/order.less";
import Bg from "../components/Bg.vue";
import PayBox from "../components/PayBox.vue";
import OrderItem from "../components/OrderItem.vue";
export default {
  name: "Order",

  data() {
    return {
      activeTabIndex: 0,

      tabs: [
        {
          title: "全部",
          status: 0,
        },
        {
          title: "进行中",
          status: 1,
        },
        {
          title: "已完成",
          status: 2,
        },
      ],

      //订单数据
      orderData: [],
    };
  },

  components: {
    Bg,
    PayBox,
    OrderItem,
  },

  created() {
    this.getOrderData(0);
  },

  methods: {
    //返回上一级
    back() {
      this.$router.go(-1);
    },

    //获取订单数据
    getOrderData(status) {
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
        url: this.baseUrl + "/findOrder",
        params: {
          appkey: this.appkey,
          tokenString,
          status,
        },
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

          if (res.data.code === 70000) {
            //按照订单编号分类
            // [
            //   {
            //     oid: '',
            //     status: 1,
            //     date: '',
            //     count: '',
            //     total: '',
            //     data: [
            //       {商品数据},
            //       {商品数据},
            //     ]
            //   }
            // ]

            let products = [];

            let oids = [];

            //先找oid
            res.data.result.forEach((v) => {
              v.small_img = v.smallImg;
              if (oids.indexOf(v.oid) === -1) {
                let o = {
                  oid: v.oid,
                  status: v.status,
                  proInfo: {
                    date: v.updatedAt,
                    count: 0,
                    total: 0,
                  },
                  data: [],
                };
                oids.push(v.oid);
                products.push(o);
              }
            });

            //通过oid查找相应的订单商品
            products.forEach((value) => {
              res.data.result.forEach((item) => {
                if (value.oid === item.oid) {
                  value.data.push(item);
                  value.proInfo.count += item.count;
                  value.proInfo.total += item.count * item.price;
                }
              });
            });

            // 
            // 

            this.orderData = products;
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

    //切换订单状态
    changeOrderStatus(name, title) {
      this.getOrderData(name);
    },

    //确认订单
    confirmOrder(item, index) {
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
        method: "POST",
        url: this.baseUrl + "/receive",
        data: {
          appkey: this.appkey,
          tokenString,
          oid: item.oid
        },
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

          if (res.data.code === 80000) {
            item.status = 2;

            // 

            if (this.activeTabIndex === 1) {
              //移除当前tab的订单数据
              this.orderData.splice(index, 1);
            }
          }

          this.$toast({
            message: res.data.msg,
            forbidClick: true,
            duration: 3000,
          });
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //删除订单
    removeOrder(oid, index) {
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
        method: "POST",
        url: this.baseUrl + "/removeOrder",
        data: {
          appkey: this.appkey,
          tokenString,
          oid
        },
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

          if (res.data.code === 90000) {
            this.orderData.splice(index, 1);
          }

          this.$toast({
            message: res.data.msg,
            forbidClick: true,
            duration: 3000,
          });
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    }
  },
};
</script>