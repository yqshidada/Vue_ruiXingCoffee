import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

//修改state唯一途径，通过mutations

export default new Vuex.Store({
  state: {
    //购物袋数量
    shopbagCount: 0,
    //是否加载购物袋数量
    isLoadShopbagCount: false
  },

  mutations: {
    changeShopbagCount(state, data) {
      //state: vuex状态state
      //data: 载荷(参数)

      // 
      state.shopbagCount = data;
    },

    changeIsLoadShopbagCount(state, data) {
      state.isLoadShopbagCount = data;
    }
  }
})
