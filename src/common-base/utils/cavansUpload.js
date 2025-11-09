import Perser from './perser';
import CFG from '../../config/index';
import Api from '../api/api';
import {Loading} from 'element-ui';


let loading = null;

// eslint-disable-next-line no-unused-vars
function showLoading (text) {
  loading = Loading.service({
    lock: true,
    text: text,
    background: 'rgba(0, 0, 0, 0.5)'
  });
}

function closeLoading () {
  loading.close();
}

function cavansUpload (oss, DOM, cb) {
  showLoading('附件生成中');
  // 增加对页面上含有图片时，需要设置跨域
  const options = {
    useCORS: true, // 允许加载跨域图片（需要服务器支持 CORS）
    allowTaint: false, // 一般情况下，优先使用 CORS 而非污染 canvas
    scale: 2, // 提高缩放倍数以获得更高清晰度的图片，根据需求调整
    logging: false, // 是否需要输出日志到控制台
  };
  // eslint-disable-next-line no-undef
  html2canvas(DOM, options).then(canvas => {
    /**
     * cavans对象读取文件流判断是否满足企业微信提交审核条件
     * 企业微信提交审核条件 is2Msize = blob.size / 1024 / 1024 < 2;
     * 小于2M可以提交
     * @param {*} cCanvas // canvas读取对象
     * @param {*} q 质量-标识 0 ~ 1
     */
    const createBlob = (cCanvas, q) => {
      cCanvas.toBlob((blob) => {
        const is2Msize = blob.size / 1024 / 1024 < 2; // 图片单位 M
        if (is2Msize) { // 小于2M图片正常上传
          uploadFile(oss, blob, cb);
        } else {
          if (q > 0.8) {
            q = q - 0.1; // 图片压缩方案降低图片质量
            createBlob(cCanvas, q);
          }else{
            cavansImg(blob);
          }
        }
        DOM.style.width = 'auto';
      }, 'image/jpeg', q);
    };
    createBlob(canvas, 1);
    /**
     * 读取文件数据流重新生成图片并读取文件流
     * @param {*} blob 文件数据流
     */
    const cavansImg = (blob) => {
      const newImg = document.createElement('img');
      newImg.onload = () => {
        /**
         * 每次减少图片大小 10%
         */
        newImg.width = newImg.width * 0.9;
        newImg.height = newImg.height * 0.9;
        const nCanvas = document.createElement('canvas');
        nCanvas.width = newImg.width;
        nCanvas.height = newImg.height;
        const context = nCanvas.getContext('2d');
        context.drawImage(newImg, 0, 0, newImg.width, newImg.height);
        createBlob(nCanvas, 0.95);
      };
      newImg.src = URL.createObjectURL(blob);
    };
  });
}

function uploadFile (oss, blob, cb, fileName) {
  let formData = new FormData();
  const name = fileName || new Date().getTime() + '.jpeg';
  beforeUpload(oss, name, data => {
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

      // 防止网络问题引起暴击
      showLoading();

      Api.post(
        data.action,
        formData,
        {
          headers: {'Content-Type': 'multipart/form-data'}
        }
      ).then((res) => {
        closeLoading();
        try {
          let result = Perser.xml2Json(res.data);
          let uploadFile = Object.assign({}, {...result.PostResponse}, {name: name, Key: data.key});
          cb && cb(oss.resourcesLocation + uploadFile.Key);
        } catch (e){
          console.log(e);
          closeLoading();
        }
      }).catch(() => {
        closeLoading();
      });
    } else {
      closeLoading();
    }
  });
}

/**
 * [beforeUpload 上传图片前执行获取秘钥]
 * @return {[type]} [description]
 */
function beforeUpload (oss, name, callback) {
  let args = {
    bucketName: oss.bucket,
    basePath: oss.basePath + oss.dirName,
    fileName: name + ''
  };
  Api.send(CFG.services.common.getSign, args, (res) => {
    res = res.serviceResult;
    let result = typeof res === 'string' ? JSON.parse(res) || {} : res;
    callback(result);
  }, () => {
    callback.call(this, {
      status: false,
      error: '获取签名失败'
    });
  }, beforeUpload);
}


function dynamicUploadFile (oss, cb) {
  const upFILE = document.createElement('input');
  upFILE.type = 'file';
  upFILE.click();
  upFILE.addEventListener('change', (e) => {
    const target = e.target || e.srcElement;
    const file = target.files[0];
    showLoading('附件上传中');
    uploadFile(oss, file, (src) => {
      cb({
        path: src,
        name: file.name
      });
    }, file.name);
  });
}


export default {
  dynamicUploadFile,
  cavansUpload,
  uploadFile
};
