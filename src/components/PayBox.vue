<template>
  <div class="pay-boxing">
    <div>
      <slot name="pay-title">
        <div class="pay-title">订单信息</div>
      </slot>
    </div>
    <div class="pad-middle">
      <slot name="order-item"></slot>
    </div>
    <div class="pay-foot">
      <div class="pay-line">
        <div class="pay-left"></div>
        <div class="pay-right"></div>
      </div>
      <div class="foot-info">
        <div class="date" v-if="proInfo.date">{{proInfo.date | formatDate('yyyy-MM-dd hh:mm:ss')}}</div>
        <div class="foot-bottom">
          <div class="foot-count">共计 {{proInfo.count}} 件</div>
          <div class="foot-total">合计 &yen;{{proInfo.total}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import '../assets/less/paybox.less';

  export default {
    name: 'payBox',
    props: {
      proInfo: {
        type: Object,
        default() {
          return {
            count: 0,
            total: 0,
            date: ''
          };
        }
      },
    }
  }
</script>