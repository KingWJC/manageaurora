<template>
  <div class="ui-tabs">
    <div class="ui-tabs-header">
      <div class="ui-tabs-nav-prev"></div>
      <div class="ui-tabs-list">

      </div>
      <div class="ui-tabs-nav-next"></div>
    </div>
    <div class="ui-tabs-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UITabs',
  props: {
    tabPosition: {
      type: String,
      default: ""
    },
    height: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {}
  },
  methods:{

  }
};
</script>