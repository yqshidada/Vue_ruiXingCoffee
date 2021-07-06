<template>
  <div class="bg">
    <div class="bg-box"></div>
    <div class="bg-content">
      <slot>内容</slot>
    </div>
  </div>
</template>

<script>
  import '../assets/less/bg.less';
  export default {
    name: 'Bg'
  }
</script>