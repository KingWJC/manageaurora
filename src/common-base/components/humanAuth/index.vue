<!--
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2024-09-29 10:31:48
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2024-10-01 23:13:14
 * @FilePath: \lonch-itoc\src\common-base\components\humanAuth\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div v-if="type === 'radioFormItem' || (humanId && type !== 'radioFormItem')" :class="`${['radioFormItem', 'tagFormItem'].includes(type) ? `lc-col-12 lc-col-xs${xs || 6}` : ''} ${type === 'tagTitle' ? 'inline vab' : ''}` ">
    <div class="flex flex-content-start flex-items-center" v-if="type === 'radioFormItem'">
      <label class="nowrap">是否已实名认证:</label>
      <div class="flex-flex-auto">
        <el-radio disabled v-model="authStatus" label="1" size="small">是</el-radio>
        <el-radio disabled v-model="authStatus" label="0" size="small">否</el-radio>
        <span class="pl10" v-if="humanId && String(authStatus) !== '1'"><span class="link" @click="toRZH()">去实名认证</span></span>
        <span class="pl10 darkgray" v-if="String(authStatus) === '1' && authTime">实名通过时间：{{authTime | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
      </div>
    </div>
    <div class="flex flex-content-start flex-items-center pt5" v-if="type === 'tagFormItem'">
      <span class="nowrap">实名认证状态:</span>
      <div class="flex-flex-auto">
        <el-tag class="ml10 mr10" size="mini" :type="String(authStatus) === '1' ? 'success' : 'warning'">{{ String(authStatus) === '1' ? '已认证' : '未认证' }}</el-tag>
        <span v-if="humanId && String(authStatus) !== '1'"><span class="link" @click=toRZH()>去实名认证</span></span>
        <span class="pl10 darkgray" v-if="String(authStatus) === '1' && authTime">实名通过时间：{{authTime | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
      </div>
    </div>
    <span class="" v-if="type === 'tagTitle'">
      <el-tag class="strong ml5 mr5" size="mini" :type="authStatus === '1' ? 'success' : 'warning'">{{ authStatus === '1' ? '已认证' : '未认证' }}</el-tag>
      <span v-if="humanId && String(authStatus) !== '1'" class="link" @click=toRZH()>去实名认证</span>
      <span class="pl10 darkgray" v-if="String(authStatus) === '1' && authTime">实名通过时间：{{authTime | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
    </span>
  </div>
</template>
<script>
import toRZHMixin from '@/common-base/components/humanAuth/toRZHMixin';

export default {
  name: "humanAuth",
  mixins: [toRZHMixin],
  props: {
    /**
     * 实名认证状态
     */
    authStatus: {
      type: String,
      default: () => ''
    },
    /**
     * 实名认证类型
      // radioFormItem
      // tagFormItem
      // tagTitle
     */
    type: {
      type: String,
      default: () => "radioFormItem"
    },
    /**
     * 认证主体
     *
     * 1: 法大大认证
     * 2: 腾讯认证
     *
     */
    issueParty: {
      type: String,
      default: () => undefined
    },
    /**
     * 认证主体id
     */
    humanId: {
      type: String,
      default: () => ''
    },
    /**
     * 认证时间
     */
    auditTime: {
      default: () => '',
    },
    /**
     * xs 表单情况下所占列数
     */
    xs: {
      type: Number,
      default: () => undefined
    }
  },
  methods: {
    /**
     * 去实名认证
     */
    toRZH(){
      this.toRZHFunction(this.humanId, this.issueParty);
      this.$emit('toRZH');
    },
  }
}
</script>
