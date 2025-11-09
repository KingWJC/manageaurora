<template>
  <div class="card card-shadow mt10">
    <div class="card-body">
      <div class="card-header">
        <strong>单据信息</strong>
      </div>
      <div class="card-content-padded">
        <div class="lc-row lc-space16">
          <!-- 如果在药发采下注册来源隐掉 -->
          <div class="lc-col-12 lc-col-xs6" v-if="!/^yaofacai$/i.test(this.CFG.projectName)">
            <div class="flex flex-content-start flex-items-center">
              <!-- 
                注册来源,来源自哪个产品
                例如：
                * 云服
                * 药发采
                * 中台
                * 致医优氧
                * 云药房
                * 云诊室等
              -->
              <label class="nowrap">注册来源:</label>
              <div class="flex-flex-auto">
                <div class="flex-flex-auto">
                  <el-select v-model="formDataSub.source"
                    disabled
                    class="full-width"
                    placeholder="请选择"
                    size="small">
                    <el-option
                      v-for="temp in CFG.projects"
                      :key="temp.id"
                      :label="temp.title"
                      :value="temp.id">
                    </el-option>
                  </el-select>
                </div>
              </div>
            </div>
          </div>
          <template v-if="type === 'detail'">
            <!-- 
              单据ID
            -->
            <div class="lc-col-12 lc-col-xs6">
              <div class="flex flex-items-center">
                <label class="label nowrap">
                  单据ID:
                </label>
                <div class="flex-flex-auto">
                  <el-input v-model="formDataSub.id"
                    disabled
                    class="full-width power-minw120"
                    size="small"
                    placeholder="请填写内容">
                  </el-input>
                </div>
              </div>
            </div>
            <!-- 
              制单人
            -->
            <div class="lc-col-12 lc-col-xs6">
              <div class="flex flex-items-center">
                <label class="label nowrap">
                  制单人:
                </label>
                <div class="flex-flex-auto">
                  <el-input v-model="formDataSub.applicantName"
                    disabled
                    class="full-width power-minw120"
                    size="small"
                    placeholder="请填写内容">
                  </el-input>
                </div>
              </div>
            </div>
            <!-- 
              申请时间
            -->
            <div class="lc-col-12 lc-col-xs6">
              <div class="flex flex-items-center">
                <label class="label nowrap">
                  申请时间:
                </label>
                <div class="flex-flex-auto">
                  <el-date-picker
                    disabled
                    v-model="formDataSub.applicationDate"
                    value-format="timestamp"
                    size="small"
                    type="datetime"
                    placeholder="请选择时间">
                  </el-date-picker>
                </div>
              </div>
            </div>
            <!-- 
              审核人
            -->
            <div class="lc-col-12 lc-col-xs6">
              <div class="flex flex-items-center">
                <label class="label nowrap">
                  审核人:
                </label>
                <div class="flex-flex-auto">
                  <el-input v-model="formDataSub.auditorName"
                    disabled
                    class="full-width power-minw120"
                    size="small"
                    placeholder="请填写内容">
                  </el-input>
                </div>
              </div>
            </div>
            <!-- 
              审核时间
            -->
            <div class="lc-col-12 lc-col-xs6">
              <div class="flex flex-items-center">
                <label class="label nowrap">
                  审核时间:
                </label>
                <div class="flex-flex-auto">
                  <el-date-picker
                      disabled
                      v-model="formDataSub.auditDate"
                      value-format="timestamp"
                      size="small"
                      type="datetime"
                      placeholder="请选择时间">
                    </el-date-picker>
                </div>
              </div>
            </div>
          </template>
          <!-- 
            单据备注
          -->
          <div class="lc-col-12 lc-col-xs12">
            <div class="flex flex-items-center">
              <label class="label nowrap">
                单据备注:
              </label>
              <div class="flex-flex-auto">
                <el-input v-model="formDataSub.formRemark"
                  @input="$forceUpdate()"
                  maxlength="800"
                  show-word-limit
                  :disabled="type === 'detail'"
                  class="full-width"
                  size="small"
                  type="textarea"
                  placeholder="请填写内容">
                </el-input>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  name: 'formData',
  props: ['formDataSub','type'],
  data () {
    return {
    }
  },
  created () {
    
  },
  mounted () {
    /**
     * 默认注册来源
     */
    this.formDataSub.source = this.formDataSub.source ? this.formDataSub.source : this.CFG.project.id;
  },
  methods: {
  }
}
</script>
