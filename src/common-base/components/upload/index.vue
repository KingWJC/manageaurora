<template>
    <!--<div class="content" @click="$refs.uploadFile.click()">-->
    <div class="content">
        <label for="uploader-file" class='uploader'>
            <span v-if="!$slots.default">{{label}}</span>
            <slot />
            <input id="uploader-file"
                   type="file"
                   class="uploader-file"
                   @change="fileChange"
                   :accept="accept"
                   :multiple="multiple"
                   ref="uploadFile" />
        </label>
    </div>
</template>

<script type="text/ecmascript-6">
import Perser from '@/common-base/utils/perser';

export default {
  name: 'OssUpload',
  props: {
    limit: {
      type: Number,
      default: 1
    },
    bucket: {
      type: String,
      default: 'resources-lonch'
    },
    region: {
      type: String,
      default: 'oss-cn-beijing'
    },
    basePath: {
      type: String,
      default: ''
    },
    dirName: {
      type: String,
      default: ''
    },
    maxSize: {
      type: Number,
      default: 10485760
    },
    label: {
      type: String,
      default: '选择文件'
    },
    accept: {
      type: String,
      default: ''
    },
    state: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
    isKeepOriginalName: {
      type: String,
      default: '0' // 默认不保留原名   保留原名值为1
    }
  },
  data () {
    return {
      fileList: [],//文件列
      showProgress: false,//进度条的显示
      dataObj: {}, //存签名信息
      dialogVisible: false,
      dialogImageUrl: '',
      progress: 0, //进度条数据
      // ==
      uploadFilesName: '',
      uploadfile: [],
      maxLength: 1,
      resultList: [],
      flag: 0
    };
  },
  methods: {
    showLoading (text) {
      this.loading = this.$loading({
        lock: true,
        text: text,
        background: 'rgba(0, 0, 0, 0.5)'
      });
    },
    closeLoading () {
      if (this.loading) {
        this.loading.close();
        this.loading = null;
      }
    },
    resetUploadFile () {
      if (this.$refs.uploadFile) {
        this.$refs.uploadFile.value = '';
      }
    },
    /**
     * [beforeUpload 上传图片前执行获取秘钥]
     * @return {[type]} [description]
     */
    beforeUpload (file, callback) {
      let args = {
        bucketName: this.bucket,
        basePath: this.basePath + this.dirName,
        fileName: file.name,
        isKeepOriginalName: this.isKeepOriginalName // 是否需要改名
      };
      this.API.send(this.CFG.services.common.getSign, args, function (res) {
        res = res.serviceResult;
        let result = typeof res === 'string' ? JSON.parse(res) || {} : res;
        callback.call(this, result);
      }, function () {
        callback.call(this, {
          status: false,
          error: '获取签名失败'
        });
      }, this);
    },
    /**
     * 转换为数据流
     * @param buffer
     * @param type
     * @return {Blob}
     */
    getBlobByArrayBuffer (buffer, type) {
      //let arr8 = Uint8Array.from(buffer);
      let BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
      if (BlobBuilder) {
        let blobBuilder = new BlobBuilder();
        blobBuilder.append(buffer);
        return blobBuilder.getBlob(type);
      } else {
        return new window.Blob([buffer], {
          type: type
        });
      }
    },
    fileChange (event) {
      this.resultList = [];
      this.flag = 0;
      let that = this;
      let fileList = event.target.files;
      // if (event.target.files) {
      //   file = event.target.files[0]
      // }
      if (!fileList) {
        return;
      }
      for (let index = 0; index < fileList.length; index++) {
        const file = fileList[index];
        if(file.type && file.type.includes('video')) {
          const videoElement = document.createElement('video');
          videoElement.addEventListener('loadedmetadata', function() {
            if(videoElement.videoWidth > 1920 || videoElement.videoHeight > 1080) {
              that.$confirm({
                title: '提示',
                text: '您选择的视频尺寸过大，用户可能无法观看，请调整大小后重新上传。建议尺寸不超过：1920*1080',
                buttons: [
                  {
                    text: '我知道了',
                    type: 'primary',
                    callback: () => {
                      that.resetUploadFile();
                    }
                  }
                ]
              });
            } else {
              that.checkFileSizeUpload(file);
            }
          })
          videoElement.src = URL.createObjectURL(file);
        } else {
          this.checkFileSizeUpload(file);
        }
      }
    },
    /**
     * 上传文件
     */
     checkFileSizeUpload(file) {
      let that = this
      let reader
      if (file.size > this.maxSize) {
        this.$toast({text: file.name + '文件大小超过' + this.maxSize / (1048576) + 'MB'})
        return
      }
      reader = new FileReader();
      reader.readAsArrayBuffer(file)
      reader.onload = function () {
        that.upLoad(this.result, file)
      }
    },
    // http-request属性来覆盖默认的上传行为（即action="url"），自定义上传的实现
    upLoad (buffer, file) {
      let blob = this.getBlobByArrayBuffer(buffer, file.type);
      let formData = new FormData();
      let that = this;
      that.showLoading('上传中...');
      that.beforeUpload(file, data => {
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
            'attachment;filename=' + encodeURIComponent(file.name) + ';filename*=UTF-8' + encodeURIComponent(file.name)
          );
          that.API.post(
            data.action,
            formData,
            {
              headers: {'Content-Type': 'multipart/form-data'}
            }
          ).then((res) => {
            that.closeLoading();
            try {
              let result = Perser.xml2Json(res.data);
              let uploadFile = Object.assign({}, {...result.PostResponse}, {
                name: file.name,
                Key: data.key
              }, {file: blob});
              that.resetUploadFile();
              that.$emit('uploaded', uploadFile, that.state);
            } catch (e) {
              that.closeLoading();
              that.$toast({text: '上传失败' + e.toString()});
            }
          }).catch((error) => {
            that.closeLoading();
            that.$toast({text: '上传失败' + error.toString()});
            that.resetUploadFile();
          });
        } else {
          that.$toast({text: data.error});
          that.closeLoading();
          that.resetUploadFile();
        }
      });
    },
    // 添加一个公共方法，允许外部调用文件上传
    uploadFiles(files) {
      if (!files || files.length === 0) return;
      
      // 模拟事件对象
      const event = {
        target: {
          files: files
        }
      };
      
      this.fileChange(event);
    }
  }
};
</script>

<style type="text/css">
    .uploader {
        display: inherit;
        position: relative;
    }

    .uploader-file {
        position: absolute;
        display: block;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        opacity: 0.01;
    }
</style>
