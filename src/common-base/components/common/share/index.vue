<template>
  <div class="mt20 mb20 flex flex-column flex-items-center">
    <div class="mt20 flex flex-content-between flex-items-start pb20 fs-m icon-list-box">
      <div v-if="isInMobileApp()" @click="createImg('weixin')" class="flex-flex-auto flex flex-column flex-content-start flex-items-center share-item">
        <div class="share-icon">
          <img alt="" src="https://resources.lonch.com.cn/ybd/image/20241106-share-icon-wx.png" />
        </div>
        <div class="mt10 darkgray fs-sm">发送到微信</div>
      </div>
      <div v-if="isInMobileApp()" @click="createImg('qyweixin')" class="flex-flex-auto flex flex-column flex-content-start flex-items-center share-item">
        <div class="share-icon">
          <img alt="" src="https://resources.lonch.com.cn/ybd/image/20241106-share-icon-wecom.png" />
        </div>
        <div class="mt10 darkgray fs-sm">发送到企业微信</div>
      </div>
      <div class="flex flex-items-center share-long-press" v-if="isInMicromessenger()">
        <div class="share-icon">
          <img alt="" src="https://resources.lonch.com.cn/ybd/image/20241110-oxygen-card-long-press.png" />
        </div>
        <div class="ml10 darkgray">长按图片保存到本地</div>
      </div>
      <div v-else @click="createImg('phone')" class="flex-flex-auto flex flex-column flex-content-start flex-items-center share-item">
        <div class="share-icon">
          <img alt="" src="https://resources.lonch.com.cn/ybd/image/20241106-share-icon-download.png" />
        </div>
        <div class="mt10 darkgray fs-sm">保存到相册</div>
      </div>
    </div>
  </div>
</template>

<script>
import Perser from "@/common-base/utils/perser";

export default {
  name: "share",
  props: {
    canvas: {
      type: Object,
      defaultValue: () => {
        return {}
      }
    }
  },
  data() {
    return {
      // 上传oss配置
      oss: Object.assign(
          {
            dirName: "/yfc-share",
          },
          this.OSSCFG
      ),
      imageDialogUrl: '',
    }
  },
  methods: {
    /**
     * 是否在移动端APP中
     */
    isInMobileApp() {
      return LonchJsApi.isInIosApp() || LonchJsApi.isInAndroidApp() || LonchJsApi.isInIosAppV2() || LonchJsApi.isInAndroidAppV2()
    },
    /**
     * 是否在Mac APP中
     */
    isInMacApp() {
      return LonchJsApi.isInMacApp() || LonchJsApi.isInMacAppV2()
    },
    /**
     * 是否在windows APP中
     */
    isInWindowApp() {
      return LonchJsApi.isInCef() || LonchJsApi.isInCefV2()
    },
    /**
     * 是否在微信
     */
    isInMicromessenger() {
      let userAgent = window.navigator.userAgent;
      return /.*Micromessenger.*/i.test(userAgent);
    },
    /**
     * 展示Loading
     */
    showLoading () {
      this.loading = this.$loading({
        lock: true,
        background: 'rgba(0, 0, 0, 0)'
      })
    },
    /**
     * 关闭Loading
     */
    closeLoading () {
      if (this.loading) {
        this.loading.close()
        this.loading = null
      }
    },
    /**
     * 下载or分享图片
     * @param {*} type
     */
    createImg(type) {
      const _self = this;
      this.showLoading();
      if(LonchJsApi.isInApp()) {
        // 在移动app或者mac app中用接口
        this.canvas.toBlob(function (blob) {
          _self.upLoad(blob, type);
        })
      } else {
        let url = this.canvas.toDataURL("image/png");
        // 用a标签下载
        let a = document.createElement("a"); // 生成一个a元素
        let event = new MouseEvent("click"); // 创建一个单击事件
        a.download = `${this.utils.formatDate(new Date(), 'yyyyMMddhhmmss')}${this.utils.UUID(8, 10)}.png`; // 设置图片名称
        a.href = url; // 将生成的URL设置为a.href属性
        this.closeLoading();
        a.dispatchEvent(event); // 触发a的单击事件
      }
    },
    /**
     * 上传前
     * @param {*} file
     * @param {*} callback
     */
    beforeUpload(file, callback) {
      let args = {
        bucketName: this.oss.bucket,
        basePath: this.oss.basePath + this.oss.dirName,
        fileName: `${this.utils.UUID(32, 16)}.png`,
      };
      this.API.send(
          this.CFG.services.common.getSign,
          args,
          function (res) {
            res = res.serviceResult;
            let result = typeof res === "string" ? JSON.parse(res) || {} : res;
            callback.call(this, result);
          },
          function () {
            callback.call(this, {
              status: false,
              error: "获取签名失败",
            });
          },
          this,
          true
      );
    },
    /**
     * 上传图片
     * @param {*} blob
     * @param {*} type
     */
    upLoad(blob, type) {
      const _self = this;
      let formData = new FormData();
      // _self.showLoading('上传中...')
      _self.beforeUpload(blob, (data) => {
        if (data.status) {
          formData["enctype"] = "multipart/form-data";
          formData.append("OSSAccessKeyId", data["accessKeyId"]);
          formData.append("policy", data["policy"]);
          formData.append("Signature", data["signature"]);
          formData.append("key", data["key"]);
          formData.append("success_action_status", "201");
          formData.append("file", blob);
          formData.append(
              "Content-Disposition",
              "attachment;filename=" +
              _self.utils.UUID(32, 16) +
              ";filename*=UTF-8" +
              _self.utils.UUID(32, 16)
          );
          _self.API.post(data.action, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
              .then((res) => {
                _self.closeLoading();
                try {
                  let result = Perser.xml2Json(res.data);
                  if (result && result.PostResponse && result.PostResponse.Location) {
                    const args = {
                      type,
                      url: result.PostResponse.Location
                    }
                    let data = LonchJsApi.createProtocolData(_self.CFG.services.im.cmdShareImage, args, {});
                    if(data && data.args && data.args.data && data.args.data.timestamp) {
                      delete data.args.data.timestamp
                    }
                    if(data && data.args && data.args.data && data.args.data.productId) {
                      delete data.args.data.productId
                    }
                    if(data && data.args && data.args.data && data.args.data.manageProductId) {
                      delete data.args.data.manageProductId
                    }
                    LonchJsApi.callAppV2(data);
                  }
                } catch (e) {
                  console.log(e);
                  // _self.closeLoading()
                  _self.$toast({ text: "生成名片失败1" });
                }
              })
              .catch((e) => {
                console.log(e);
                _self.closeLoading();
                _self.$toast({ text: "生成名片失败2" });
              });
        } else {
          _self.closeLoading();
          _self.$toast({ text: data.error });
        }
      });
    }
  },
  mounted() {
  }
}
</script>

<style lang="scss" scoped>
.icon-list {
  &-box {
    .share-item {
      margin: 0 10px;
      text-align: center;
    }
    .share-icon {
      width: 24px;
      img {
        display: block;
        width: 100%;
      }
    }
  }
}
.share-long-press {
  img {
    width: 24px;
    display: block;
  }
}
</style>
