<template>
  <div class="flex-flex-auto">
    <template v-if="config.type == 'checkbox'">
      <el-checkbox-group v-model="model[config.id]" @change="inputChange($event, config, config.model)">
        <el-checkbox v-for="check in config.options" :true-label="config.trueLabel" :false-label="config.falseLabel" :label="check.c" :key="check.c" @change="check.change && check.change($event)" :disabled="config.disabled || check.disabled">{{check.n}}</el-checkbox>
      </el-checkbox-group>
    </template>

    <el-input-number
      v-model="model[config.id]"
      size="small"
      class="full-width"
      :class="isRedBorder() ? 'red-border' : ''"
      v-if="config.type == 'number'"
      :controls="!config.isNotControls"
      controls-position="right"
      :disabled="config.disabled || (config.isDisabled && config.isDisabled(model))"
      @change="inputChange($event, config, config.model)"
      :min="config.min || (config.rMin && config.rMin(model))"
      :max="config.max || (config.rMax && config.rMax(model))"
      :precision="config.precision"
      :step="config.step || 1"
      :placeholder="config.placeholder || config.label"
    ></el-input-number>

    <el-date-picker
      v-if="config.type == 'date'"
      size="small"
      class="full-width"
      :clear-icon="config.clearIcon || ''"
      v-model="model[config.id]"
      :editable="globalData.viewportWidth > 768 ? true : false"
      :class="isRedBorder() ? 'red-border' : ''"
      :type="config.dateType"
      :format="config.format"
      :value-format="config.valFormat"
      :start-placeholder="config.startpla"
      :end-placeholder="config.endpla"
      :default-time="config.defaultTime ? config.defaultTime : '00:00:00'"
      @change="inputChange($event, config, config.model)"
      :disabled="config.disabled || (config.isDisabled && config.isDisabled(model))"
      :picker-options="typeof config.pickerOptions === 'function' ? config.pickerOptions(model) : config.pickerOptions"
      :placeholder="config.placeholder || config.label"
    ></el-date-picker>

    <el-select
      v-if="config.type == 'select'"
      size="small"
      class="full-width"
      :filterable="config.filterable===false?false:true"
      remove-tag
      clearable
      :value-key="config.valueKey"
      @change="selectChange($event, config, model)"
      :multiple="config.multiple"
      :remote="config.remoteMethod"
      :remote-method="remoteMethod"
      :class="isRedBorder() ? 'red-border' : ''"
      v-model="model[config.id]"
      :disabled="config.disabled || (config.isDisabled && config.isDisabled(model))"
      :placeholder="config.placeholder  || config.label"
    >
      <!-- <el-option :label="'请选择...'" value></el-option> -->

      <template v-if="config.renderOption">
        <expan-render :data="getOptions(config, model)" :render="config.renderOption"></expan-render>
      </template>
      <template v-else>
        <el-option
          v-for="(opt, index) in getOptions(config, model)"
          :key="opt.c || index"
          :label="opt.n"
          :value="opt.c"
        ></el-option>
      </template>
    </el-select>

    <!-- 选择框 - 带按钮文本 -->
    <template v-if="config.type === 'select-word-btn'">
      <div class="flex flex-flex-auto">
        <!-- 选择框 -->
        <el-select
          size="small"
          class="full-width"
          :filterable="config.filterable===false?false:true"
          remove-tag
          clearable
          :value-key="config.valueKey"
          @change="selectChange($event, config, model)"
          :multiple="config.multiple"
          :remote="config.remoteMethod"
          :remote-method="remoteMethod"
          :class="isRedBorder() ? 'red-border' : ''"
          v-model="model[config.id]"
          :disabled="config.disabled || (config.isDisabled && config.isDisabled(model))"
          :placeholder="config.placeholder  || config.label"
        >
          <!-- <el-option :label="'请选择...'" value></el-option> -->

          <template v-if="config.renderOption">
            <expan-render :data="getOptions(config, model)" :render="config.renderOption"></expan-render>
          </template>
          <template v-else>
            <el-option
              v-for="(opt, index) in getOptions(config, model)"
              :key="opt.c || index"
              :label="opt.n"
              :value="opt.c"
            ></el-option>
          </template>
        </el-select>
        <!-- 按钮 -->
        <div v-for="el of config.btnList" :key="el" class="ml10">
          <el-button size="mini" :type="el.type || 'primary'" @click="el.btnClick(model, el, config)">{{el.btnText}}</el-button>
        </div>
      </div>
    </template>

    <el-autocomplete
      v-if="config.type == 'autocomplete'"
      class="full-width"
      v-model="model[config.id]"
      size="small"
      :class="isRedBorder() ? 'red-border' : ''"
      :value-key="config.valueKey"
      :trigger-on-focus="config.triggerOnFocus"
      :disabled="config.disabled || (config.isDisabled && config.isDisabled(model))"
      :fetch-suggestions="config.querySearch"
      :placeholder="config.placeholder || config.label"
      :maxlength="config.maxlength || '50'"
      @select="config.handleSelect"
    ></el-autocomplete>

    <el-input
      v-if="config.type == 'text'"
      class="full-width"
      size="small"
      v-model="model[config.id]"
      :show-password="config.showPassword"
      :disabled="config.disabled || (config.isDisabled && config.isDisabled(model))"
      :class="isRedBorder() ? 'red-border' : ''"
      @change="inputChange($event, config, config.model)"
      @blur="inputBlur($event, config, config.model)"
      :maxlength="config.maxlength || '50'"
      :placeholder="config.placeholder || config.label"
      :show-word-limit="config.isWordLimit"
    >
      <template slot="append" v-if="config.append">{{config.append}}</template>
    </el-input>

    <div
      v-if="config.type == 'textFraction'"
      class="full-width flex"
    >
      <el-input
        size="small"
        v-model="model[config.ids[0]]"
        :disabled="config.disabled || (config.isDisabled && config.isDisabled(model))"
        :class="isRedBorder() ? 'red-border' : ''"
        @change="inputChangeFraction($event, config, config.model)"
        @blur="inputBlurFraction($event, config, config.model)"
        :maxlength="config.maxlength || '50'"
        :placeholder="config.placeholder[0] || config.label"
      >
      </el-input>
      <div class="ml5 mr5">{{config.append}}</div>
      <el-input
        size="small"
        v-model="model[config.ids[1]]"
        :disabled="config.disabled || (config.isDisabled && config.isDisabled(model))"
        :class="isRedBorder() ? 'red-border' : ''"
        @change="inputChangeFraction($event, config, config.model)"
        @blur="inputBlurFraction($event, config, config.model)"
        :maxlength="config.maxlength || '50'"
        :placeholder="config.placeholder[1] || config.label"
      >
      </el-input>
    </div>

    <el-input
      v-if="config.type == 'textarea'"
      class="full-width"
      size="small"
      type="textarea"
      v-model="model[config.id]"
      :class="isRedBorder() ? 'red-border' : ''"
      :disabled="config.disabled || (config.isDisabled && config.isDisabled(model))"
      @change="inputChange($event, config, config.model)"
      :rows="config.rows || 5"
      :maxlength="config.maxlength || 200"
      :show-word-limit="!config.isNoWordLimit"
      :placeholder="config.placeholder || config.label"
    ></el-input>

    <!-- 添加textarea加按钮的方式 -->
    <div class="flex flex-flex-auto" v-if="config.type == 'textarea-word-btn'">
      <!-- textarea输入框 -->
      <el-input
        class="full-width"
        size="small"
        type="textarea"
        v-model="model[config.id]"
        :class="isRedBorder() ? 'red-border' : ''"
        :disabled="config.disabled || (config.isDisabled && config.isDisabled(model))"
        @change="inputChange($event, config, config.model)"
        :rows="config.rows || 5"
        :maxlength="config.maxlength || 200"
        :show-word-limit="!config.isNoWordLimit"
        :placeholder="config.placeholder || config.label"
      ></el-input>
      <!-- 按钮组 -->
      <div v-for="el of config.btnList" :key="el" class="ml10">
        <!-- 单个按钮 -->
        <el-button size="mini" :type="el.type || 'primary'" @click="el.btnClick(model, el, config)">{{el.btnText}}</el-button>
      </div>
    </div>

    <div v-if="config.type == 'richText'" class="full-width relative">
       <div :id="config.id" class="editor full-width"></div>
       <oss-upload
          :bucket="oss.bucket"
          :basePath="oss.basePath"
          :region="oss.region"
          :dir-name="oss.dirName"
          :maxSize="config.maxSize"
          :multiple="config.multiple"
          :accept="config.accept"
          label=""
          ref="fileCom"
          @uploaded="insertImgFn($event, config)"
        >
        </oss-upload>
    </div>

    <div
      v-if="config.type == 'treeselect'"
      :class="isRedBorder() ? 'red-border-treeselet' : ''"
      >
      <treeselect
        :multiple="config.multiple"
        :disabled="config.disabled || (config.isDisabled && config.isDisabled(model))"
        :options="config.options"
        :defaultExpandLevel="config.defaultExpandLevel || 0"
        :flat="config.flat"
        :disable-branch-nodes="config.disableBranchNodes"
        ref="treeselect"
        :value-consists-of="config.valueConsistsOf ? config.valueConsistsOf : 'BRANCH_PRIORITY'"
        search-nested
        default-expand-level="1"
        v-model="model[config.id]"
        @input="inputChange($event, config, config.model)"
        :placeholder="config.placeholder || config.label">
      </treeselect>
    </div>

    <area-select
      style="line-height: 14px"
      v-if="config.type == 'area-tree'"
      :multiple="true"
      :disabled="config.disabled"
      :value="{city: model[config.id].city, province: model[config.id].province, district: model[config.id].district}"
      :flatten-search-results="true"
      @change="(data) => {config.selectAreasSelect(data, model, model[config.id])}"
      ref="areaSelect"
      :placeholder="config.placeholder">
    </area-select>

    <template v-if="config.type == 'radio'">
      <el-radio-group
        v-model="model[config.id]"
        @change="config.change && config.change($event, config, model)"
        :class="isRedBorder() ? 'red-border' : ''"
        :disabled="config.disabled || (config.isDisabled && config.isDisabled(model))">
        <el-radio :label="radio.c" v-for="(radio, index) in config.options" :key="index" :border="config.border">{{radio.n}}</el-radio>
      </el-radio-group>
    </template>

    <template v-if="config.type == 'radio-button'">
      <el-radio-group
      v-model="model[config.id]"
      @change="config.change && config.change($event, config)"
      :class="isRedBorder() ? 'red-border' : ''"
      :size="config.size || 'small'"
      :disabled="config.disabled || (config.isDisabled && config.isDisabled(model))">
        <el-radio-button :label="radio.c" v-for="(radio, index) in config.options" :key="index" :border="config.border">{{radio.n}}</el-radio-button>
      </el-radio-group>
    </template>

    <div v-if="config.type == 'button'">
        <el-button size="small" type="primary" v-for="btn in config.btns" :key="btn" @click="btn.click(model, config)">{{btn.name}}</el-button>
    </div>


    <div v-if="config.type == 'file'">
      <div class="flex-flex-auto" v-if="fileIsEdit(config)">
        <oss-upload
          :bucket="oss.bucket"
          :basePath="oss.basePath"
          :region="oss.region"
          :dir-name="oss.dirName"
          :maxSize="config.maxSize"
          :multiple="config.multiple"
          :accept="config.accept"
          label="+选择文件"
          @uploaded="fileUploader($event, config)"
        >
          <span class="btn" :class="isRedBorder() ? 'red-border' : ''">+ 选择文件</span>
        </oss-upload>
      </div>
      <span
        class="mr20"
        v-for="(fileSrc, i) in config.isDel? model[config.id].filter(ele=> ele.isDel !== config.isDelKey):model[config.id]"
        :key="i"
        style="position: relative;display: inline-block; line-height: 20px; border: 1px solid #e0e0e0; padding: 5px; background: #fbfbfb;"
      >
        <!-- <a :href="fileSrc[config.fileSrcKey]" target="_blank">
          <img width="100" height="100"
            v-if="isImg(fileSrc[config.fileSrcKey])"
            :src="fileSrc[config.fileSrcKey]" alt srcset/>

          <video width="100" height="100"
            v-else-if="isMp4(fileSrc[config.fileSrcKey])"
            :src="fileSrc[config.fileSrcKey]"></video>

          <span v-else style="overflow-wrap: break-word;">{{getFileName(fileSrc[config.fileSrcKey])}}</span>
        </a> -->
        <div style="width:100px;height:100px;overflow:hidden">
          <limit-img v-if="isImg(fileSrc[config.fileSrcKey])">
            <viewer :images="[fileSrc[config.fileSrcKey]]" class="viewer" ref="viewer">
              <img :src="fileSrc[config.fileSrcKey]" :width="100" :height="100"/>
            </viewer>
          </limit-img>
          <video v-else-if="isMp4(fileSrc[config.fileSrcKey])" width="100" height="100" controls :src="fileSrc[config.fileSrcKey]"></video>
          <template v-else-if="config.fileType = 'downLoadFile'">
            <a href="javascript:void 0" @click="downloadFile(urlDeal(fileSrc[config.fileSrcKey]), config.fileNameKey ? fileSrc[config.fileNameKey] : getFileName(fileSrc[config.fileSrcKey]))">
              <span style="overflow-wrap: break-word;">{{ config.fileNameKey ? fileSrc[config.fileNameKey] : getFileName(fileSrc[config.fileSrcKey])}}</span>
            </a>
          </template>
          <template v-else>
            <span class="link" v-if="CFG.client.isApp" @click="openFile(3, urlDeal(fileSrc[config.fileSrcKey]))" style="overflow-wrap: break-word;">{{ config.fileNameKey ? fileSrc[config.fileNameKey] : getFileName(fileSrc[config.fileSrcKey])}}</span>
            <a v-else :href="urlDeal(fileSrc[config.fileSrcKey])" target="_blank">
              <span style="overflow-wrap: break-word;">{{ config.fileNameKey ? fileSrc[config.fileNameKey] : getFileName(fileSrc[config.fileSrcKey])}}</span>
            </a>
          </template>
        </div>
        <el-input
          v-if="config.fileBzKey"
          style="width: 100%; margin-top: 10px;"
          size="small"
          type="textarea"
          v-model="fileSrc[config.fileBzKey]"
          :rows="config.rows || 2"
          :maxlength="config.maxlength || 255"
          :disabled="!config.isEdit"
          placeholder="附件备注"
        >
        </el-input>
        <div v-if="config.orderKey" class="flex flex-items-start" style="width: 100%; margin-top: 10px;">
          <label class="label nowrap" style="padding-top: 5px;">
            显示顺序：
          </label>
          <el-input-number
            size="small"
            v-model="fileSrc[config.orderKey]"
            @change="config.orderChange && config.orderChange($event, config)"
            :controls="false"
            :min="0"
            :disabled="!config.isEdit"
            placeholder="展示顺序"
          >
          </el-input-number>
        </div>
        <span
          v-if="config.isEdit && !config.disabled"
          class="close"
          @click="config.isDel?config.isDel(model[config.id],fileSrc,i):delImg(config, model[config.id], i)"
        >
          <i class="el-icon-close"></i>
        </span>
      </span>
    </div>

    <div v-if="config.type == 'area'">
      <div class="lc-col-12 lc-col-xs4">
        <el-select
          class="full-width pr10"
          size="small"
          :placeholder="provincePlaceholder || '省'"
          filterable
          v-model="model[config.provinceKey]"
          :class="isAreaRedBorder('provinceKey') ? 'red-border' : ''"
          :disabled="config.disabled || (config.isDisabled && config.isDisabled(model))"
          @change="$forceUpdate(); config.provinceChange && config.provinceChange($event, config, model)"
        >
          <el-option label="请选择..." value></el-option>
          <el-option
            v-for="(opt, index) in config.provinceOpt"
            :key="index"
            :label="opt.n"
            :value="opt.c"
          ></el-option>
        </el-select>
      </div>
      <div class="lc-col-12 lc-col-xs4" v-if="((model[config.cityOptKey] && model[config.cityOptKey].length) || (config.cityOpt && config.cityOpt.length)) && model[config.provinceKey]">
        <el-select
          class="full-width pr10"
          size="small"
          :placeholder="cityPlaceholder || '市'"
          filterable
          v-model="model[config.cityKey]"
          :class="isAreaRedBorder('cityKey') ? 'red-border' : ''"
          :disabled="config.disabled || (config.isDisabled && config.isDisabled(model))"
          @change="$forceUpdate(); config.cityChange && config.cityChange($event, config, model)"
        >
          <el-option label="请选择..." value></el-option>
          <el-option
            v-for="(opt, index) in model[config.cityOptKey] || config.cityOpt"
            :key="index"
            :label="opt.n"
            :value="opt.c"
          ></el-option>
        </el-select>
      </div>
      <div
        class="lc-col-12 lc-col-xs4"
        v-if="((model[config.districtOptKey] && model[config.districtOptKey].length) || (config.districtOpt && config.districtOpt.length)) && model[config.cityKey]"
      >
        <el-select
          class="full-width"
          size="small"
          filterable
          :disabled="config.disabled || (config.isDisabled && config.isDisabled(model))"
          :class="isAreaRedBorder('districtKey') ? 'red-border' : ''"
          @change="$forceUpdate(); config.districtChange && config.districtChange($event, config, model)"
          v-model="model[config.districtKey]"
          :placeholder="districtPlaceholder || '县'"
        >
          <el-option label="请选择..." value></el-option>
          <el-option
            v-for="(opt, index) in model[config.districtOptKey] || config.districtOpt"
            :key="index"
            :label="opt.n"
            :value="opt.c"
          ></el-option>
        </el-select>
      </div>
    </div>

    <template v-if="config.type == 'text-btn'">
      <div class="flex flex-flex-auto">
        <el-input
          class="full-width"
          size="small"
          :ref="config.ref"
          :class="isRedBorder() ? 'red-border' : ''"
          v-model="model[config.id]"
          :disabled="config.disabled || (config.isDisabled && config.isDisabled(model))"
          :maxlength="config.maxlength || '50'"
          :placeholder="config.placeholder || config.label"
        ></el-input>
        <span
          v-if="config.showAdd"
          class="ml10"
          style="color: #3f9eff; font-size: 22px; cursor: pointer"
          @click="config.click(model, config)"
        >
          <i :class="config.icon || 'el-icon-circle-plus'"></i>
        </span>
      </div>
    </template>
        <template v-if="config.type == 'text-word-btn'">
      <div class="flex flex-flex-auto">
        <el-input
          class="full-width"
          size="small"
          :class="isRedBorder() ? 'red-border' : ''"
          v-model="model[config.id]"
          :disabled="config.disabled || (config.isDisabled && config.isDisabled(model))"
          maxlength="50"
          :placeholder="config.placeholder || config.label"
        ></el-input>
          <div v-if="config.showAdd" class="ml10">
            <el-button size="mini" type="primary"   @click="config.btnClick(model, config)">{{config.btnText}}</el-button>
          </div>
      </div>
    </template>

    <template v-if="config.type == 'number-btn'">
      <div class="flex flex-items-center">
        <el-input-number
          v-model="model[config.id]"
          size="small"
          class="full-width"
          :class="isRedBorder() ? 'red-border' : ''"
          v-if="config.type == 'number-btn'"
          :controls="!config.isNotControls"
          controls-position="right"
          :disabled="config.disabled || (config.isDisabled && config.isDisabled(model))"
          @change="inputChange($event, config, config.model)"
          :min="config.min || (config.rMin && config.rMin(model))"
          :max="config.max || (config.rMax && config.rMax(model))"
          :precision="config.precision"
          :step="config.step || 1"
          :placeholder="config.placeholder || config.label"
        ></el-input-number>
        <span
          v-if="config.showAdd"
          class="ml10"
          style="color: #3f9eff; font-size: 22px;"
          @click="config.click(model, config)"
        >
         <i :class="config.icon || 'el-icon-circle-plus'"></i>
        </span>
      </div>
    </template>
    <template v-if="config.type == 'signature'">
      <div class="flex flex-items-center mb10">
        <el-button size="mini" type="primary" icon="el-icon-edit" @click="isShowSignature = true">{{model[config.id] && model[config.id].length > 0 && !config['multiple'] ? '重新签字' : '签字'}}</el-button>
      </div>
      <div class="signature-page" v-if="isShowSignature">
        <div class="signature-box">
          <Signature :oss="oss" @change="signatureUploadFin($event, config)"></Signature>
        </div>
      </div>
      <!-- <div class="signature-img">
        <img :src="model[config.id]" class="full-width" v-if="model[config.id]"></img>
      </div> -->
      <span
        class="mr20"
        v-for="(fileSrc, i) in config.isDel? model[config.id].filter(ele=> ele.isDel !== config.isDelKey):model[config.id]"
        :key="i"
        style="position: relative;display: inline-block; line-height: 20px; border: 1px solid #e0e0e0; padding: 5px; background: #fbfbfb;"
      >
        <div style="width:100px;height:60px;overflow:hidden">
          <limit-img>
            <viewer :images="[fileSrc[config.fileSrcKey]]" class="viewer" ref="viewer">
              <img :src="fileSrc[config.fileSrcKey]" :width="100" :height="60"/>
            </viewer>
          </limit-img>
        </div>
        <span
          v-if="config.isEdit && !config.disabled"
          class="close"
          @click="config.isDel?config.isDel(model[config.id],fileSrc,i):delImg(config, model[config.id], i)"
        >
          <i class="el-icon-close"></i>
        </span>
      </span>
    </template>

  </div>
