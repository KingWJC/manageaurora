<template>
  <div class="tac">
    <div class="camera_outer">
      <video id="videoCamera" autoplay :width="videoWidth" :height="videoHeight" playsinline='false'
        webkit-playsinline='false'></video>
      <canvas id="canvasCamera" :width="videoWidth" :height="videoHeight"></canvas>
      <div v-if="imgSrc" class="camerimage">
        <img :src="imgSrc" alt="" class="tx_img">
      </div>
      <img v-if="circleimgflag && !camersuccess && !camererror" class="circleimg"
        src="https://resources.lonch.com.cn/ybd/image/20231226-circle.png" alt="">
    </div>
    <div class="handle">
      <el-button type="primary" @click="againsetImage" v-show="camererror">重新识别</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["error", "success"],
  data() {
    return {
      circleimgflag: false,
      settimeoutobj: '',
      videoWidth: 240,
      videoHeight: 320,
      imgSrc: '',
      thisCancas: null,
      thisContext: null,
      thisVideo: null,
    }
  },
  computed: {
    camererror() {
      return this.error
    },
    camersuccess() {
      return this.success
    }
  },
  methods: {
    getCompetence() {
      let _this = this
      this.thisCancas = document.getElementById('canvasCamera')
      this.thisContext = this.thisCancas.getContext('2d')
      this.thisVideo = document.getElementById('videoCamera')
      // 旧版本浏览器可能根本不支持mediaDevices，我们首先设置一个空对象
      //navigator获取浏览器信息
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {}
      }
      // 一些浏览器实现了部分mediaDevices，我们不能只分配一个对象
      // 使用getUserMedia，因为它会覆盖现有的属性。
      // 这里，如果缺少getUserMedia属性，就添加它。
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function (constraints) {
          // 首先获取现存的getUserMedia(如果存在)
          let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.getUserMedia
          // 有些浏览器不支持，会返回错误信息
          // 保持接口一致
          if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
          }
          // 否则，使用Promise将调用包装到旧的navigator.getUserMedia
          return new Promise(function (resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject)
          })
        }
      }
      let constraints = { audio: false, video: {
        /*
        人脸识别需要调前置摄像头
        */
        facingMode: "user", // 摄像头
        width: this.videoWidth, height: this.videoHeight, transform: 'scaleX(-1)' } }
      navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        // 旧的浏览器可能没有srcObject
        if ('srcObject' in _this.thisVideo) {
          _this.thisVideo.srcObject = stream
        } else {
          // 避免在新的浏览器中使用它，因为它正在被弃用。
          _this.thisVideo.src = window.URL.createObjectURL(stream)
        }
        _this.thisVideo.onloadedmetadata = function () {
          _this.thisVideo.play()
          _this.circleimgflag = true;
          _this.stopMediaDev(stream);
          _this.daoshunumber();
        }
      }).catch(() => {
        alert("没有检测到视频设备,请在系统设置里添加权限，允许当前浏览器访问摄像头")
      })
    },
    /*
    }
    *****************************************/
    stopMediaDev(stream) {
      setTimeout(() => {
        stream.getTracks().forEach(function (track) {
          track.stop();
        });
      }, 5000)
    },
    setImage() {
      let _this = this
      // 点击，canvas画图
      _this.thisContext.drawImage(_this.thisVideo, 0, 0, _this.videoWidth, _this.videoHeight)
      // 获取图片base64链接
      let image = this.thisCancas.toDataURL('image/png')
      _this.imgSrc = image
      this.$emit('refreshDataList', _this.imgSrc)
    },
    /*

    *****************************************/
    dataURLtoFile(dataurl, filename) {
      let arr = dataurl.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let bstr = atob(arr[1])
      let n = bstr.length
      let u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    },
    /*

    *****************************************/
    stopNavigator() {
      this.thisVideo.srcObject && this.thisVideo.srcObject.getTracks && this.thisVideo.srcObject.getTracks()[0].stop()
    },
    againsetImage() {
      this.getCompetence();
      this.imgSrc = "";
      this.circleimgflag = false;
      this.$emit('again', false);
      // this.daoshunumber();
    },
    daoshunumber() {
      let that = this;
      this.settimeoutobj = setTimeout(() => {
        clearTimeout(that.settimeoutobj);
        that.setImage();
      }, 3000)
    }
  },
  mounted() {
    this.getCompetence()
  },
  beforeDestroy() {
    this.stopNavigator()
  }

}
</script>
<style lang="scss" scoped type="text/scss">
.handle {
  text-align: center;
  margin-top: 20px;
}
#canvasCamera {
  display: none;
}
.camera_outer {
  padding: 10px;
  // border: 1px solid rgba(221, 221, 221, 0.5);
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 100%;
  background: rgba(221, 221, 221, 0.5);

  #videoCamera {
    position: absolute;
    top: 0;
    left: 0px;
    z-index: 3;
    border-radius: 100%;
    width: 200px;
    height: 200px;
    padding: 10px;
    object-fit: cover;
  }

  .tx_img {
    position: absolute;
    top: 0;
    left: 0;
    object-fit: cover;
    width: 200px;
    height: 200px;
    border-radius: 100%;
  }

  .camerimage {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 100%;
    z-index: 3;
  }

  video,
  canvas,
  .tx_img {
    -moz-transform: scaleX(-1);
    -webkit-transform: scaleX(-1);
    -o-transform: scaleX(-1);
    transform: scaleX(-1);
  }

  .btn_camera {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    background-color: rgba(0, 0, 0, 0.3);
    line-height: 50px;
    text-align: center;
    color: #ffffff;
  }

  .circleimg {
    position: absolute;
    width: 200px;
    height: 200px;
    display: block;
    top: 0px;
    left: 0px;
    z-index: 1;
    animation: roller 2s infinite linear;
  }
}

@keyframes roller {
  0% {
    transform: rotateZ(0);
  }

  100% {
    transform: rotateZ(360deg);
  }
}</style>
