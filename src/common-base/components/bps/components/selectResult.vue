<!-- eslint-disable vue/no-template-key -->
<!--
 * @Date: 2022-08-26 16:29:24
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-04-07 18:20:12
 * @FilePath: /Workflow/src/components/selectResult.vue
-->
<template>
  <div class="bps-select-result l">
    <p class="clear">已选（{{list.length}}）
        <a @click="$emit('del')">清空</a>
    </p>
    <ul>
      <template v-for="(data, index) in list" >
        <li :key="index" style="cursor: pointer">
          <img src="@/common-base/accsets/images/icon_people.png">
          <span>{{data.name}}</span>
          <img src="@/common-base/accsets/images/cancel.png" @click="deleteOne(index)">
        </li>
      </template>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    total: {
      type: Number,
      default: 0
    },
    list: {
      type: Array,
      default: () => [{ type: 'role', data: [], cancel: function () { } }]
    }
  },
  methods: {
    deleteOne(index){
      this.$emit('cancelSelect', index)
    }
  }
}
</script>

<style lang="scss" scoped>

.bps-select-result {
  width: 256px;
  height: 100%;
  font-size: 12px;

  ul {
    height: 380px;
    overflow-y: auto;

    li {
      margin: 11px 26px 13px 19px;
      line-height: 17px;
      list-style: none;

      span {
        vertical-align: middle;
      }

      img {
        &:first-of-type {
          width: 14px;
          vertical-align: middle;
          margin-right: 5px;
          display: inline-block;
        }

        &:last-of-type {
          float: right;
          margin-top: 2px;
          width: 14px;
        }
      }
    }
  }

  p {
    padding-left: 19px;
    padding-right: 20px;
    line-height: 37px;
    border-bottom: 1px solid #f2f2f2;

    a {
      float: right;
    }
  }
}
</style>
