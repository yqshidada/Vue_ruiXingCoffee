<template>
  <div class="main">
    <div>
      <!-- 二级路由 -->
      <router-view></router-view>
    </div>

    <van-tabbar v-model="activeIndex" active-color="#0C34BA" inactive-color="#646566" route>
      <van-tabbar-item
        v-for="(item, index) in tabbarData"
        :key="index"
        :badge="item.badge > 0 ? item.badge : ''"
        :dot="item.dot"
        :to="item.to"
      >
        <span>{{item.title}}</span>
        <template #icon="props">
          <img :src="props.active ? item.icon.active : item.icon.inactive" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "Main",

  data() {
    return {
      activeIndex: 0,

     
    };
  },

  computed: {
    ...mapState(["shopbagCount", "isLoadShopbagCount"]),

    tabbarData() {
       return [
        {
          title: "首页",
          icon: {
            active: require("../assets/images/home_active.png"),
            inactive: require("../assets/images/home.png"),
          },
          to: "/",
        },
        {
          title: "菜单",
          icon: {
            active: require("../assets/images/menu_active.png"),
            inactive: require("../assets/images/menu.png"),
          },
          to: "/menu",
        },
        {
          title: "购物袋",
          icon: {
            active: require("../assets/images/shopbag_active.png"),
            inactive: require("../assets/images/shopbag.png"),
          },
          badge: this.shopbagCount,
          to: "/shopbag",
        },
        {
          title: "我的",
          icon: {
            active: require("../assets/images/my_active.png"),
            inactive: require("../assets/images/my.png"),
          },
          dot: false,
          to: "/my",
        },
      ];
    }
  },

  created() {
    

    this.getShopbagCount();
  },

  methods: {

    //mutations
    ...mapMutations(['changeShopbagCount', 'changeIsLoadShopbagCount']),
    //等价于
    // changeShopbagCount(data) {
    //   this.$store.commit('changeShopbagCount', data)
    // },

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
  },
};
</script>

<style lang="less" scoped>
.main {
  padding-bottom: 50px;
}
</style>