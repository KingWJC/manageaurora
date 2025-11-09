<!--
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2025-03-13 17:54:17
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-03-18 22:41:18
 * @FilePath: \lonch-appbar\src\components\common\yfCard\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <!-- <div class="mt20 mb10">
      <AuthenticationCard @toRZH="toRZH"></AuthenticationCard>
    </div> -->
    <div class="manage-card-frame pt10" v-if="cardInfo">
      <img ref="manageCardRef" :src="cardInfo.url" alt="名片" v-if="cardInfo.url" @click="handleClickCard"/>
      <Share :canvas="cardInfo.canvas" v-if="cardInfo.url"></Share>
    </div>
    <el-dialog
      :close-on-click-modal="true"
      :append-to-body="true"
      v-if="imageDialog.visible"
      :visible.sync="imageDialog.visible"
      :top="imageDialog.top"
      custom-class="manage-card-img-preview-dialog"
      :width="'400px'"
      center>
        <img class="full-width" alt="" :src="imageDialog.url" @click="imageDialog.visible = false">
    </el-dialog>
    <el-dialog
      title="邮箱管理"
      :close-on-click-modal="false"
      :append-to-body="true"
      v-if="maillSetting.visible"
      :visible.sync="maillSetting.visible"
      custom-class="mail-seeting-dialog"
      center>
      <Email @close="maillSetting.visible = false"></Email>
    </el-dialog>
  </div>
</template>

