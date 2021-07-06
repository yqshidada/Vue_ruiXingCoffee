<template>
  <div class="login">
    <RXnav />
    <div class="login-box">

      <div class="login-title-box">
        <div class="login-title">欢迎回来!</div>
        <div class="login-sub-title">Please login to your accounts</div>
      </div>

      <div class="form-box">
         <van-field v-model="userLoginInfo.phone" label="手机号" placeholder="输入手机号(11位)" />
         <van-field v-model="userLoginInfo.password" :type="isText ? 'text' : 'password'" label="密码" placeholder="输入密码(6-16位)" :right-icon="isText ? 'eye-o' : 'closed-eye'" @click-right-icon="toggleType" />

         <div class="forgot"><span>忘记密码？</span></div>

         <div class="btn-box">
           <van-button round block color="#0C34BA" @click="login">登&nbsp;&nbsp;&nbsp;录</van-button>
           <van-button class="register-btn" type="default" round block @click="openPopup">注&nbsp;&nbsp;&nbsp;册</van-button>
         </div>
      </div>

    </div>

    <!-- 注册弹出层 -->
    <van-popup v-model="isOpen" position="bottom" closeable>
      <div class="register-box">
        <div class="register-title">注册</div>
        <div class="form-box">
          <van-field v-model="userRegisterInfo.phone" label="手机号" placeholder="输入手机号(11位)" />

          <van-field v-model="userRegisterInfo.password" :type="isText ? 'text' : 'password'" label="密码" placeholder="输入密码(6-16位)" :right-icon="isText ? 'eye-o' : 'closed-eye'" @click-right-icon="toggleType" />

          <van-field v-model="userRegisterInfo.nickName" label="昵称" placeholder="输入昵称(1-10位)" />

          <div class="btn-box">
            <van-button round block color="#0C34BA" @click="register">注&nbsp;&nbsp;&nbsp;册</van-button>
          </div>
        </div>
      </div>
    </van-popup>

  </div>
</template>

<script>
import "../assets/less/login.less";

import RXnav from '../components/RXnav.vue';

import {utils} from '../assets/js/utils';

import {mapMutations} from 'vuex';

export default {
  name: "Login",

  data() {
    return {
      //用户登录信息
      userLoginInfo: {
        phone: '',
        password: ''
      },

      //用户注册信息
      userRegisterInfo: {
        phone: '',
        password: '',
        nickName: ''
      },

      //是否显示弹出层
      isOpen: false,

      isText: true
    };
  },

  created() {
    this.changeShopbagCount(0);
    this.changeIsLoadShopbagCount(false);
  },

  components: {
    RXnav
  },

  methods: {

    ...mapMutations(['changeShopbagCount', 'changeIsLoadShopbagCount']),

    //显示弹出层
    openPopup() {
      this.isOpen = true;
    },

    //注册
    register() {

      let o = {
        phone: {
          value: this.userRegisterInfo.phone,
          reg: /^1[3-9]\d{9}$/,
          errorMsg: '手机号格式不正确'
        },

        password: {
          value: this.userRegisterInfo.password,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: '密码支持字母数字_组合且首字符必须为字母'
        },

        nickName: {
          value: this.userRegisterInfo.nickName,
          reg: /^[\u4e00-\u9fa5A-Za-z0-9]{1,10}$/,
          errorMsg: '昵称支持汉字字母数字组合'
        },
      };

      //验证表单
      //表单验证不通过, 拦截注册请求
      if (!utils.validForm(o)) {
        return;
      }

      //发起注册请求
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      });

      this.axios({
        //请求方式
        method: 'POST',
        url: this.baseUrl + '/register',

        //如果是POST请求，参数需要挂载到data
        //a=1&b=2&c=3
        data: {
          appkey: this.appkey,
          nickName: this.userRegisterInfo.nickName,
          password: this.userRegisterInfo.password,
          phone: this.userRegisterInfo.phone
        }
      }).then(res => {
        
        this.$toast.clear();
        if (res.data.code == 100) {
          //关闭注册弹出层
          this.isOpen = false;
          //清除用户注册信息
          for (let key in this.userRegisterInfo) {
            this.userRegisterInfo[key] = '';
          }
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

    //登录
    login() {
      let o = {
        phone: {
          value: this.userLoginInfo.phone,
          reg: /^1[3-9]\d{9}$/,
          errorMsg: '手机号格式不正确'
        },

        password: {
          value: this.userLoginInfo.password,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: '密码支持字母数字_组合且首字符必须为字母'
        }
      };

      //验证表单
      //表单验证不通过, 拦截注册请求
      if (!utils.validForm(o)) {
        return;
      }

      //发起登录请求
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      });

      

      this.axios({
        //请求方式
        method: 'POST',
        url: this.baseUrl + '/login',

        //如果是POST请求，参数需要挂载到data
        //a=1&b=2&c=3
        data: {
          appkey: this.appkey,
          password: this.userLoginInfo.password,
          phone: this.userLoginInfo.phone
        }
      }).then(res => {
        // 
        this.$toast.clear();

        if (res.data.code === 200) {
          //登录成功
          //存储token, 用于下次访问有关于用户信息界面的登录标记
          this.$cookies.set('tokenString', res.data.token, '1d');

          //跳转到其他页面
          this.$router.push({name: 'Home'});
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

    //切换输入框的类型
    toggleType() {
      this.isText = !this.isText;
    }

  }
};
</script>