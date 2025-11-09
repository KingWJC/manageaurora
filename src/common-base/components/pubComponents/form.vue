<template>
  <el-form :model="form" class="full-width form" :rules="rules" ref="form" v-if="!isDisabledForm">
    <el-row class="full-width flex-wrap" type="flex">
      <template v-for="(config, index) in formConfig" >
          <el-col :key="index" :xs="config.xs || 24" :sm="config.sm || 24" :md="config.md || 12" :lg="config.lg || 8" :xl="config.xl || 6" v-if="isShow(config)">
            <div class="flex flex-items-start full-width mb10">
              <label
                class="label mt10"
                style="text-align: right;"
                v-bind:style="{
                  'font-weight': config.fw,
                  'color': config.color,
                  'width': config.mWidth || '100px',
                  'padding-left': config.pl || '0px',
                }"
              >
                <span class="red" v-if="config.required">*</span>
                {{config.label}}:
              </label>
              <el-form-item :prop="config.id" style="flex: 1">
                <formItem v-if="!config.showDetail" :config="config" :model="config.model || model" :oss="oss" ref="formItem"></formItem>
                <!-- 添加slot -->
                <slot v-else-if="config.slot" :name="'formItem_' + config.id" :config="config"></slot>
                <div style="line-height: 2.5" v-else>{{config.model[config.id]}}</div>
              </el-form-item>
              <div
                  class="lh40"
                  v-bind:style="{
                  'font-weight': config.fw,
                  'color': config.rightTextcolor,
                }">{{config.rightText}}</div>
              <div v-if="config.rightIcon"
                  style="color: #3f9eff; cursor: pointer"
                  class="pl5 fs-lg lh40">
                <i :class="config.iconName" @click="config.rightIconClick(config, index)"></i>
              </div>
            </div>
        </el-col>
      </template>
    </el-row>
  </el-form>
  <el-row class="full-width flex-wrap" type="flex" v-else>
    <template v-for="(config, index) in formConfig" >
      <el-col :key="index" :xs="24" :sm="24" :md="config.md || 12" :lg="config.lg || 8" :xl="config.xl || 6" v-if="isShow(config)">
        <div class="flex flex-items-start full-width mb10">
          <label
              class="label mt10"
              style="text-align: right;"
              v-bind:style="{
                  'font-weight': config.fw,
                  'color': config.color,
                  'width': config.mWidth || '100px',
                  'padding-left': config.pl || '0px',
                }"
          >
            <span class="red" v-if="config.required">*</span>
            {{config.label}}:
          </label>
          <div class="flex1">
            <formItem v-if="!config.showDetail" :config="config" :model="config.model || model" :oss="oss" ref="formItem"></formItem>
            <!-- 添加slot -->
            <slot v-else-if="config.slot" :name="'formItem_' + config.id" :config="config"></slot>
            <div style="line-height: 2.5" v-else>{{config.model[config.id]}}</div>
          </div>
          <div
              class="lh40"
              v-bind:style="{
                  'font-weight': config.fw,
                  'color': config.rightTextcolor,
                }">{{config.rightText}}</div>
          <div v-if="config.rightIcon"
               style="color: #3f9eff; cursor: pointer"
               class="pl5 fs-lg lh40">
            <i :class="config.iconName" @click="config.rightIconClick(config, index)"></i>
          </div>
        </div>
      </el-col>
    </template>
  </el-row>
</template>

<script type="text/ecmascript-6">
import formItem from "./formItem";
export default {
  name: "addAndEdit",
  components: { formItem },
  props: {
    formConfig:{
      type: Array,
       default : ()=>{
        return [];
      },
    },
    oss:{
      type: Object,
      default : ()=>{
        return {};
      },
    },
    model : {
      type: Object,
      default : ()=>{
        return {};
      },
    },
    /**
     *  element form rules
     */
    rules:{
      type: Object,
      default : ()=>{
        return {};
      },
    },
    form:{
      type: Object,
      default : ()=>{
        return {};
      },
    },
    isDisabledForm: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  created() {

  },
  mounted() {},
  methods: {
    isShow(config) {
      if (typeof config.hide === 'function') {
        return !config.hide(config);
      }
      return !config.hide;
    },
    /**
     * 检验form是否符合rule规则如不符合返回false;
     */
    checkFormData() {
        let falg = false;
        this.$refs.form.validate((valid) => {
          if (valid) {
            falg = true;
          } else {
            falg = false;
            return false;
          }
        });
        return falg;
    },
    isFormMustKey() {
      for(let i of this.formConfig){
        if (i.type !== 'area') {
          if (i.required && (typeof i.hide === 'function' ? !i.hide(): !i.hide) && (Array.isArray(i.model[i.id]) ? i.model[i.id].length < 1 : !i.model[i.id] && i.model[i.id] !== 0 && i.model[i.id] !== false)) {
            this.$toast({text: i.placeholder || i.label});
            return false;
          }
        }
      }
      return true;
    }
  }
};
</script>
<style lang="scss" type="text/scss">
.el-form-item {
  margin-bottom: 4px !important;
}
.w100 {
  width: 100% !important;
}
.red-border input {
  border: 1px solid red;
}
.red-border textarea {
  border: 1px solid red;
}
.el-input.is-disabled .el-input__inner {
  background-color: #fbfdff;
}
.el-textarea.is-disabled .el-textarea__inner {
  background-color: #fbfdff;
}
.img-box {
  position: relative;
}
.img-box span {
  position: absolute;
  width: 25px;
  height: 25px;
  top: -6px;
  right: -6px;
  font-size: 20px;
  border-radius: 50%;
  background: #ececec;
  color: #666666;
  display: flex;
  justify-content: center;
  align-items: center;
}
.close {
  position: absolute;
  top: 0;
  right: -10px;
  font-size: 22px;
  background: #a7a7a7;
  border-radius: 50%;
  color: #fff;
}
.el-form {
  display: flex;
  flex-wrap: wrap;
}
.lh40{
  line-height: 40px;
}
</style>
