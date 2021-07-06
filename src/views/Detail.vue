<template>
  <div class="detail">
    <van-nav-bar title="商品详情" left-text="返回" left-arrow @click-left="back" />

    <div>
      <img class="auto-img" :src="detailData.large_img" alt />
    </div>

    <div class="pro-info">
      <div class="pro-box">
        <div class="pro-name">
          <div class="ch-name">{{detailData.name}}</div>
          <div class="en-name">{{detailData.enname}}</div>
        </div>
        <div class="pro-price">&yen;{{detailData.price}}</div>
      </div>

      <!-- 规格 -->
      <div class="rules">
        <div class="rule" v-for="(v1, i1) in detailData.rulesData" :key="i1">
          <div class="rule-title">{{v1.title}}</div>

          <div class="rule-items">
            <div
              :class="{active: v1.currentIndex === i2}"
              v-for="(v2, i2) in v1.rule"
              :key="i2"
              @click="selectRule(v1, i2)"
            >{{v2.title}}</div>
          </div>
        </div>
      </div>

      <!-- 数量 -->
      <div class="count-box">
        <div class="select-count">选择数量</div>
        <div class="count">
          <van-stepper v-model="count" theme="round" button-size="22" disable-input />
        </div>
      </div>

      <!-- 描述 -->
      <div class="desc">
        <div class="desc-title">商品描述</div>
        <div class="desc-text">
          <div v-for="(item, index) in detailData.desc" :key="index">{{index + 1}}、{{item}}</div>
        </div>
      </div>
    </div>

    <van-goods-action>
      <van-goods-action-icon
        icon="bag"
        text="购物袋"
        color="#666"
        :badge="shopbagCount > 0 ? shopbagCount : ''"
        @click="goShopbag"
      />
      <van-goods-action-icon
        icon="like"
        :text="likeStatus ? '已收藏' : '收藏'"
        :color="likeStatus ? '#0C34BA' : '#666'"
        @click="likeAndNotLike"
      />
      <van-goods-action-button color="#6A91EC" type="warning" text="加入购物袋" @click="addShopbag" />
      <van-goods-action-button color="#0C34BA" type="danger" text="立即购买" @click="buyNow" />
    </van-goods-action>
  </div>
</template>

<script>
import "../assets/less/detail.less";
import {mapState, mapMutations} from 'vuex';
export default {
  name: "Detail",

  data() {
    return {
      //商品pid
      pid: "",

      //商品详情数据
      detailData: {},

      //收藏状态
      likeStatus: false,

      //选择数量
      count: 1,
    };
  },

  created() {
    //截取pid
    this.pid = this.$route.params.pid;

    this.getDetailData();

    this.getLikeProduct();

    this.getShopbagCount();

  },

  computed: {
    ...mapState(['shopbagCount', 'isLoadShopbagCount'])
  },

  methods: {

    ...mapMutations(['changeShopbagCount', 'changeIsLoadShopbagCount']),

    //返回上一级
    back() {
      this.$router.go(-1);
    },

    //获取商品详情数据
    getDetailData() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        //请求方式
        method: "GET",
        url: this.baseUrl + "/productDetail",
        params: {
          appkey: this.appkey,
          pid: this.pid,
        },
      })
        .then((res) => {
          
          this.$toast.clear();

          if (res.data.code === 600) {
            let data = res.data.result[0];

            //处理res
            let rules = ["cream", "tem", "sugar", "milk"];

            //保存处理规格数据
            data.rulesData = [];

            rules.forEach((v) => {
              //如果不存在规格，则不添加到data.rulesData
              if (!data[v]) {
                return;
              }

              let rulesText = data[v].split("/");

              let currentRule = {
                title: data[v + "_desc"],
                currentIndex: 0,
                rule: [],
              };

              rulesText.forEach((item) => {
                let o = {
                  title: item,
                };
                currentRule.rule.push(o);
              });

              data.rulesData.push(currentRule);
            });

            //处理商品描述信息
            data.desc = data.desc.split(/\n/);

            

            this.detailData = data;
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

    //选择规格
    selectRule(item, index) {
      //如果点击相同rule
      if (item.currentIndex === index) {
        return;
      }

      item.currentIndex = index;
    },

    //收藏或者取消收藏
    likeAndNotLike() {
      if (this.likeStatus) {
        //取消收藏
        this.notLike();
      } else {
        //收藏
        this.like();
      }
    },

    //收藏
    like() {
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
        url: this.baseUrl + "/like",
        data: {
          appkey: this.appkey,
          pid: this.pid,
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

          if (res.data.code === 800) {
            //已收藏
            this.likeStatus = true;
          } else {
            this.$toast({
              message: res.data.msg,
              // forbidClick: true,
              duration: 3000,
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //查询当前收藏商品
    getLikeProduct() {
      let tokenString = this.$cookies.get("tokenString");
      // 

      if (!tokenString) {
        
        return;
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        //请求方式
        method: "GET",
        url: this.baseUrl + "/findlike",
        params: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString,
        },
      })
        .then((res) => {
          
          this.$toast.clear();

          if (res.data.code == 700) {
            return;
          }

          if (res.data.code === 1000) {
            //已收藏
            // this.likeStatus = true;

            if (res.data.result.length > 0) {
              this.likeStatus = true;
            }
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //取消收藏
    notLike() {
      let tokenString = this.$cookies.get("tokenString");
      

      if (!tokenString) {
        
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中...",
        // forbidClick: true,
        duration: 0,
      });

      this.axios({
        //请求方式
        method: "POST",
        url: this.baseUrl + "/notlike",
        data: {
          appkey: this.appkey,
          pid: this.pid,
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

          if (res.data.code === 900) {
            if (res.data.result === 1) {
              //取消收藏
              this.likeStatus = false;
            }
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

    //添加购物袋
    addShopbag(isBuy) {
      let tokenString = this.$cookies.get("tokenString");
      // 

      if (!tokenString) {
        
        return this.$router.push({ name: "Login" });
      }

      let rules = [];
      this.detailData.rulesData.forEach((v) => {
        rules.push(v.rule[v.currentIndex].title);
      });

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        //请求方式
        method: "POST",
        url: this.baseUrl + "/addShopcart",
        data: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString,
          count: this.count,
          rule: rules.join("/"),
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

          if (res.data.code === 3000) {
            if (res.data.status === 1) {
             
              //提交mutations修改shopbagCount
              this.changeShopbagCount(this.shopbagCount + 1);

              this.$toast({
                message: res.data.msg,
                forbidClick: true,
                duration: 3000,
              });
            }

            if (isBuy) {
              this.$router.push({name: 'Pay', query: {sids: res.data.sid}});
            }
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

    //跳转到购物袋页面
    goShopbag() {
      this.$router.push({name: 'Shopbag'});
    },

    //获取购物袋的数目(不是商品总数量)
    getShopbagCount() {

      if (this.isLoadShopbagCount) {
        
        return;
      }

      let tokenString = this.$cookies.get("tokenString");
      // 

      if (!tokenString) {
        
        return;
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        //请求方式
        method: "GET",
        url: this.baseUrl + "/shopcartRows",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((res) => {
          
          this.$toast.clear();

          //没有登录
          if (res.data.code == 700) {
            return;
          }

          if (res.data.code === 8000) {
            //提交changeShopbagCount的mutations
            this.changeShopbagCount(res.data.result);
            // 
            this.changeIsLoadShopbagCount(true);
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //立即购买
    buyNow() {
      this.addShopbag(true);
    }
  },
};
</script>