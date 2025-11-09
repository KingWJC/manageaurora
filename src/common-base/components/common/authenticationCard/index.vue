<template>
  <div class="authentication-wrapper">
    <!-- <div class="authentication-container"></div> -->
    <!--头像上的麦穗-->
    <div class="authentication-ear-wheat">
      <div class="authentication-ear-wheat-head">
        <div class="authentication-ear-wheat-head-btn" @click="toRZH()">{{authData.fddAuthStatus === '1' || authData.tencentAuthStatus === '1' ? '再次认证' : '申请实名认证'}}</div>
        <div class="authentication-ear-wheat-head-tag" v-if="authData.fddAuthStatus === '1' || authData.tencentAuthStatus === '1'"></div>
        <img :src="renderFaceImagePath" alt="" />
      </div>
    </div>
    <!--证件号-->
    <div class="authentication-userinfo" :class="{'authentication-userinfo-ok': authData.fddAuthStatus === '1' || authData.tencentAuthStatus === '1'}">
      <div>手机号：{{maskSensitiveInfo(userInfo.cellphone)}}</div>
      <div>证件号：{{maskSensitiveInfo(userInfo.identificationNumber)}}</div>
      <div>证件类型：{{identificationType}}</div>
      <div>
        认证时间：{{ authData.authTime ? formatDate(authData.authTime) : '未认证' }}
      </div>
    </div>
    <!--证件号-->
    <div class="authentication-certificate-authority">
      <!--法大大认证-->
      <div class="authentication-certificate-authority-item">
        <div class="flex flex-content-between flex-items-start">
          <div class="flex flex-items-center">
            <div class="flex flex-wrap">
              <div class="ellipsis mr5">法大大认证</div>
              <div class="authentication-certificate-authority-item-tag" v-if="authData.fddAuthStatus === '1'">
                已认证
              </div>
              <div class="authentication-certificate-authority-item-notag" v-else>
                未认证
              </div>
            </div>
          </div>
          <div class="link" @click="openFddDetail()" v-if="authData.fddAuthStatus === '1'">
            {{ isShowFddDetail ? '收起' : '展开' }}
          </div>
        </div>
        <div class="authentication-certificate-authority-item-detail" v-if="isShowFddDetail">
          <div>认证ID：{{ authData.fddAuthCertId || '--' }}</div>
          <div class="link" @click="toRZHCert()">查看认证</div>
        </div>
      </div>
      <!--end 法大大认证-->
      <!--腾讯认证-->
      <div class="authentication-certificate-authority-item">
        <div class="flex flex-content-between flex-items-center">
          <div class="flex flex-items-center">
            <div class="flex flex-wrap">
              <div class="mr5">腾讯认证</div>
              <div class="authentication-certificate-authority-item-tag" v-if="authData.tencentAuthStatus === '1'">
                已认证
              </div>
              <div class="authentication-certificate-authority-item-notag" v-else>
                未认证
              </div>
            </div>
          </div>
          <div class="link" @click="openTencentDetail()" v-if="authData.tencentAuthStatus === '1'">
            {{ isShowTencentDetail ? '收起' : '展开' }}
          </div>
        </div>
        <div class="authentication-certificate-authority-item-detail" v-if="isShowTencentDetail">
          <div>认证ID：{{ authData.tencentAuthCertId || '--' }}</div>
        </div>
      </div>
      <!--end 腾讯认证-->
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import toRZHMixin from '@/common-base/components/humanAuth/toRZHMixin';