</template>

<script type="text/ecmascript-6">
import OssUpload from "../upload/index";
import treeselect from '@riophae/vue-treeselect';
import AreaSelect from '../common/areaSelect';
import LimitImg from '../limit-img-box/index';
import expanRender from './expanRender';
import E from "wangeditor";
import Signature from '../signature';
// import Signature from './signature';
let commonAreaData;
export default {
  name: "addAndEdit",
  components: { OssUpload, treeselect, expanRender, LimitImg, AreaSelect, Signature},
  props: ["config", "model", "oss"],
  data() {
    return {
      timer: null, //下拉选择远程搜索定时器
      timerTime: 200, //下拉选择时间截流延迟默认时间
      editor: null, //
      isKeepOriginalName: '0',
      // 是否展示手写签名？
      isShowSignature: false,
    };
  },
  created() {
    // eslint-disable-next-line no-undef
    commonAreaData = vue.getCommonDictionary('area');
    this.initComStatus();
  },
  mounted() {},
  methods: {
    // 打开文件
    openFile(type, url) {
      const _self = this;
      _self.API.send(_self.CFG.services.common.openChatFile, {
        type: type,
        fileUrl: url
      }, function () {
      }, function () { }, _self, true)
    },
    insertImgFn(){},
    initE(id) {
      this.$nextTick(()=>{
          this.editor = new E('#'+ id);
          this.editor.config.onchange = (newHtml)=> {
             this.model[id] = newHtml;
          };
          this.editor.config.menus = ["bold", "head", "fontName", "foreColor", "backColor", "table", "italic", "underline", "image", "justify"];
          this.editor.config.fontSizes = {
            'normal': { name: '14px', value: '3' },
          };
          this.editor.config.zIndex = 100;
          this.editor.config.focus = false;
          this.editor.config.placeholder = this.config.placeholder || '请输入正文';
          this.editor.config.height = this.config.height || 500;
          this.editor.config.customUploadImg = (resultFiles, insertImgFn)=> {
            this.$refs.fileCom.fileChange({
              target: { files: resultFiles }
            });
            this.insertImgFn = (c)=>{
              insertImgFn(this.oss.resourcesLocation + c.Key);
            };
          };
          this.editor.create();
          if(this.model[id]){
            this.editor.txt.html( this.model[id] );
          }
          if(this.config.disabled){
            this.editor.disable();
          }
      });
    },
    /**
     * @description: 初始化省市县 下拉选择组件状态
     * @param {*} 无
     * @return {*} 无
     */
    initComStatus(){
      if(this.config.type == "area"){
        this.initAreaData();
      }else if (this.config.type == "richText"){
        this.initE(this.config.id);
      }
    },
    initAreaData(){
      //数据源区分放在model上，还是放在config上面 支持配置
      //isOptsInModel 为true表示下拉选项是放在model上面的
      if(this.model[this.config.provinceKey]){
        this.setAreaOptions(this.model[this.config.provinceKey], 'cityOpt', false, this.config.isOptsInModel ? this.model : this.config);
        if(this.model[this.config.cityKey]){
          this.setAreaOptions(this.model[this.config.cityKey], 'districtOpt', false, this.config.isOptsInModel ? this.model : this.config);
        }
      }
    },
    fileIsEdit(config) {
      if (config.isEdit) {
        if (config.onlyOne) {
          if (!this.model[config.id] || this.model[config.id].length == 0) {
            return true;
          }
          return false;
        }
        if (typeof config.isEdit === 'function') {
          return config.isEdit();
        }
        return true;
      }
      return false;
    },
    isRedBorder() {
      return this.config.required && (this.model[this.config.id] === '' || this.model[this.config.id] === null || this.model[this.config.id] === undefined ) && !this.config.noRedborder;
    },
    isAreaRedBorder(key) {
      return this.config.required && !this.model[this.config[key]];
    },
    isImg(src) {
      if(src){
        const sub = src.substring(src.length, src.lastIndexOf('.') + 1);
        if (sub == 'png' || sub == 'jpg' || sub == 'jpeg' || sub == 'gif' || sub == 'svg' || sub == 'webp') {
          return true;
        }
        return false;
      }
    },
    isMp4(src) {
      /**
       * 验证不能为空
       */
      if(src) {
        const sub = src.substring(src.length, src.lastIndexOf('.') + 1);
        if (sub == 'mp4' || sub == 'MP4' || sub == 'mov' || sub == 'mpv' || sub == 'wmv' || sub == 'avi' || sub == '3gp' || sub == 'rmvb') {
          return true;
        }
      }
      return false;
    },
    urlDeal(url){
      if(url){
        return url.replace('+', '%2B').replace(/\s+/g, '%20');
      }
    },
    downloadFile(url, fileName) {
      let xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            let blob = xhr.response;
            let a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = fileName + '.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(a.href);
          } else {
            console.error('请求失败，状态码:', xhr.status);
          }
        }
      };
      xhr.send();
    },
    getFileName(src) {
      /**
       * 验证不能为空
       */
      if(src) {
        const sub = src.substring(src.lastIndexOf('.'), src.lastIndexOf('/') + 1);
        return sub;
      }

      return ''
    },
    remoteMethod(query) {
      if (this.config.remoteMethod && this.config.remote) {
        if(!this.config.remote){
          this.model[this.config.id] = null;
        }
        this.config.remoteMethod(query, this.model);
      }
    },
    getOptions(config, model) {
      if (config.optKey) {
        return model[config.optKey];
      } else {
        return config.options;
      }
    },
    /**
     * 上传图片
     */
    fileUploader(res, config) {
      if (!this.model[config.id]) {
        this.model[config.id] = [];
      }
      const OBJ = { ...config.obj };
      if (config.orderKey) {
        OBJ[config.orderKey] = this.model[config.id].length;
      }
      OBJ[config.fileSrcKey] = this.oss.resourcesLocation + res.Key;
      OBJ[config.fileNameKey] = res.name;
      this.model[config.id].push(OBJ);
      if(config.change){
        this.config.change(this.model[config.id],OBJ);
      }
    },
    /**
     * 删除已上传图片
     */
    delImg(config, imgs, i) {
      imgs.splice(i, 1);
      if(config.change){
        this.config.change(this.model[config.id]);
      }
    },

    /**
     * select下拉框发生变化触发方法
     * @param val 选中值
     * @param config 配置项
     */
    selectChange(val, config) {
      if (config.change) {
        config.change(val, config, this.model);
      }
    },
    /**
     * input输入框发生变化时触发方法
     */
    inputBlur(val, config) {
      if (config.blur) {
        config.blur(val, config, this.model);
      }
    },
    /**
     * inputFraction输入框发生变化时触发方法
     */
    inputBlurFraction(val, config) {
      if (config.blur) {
        config.blur(val, config, this.model);
      }
    },
    /**
     * input输入框发生变化时触发方法
     */
    inputChange(val, config) {
      if (config.reg) {
        if (!config.reg.test(this.model[config.id])) {
          this.model[config.id] = "";
          this.$toast({ text: "您填写的" + config.label + "不符合规范" });
        }
      }
      if (config.change) {
        config.change(val, config, this.model);
      }
    },
    /**
     * inputFraction输入框发生变化时触发方法
     */
    inputChangeFraction(val, config) {
      if (config.change) {
        config.change(val, config, this.model);
      }
    },
    /**
     * 设置地域下拉选项
     * @param val { string } 父级id
     * @param key { string } 需要设置的目标元素
     * @param flag { boolean } 是否清空下拉选 true 清空 false 设置新值
     */
    setAreaOptions (val, key, flag, config) {
      if(val == '-1'){
        config[key] = [];
        return;
      }
      if (flag) {
        config[key] = [];
      } else {
        let areaList = commonAreaData.filter(ad => ad.p === val);
        if(config.isAllOption && config.isAllOption.length > 0){
          config[key] = areaList.length > 0 ? config.isAllOption.concat(areaList) : [];
        }else{
          config[key] = areaList.length > 0 ? areaList : [];
        }
      }
    },
    /**
     * 签名上传完成
     */
    signatureUploadFin(val, config) {
      if (!this.model[config.id]) {
        this.model[config.id] = [];
      }
      if(config['multiple']) {
        this.model[config.id].push({
          [config.fileSrcKey]: val.url
        });
      } else {
        this.model[config.id] = [{
          [config.fileSrcKey]: val.url
        }];
      }
      this.isShowSignature = false;
    },
  }
};
</script>
<style lang="scss" type="text/scss" scoped>
.vue-treeselect {
  line-height: 25px;
  margin-top: 5px;
}
::v-deep p[size="3"] {
    font-size: 14px;
}
::v-deep .w-e-content-mantle .w-e-content-preview{
  background: #fbfdff;
  color: #C0C4CC;
}
.el-form-item {
  margin-bottom: 4px;
}
.w100 {
  width: 100% !important;
}
.red-border input {
  border: 1px solid red;
}
.red-border-treeselet .vue-treeselect__control {
  border: 1px solid red;
}
.red-border textarea {
  border: 1px solid red;
}
.el-input.is-disabled .el-input__inner {
  background-color: #fbfdff;
}
.el-textarea.is-disabled .el-textarea__inner {
  background-color: #fbfdff;
}
::v-deep .el-input-number.is-without-controls .el-input__inner{
  padding-left: 5px;
}
img{
  width: 100%;
}
.img-box {
  position: relative;
}
.img-box span {
  position: absolute;
  width: 25px;
  height: 25px;
  top: -6px;
  right: -6px;
  font-size: 20px;
  border-radius: 50%;
  background: #ececec;
  color: #666666;
  display: flex;
  justify-content: center;
  align-items: center;
}
.close {
  position: absolute;
  top: 0;
  right: -10px;
  font-size: 22px;
  background: #a7a7a7;
  border-radius: 50%;
  color: #fff;
}
.el-form {
  display: flex;
  flex-wrap: wrap;
}
.full-width {
  width: 100% !important;
}
.el-radio-group label.el-radio{
  margin-left: 5px;
}
.self-icon {
  color: #409EFF;
  font-size: 16px;
}
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
  max-width: 480px;
  padding: 10px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 10px;
  .signature-main {
    flex: 1 1 auto;
    overflow: hidden;
    border-radius: 10px;
  }
  ::v-deep canvas {
    background: #f0f0f0;
    display: block;
    border: none;
  }
}
.signature-img {
  max-width: 320px;
  width: 100%;
  background: #f9f9f9;
  border-radius: 10px;
  border: #eee 1px solid;
  margin-top: 10px;
}
</style>
