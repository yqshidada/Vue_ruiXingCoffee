<template>
  <div class="address">
    <van-nav-bar :title="aid ? '编辑地址' : '新增地址'" left-text="返回" left-arrow @click-left="back" />
    <Bg>
      <van-address-edit
        :area-list="areaList"
        show-postal
        :show-delete="!!aid"
        show-set-default
        show-search-result
        :detail-maxlength="30"
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        :address-info="originAddressInfo"
        @save="save"
        @delete="removeAddress"
      />
    </Bg>
  </div>
</template>

<script>
import "../assets/less/address.less";
import Bg from "../components/Bg.vue";
import areaList from "../assets/js/area";

export default {
  name: "Address",

  data() {
    return {
      //省市区数据
      areaList,

      //编辑地址的aid
      aid: "",

      //编辑地址初始值
      originAddressInfo: {},
    };
  },

  components: {
    Bg,
  },

  created() {
    //截取路由参数
    this.aid = this.$route.params.aid;

    

    //如果存在aid,则根据aid查询地址数据
    if (this.aid) {
      this.getAddressDataByAid();
    }
  },

  methods: {
    back() {
      this.$router.go(-1);
    },

    //新增地址
    add(value) {
      let tokenString = this.$cookies.get("tokenString");

      if (!tokenString) {
        
        return this.$router.push({ name: "Login" });
      }

      //复制value
      let data = {
        ...value,
        tokenString,
        appkey: this.appkey,
      };
      //等价于
      //Object.assign({tokenString, appkey: this.appkey}, value);

      data.isDefault = Number(data.isDefault);
      delete data.country;

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        //请求方式
        method: "POST",
        url: this.baseUrl + "/addAddress",
        data,
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

          if (res.data.code === 9000) {
            //如果添加成功, 跳回地址列表组件
            this.$router.push({ name: "AddressList" });
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

    //编辑地址
    edit(value) {
      // 
      // 

      let isEdit = false;

      for (let key in this.originAddressInfo) {
        if (this.originAddressInfo[key] !== value[key]) {
          //只要有一个数据不同，则表明用户已经修改数据
          isEdit = true;
          break;
        }
      }

      if (isEdit) {
        //发起编辑地址请求
        

        let tokenString = this.$cookies.get("tokenString");

        if (!tokenString) {
          
          return this.$router.push({ name: "Login" });
        }

        //复制value数据
        let address = {};
        address.aid = this.aid;
        address.name = value.name;
        address.tel = value.tel;
        address.province = value.province;
        address.city = value.city;
        address.county = value.county;
        address.addressDetail = value.addressDetail;
        address.areaCode = value.areaCode;
        address.postalCode = value.postalCode;
        address.isDefault = Number(value.isDefault);
        

        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0,
        });

        this.axios({
          //请求方式
          method: "POST",
          url: this.baseUrl + "/editAddress",
          data: {
            appkey: this.appkey,
            tokenString,
            ...address
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

            if (res.data.code === 30000) {
              //如果添加成功, 跳回地址列表组件
              this.$router.push({ name: "AddressList" });
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

        
      } else {
        
        this.$router.push({ name: "AddressList" });
      }
    },

    //保存地址
    save(value) {
      if (this.aid) {
        //编辑地址
        this.edit(value);
      } else {
        //新增地址
        this.add(value);
      }
    },

    //删除地址
    removeAddress(value) {
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
        url: this.baseUrl + "/deleteAddress",
        data: {
          tokenString,
          appkey: this.appkey,
          aid: value.aid,
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

          if (res.data.code === 10000) {
            //如果添加成功, 跳回地址列表组件
            this.$router.push({ name: "AddressList" });
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

    //根据aid获取地址数据
    getAddressDataByAid() {
      //查询地址数据
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
        url: this.baseUrl + "/findAddressByAid",
        params: {
          appkey: this.appkey,
          tokenString,
          aid: this.aid,
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

          if (res.data.code === 40000) {
            let data = res.data.result[0];
            data.isDefault = !!data.isDefault;

            // res.data.result.forEach(v => {
            //   v.isDefault = Boolean(v.isDefault);
            //   // v.isDefault = !!v.isDefault;
            // })

            this.originAddressInfo = data;
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
  },
};
</script>
