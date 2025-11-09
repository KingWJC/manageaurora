<template>
    <div class="card card-shadow">
        <div class="card-body">
            <div class="card-header">
                <div class="flex flex-content-between">
                    <strong>
                        <span v-if="isRequired" class="red">*</span>{{types[type]}}
                    </strong>
                    <el-tooltip v-if="isESign && type===5" class="e-contract" effect="dark" content="电子签署协议" placement="top-start">
                      <i class="el-icon-edit" @click="gotoESign(10001)"></i>
                    </el-tooltip>
                    <el-tooltip v-if="isESign && type===6" class="e-contract" effect="dark" content="电子签署合同" placement="top-start">
                      <i class="el-icon-edit" @click="gotoESign(10002)"></i>
                    </el-tooltip>
                    <oss-upload
                      v-if="isEdit"
                      :bucket="oss.bucket"
                      :basePath="oss.basePath"
                      :region="oss.region"
                      
                      label="+选择文件"
                      @uploaded="handleFileUploaded">
                        <span class="btn">
                          + 选择文件
                        </span>
                    </oss-upload>
                </div>
            </div>
            <div class="card-content-padded owner_a">
                <div class="flex-flex-auto">
                    <div>
                      <!-- <div v-for="(file, index) in data" :key="index" class="flex flex-items-start flex-items-center">
                        <div class="flex-flex-auto">
                          <viewer v-if="/\.(png|jpg|jpeg)$/.test(file['filePath'])" :images="[file]" class="viewer" ref="viewer">
                            <div class="file-img-thumb flex flex-column flex-items-center flex-content-center" style="width: 100px;">
                              <img :src="file['filePath']" alt="" /> 
                            </div>
                          </viewer>
                          <a v-else class="mt5 mb5 blue power-tdNone" :href="file['filePath']+'?_=.zip'" target="_blank">{{file['qualificationsName']||defaultFileName}}</a>
                        </div>
                        <span v-if="isEdit" class="btn btn-s ml10" @click="removeFile(index)">
                          删除
                        </span>
                      </div> -->
                      <div v-for="(item, index) in data" :key="index">
                        <div class="lc-col-6 lc-col-xs4 lc-col-sm3 lc-col-md2 p5">
                          <div class="relative ownShopSty_1">
                              <div v-if="isEdit && item.canEdit" class="ownShopSty_2"
                                  @click="removeFile(index)">
                                  <span class="icon-close"></span>
                              </div>
                              <limit-img>
                                  <viewer :images="data" class="viewer" ref="viewer">
                                    <img :src="item.filePath" alt="" />  
                                  </viewer>  
                              </limit-img>
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import OssUpload from '@/common-base/components/upload/index'
import LimitImg from '@/components/admin/common/limitImg/index'
const types = {
  '0': '资质图片',
  '1': '营业执照（正本或副本）',
  '2': '经营许可证（正本或副本及变更记录）',
  '3': '开票信息',
  '4': '采购委托书及身份证复印件',
  '5': '质量保证协议',
  '6': '购销合同',
  '7': 'GSP证书',
  '8': '医疗器械经营备案凭证',
  '9': '质量体系调查表',
  '10': '印章印模',
  '11': '医疗机构执业许可证（含校验记录）',
  '12': '上一年度报告公示',
  '13': '法人采购委托书',
  '14': '法人身份证复印件',
  '15': '购销人员身份证复印件',
  '16': '药品经营许可证/药品生产许可证',
  '17': '其他补充文件',
  '18': '三包凭证',
  '19': '产品注册批件',
  '20': '质量标准',
  '21': '说明书',
  '22': '包装备案（参照）',
  '23': '包装盒（参照）',
  '24': '检验报告（参照）',
  '25': 'CCC认证',
  '26': '开票信息上传',
  '27': '食品注册证书',
  '28': '保健食品注册证书',
  '29': '消毒用品注册证书',
  '30': '创始人授权书',
  '31': '创始人意向书',
  '32': '创始人协议',
  '33': '创始人法人',
  '34': '药店合伙人授权书',
  '35': '药店合伙人意向书',
  '36': '药店合伙人协议',
  '37': '药店合伙人法人',
  '38': '机构店面图片',
  '39': '授信协议',
  '40': '收款凭据',
  '41': '创始人文件',
  '42': '创始人认证文件补充',
  '43': '药店合伙人认证文件补充',
  '44': '卫生许可费',
  '45': '医疗器械经营许可证',
  '46': '大型医用设备配置许可证',
  '47': '医用机构制剂许可证',
  '48': '互联网药品交易服务证',
  '49': '食品经营许可证',
  '0001': '签约代表委托书上传',
  '0002': '文件上传',
  '0003': '其他详见合同原件',
  '0004': '合同文件上传',
}
export default {
  name: 'QualificationUploader',
  components: {
    OssUpload,
    LimitImg
  },
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    },
    type: {
      type: Number,
      default: 0
    },
    newType: {
      type: Number,
      default: 0
    },
    oss: {
      type: Object
    },
    isEdit: {
      type: Boolean,
      default: true
    },
    isRequired: {
      type: Boolean,
      default: false
    },
    isESign: {
      type: Boolean,
      default: false
    },
    findData: {
      type: Boolean,
      default: false
    },
    dataResult: {
      type: Object,
      default () {
        return {}
      }
    },
  },
  data () {
    return {
      defaultFileName: '无标题',
      list: [],
      types: types,
      findData_end: {},
    }
  },
  created () {
    console.info(this.data)
    // this.list = this.data
  },
  methods: {
    /**
     * 上传图片
     * 获取图片oss地址
     */
    handleFileUploaded (result) {
      this.data.push({
        // isDel: false, 
        // qualificationsCode: this.type, // 类型，营业执照（正本或副本）	1经营许可证	2开票信息	3采购委托书及身份证复印件	4质量保证协议	5购销合同	6GSP证书	7医疗器械经营备案凭证	8质量体系调查表	9印章印模	10医疗机构执业许可证	11上一年度报告公示	12其他	0
        // qualificationsUrl: this.oss.resourcesLocation + result.Key, // 图片地址
        // type: this.newType,
        // qualificationsName: result.Key.substring(result.Key.lastIndexOf("/") + 1, result.Key.length)
        filePath: this.oss.resourcesLocation + result.Key, // 图片地址
        canEdit: true

      })
      if(this.findData){
        // 这里要调用营业执照图片识别的接口，如果没有获取到数据就提示
        setTimeout(() => {
          this.API.send(this.CFG.services.sy.businessLicenseAuth, { url:  this.oss.resourcesLocation + result.Key }, (res) => {
            if(res && res.serviceResult && typeof res.serviceResult === "string" && res.serviceResult.indexOf('<html>') === -1){
              res = JSON.parse(res.serviceResult);
              if(!res.words_result){
                this.$toast({text: "未识别图片上信息，请重试!"})
              }
              this.findData_end = res.words_result || {}
              this.$emit('handleFileUploaded', this.findData_end)
            }
          }, () => {
          }, this);
        }, 500);
      }
    },
    /**
     * 删除操作
     */
    removeFile (index) {
      if (index >= 0) {
        this.data.splice(index, 1)
      }
    },
    // removeFile (data, index) {
    //   data.isDel = true
    //   this.$set(this.data, index, data)
    // },
    /**
     * 签署操作
     */
    gotoESign(type) {
      this.$emit('sign', type)
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
.ownShopSty_1{box-shadow: 0 0 3px 0 rgba(0,0,0,.3);}
.ownShopSty_2{position: absolute;top:-10px;right:-10px;width: 28px;height:28px;padding:2px;border-radius:100%;z-index: 1;background-color: #f7f7f7;box-shadow: 0 0 3px 0 rgba(0,0,0,.3);opacity: .75;}
.file-img-thumb {
    width: 3rem;
    height: 2rem;
    overflow: hidden;
    margin-top: 3px;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, .3);
    & img {
      display: block;
      max-width: 100%;
    }
  }
.form-label {
    min-width: 65px;
}
.owner_a .lc-space16 > * {
padding: 0px;}
.e-contract{
  position: absolute;
  top: 16px;
  right: 120px;
}
</style>
