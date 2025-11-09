<template>
  <div>
    <div class="singdialog" v-if="!startCame">
      <div class="tip-img-box">
        <img alt="提示" src="https://resources.lonch.com.cn/ybd/image/20231226-face.png" />
      </div>
      <div class="info">
        <div>录入时，请保证五官清晰可见，避免佩戴帽子、墨镜、口罩等物件，保证光线充足、避免阳光直射，以提高录入率</div>
        <div>当前设备ID：{{ deviceId }}</div>
      </div>
      <el-button type="primary" @click="startCame = true">开始</el-button>
    </div>
    <div class="camerialog" v-if="startCame">
      <div class="title">{{ camerdialogtitle }}</div>
      <camer ref="camervideo" @refreshDataList="refreshCameraPhoto" @again="againcamer" :error="camererror" :success="camersuccess"></camer>
    </div>
  </div>
</template>

<script>
import Perser from '@/common-base/utils/perser';
import camer from './managecamer';
// import commonApi from "@/common-base/config/common-api-config.js";

export default {
  components: {
    camer,
    Perser
  },
  data() {
    return {
      oss: Object.assign({ basePath: 'bi', dirName: '/caFace' }, this.OSSCFG),
      storeData: {
        picture: [],
      },
      startCame: false,//人脸识别提示文本
      camerdialogtitle: '人脸采集过程中，请保持脸部正面朝向摄像头',//人脸识别踢死文本
      camererror: false,//人脸识别-按钮是否显示
      deviceId: '',
      appName: ''
    }
  },
  mounted() {
    this.getPhoneInfo();
  },
  methods: {
    refreshCameraPhoto(cameraPhoto) {//视频组件回调
      // console.log(cameraPhoto);
      let base64img = cameraPhoto;//获取截图
      let picture = base64img.substr(String('data:image/png;base64,').length)
      this.camerdialogtitle = "识别中..."
      // this.checkFn();
      // return;
      this.uploadFile(this.convertBase64UrlToBlob('data:image/jpeg;base64,' + picture))
    },
    /**
     * [beforeUpload 上传图片前执行获取秘钥]
     * @return {[type]} [description]
     */
    beforeUpload(name, callback) {
      let args = {
        bucketName: this.oss.bucket,
        basePath: this.oss.basePath + this.oss.dirName,
        fileName: name + ''
      };
      this.API.send(this.CFG.services.common.getSign, args, function (res) {
        res = res.serviceResult;
        let result = typeof res === 'string' ? JSON.parse(res) || {} : res;
        callback(result);
      }, function () {
        callback.call(this, {
          status: false,
          error: '获取签名失败'
        });
      }, this);
    },
    uploadFile(blob) {
      let formData = new FormData();
      const name = new Date().getTime() + '.jpeg';
      this.beforeUpload(name, data => {
        if (data.status) {
          formData['enctype'] = 'multipart/form-data';
          formData.append('OSSAccessKeyId', data['accessKeyId']);
          formData.append('policy', data['policy']);
          formData.append('Signature', data['signature']);
          formData.append('key', data['key']);
          formData.append('success_action_status', '201');
          formData.append('file', blob);
          formData.append(
            'Content-Disposition',
            'attachment;filename=' + name + ';filename*=UTF-8' + name
          );
          this.API.post(
            data.action,
            formData,
            {
              headers: { 'Content-Type': 'multipart/form-data' }
            }
          ).then((res) => {
            try {
              let result = Perser.xml2Json(res.data);
              let uploadFile = Object.assign({}, { ...result.PostResponse }, { name: name, Key: data.key });
              if (uploadFile.Key) {
                this.checkFn(this.oss.resourcesLocation + uploadFile.Key);
              }
            } catch {
              console.log('失败')
            }
          }).catch(() => {
          });
        } else {
          this.$toast({ text: data.error });
        }
      });
    },
    checkFn(img) {
      this.$emit('change', img);
      /*
      //校验人脸
      let url = commonApi.lca.systemHumanApplyCreate;
      let img1 = "https://resources.lonch.com.cn/bi-dev/caFace/2023/09/05/457cff2a831f483cbacda744f4fdf0a720230905153423.jpeg"
      this.API.send(url, {
        humanId: this.CFG.userInfo.id,
        imageUrl: img || img1,
        cellphone: this.CFG.userInfo.cellphone,
        terminalId: this.CFG.terminalId,
        osName: window.navigator.platform,
        browserName: this.getBrowserInfo()[0],
        deviceId: this.deviceId,
        appName: this.appName || this.getWebAppName(),
      }, function (res) {
        res = res.serviceResult;
        let msg = '';
        if (res.resultCode === 0) {
          this.sendBack(res.caToken, '认证成功');
          return
        } else if (res.resultCode === 1) {
          msg = '没有找到自然人对应关联, 请联系管理员';
        } else if (res.resultCode === 2) {
          msg = '活体检测失败，请重试';
        } else if (res.resultCode === 3) {
          msg = '人脸认证不通过';
        }
        this.$toast({ text: msg });
        setTimeout(() => {
          this.againcamer(true);
        }, 2000);
      }, function () { }, this)
      */
    },
    sendBack(caToken) {
      this.utils.setCookie('ca-token', caToken, '/', this.CFG.domain, 30 * 24 * 60 * 60 * 1000);
    },
    convertBase64UrlToBlob(urlData) {
      let arr = urlData.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },
    againcamer(value) {//视频组价相机未获取回调
      // console.log('againcamer');
      this.camererror = value;
      this.camerdialogtitle = "人脸采集过程中，请保持脸部正面朝向摄像头"
    },
    goBack() {
      if (LonchJsApi.isInApp()) {
        LonchJsApi.callApp({ command: 'cmdAppBack' });
      } else {
        this.$router.go(-1);
      }
    },
    /**
     * 获取当前设备ID
     */
    getPhoneInfo() {
      if (LonchJsApi.isInApp()) {
        this.API.send(this.CFG.services.appCommand.getAppInfo, {},
          (res) => {
            res = res.serviceResult;
            this.appName = res.appName;
            this.deviceId = res.deviceId;
          },
          function () {
          }, this)
      } else {
        this.appName = this.CFG.appName;
        this.deviceId = this.CFG.terminalId;
      }
    },
    getBrowserInfo() {
      let agent = navigator.userAgent.toLowerCase();
      let regStr_ie = /msie [\d.]+;/gi;
      let regStr_ff = /firefox\/[\d.]+/gi;
      let regStr_chrome = /chrome\/[\d.]+/gi;
      let regStr_saf = /safari\/[\d.]+/gi;
      //IE
      if (agent.indexOf("msie") > 0) {
        return agent.match(regStr_ie);
      }

      //firefox
      if (agent.indexOf("firefox") > 0) {
        return agent.match(regStr_ff);
      }

      //Chrome
      if (agent.indexOf("chrome") > 0) {
        return agent.match(regStr_chrome);
      }

      //Safari
      if (agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
        return agent.match(regStr_saf);
      }
      return [''];
    },
    getWebAppName() {
      let appName = '';
      this.CFG.projects.forEach(element => {
        if (element.id === this.CFG.project.id) {
          appName = element.title
        }
      });
      return appName
    }
  }
}
</script>

<style lang="scss" scoped>
.singdialog {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px;
  justify-content: space-between;

  .title {
    font-size: 18px;
    padding: 10px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(26, 28, 31, 1);
  }

  .info {
    line-height: 25px;
    text-align: center;
    margin-bottom: 40px;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(109, 114, 120, 1);
  }

  .sign {
    width: 528px;
    height: 240px;
    border-radius: 10px;
    border: 1px solid rgba(151, 151, 151, 1);
  }
  .tip-img-box {
    margin: 20px;
    img {
      width: 200px;
      display: block;
    }
  }
}

.camerialog {
  min-height: 415px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  .title {
    font-size: 18px;
    padding: 10px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(26, 28, 31, 1);
    margin-bottom: 20px;
  }

  .camecomponet {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .picture {
    display: flex;
    flex-direction: column;

    img {
      height: 200px;
      width: 200px;
      margin-bottom: 10px;
      border-radius: 100%;
      border: 2px solid rgba(0, 204, 195, 1);
    }
  }
}
</style>
