<!--
 * @Author: tuWei
 * @Date: 2022-02-15 17:15:51
 * @LastEditors:
 * @LastEditTime: 2022-02-15 17:21:12
-->
<template>
   <div class="panel pl15 pr15 pt10">
      <div class="search-bar flex flex-content-start flex-items-center flex-wrap">
        <template v-for="(config) in formConfig.form">
            <template v-if="config.type == 'range'">
              <div :key="config.id" class="search-bar-item" v-if="config.isSearch">
                <formItem :config="config.start" :model="searchParams"></formItem>
              </div>
              <div :key="config.id" class="search-bar-item" v-if="config.isSearch">
                <formItem :config="config.end" :model="searchParams"></formItem>
              </div>
            </template>
            <template v-else>
              <div :key="config.id" class="search-bar-item" v-if="config.isSearch">
                <formItem :config="config" :model="searchParams"></formItem>
              </div>
            </template>
        </template>
        <template v-for="(btn) in formConfig.searBths">
          <div class="search-bar-item-auto"  :key="btn.name" v-if="isShowBtn(btn)">
            <el-button size="small" type="primary" @click="btn.click ? btn.click() : null ">{{btn.name}}</el-button>
          </div>
        </template>
        <slot name="searchMore" v-if="$slots.searchMore" />
      </div>
      <div class="flex flex-content-start flex-items-center flex-wrap pt5">
        <template  v-for="(btn) in formConfig.btmSearBths">
           <div class="search-bar-item-auto" v-if="isShowBtn(btn)"  :key="btn.name" :style="{'margin-left':index === 0 ? 0 : ''}">
              <el-button  size="small" type="primary" @click="btn.click ? btn.click() : null ">{{btn.name}}</el-button>
          </div>
        </template>
      </div>
      <div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
import formItem from "./formItem";
export default {
  name: "addAndEdit",
  components: { formItem },
  props: {
    formConfig:{
      type: Object,
       default : ()=>{
        return {}
      },
    },
    searchParams:{
      type: Object,
      default : ()=>{
        return {}
      },
    },
    model : {
      type: Object,
      default : ()=>{
        return {}
      },
    },
    /**
     *  element form rules
     */
    rules:{
      type: Object,
      default : ()=>{
        return {}
      },
    },
    form:{
      type: Object,
      default : ()=>{
        return {}
      },
    }
  },
  data() {
    return {
    };
  },
  created() {
  },
  mounted() {},
  methods: {
    /**
     * 判断按钮显隐
     */
    isShowBtn(btn){
      return btn.condition ? btn.condition() : true;
    },
  }
};
</script>
