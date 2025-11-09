<!--
 * @Author: tuWei
 * @Date: 2023-03-22 14:25:26
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-06-10 22:23:53
-->
<template>
  <div class="bps-user-approve">
    <template v-if="type === 1">
      <div class="flex mt10 flex flex-wrap">
        <div class="flex mr10 mb5" v-for="(user, index) in node.rdUserNodes" :key="index">
          <div class="p10 bg-gray">
            <el-image v-if="user.portrait" :src="user.portrait" class="icon-img"></el-image>
            <i v-else class="el-icon-user-solid vam"></i>
            <span class="ml10">{{user.name}}</span>

            <i class="el-icon-close ml10 pointer" v-if="node.userType == 2 || node.userType == 4 || (node.userType == 0 && node.userIds.length <= index)" @click="deletePerson(node.rdUserNodes,index)"></i>
          </div>
          <div class="next pt15 pl10" v-if="index < node.rdUserNodes.length - 1 && node.approvalWayType === 1">
            <i class="el-icon-right vam"></i>
          </div>
        </div>
      </div>
    </template>
    <!-- 操作模版 -->
    <template v-if="type === 2">
      <div>
        <div class="pt10">
          {{getOprTypesName(node.oprType)}} <span v-if="node.state" class="bule">({{node.state}})</span>
        </div>
        <div v-if="node.rdUserNodes" :class="node.rdUserNodes.length > 1 ? 'flex flex-items-center mr10 flex-wrap': 'mr10'">
          <div class="mt10 flex-wrap flex flex-content-between flex-items-center mr10 flex-wrap mb5" v-for="(user, index) in node.rdUserNodes" :key="index">
            <div class="p10 bg-gray">
              <el-image v-if="user.portrait" :src="user.portrait" class="icon-img"></el-image>
              <i v-else class="el-icon-user-solid vam"></i>
              <span class="ml10">{{user.name}}</span>
            </div>
            <div class="gray" v-if="node.createTime && node.rdUserNodes.length === 1">
              {{node.createTime}}
            </div>
          </div>
          <div class="mr10 margin-left gray" v-if="node.createTime && node.rdUserNodes.length > 1">
            {{node.createTime}}
          </div>
        </div>
        <div class="bg-gray-fd">
          <div class="p5 mt10 flex" v-if="node.remark">
            <span class="label-span">备注：</span>
            <div class="gray">{{node.remark}}</div>
          </div>
          <div class="p5 flex" v-if="node.pictures && node.pictures.length > 0">
            <span class="label-span">图片：</span>
            <div>
              <template v-for="(img,index) in node.pictures">
                <span class="link mr10" @click="previewImgObject(index, node.pictures)" :key="img.src">{{img.name}} </span>
              </template>
            </div>
          </div>
          <div class="p5 flex" v-if="node.attachment && node.attachment.length > 0">
            <span class="label-span">附件：</span>
            <div>
              <template v-for="(img) in node.attachment">
                <!-- <a class="link" @click="openUrl(img.url)" :key="img.src">{{img.name}} </a> -->
                <a :href="img.url" class="link mr10 block" target="_blank" :key="img.src"> {{img.name}} </a>
              </template>
            </div>
          </div>
        </div>
        <div v-if="node.exAttribute && node.exAttribute.rdUserNodes">
          <div class="mt10 flex flex-items-center" v-for="(user, index) in node.rdUserNodes" :key="index">
            <el-image v-if="node.exAttribute.isAddSignBefore === 1" :src="iconBefoer" class="icon-img"/>
            <el-image v-else-if="node.exAttribute.isAddSignBefore === 0" :src="iconLater" class="icon-img" />
            <el-image v-else :src="iconZj" class="icon-img"/>
            <template v-for="user in node.exAttribute.rdUserNodes">
              <div class="p10 bg-gray mr10" :key="user">
                <el-image v-if="user.portrait" :src="user.portrait" class="icon-img"></el-image>
                <i v-else class="el-icon-user-solid vam"></i>
                <span class="ml10">{{user.name}}</span>
              </div>

            </template>
          </div>
        </div>
      </div>
    </template>
    <!-- 工单记录模版模版 -->
    <template v-if="type === 3">
      <div>
        <div class="pt10">
          {{getOprTypesWorkName(node.oprType)}} <span v-if="node.state" class="bule">({{node.state}})</span>
          <span v-if="node.oprType === 109 && node.exAttribute" class="bule">
             ({{ node.exAttribute.nextNodeName}})
          </span>
          <span v-else-if="node.oprType === 104 && node.exAttribute" class="bule">
            ({{ node.exAttribute.backNodeName}})
          </span>
        </div>
        <div v-if="node.rdUserNodes" :class="node.rdUserNodes.length > 1 ? 'flex flex-items-center mr10': 'mr10'">
          <div class="mt10 flex-wrap flex flex-content-between flex-items-center mr10 mb5" v-for="(user, index) in node.rdUserNodes" :key="index">
            <div class="p10 bg-gray">
              <el-image v-if="user.portrait" :src="user.portrait" class="icon-img"></el-image>
              <i v-else class="el-icon-user-solid vam"></i>
              <span class="ml10">{{user.name}}</span>
            </div>
            <div class="gray" v-if="node.createTime && node.rdUserNodes.length === 1">
              {{node.createTime}}
            </div>
          </div>
          <div class="mr10 margin-left gray" v-if="node.createTime && node.rdUserNodes.length > 1">
            {{node.createTime}}
          </div>
        </div>
        <div class="bg-gray-fd">
          <div class="p5 mt10 flex" v-if="node.remark">
            <span style="width: 50px; flex-shrink: 0;">备注：</span>
            <div class="gray">{{node.remark}}</div>
          </div>
          <div class="p5 flex" v-if="node.pictures && node.pictures.length > 0">
            <span style="width: 50px; flex-shrink: 0;">图片：</span>
            <div>
              <template v-for="(img,index) in node.pictures">
                <span class="link mr10" @click="previewImgObject(index, node.pictures)" :key="img.src">{{img.name}} </span>
              </template>
            </div>
          </div>
          <div class="p5 flex" v-if="node.attachment && node.attachment.length > 0">
            <span style="width: 50px; flex-shrink: 0;">附件：</span>
            <div>
              <template v-for="(img) in node.attachment">
                <!-- <a class="link" @click="openUrl(img.url)" :key="img.src">{{img.name}} </a> -->
                <a :href="img.url" class="link mr10 block" target="_blank" :key="img.src"> {{img.name}} </a>
              </template>
            </div>
          </div>
        </div>
        <div v-if="node.exAttribute && node.exAttribute.rdUserNodes">
          <div class="mt10 flex flex-items-center" v-for="(user, index) in node.rdUserNodes" :key="index">
            <el-image v-if="node.exAttribute.isAddSignBefore === 1" :src="iconBefoer" class="icon-img"/>
            <el-image v-else-if="node.exAttribute.isAddSignBefore === 0" :src="iconLater" class="icon-img" />
            <el-image v-else :src="iconZj" class="icon-img"/>
            <template v-for="user in node.exAttribute.rdUserNodes">
              <div class="p10 bg-gray mr10" :key="user">
                <el-image v-if="user.portrait" :src="user.portrait" class="icon-img"></el-image>
                <i v-else class="el-icon-user-solid vam"></i>
                <span class="ml10">{{user.name}}</span>
              </div>

            </template>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { getOprTypesName, getOprTypesWorkName } from "./dit.js"
