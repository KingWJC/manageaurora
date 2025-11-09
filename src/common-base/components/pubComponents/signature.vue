<template>
  <div class="signature-page">
    <div class="signature-box">
      <div class="signature-main">
        <canvas class="full-width" ref="canvas" width="800" height="480" @mousedown="startDrawing" @mousemove="draw" @mouseup="stopDrawing" @touchstart="startDrawing" @touchmove="draw" @touchend="stopDrawing"></canvas>
      </div>
      <div class="mt10 flex flex-content-between flex-items-center btns">
        <el-button size="small" @click="clearSignature">全部擦掉</el-button>
        <el-button size="small" @click="save">保存签名</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Perser from '@/common-base/utils/perser';
import Loading from '../lonchComponents/loading/index.js';

let loadings = [];
let loadingConfig = {
  show: false,
  loading: null
};

// eslint-disable-next-line no-unused-vars
function showLoading (text) {
  loadings.push(1);
  loadingConfig.show = true;
  loadingConfig.loading = Loading.service({
    lock: true,
    text: text,
    background: 'rgba(0, 0, 0, 0.01)'
  });
}

// eslint-disable-next-line no-unused-vars
function closeLoading () {
  loadings.shift();
  if (loadings.length <= 0) {
    loadingConfig.loading.close();
    loadingConfig.show = false;
  }
}

export default {
  data() {
    return {
      oss: Object.assign({ basePath: 'bi', dirName: '/yfc-sign' }, this.OSSCFG),
      drawing: false,
      context: null,
      loading: null
    };
  },
  mounted() {
    this.context = this.$refs.canvas.getContext('2d');
    this.context.lineWidth = 2;
    this.context.lineCap = 'round';
    this.context.strokeStyle = '#000000';
    const canvasElement = this.$refs.canvas;

    canvasElement.addEventListener('touchstart', function(e) {
      e.preventDefault();
    });

    canvasElement.addEventListener('touchmove', function(e) {
      e.preventDefault();
    });

    canvasElement.addEventListener('touchend', function(e) {
      e.preventDefault();
    });

    canvasElement.addEventListener('gesturestart', function (e) {
      e.preventDefault();
    });

    canvasElement.addEventListener('gesturechange', function (e) {
      e.preventDefault();
    });

    canvasElement.addEventListener('gestureend', function (e) {
      e.preventDefault();
    });
  },
  methods: {
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
              closeLoading();
              let result = Perser.xml2Json(res.data);
              let uploadFile = Object.assign({}, { ...result.PostResponse }, { name: name, Key: data.key });
              if (uploadFile.Key) {
                this.$emit('uploadFin', this.oss.resourcesLocation + uploadFile.Key);
              }
            } catch(e) {
              console.log(e)
              console.log('失败')
            }
          }).catch(() => {
          });
        } else {
          this.$toast({ text: data.error });
        }
      });
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
    save() {
      showLoading();
      //获取截图
      let base64img = this.$refs['canvas'].toDataURL('image/png');
      this.uploadFile(this.convertBase64UrlToBlob(base64img));
    },
    startDrawing(event) {
      this.drawing = true;
      this.context.beginPath();
      this.setPosition(event);
    },
    draw(event) {
      if (!this.drawing) {
        return;
      }
      this.setPosition(event);
      this.context.lineTo(this.posX, this.posY);
      this.context.stroke();
    },
    stopDrawing() {
      this.drawing = false;
    },
    setPosition(event) {
      const rect = this.$refs.canvas.getBoundingClientRect();
      const scaleX = this.$refs.canvas.width / rect.width;
      const scaleY = this.$refs.canvas.height / rect.height;

      if (event.touches && event.touches.length > 0) {
        this.posX = (event.touches[0].clientX - rect.left) * scaleX;
        this.posY = (event.touches[0].clientY - rect.top) * scaleY;
      } else {
        this.posX = (event.clientX - rect.left) * scaleX;
        this.posY = (event.clientY - rect.top) * scaleY;
      }
    },
    clearSignature() {
      this.context.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height);
    },
  },
};
</script>

<style lang="scss" scoped>
.signature-page {
  position: fixed;
  z-index: 999;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.signature-box {
  width: 90%;
  max-width: 340px;
  padding: 10px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 10px;
  .signature-main {
    flex: 1 1 auto;
    overflow: hidden;
    background: #f0f0f0;
    border-radius: 10px;
    canvas {
      display: block;
      border: none;
    }
  }
}
.btns {
  flex-shrink: 0;
  .el-button {
    // transform: rotate(90deg);
  }
}
</style>
