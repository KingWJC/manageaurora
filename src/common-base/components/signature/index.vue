<template>
  <div>
    <canvas class="full-width" width="800" height="480" :class="isAngelswings ? 'canvas-h' : ''" ref="canvas" @mousedown="startDrawing" @mousemove="draw" @mouseup="stopDrawing" @touchstart="startDrawing" @touchmove="draw" @touchend="stopDrawing"></canvas>
    <div class="mt10 flex flex-content-between flex-items-center">
      <el-button size="small" @click="clearSignature">全部擦掉</el-button>
      <el-button size="small" @click="save">保存签名</el-button>
    </div>
  </div>
</template>
<script>
import Perser from '@/common-base/utils/perser';
export default {
  props: ['oss'],
  data() {
    return {
      drawing: false,
      context: null,
      base64img: null,
      loading: null
    };
  },
  computed:{
    /** 云诊室s **/
    isAngelswings() {
      return this.CFG.appName === 'angelswings'
    }
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
              let result = Perser.xml2Json(res.data);
              let uploadFile = Object.assign({}, { ...result.PostResponse }, { name: name, Key: data.key });
              if (uploadFile.Key) {
                this.loading.close();
                this.$emit('change', {
                  url: this.oss.resourcesLocation + uploadFile.Key,
                  type: 'image/png',
                  base64Data: this.base64img,
                });
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
      this.loading = this.$loading({
        show: false,
        loading: null,
        background: 'rgba(0, 0, 0, 0.01)'
      });
      //获取截图
      this.base64img = this.$refs['canvas'].toDataURL('image/png');
      this.uploadFile(this.convertBase64UrlToBlob(this.base64img));
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
canvas {
  border: #ddd 1px solid;
  border-radius: 8px;
  overflow: hidden;
}
.canvas-h{
  height: 200px;
}
::v-deep .el-dialog {
  width: 800px;  // 默认宽度，对于大于等于 800px 的屏幕
}

@media (max-width: 800px) {
  ::v-deep .el-dialog {
    width: 100%;  // 在小于 800px 的屏幕上设置宽度为 100%
  }
}
</style>
