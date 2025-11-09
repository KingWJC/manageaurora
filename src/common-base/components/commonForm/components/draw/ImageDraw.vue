<!--
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2024-11-13 16:42:08
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2024-11-23 00:57:21
 * @FilePath: \lonch-rxv-fe\src\components\admin\rxv\scaleRecord\components\draw\ImageDraw.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <canvas
      class="full-width"
      :class="isAngelswings ? 'canvas-h' : ''"
      ref="canvas"
      @mousedown="startDrawing"
      @mousemove="draw"
      @mouseup="stopDrawing"
      @touchstart="startDrawing"
      @touchmove="draw"
      @touchend="stopDrawing"
    ></canvas>
    <div class="mt10 flex flex-content-between flex-items-center">
      <el-button size="small" @click="clearSignature">重置</el-button>
      <el-button type="primary" size="small" @click="save">确定</el-button>
    </div>
  </div>
</template>

<script>
import Perser from '@/common-base/utils/perser';
export default {
  props: ['oss', 'imageSrc', 'imagePos'],
  data() {
    return {
      drawing: false,
      context: null,
      loading: null
    };
  },
  computed: {
    /** 云诊室s **/
    isAngelswings() {
      return this.CFG.appName === 'angelswings';
    }
  },
  mounted() {
    this.context = this.setupCanvas(this.$refs.canvas);
    this.context.lineWidth = 2;
    this.context.lineCap = 'round';
    this.context.strokeStyle = '#000000';
    const canvasElement = this.$refs.canvas;
    this.drawImage();

    canvasElement.addEventListener('touchstart', function (e) {
      e.preventDefault();
    });

    canvasElement.addEventListener('touchmove', function (e) {
      e.preventDefault();
    });

    canvasElement.addEventListener('touchend', function (e) {
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
     * @param {Number} sx 固定盒子的x坐标,sy 固定盒子的y左标
     * @param {Number} box_w 固定盒子的宽, box_h 固定盒子的高
     * @param {Number} source_w 原图片的宽, source_h 原图片的高
     * @return {Object} {drawImage的参数，缩放后图片的x坐标，y坐标，宽和高},对应drawImage(imageResource, dx, dy, dWidth, dHeight)
     */
    containImg(sx, sy, box_w, box_h, source_w, source_h) {
      let dx = sx,
        dy = sy,
        dWidth = box_w,
        dHeight = box_h;

      // 当图片宽度大于盒子宽度或图片高度大于盒子高度时，按盒子宽度缩放
      if (source_w > box_w || source_h > box_h) {
        // 按盒子宽度等比例缩放
        dHeight = (source_h * dWidth) / source_w;
        // 计算垂直居中位置
        dy = sy + (box_h - dHeight) / 2;
      } else {
        // 原图尺寸适合盒子，保持原有逻辑
        if (source_w > source_h || (source_w === source_h && box_w < box_h)) {
          dWidth = (source_w * dHeight) / source_h;
          dx = sx + (box_w - dWidth) / 2;
        } else if (
          source_w < source_h ||
          (source_w === source_h && box_w > box_h)
        ) {
          dHeight = (source_h * dWidth) / source_w;
          dy = sy + (box_h - dHeight) / 2;
        }
      }

      return {
        dx,
        dy,
        dWidth,
        dHeight
      };
    },
    setupCanvas(canvas) {
      // Get the device pixel ratio, falling back to 1.
      const dpr = window.devicePixelRatio || 1;
      // Get the size of the canvas in CSS pixels.
      const rect = canvas.getBoundingClientRect();
      // Give the canvas pixel dimensions of their CSS
      // size * the device pixel ratio.
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      // Scale all drawing operations by the dpr, so you
      // don't have to worry about the difference.
      ctx.scale(dpr, dpr);
      return ctx;
    },

    drawImage() {
      if (this.imageSrc) {
        this.context = this.setupCanvas(this.$refs.canvas);
        const image = new Image();
        image.src = this.imageSrc;
        image.setAttribute('crossOrigin', 'anonymous');
        image.onload = () => {
          if (this.imagePos === '2') {
            const imgRect = this.containImg(0,0, this.$refs.canvas.width, this.$refs.canvas.height, image.width, image.height);

            this.context.drawImage(image, imgRect.dx, imgRect.dy, imgRect.dWidth, imgRect.dHeight);
          } else if (this.imagePos === '1') {
            this.context.drawImage(image, 0, 0, this.$refs.canvas.width * 0.25, this.$refs.canvas.width * 0.25 / image.width * image.height);
          }
        };
      }
      this.context.resetTransform();
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
      this.API.send(
        this.CFG.services.common.getSign,
        args,
        function (res) {
          res = res.serviceResult;
          let result = typeof res === 'string' ? JSON.parse(res) || {} : res;
          callback(result);
        },
        function () {
          callback.call(this, {
            status: false,
            error: '获取签名失败'
          });
        },
        this
      );
    },
    uploadFile(blob) {
      let formData = new FormData();
      const name = new Date().getTime() + '.jpeg';
      this.beforeUpload(name, (data) => {
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
          this.API.post(data.action, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
            .then((res) => {
              try {
                let result = Perser.xml2Json(res.data);
                let uploadFile = Object.assign(
                  {},
                  { ...result.PostResponse },
                  { name: name, Key: data.key }
                );
                if (uploadFile.Key) {
                  this.loading.close();
                  this.$emit(
                    'uploadFin',
                    this.oss.resourcesLocation + uploadFile.Key
                  );
                }
              } catch (e) {
                console.error(e);
              }
            })
            .catch(() => {});
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
      this.context.clearRect(
        0,
        0,
        this.$refs.canvas.width,
        this.$refs.canvas.height
      );
      this.drawImage();
    }
  }
};
</script>

<style lang="scss" scoped>
canvas {
  border: #ddd 1px solid;
  border-radius: 8px;
  overflow: hidden;
}
.canvas-h {
  height: 200px;
}
::v-deep .el-dialog {
  width: 800px; // 默认宽度，对于大于等于 800px 的屏幕
}

@media (max-width: 800px) {
  ::v-deep .el-dialog {
    width: 100%; // 在小于 800px 的屏幕上设置宽度为 100%
  }
}
</style>