<script>
import Share from '@/common-base/components/common/share';
// 实名认证卡片
import AuthenticationCard from '@/common-base/components/common/authenticationCard'
// 邮箱管理
import Email from '@/common-base/components/common/card/yfCard/email'
export default {
  components: {
    Share,
    AuthenticationCard,
    Email,
  },
  data() {
    return {
      cardInfo: undefined,
      wecomQrCode: undefined,
      imageDialog: {
        visible: false,
        url: '',
        top: undefined,
      },
      // 邮箱设置
      maillSetting: {
        visible: false,
        url: '',
        top: undefined,
      },
    }
  },
  created() {
    // 获取用户信息
    this.getUserInfo();
  },
  methods: {
    /**
     * 预览图片
     * @param {*} url 图片地址
     * @param {*} imageZoomType 图片类型, cardInfoUrl: 名片图片, wecomQrCode: 企业微信二维码,
     */
    previewImg(image, top) {
      this.imageDialog = {
        visible: true,
        url: image,
        top,
      }
    },
    /**
     * 获取图片放大弹窗的top
     * @param {*} type 图片类型, cardInfoUrl: 名片图片, wecomQrCode: 企业微信二维码,
     * @returns
     */
    getImageDialogTop(type) {
      if (type === 'wecomQrCode') {
        return '8vh';
      }
      return '15vh';
    },
    /**
     * 点击名片
     * @param {*} e 事件
     */
    handleClickCard(e) {
     const manageCardRef = this.$refs.manageCardRef;
      if (!manageCardRef) { return; }
      // 获取图片元素的位置信息
      const rect = manageCardRef.getBoundingClientRect();
      // 获取点击位置的坐标
      const pos = {
        x: e.offsetX,
        y: e.offsetY,
      };
      // 计算点击位置相对于图片元素的百分比坐标
      const percentX = pos.x / rect.width * 100;
      const percentY = pos.y / rect.height * 100;
      /**
       * 计算出点击位置
       *
       * 如果二维码存在, 则二维码位置
       * x: 74% ~ 93%
       * y: 4% ~ 17%
       */
      // 预览企业微信二维码
      if (percentX > 74 && percentX < 93 && percentY > 4 && percentY < 17 && this.wecomQrCode) {
        this.handleViewImage(this.wecomQrCode, '8vh');
      } else {
        // 预览名片图片
        this.handleViewImage(this.cardInfo.url, '8vh');
      }
    },
    /**
     * 查看放大图片
     *
     * @param image 图片地址
     * @param top 弹窗top
     */
    handleViewImage(image, top) {
      // 如果是 Android 或 iOS 应用，调用 LonchJsApi 中的 cmdFullScreenShowMedia 打开图片弹窗
      if (LonchJsApi.isInIosApp() || LonchJsApi.isInIosAppV2() || LonchJsApi.isInAndroidApp() || LonchJsApi.isInAndroidAppV2()) {
        this.API.send({ command: 'cmdFullScreenShowMedia' }, {
          type: "image",
          source: [image],
          backgroundAlpha: 0.3,
        }, () => {}, () => { }, this, true);
      } else {
        // 如果不是 Android 或 iOS 应用，打开弹窗预览图片
        this.previewImg(image, top);
      }
    },
    /**
     * 获取用户信息
     */
    async getUserInfo() {
      try {
        const [cardInfo, cardPhoto, wecomInfo] = await Promise.all([this.getCardInfo(), this.getCardPhoto(), this.getUserWxQrCode()]);
        this.wecomQrCode = wecomInfo?.qrCode;
        if (cardInfo) {
          this.cardInfo = await this.loadCardItem({
            name: cardInfo.name, // 姓名
            photo: cardPhoto, // 头像照片
            wecomQrCode: wecomInfo?.qrCode, // 企业微信二维码
            positionName: cardInfo.positionName, // 职位
            orgName: cardInfo.orgName, // 组织
            ownerName: cardInfo.subjectName, // 所属组织
          });
        }
      } catch (error) {
        console.error(error);
        this.$toast({text: '生成失败，请您再试一次'});
      }
    },
    /**
     * 获取朗致集团用户数据信息
     *
     * 数据来源: /employee/viewLzEmployeeByHumanId
     *
     * 单据: 人员行政认证申请单 - 隶属(组织): 朗致集团有限公司
     *
     * @returns {Promise<*>}
     */
    getCardInfo() {
      return new Promise((resolve, reject) => {
        this.API.send({
          module: 'ca',
          url: '/employee/viewLzEmployeeByHumanId',
          method: 'POST',
          comment: '获取朗致员工信息'
        }, {
          id: this.CFG.userInfo.id,
        }, (res) => {
          const result = res?.data;
          resolve(result);
        }, () => {
          reject()
        }, this, true);
      });
    },
    /**
     * 获取用户照片
     *
     * 数据来源: /employeeApply/getEmployeeApplyPhotoUrl
     * 目前来源为 行政认证的个人影像资料
     *
     * @returns {Promise<string>}
     */
    getCardPhoto() {
      return new Promise((resolve) => {
        // 测试照片
        // resolve('https://resources.lonch.com.cn/bi-test/2025/03/15/ed31f84cce5c43dbb2875d6b2986290020250315165116.jpg');
        this.API.send({ module: 'ca', url: '/employeeApply/getEmployeeApplyPhotoUrl', method: 'POST', comment: '根据自然人id查询行政认证照片'}, {
          humanId: this.CFG.userInfo.id,
        },
          (res) => {
            const result = res?.data;
            if(result) {
              resolve(result);
            } else {
              resolve();
            }
          }, () => {
            resolve();
          }, this, true);
      });
    },
    /**
     * 获取用户企业微信二维码
     */
    getUserWxQrCode() {
      return new Promise((resolve, reject) => {
        const args = {
          corpId: 'ww98055e27dd1e67fd',
          cellphone: this.CFG.userInfo.cellphone
        };
        this.API.send({ module: 'tecapi', url: '/wecomUser/getWecomUserInfo', method: 'POST', comment: '查询用户企业微信信息'}, args,
          (res) => {
            const result = res?.data;
            if(result) {
              resolve(result);
            } else {
              reject("用户企业微信信息查询失败");
            }
          }, () => {
            reject();
          }, this, true);
      });
    },
    /**
     * 加载数据
     *
     * @param {*} info 用户信息
     * @returns {Promise<*>} 返回canvas图片
     *
     */
    async loadCardItem(info) {
      const imgs = await this.loadAllImg(info);
      return this.createImg(imgs, info);
    },
    /**
     * 载入canvas需要的图片
     * @param {*} info 用户信息
     * @returns {Promise<*>}
     *
     * 返回的图片顺序为:
     * 0: 背景
     * 1: 证件照
     * 2: 企业微信二维码
     * 3: LOGO
     * 4: 工种背景 (暂时不需要)
     * 5: 工种 (暂时不需要)
     *
     */
    loadAllImg(info) {
      return Promise.all([
        // 背景
        this.loadImage('https://resources.lonch.com.cn/bi-test/2025/03/15/5a52c5b9ec6f4cd182621cedc1bdb91820250315135024.png'),
        // 证件照
        this.loadImage((info.photo?.split('?')[0] || 'https://resources.lonch.com.cn/ybd/image/20241105-oxygen-card-default-head.png') + '?x-oss-process=image/resize,m_fill,w_400,h_560/quality,Q_80'),
        // 企业微信二维码
        info.wecomQrCode  ? this.loadImage(info.wecomQrCode + '?x-oss-process=image/resize,m_fill,w_200,h_200/quality,Q_80') : null,
        // this.loadImage('https://resources.lonch.com.cn/ybd/image/20230705-qrcode.png'),
        // LOGO
        this.loadImage('https://resources.lonch.com.cn/ybd/image/20241105-oxygen-card-logo.png?v=1'),
        // // 工种背景
        // this.loadImage('https://resources.lonch.com.cn/ybd/image/20241105-oxygen-card-type-background.png'),
        // // 工种
        // this.loadImage('https://resources.lonch.com.cn/bi-test/2025/05/11/fa339248ef7e4a19af6295b6e3c94b9f20250511234032.png'),
      ]);
    },
    /**
     * 生成名片图片
     *
     * @param {*} imgs 图片数组
     * @param {*} info 用户信息
     * @returns {Promise<*>} 返回canvas图片
     *
     */
    createImg(imgs, info) {
      return new Promise((resolve, reject) => {
        const username = info.name;
        const positionName = info.positionName;
        const orgName = info.orgName;
        const ownerName = info.ownerName;
        let canvas = document.createElement("canvas");
        canvas.width = 736;
        canvas.height = 1220;
        let context = canvas.getContext("2d");
        // 画背景
        context.drawImage(imgs[0], 0, 0, 736, 1220);
        // 画白底
        context.save();
        context.fillStyle = 'white';
        this.drawRoundedRect(context, 160, 236, 416, 576, 20);
        context.fill();
        context.restore();
        // 画证件照
        context.save();
        this.drawRoundedRect(context, 164, 240, 408, 568, 20);
        context.clip();
        context.drawImage(imgs[1], 164, 240, 408, 568);
        context.restore();
        // 画二维码
        if (imgs[2]) {
          context.drawImage(imgs[2], 540, 50, 150, 150);
        }
        // // 画类型背景
        // context.drawImage(imgs[4], 324, 761, 96, 96);
        // // 画类型背景
        // context.drawImage(imgs[5], 340, 777, 64, 64);
        // 写名字
        if (username) {
          context.fillStyle = "#476ea7";
          context.font = '64px 微软雅黑';
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          context.fillText(username, 368, 916);
        }
        // 写工种
        if (positionName) {
          context.fillStyle = "#6d86ab";
          context.font = '32px 微软雅黑';
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          context.fillText(positionName, 368, 976);
        }
        // 写所属组织
        if (orgName) {
          context.fillStyle = "#6d86ab";
          context.font = '38px 微软雅黑';
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          context.fillText(orgName, 368, 1066);
        }
        // 写所属公司
        if (ownerName) {
          context.fillStyle = "#6d86ab";
          context.font = '38px 微软雅黑';
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          context.fillText(ownerName, 368, 1136);
        }
        const url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
        resolve({ url, canvas, imgs, info })
      });
    },
    /**
     * 锁定画画范围
     * @param {*} ctx
     * @param {*} x
     * @param {*} y
     * @param {*} width
     * @param {*} height
     * @param {*} radius
     */
    drawRoundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    },
    /**
     * 载入图片，返回promise对象
     * @param {*} url
     */
    loadImage(url) {
      return new Promise((resolve, reject) => {
        let img = new Image();
        img.src = url;
        img.setAttribute('crossOrigin', 'anonymous');
        img.onload = function() {
          resolve(img);
        }
        img.onerror = function() {
          reject();
        }
      })
    },
    /**
     * 关闭弹窗
     */
    toRZH() {
      this.$emit('toRZH');
    },
    /**
     * 打开邮箱设置
     */
    openMaillSetting() {
      this.maillSetting.visible = true;
    },
  },
}
</script>

<style lang="scss">
.manage-card {
  &-frame {
    img {
      margin: 0 auto;
      display: block;
      width: 80%;
      max-width: 368px;
    }
  }
}
// 图片放大弹窗样式
// 弹窗背景透明
// 遮罩正常显示
.manage-card-img-preview-dialog {
  box-shadow: none;
  background-color: transparent;
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 0;
  }
}
</style>