import { openUrl } from "./utils.js"
import LimitImg from '../../limit-img-box/index';
import { api as viewerApi } from "v-viewer"

export default {
  name: 'item-user',
  components: { LimitImg },
  props: {
    node: {
      type: Array,
      default: ()=> { return []}
    },
    type: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      getOprTypesName,
      getOprTypesWorkName,
      iconBefoer: require("@/common-base/accsets/images/icon-befoer.png"),
      iconLater: require("@/common-base/accsets/images/icon-later.png"),
      iconZj: require("@/common-base/accsets/images/icon-zj.png")
    }
  },
  methods: {
    openUrl: openUrl,
    deletePerson(rdUserNodes, index){
      rdUserNodes.splice(index, 1);
    },
    previewImgObject (index, arr) {
        // eslint-disable-next-line no-unused-vars
        viewerApi({
          options: {
            toolbar: true,
            url: 'url',
            initialViewIndex: index
          },
          images: arr
        })
      }
  },
  created() {
  }
}
</script>
<style  lang="scss" scoped>

.bps-user-approve{

  .el-icon-user-solid{
    font-size: 30px;
    vertical-align: middle;
  }

  .icon-img{
    width: 30px;
    height: 30px;
    border-radius: 50%;
    vertical-align: middle;
    color: #f2f3f3
  }

  .gray{
    color: gray;
  }

  img{
    display: inline-block;
  }

  .bg-gray{
    background-color: #f2f3f3
  }

  .bg-gray-fd{
    background-color: #fdfdfd;
    .label-span{
      width: 50px;
      flex-shrink: 0;
    }
  }

  .margin-left{
    margin-left: auto;
  }
}

</style>
