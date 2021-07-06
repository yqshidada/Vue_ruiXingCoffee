<template>
  <div class="home">
    <van-nav-bar>
      <template #left>
        <div class="home-title">
          <div>午夜好</div>
          <div class="username one-text">阿丽斯阿丽斯阿丽斯阿丽斯阿丽斯阿丽斯</div>
        </div>
      </template>
      <template #right>
        <van-search placeholder="输入商品名称" shape="round" />
      </template>
    </van-nav-bar>
    
    <van-swipe @change="changeCurrentIndex" :autoplay="5000">

      <van-swipe-item v-for="(item, index) in bannerData" :key="index">
        <img @click="viewProduct(item.pid)" class="auto-img" :src="item.bannerImg" alt="">
      </van-swipe-item>

      <template #indicator>
          <div class="indicator-box">
            <div class="indicator-item" :class="{active: currentIndex === i}" v-for="(v, i) in bannerData.length" :key="i"></div>
          </div>
      </template>
    </van-swipe>

    <div class="product-box">
      <div class="line">
        <span>热卖推荐</span>
      </div>
      <div class="product-items">

        <Product class="product-item" v-for="(item, index) in hotProduct" :key="index" :product="item">
          <template #hot>
            <div class="hot-box">hot</div>
          </template>
        </Product>

      </div>
    </div>

  </div>
</template>

<script>

import '../assets/less/home.less';

import Product from '../components/Product.vue';

export default {
  name: 'Home',

  data() {
    return {
      currentIndex: 0,

      //轮播图数据
      bannerData: [],

      //热卖商品数据
      hotProduct: []
    };
  },

  created() {
    //生成data, 但是没有$el(没有生成<div id="app"></div>)
    this.getBannerData();

    this.getHotProduct();

  },

  components: {
    Product
  },

  methods: {

    //切换轮播图
    changeCurrentIndex(index) {
      this.currentIndex = index;
    },

    //获取轮播图数据
    getBannerData() {

      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      });

      this.axios({
        //请求方式
        method: 'GET',
        url: this.baseUrl + '/banner',
        params: {
          appkey: this.appkey
        }
      }).then(res => {
        
        this.$toast.clear();

        if (res.data.code === 300) {
          this.bannerData = res.data.result;
        } else {
          this.$toast({
            message: res.data.msg,
            forbidClick: true,
            duration: 3000
          })
        }
        
      }).catch(err => {
        this.$toast.clear();
        
      })
    },

    //获取首页热卖推荐商品
    getHotProduct() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      });

      this.axios({
        //请求方式
        method: 'GET',
        url: this.baseUrl + '/typeProducts',
        params: {
          appkey: this.appkey,
          key: 'isHot',
          value: 1
        }
      }).then(res => {
        
        this.$toast.clear();

        if (res.data.code === 500) {
          this.hotProduct = res.data.result;
        } else {
          this.$toast({
            message: res.data.msg,
            forbidClick: true,
            duration: 3000
          })
        }
        
      }).catch(err => {
        this.$toast.clear();
        
      })
    },

    //查看商品详情
    viewProduct(pid) {
      this.$router.push({name: 'Detail', params: {pid}});
    }
  }
}
</script>