export default {
  name: 'AuthenticationCard',
  mixins: [toRZHMixin],
  props: {
  },
  data() {
    return {
      // 证件类型
      identificationTypeOptions: [],
      // 用户实名认证信息
      authData: {},
      // 是否展示法大大认证详情
      isShowFddDetail: false,
      // 是否展示腾讯认证详情
      isShowTencentDetail: false,
    };
  },
  computed: {
    /**
     * 用户信息
     */
    userInfo() { 
      return this.CFG && this.CFG.userInfo || {};
    },
    /**
     * 渲染证件类型
     */
    identificationType() {
      if(this.CFG.userInfo && this.CFG.userInfo.identificationTypeCode) {
        const identificationType = this.identificationTypeOptions.find(v => v.c === this.CFG.userInfo.identificationTypeCode);
        return identificationType && identificationType.n || '--';
      } else {
        return '--';
      }
    },
    /**
     * 渲染实名认证照片
     */
    renderFaceImagePath() {
      if(this.authData.faceImagePath) {
        return `${this.authData.faceImagePath}?x-oss-process=image/format,jpg/resize,limit_0,m_fill,w_200,h_200`;
      } else {
        return 'https://resources.lonch.com.cn/bi/yfcadvertising/2025/07/17/bd79f321d5944cd8a96f146eb06c2af420250717162455.png?x-oss-process=image/format,jpg/resize,limit_0,w_240';
      }
    },
  },
  created() {
    const identificationTypeOptions = vue.getCommonDictionary('identificationType');
    this.identificationTypeOptions = identificationTypeOptions;
  },
  mounted() {
    // 获取用户实名认证信息
    this.getUserAuthStatus();
  },
  methods: {
    /**
     * 去实名认证申请
     */
    toRZH() {
      this.$emit('toRZH');
      this.toRZHFunction(this.CFG.userInfo.id);
    },
    /**
     * 去查看证书
     */
    toRZHCert() {
      this.$emit('toRZH');
      this.toViewRZHCert(this.CFG.userInfo.id);
    },
    /**
     * 格式化日期
     * @param timer
     */
    formatDate(timer) {
      return this.utils.formatDate(timer, 'YYYY年MM月dd日');
    },
    /**
     * 隐藏敏感信息中间部分
     * @param {string} value - 需要处理的字符串
     * @param {Object} options - 配置选项
     * @param {number} [options.prefix=3] - 前面保留的字符数
     * @param {number} [options.suffix=4] - 后面保留的字符数
     * @param {string} [options.maskChar='*'] - 用于替换的掩码字符
     * @returns {string} - 处理后的字符串
     */
    maskSensitiveInfo(value, options = {}) {
      if (!value || typeof value !== 'string') {
        return '';
      }

      // 合并默认配置
      const {
        prefix = 3,
        suffix = 4,
        maskChar = '*'
      } = options;

      const length = value.length;

      // 根据不同长度调整隐藏策略
      if (length <= prefix + suffix) {
        // 长度不足以隐藏，保留首尾各1个字符
        return value.slice(0, 1) +
          maskChar.repeat(length - 2) +
          value.slice(-1);
      }

      // 常规隐藏中间部分
      return value.slice(0, prefix) +
        maskChar.repeat(length - prefix - suffix) +
        value.slice(-suffix);
    },
    /**
     * [beforeUpload 上传图片前执行获取秘钥]
     * @return {[type]} [description]
     */
    getUserAuthStatus() {
      if (this.CFG.userInfo && this.CFG.userInfo.id) {
        let args = {
          humanId: this.CFG.userInfo.id
        }
        this.API.send({module: 'ca', url: '/realName/queryAuthStatus', method: 'POST', comment: '查询自然人腾讯和法大大的实名认证状态'}, args, function (res) {
          const result = res && res.data || {};
          this.authData = result;
        }, function () {
        }, this, true)
      }
    },
    /**
     * 查看法大大认证详情
     */
    openFddDetail() {
      this.isShowFddDetail = !this.isShowFddDetail;
    },
    /**
     * 查看法大大认证详情
     */
    openTencentDetail() {
      this.isShowTencentDetail = !this.isShowTencentDetail;
    },
    /**
     * 去查看证书
     */
    toCertificate() {
      const url = {
        originName: 'manage',
        routePath: `/admin/eContract/certificationPersonal`,
        query: {
          moduleCode: '140300',
          showViewMode: 'show',
        },
      };
      LonchJsApi.openUrl(url);
    }
  }
}
</script>

