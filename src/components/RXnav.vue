<template>
  <div class="rx-nav">
    <van-nav-bar left-arrow>
      <template #left>
        <div class="left-title">
          <div class="logo">
            <img class="auto-img" src="../assets/images/home_active.png" />
          </div>
          <div class="logo-title">Luckin Coffee</div>
        </div>
      </template>

      <template #right>
        <div class="right-title" @click="goPage">
          先逛一逛
        </div>
      </template>
    </van-nav-bar>
  </div>
</template>

<script>
  import "../assets/less/rxnav.less";
  export default {
    name: 'RXnav',

    methods: {
      goPage() {
        this.$router.push({name: 'Home'});
      }
    }
  }
</script>