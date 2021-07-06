<template>
  <div class="shopbag">
    <van-nav-bar title="购物袋" left-text="返回" left-arrow @click-left="back">
      <template #right>
        <div @click="toggleEditStatus" v-if="shopbagData.length > 0">{{!isEdit ? '编辑' : '完成'}}</div>
      </template>
    </van-nav-bar>
    <div v-if="shopbagData.length > 0">
      <div class="shopbag-bg"></div>

      <div class="shopbag-box">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="哎呀, 没有数据啦！"
          offset="100"
          @load="loadShopbagData"
        >
          <van-swipe-cell
            class="shopbag-cell"
            :disabled="isEdit"
            v-for="(item, index) in shopbagData"
            :key="item.sid"
          >
            <div class="shopbag-item">
              <div class="check">
                <van-checkbox v-model="item.isChecked" icon-size="20px" @change="simpleSelect"></van-checkbox>
              </div>
              <div class="pro-info">
                <div class="pro-img">
                  <img class="auto-img" :src="item.small_img" alt />
                </div>
                <div class="pro-text">
                  <div class="text-box">
                    <div class="pro-names">
                      <div class="pro-name">{{item.name}}</div>
                      <div class="pro-rule">{{item.rule}}</div>
                    </div>
                    <div class="pro-enname">{{item.enname}}</div>
                  </div>
                  <div class="count-box">
                    <div class="pro-price">&yen;{{item.price}}</div>
                    <div class="pro-count">
                      <van-stepper
                        v-model="item.count"
                        theme="round"
                        button-size="22"
                        disable-input
                        @change="updateShopbagCount(item.sid, item.count)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <template #right>
              <van-button
                class="shopbag-remove-btn"
                color="#0C34BA"
                square
                text="删除"
                @click="removeShopbag([item.sid], index)"
              />
            </template>
          </van-swipe-cell>
        </van-list>
      </div>

      <van-submit-bar v-show="!isEdit" :price="total" button-text="提交订单" button-color="#0C34BA" @submit="commit">
        <van-checkbox v-model="checked" @click="allSelect">全选</van-checkbox>
      </van-submit-bar>

      <van-submit-bar
        v-show="isEdit"
        button-text="删除选择"
        button-color="#0C34BA"
        @submit="removeSelect"
      >
        <van-checkbox v-model="checked" @click="allSelect">全选</van-checkbox>
      </van-submit-bar>
    </div>
    <div v-else>
      <van-empty description="购物袋没有数据，赶紧去逛一逛！">
        <div class="guang" @click="goHome">逛一逛</div>
      </van-empty>
    </div>
  </div>
</template>

<script>
import "../assets/less/shopbag.less";

import { mapState, mapMutations } from "vuex";