<style lang="scss" scoped>
.authentication {
  &-wrapper {
    user-select: none;
    background-image: url(https://resources.lonch.com.cn/bi/yfcadvertising/2025/07/16/6744ffa7c1834ab5ac9a083de693f24720250716220417.png?x-oss-process=image/format,jpg/resize,limit_0,w_240);
    background-repeat: repeat-x;
    background-size: auto 100%;
    max-width: 368px;
    margin: 0 auto;
    // height: 415px;
    overflow: hidden;
    border-radius: 8px;
    padding-bottom: 20px;
  }

  // 个人头像
  &-ear-wheat {
    background-image: url(https://resources.lonch.com.cn/bi/yfcadvertising/2025/07/16/2d64a901fada48a888cf0d6a20b3c2b120250716222539.png);
    background-repeat: no-repeat;
    background-size: auto 100%;
    background-position: center;
    height: 130px;
    overflow: hidden;
    margin: 20px 0;
    z-index: 1;
    position: relative;
    &-head {
      width: 100px;
      height: 100px;
      border-radius: 100px;
      margin: 0 auto;
      background: #fff;
      margin-top: 20px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        display: block;
        width: 98%;
        height: 98%;
        border-radius: 100%;
      }
      &-tag {
        width: 33px;
        height: 37px;
        background-image: url(https://resources.lonch.com.cn/bi/yfcadvertising/2025/07/17/fe70a0de91af4b34802db89f0161db4620250717183057.png);
        background-size: 100% 100%;
        z-index: 1;
        position: absolute;
        bottom: 10px;
        right: 50%;
        transform: translateX(50px);
      }
      &-btn {
        z-index: 1;
        position: absolute;
        top: 00px;
        left: 20px;
        background-color: #3f7ed5;
        background-image: url(https://resources.lonch.com.cn/bi/yfcadvertising/2025/07/17/b3718e52611c4607820b55148bd9d51f20250717183920.png);
        background-size: 11px 12px;
        background-repeat: no-repeat;
        background-position: left 8px center;
        color: #fff;
        padding: 4px 8px 4px 24px;
        border-radius: 100px;
        font-size: 12px;
        cursor: pointer;
      }
    }
  }

  // 用户信息
  &-userinfo {
    background: #fff8f3;
    color: #cd6f01;
    border-radius: 8px;
    margin: 0 20px 10px;
    padding: 15px 15px;
    font-size: 14px;
    line-height: 20px;
    word-break: break-all;
    &-ok {
      background-image: url(https://resources.lonch.com.cn/bi/yfcadvertising/2025/07/17/32c87063d887453d9d13f1a3e2e6bf4120250717040020.png);
      background-position: right 10px center;
      background-repeat: no-repeat;
      background-size: 20%;
    }
  }

  // 认证机构
  &-certificate-authority {
    background: #fff;
    border-radius: 8px;
    margin: 0 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding: 0 15px;

    &-item {
      border-bottom: #ddd 1px solid;
      padding: 15px 0;
      font-size: 14px;
      text-wrap: nowrap;
      &:last-child {
        border-bottom: none;
      }

      &-tag {
        border: #68be3e 1px solid;
        background: #f8fff7;
        color: #68be3e;
        font-size: 10px;
        border-radius: 4px;
        padding: 2px;
        text-wrap: nowrap;
      }

      &-notag {
        border: #ffa76c 1px solid;
        background: #fffaf7;
        color: #ffa76c;
        font-size: 10px;
        border-radius: 4px;
        padding: 2px;
        text-wrap: nowrap;
      }

      &-detail {
        background-color: #f0f0f0;
        border-radius: 10px;
        padding: 20px;
        margin-top: 10px;
        line-height: 20px;
        word-break: break-all;
        text-wrap: wrap;
        font-size: 14px;
      }
    }
  }
}
</style>