export default {
  name: "Shopbag",

  data() {
    return {
      //是否编辑商品
      isEdit: false,

      //全选或者取消全选
      checked: false,

      //购物袋所有数据
      shopbagAllData: [],

      //购物袋数据
      shopbagData: [],

      //开始截取位置
      start: 0,

      //每次获取10条数据
      count: 7,

      //是否加载, 首次不触发懒加载
      loading: true,

      //是否全部加载完毕
      finished: false,

      //总金额
      total: 0,
    };
  },

  created() {
    this.getShopbagData();
  },

  computed: {
    ...mapState(["shopbagCount"]),
  },

  methods: {
    ...mapMutations(["changeShopbagCount"]),

    //返回上一级
    back() {
      this.$router.go(-1);
    },

    goHome() {
      this.$router.push({ name: "Home" });
    },

    //切换编辑状态
    toggleEditStatus() {
      this.isEdit = !this.isEdit;
    },

    //获取购物袋数据
    getShopbagData() {
      let tokenString = this.$cookies.get("tokenString");
      // 

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
        url: this.baseUrl + "/findAllShopcart",
        params: {
          appkey: this.appkey,
          tokenString,
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

          if (res.data.code === 5000) {
            res.data.result.forEach((v) => {
              v.isChecked = false;
            });

            this.shopbagAllData = res.data.result;

            this.shopbagData = this.shopbagAllData.slice(
              this.start,
              this.start + this.count
            );

            this.start += this.count;

            if (this.shopbagAllData.length < this.count) {
              this.finished = true;
              return;
            }

            //下次触底进行懒加载
            this.loading = false;
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

    //加载数据
    loadShopbagData() {
      setTimeout(() => {
        
        // 

        let data = this.shopbagAllData.slice(
          this.start,
          this.start + this.count
        );

        // 
        this.shopbagData.push(...data);
        // 
        this.start += this.count;

        //取消全选
        if (data.length > 0) {
          this.checked = false;
        }

        //如果本次截取不足this.count条数据, 下次不可能有数据
        if (data.length < this.count) {
          
          this.finished = true;
          return;
        }

        //下次进行触底懒加载
        this.loading = false;
      }, 1000);
    },

    //修改购物袋数量
    updateShopbagCount(sid, count) {
      let tokenString = this.$cookies.get("tokenString");
      // 

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
        url: this.baseUrl + "/modifyShopcartCount",
        data: {
          appkey: this.appkey,
          tokenString,
          sid,
          count,
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

          if (res.data.code === 6000) {
            this.sum();
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

    //全选
    allSelect() {
      //将所有单选状态修改位全选状态
      this.shopbagData.forEach((v) => {
        v.isChecked = this.checked;
      });

      this.sum();
    },

    //单选
    simpleSelect() {
      this.sum();

      //只要有一个单选没有勾选，则全选不能勾选
      for (let i = 0; i < this.shopbagData.length; i++) {
        if (!this.shopbagData[i].isChecked) {
          this.checked = false;
          return;
        }
      }

      this.checked = true;
    },

    //删除购物袋数据, 删除成功后, 记得修改vuex的购物袋数量
    removeShopbag(sids, index) {
      let tokenString = this.$cookies.get("tokenString");
      // 

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
        url: this.baseUrl + "/deleteShopcart",
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(sids),
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

          if (res.data.code == 7000) {
            //如果是单个
            if (index !== undefined) {
              this.shopbagData.splice(index, 1);

              this.changeShopbagCount(this.shopbagCount - 1);

              this.simpleSelect();
            } else {
              //执行多个删除
              for (let i = 0; i < this.shopbagData.length; i++) {
                if (this.shopbagData[i].isChecked) {
                  this.shopbagData.splice(i, 1);
                  i--;
                }
              }

              this.changeShopbagCount(this.shopbagCount - sids.length);
              this.sum();
            }

            this.$nextTick(() => {
              let cells = document.querySelectorAll(".shopbag-cell");

              

              if (cells.length === 0 && this.shopbagData.length < this.shopbagAllData.length) {
                //触发懒加载
                this.loadShopbagData();
              } else {

                //获取最后一个节点距离可视区域的尺寸
                let cellSzie = cells[cells.length - 1].getBoundingClientRect();

                //获取最后一个节点距离可视区域页面顶部的距离
                let distance = cellSzie.top;
                // 

                //获取最后一个节点的高度
                let cellHeight = cellSzie.height;
                // 

                //获取屏幕高度
                let innerHeight = window.innerHeight;
                // 

                if (distance + cellHeight - innerHeight <= 50) {
                  //触发懒加载
                  this.loadShopbagData();
                }
              }
            });
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

    //删除选择的购物袋商品
    removeSelect() {
      //获取勾选的sid
      let sids = [];
      this.shopbagData.forEach((v) => {
        if (v.isChecked) {
          sids.push(v.sid);
        }
      });

      if (sids.length === 0) {
        this.$toast({
          message: "未选择删除商品",
          forbidClick: true,
          duration: 3000,
        });

        return;
      }

      

      this.removeShopbag(sids);
    },

    //计算勾选的商品总金额
    sum() {
      let total = 0;
      this.shopbagData.forEach((v) => {
        if (v.isChecked) {
          total += v.price * v.count;
        }
      });

      this.total = total * 100;
    },

    //提交订单
    commit() {
      //获取勾选的sid
      let sids = [];
      this.shopbagData.forEach((v) => {
        if (v.isChecked) {
          sids.push(v.sid);
        }
      });

      if (sids.length === 0) {
        this.$toast({
          message: "选择下单的商品",
          forbidClick: true,
          duration: 3000,
        });

        return;
      }

      this.$router.push({name: 'Pay', query: {sids: sids.join('-')}});

      
    }
  }
};
</script>