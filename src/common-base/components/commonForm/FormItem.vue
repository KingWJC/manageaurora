<!--
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2024-11-18 00:54:01
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-04-02 01:06:43
 * @FilePath: \lonch-rxv-fe\src\components\admin\medicalReport\components\FormItem.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div :class="getItemClass(item)" :style="getItemStyle(item)" v-show="getItemShow(item, 'show')">
    <div :class="`flex-content-start flex-items-center ${item.type === 'table' && (item.title || item.add) ? 'block' : 'flex'} ${getFieldWrapperClass(item)}`">
      <label :class="`${getFieldWrapperClass(item).includes('flex-column') ? '' : 'nowrap'} ${getLabelClass(item)}`" v-if="item.label"
        ><span class="red" v-if="item.required">*</span>{{ getItemLabel(item, ':') }}</label
      >
      <div
        :class="`flex-flex-auto flex flex-row flex-wrap flex-gap5 ${getFieldClass(item)}`"
        v-if="item.type === 'row' && item.children && getItemShow(item, 'if')"
      >
        <FormItem
          v-for="child in getChildrenItems(item)"
          :key="child.id"
          :item="child"
          :ref="child.id"
          :auditType="auditType"
          :formData.sync="formData"
          :config="config"
          :disabled="disabled || getItemDisabled(child)"
          :options="options"
          :oss="oss"
          layout="row"
        />
      </div>
      <div :class="`card ${item.type === 'card' ? `card-shadow` : `card-mobile`} full-width ${getFieldClass(item)}`" v-else-if="[`card`, `cardMobile`].includes(item.type) && item.children && getItemShow(item, 'if')">
        <div :class="`card-body`">
          <div :class="`${item.type === 'card' ? 'card-header' : 'card-mobile-title fs-l'}`" v-if="item.title || getTitleDescription(item)">
            <strong><span class="red" v-if="item.required">*</span>{{ item.title }}</strong>
            <div :class="`${item.type === 'card' ? 'card-description' : 'card-mobile-description lh16 fs-12 mt5'}`" v-if="getTitleDescription(item)">
            {{ getTitleDescription(item) }}
            </div>
          </div>
          <div :class="`${item.type === 'card' ? 'card-content-padded' : ''}`">
            <FormItem
              v-for="child in getChildrenItems(item)"
              :key="child.id"
              :ref="child.id"
              :item="child"
              :auditType="auditType"
              :formData.sync="formData"
              :config="config"
              :disabled="disabled || getItemDisabled(child)"
              :options="options"
              :oss="oss"
            />
          </div>
        </div>
      </div>
      <div :class="`full-width ${getFieldClass(item)}`" v-else-if="item.type === 'tabs' && item.tabs && item.tabs.length > 0 && getItemShow(item, 'if')">
        <el-tabs
          v-model="formData[item.id]"
          :type="item.tabsType"
          :position="item.position || 'top'"
          class="full-width"
        >
          <el-tab-pane
            v-for="tab in item.tabs"
            :key="tab.id || tab.label"
            :name="tab.id || tab.label"
          >
            <span class="nowrap" slot="label"><i v-if="tab.icon" :class="`mr5 ${tab.icon}`"></i> {{tab.label}}</span>
            <div class="lc-row full-width">
              <FormItem
                v-for="child in tab.children"
                :key="child.id"
                :ref="child.id"
                :item="child"
                :auditType="auditType"
                :formData.sync="formData"
                :config="config"
                :disabled="disabled || getItemDisabled(child)"
                :options="options"
                :oss="oss"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <el-form-item
        :class="`flex-flex-auto ${getFieldClass(item)}`"
        :prop="item.id"
        v-else-if="getItemShow(item, 'if')"
        :showMessage="!['table'].includes(item.type)"
      >
        <el-input
          v-if="item.type === 'text' || item.type === 'textarea'"
          v-model="formData[item.id]"
          :type="item.type"
          class="full-width"
          :size="item.size || `small`"
          :placeholder="getItemPlaceholder(item) || `请输入${getItemLabel(item)}`"
          :disabled="disabled || getItemDisabled(item)"
          :clearable="!item.required"
          :maxlength="item.maxlength"
          :showWordLimit="
            typeof item.showWordLimit === 'boolean'
              ? item.showWordLimit
              : !getItemDisabled(item)
          "
        />
        <div
          :class="`flex flex-row flex-items-center flex-wrap ${getFieldClass(item)}`"
          v-else-if="item.type === 'number'"
        >
          <span>
            <el-input-number
              v-model="formData[item.id]"
              :size="item.size || `small`"
              :placeholder="getItemPlaceholder(item) || getItemLabel(item)"
              :disabled="disabled || getItemDisabled(item)"
              :min="item.min"
              :max="item.max"
              :step="item.step"
              :stepStrictly="item.stepStrictly"
              :precision="item.precision"
              :controls="item.controls"
              :controlsPosition="item.controlsPosition"
            ></el-input-number>
          </span>
          <span v-if="item.unit" class="ml5">{{ item.unit }}</span>
        </div>
        <div :class="`flex flex-row flex-wrap ${getFieldClass(item)}`" v-else-if="item.type === 'select'">
          <el-select
            v-model="formData[item.id]"
            class="full-width"
            :size="item.size || `small`"
            :placeholder="getItemPlaceholder(item) || `请选择${getItemLabel(item)}`"
            :disabled="disabled || getItemDisabled(item)"
            filterable
            :remote="!!item.remoteMethod"
            :remoteMethod="
              item.remoteMethod
                ? (query) => remoteMethod(query, item)
                : undefined
            "
            :clearable="!item.required"
            @change="(value) => onFormItemSelectChange(value, item)"
          >
            <el-option
              v-for="option in getOptions(item)"
              :key="option[item.field.valueKey]"
              :value="option[item.field.valueKey]"
              :label="getLabel(option, item)"
            />
          </el-select>
        </div>
        <div :class="`flex flex-row flex-wrap ${getFieldClass(item)}`" v-else-if="item.type === 'treeSelect'">
          <TreeSelect
            :value="formData[item.id] || null"
            @input="(value) => onTreeSelectChange(value, item)"
            :normalizer="(node, instanceId) => treeSelectNormalizer(node, instanceId, item)"
            class="full-width"
            :options="getOptions(item)"
            :popover-placement="'top'"
            :size="item.size || `small`"
            :placeholder="getItemPlaceholder(item) || `请选择${getItemLabel(item)}`"
            :disabled="disabled || getItemDisabled(item)"
            :clearable="!item.required"
            :multiple="item.multiple"
            :defaultExpandLevel="item.defaultExpandLevel || 0"
            :flat="item.flat"
            :disable-branch-nodes="item.disableBranchNodes"
            :value-consists-of="item.valueConsistsOf ? item.valueConsistsOf : 'BRANCH_PRIORITY'"
            search-nested
            :loadOptions="typeof item.loadOptions === 'function' ? (value) => treeSelectLoadOptions(value, item) : undefined"
          >
          </TreeSelect>
        </div>
        <el-radio-group
          v-else-if="item.type === 'radio'"
          v-model="formData[item.id]"
          :class="`full-width ${getFieldClass(item)}`"
          :size="item.size || `small`"
          :disabled="disabled || getItemDisabled(item)"
          @input="value => onFormItemRadioGroupChange(value, item)"
        >
          <el-radio
            v-for="option in getOptions(item)"
            :key="option[item.field.valueKey]"
            :label="option[item.field.valueKey]"
            :class="isImageUrl(getLabel(option, item)) ? 'radio-group-item-image' : ''"
            :disabled="option.disabled"
            >
            <template v-if="isImageUrl(getLabel(option, item))">
              <img :src="getLabel(option, item)" alt=""/>
            </template>
            <template v-else>
              {{ getLabel(option, item) }}
            </template>
          </el-radio>
        </el-radio-group>
        <el-radio-group
          v-else-if="item.type === 'radioButton'"
          v-model="formData[item.id]"
          :class="`full-width radio-button-group ${getFieldClass(item)}`"
          :size="item.size || `small`"
          :disabled="disabled || getItemDisabled(item)"
          @input="value => onFormItemRadioGroupChange(value, item)"
        >
          <el-radio-button
            v-for="option in getOptions(item)"
            :key="option[item.field.valueKey]"
            :label="option[item.field.valueKey]"
            :class="isImageUrl(getLabel(option, item)) ? 'radio-group-item-image' : ''"
            :disabled="option.disabled"
            >
            <template v-if="isImageUrl(getLabel(option, item))">
              <img :src="getLabel(option, item)" alt=""/>
            </template>
            <template v-else>
              {{ getLabel(option, item) }}
            </template>
          </el-radio-button>
        </el-radio-group>
        <el-checkbox-group
          v-else-if="item.type === 'checkbox'"
          v-model="formData[item.id]"
          :class="`full-width ${getFieldClass(item)}`"
          :size="item.size || `small`"
          :disabled="disabled || getItemDisabled(item)"
          @change="value => onFormItemCheckboxGroupChange(value, item)"
          >
          <el-checkbox
            v-for="option in getOptions(item)"
            :key="option[item.field.valueKey]"
            :label="option[item.field.valueKey]"
            :disabled="option.disabled"
            >{{ getLabel(option, item) }}</el-checkbox
          >
        </el-checkbox-group>
        <el-checkbox-group
          v-else-if="item.type === 'checkboxButton'"
          v-model="formData[item.id]"
          :class="`full-width checkbox-button-group ${getFieldClass(item)}`"
          :size="item.size || `small`"
          :disabled="disabled || getItemDisabled(item)"
          @change="value => onFormItemCheckboxGroupChange(value, item)"
        >
          <el-checkbox-button
            v-for="option in getOptions(item)"
            :key="option[item.field.valueKey]"
            :label="option[item.field.valueKey]"
            :class="isImageUrl(getLabel(option, item)) ? 'checkbox-group-item-image' : ''"
            :disabled="option.disabled"
            >
            <template v-if="isImageUrl(getLabel(option, item))">
              <img :src="getLabel(option, item)" alt=""/>
            </template>
            <template v-else>
              {{ getLabel(option, item) }}
            </template>
          </el-checkbox-button>
        </el-checkbox-group>
        <el-date-picker
          v-else-if="item.type === 'date'"
          v-model="formData[item.id]"
          :class="`full-width ${getFieldClass(item)}`"
          :size="item.size || `small`"
          :type="getDateType(item)"
          :format="getDateFormat(item)"
          valueFormat="timestamp"
          :placeholder="getItemPlaceholder(item) || `请选择${getItemLabel(item)}`"
          :disabled="disabled || getItemDisabled(item)"
          :clearable="!item.required"
          :pickerOptions="datePickerOptions(item)"
           @change="value => onFormItemDatePickerChange(value, item)"
        >
        </el-date-picker>
        <template
          v-else-if="
            ['selectTableDialog', 'selectTablePage'].includes(item.type)
          "
        >
          <template v-if="item.selectTable && item.selectTable.multiple">
            <div
              :class="`flex flex-row flex-items-center flex-gap5 flex-wrap ${getFieldClass(item)}`"
            >
              <el-tag
                v-for="(element, elementIndex) in (formData[item.id] || [])"
                v-show="typeof item.field.labelRenderer === 'function'
                    ? item.field.labelRenderer(element)
                    : element[item.field.labelKey]"
                :key="element[item.field.valueKey] || element[item.field.labelKey] || elementIndex"
                :closable="!(disabled || getItemDisabled(item)) && !getItemDisabled(element)"
                @close="onSelectTableClose(element, elementIndex, item)"
                >
                {{ typeof item.field.labelRenderer === 'function'
                  ? item.field.labelRenderer(element)
                  : element[item.field.labelKey] }}
              </el-tag>
              <el-button
                :disabled="disabled || getItemDisabled(item)"
                @click="onSelectTableShow(item.selectTable, item.type)"
                :size="item.buttonSize || `mini`"
                type="primary"
                >选择</el-button>
            </div>
          </template>
          <template v-else>
            <div :class="`flex flex-row ${getFieldClass(item)}`">
              <el-input
                :value="getLabel(formData, item)"
                :placeholder="getItemPlaceholder(item) || `请选择${getItemLabel(item)}`"
                :size="item.size || `small`"
                disabled
              >
                <el-button size="mini" v-if="!(disabled || getItemDisabled(item)) && typeof item.onReset === 'function'" slot="append" @click="onResetSelectTableInput(item)">重置</el-button>
              </el-input>
              <span
                v-if="!(disabled || getItemDisabled(item))"
                :class="`ml5 plus-icon-wrapper plus-icon-wrapper-${
                  (item.icon && item.icon.color) || 'blue'
                }`"
                @click="onSelectTableShow(item.selectTable, item.type)"
              >
                <i
                  :class="(item.icon && item.icon.name) || `el-icon-circle-plus`"
                ></i>
              </span>
            </div>
          </template>
        </template>
        <div
          :class="`flex flex-row flex-items-center flex-gap5 flex-wrap ${getFieldClass(item)}`"
          v-else-if="item.type === 'tagList'"
        >
          <el-tag
            :size="item.size || `small`"
            type="success"
            v-for="(tag, index) in (formData[item.id] || []).filter(Boolean)"
            :key="index"
            :closable="!(disabled || getItemDisabled(item, 'delete', tag, index))"
            @close="onTagListClose(tag, index, item)"
          >
            {{ item.field && item.field.modelLabelKey ? tag[item.field.modelLabelKey] : getLabel(tag, item) }}
          </el-tag>
          <template v-if="item.editConfig">
            <el-button
              v-if="!(disabled || getItemDisabled(item, 'add'))"
              @click="editModel(item)"
              :size="item.buttonSize || `mini`"
              >添加</el-button
            >
          </template>
          <template v-else>
            <el-button
              v-if="!(disabled || getItemDisabled(item))"
              @click="onTagListDialogShow(item)"
              :size="item.buttonSize || `mini`"
              >添加/删除标签</el-button
            >
          </template>
        </div>
        <div :class="`flex flex-column ${getFieldClass(item)}`" v-else-if="item.type === 'uploadImage'">
          <OssUpload
            v-if="!(disabled || getItemDisabled(item))"
            :bucket="oss.bucket"
            :basePath="oss.basePath"
            :region="oss.region"
            :dir-name="oss.dirName"
            :maxSize="oss.maxSize"
            :multiple="!!item.multipleKey"
            :accept="item.accept"
            @uploaded="(data) => onUploadedImage(data, item)"
          >
            <a class="link pointer" v-if="item.linkText">{{ item.linkText }}</a>
            <el-button
              class="pointer"
              v-else
              :type="item.buttonType"
              :size="item.buttonSize || `mini`"
              >{{ item.buttonText || `+ 选择文件` }}</el-button
            >
          </OssUpload>
          <template v-if="(disabled || getItemDisabled(item)) && (!formData[item.id] || !formData[item.id].length)">
            <a :class="`link cursor-not-allowed color-disabled ${getFieldClass(item)}`" v-if="item.linkText">{{ item.linkText }}</a>
            <div v-else>
              <el-button
              class="cursor-not-allowed"
              disabled
              :type="item.buttonType"
              :size="item.buttonSize || `mini`"
              >{{ item.buttonText || `+ 选择文件` }}</el-button
            >
            </div>
          </template>
          <viewer
            v-if="formData[item.id]"
            :images="getUploadedImages(item)"
            :class="`lc-row lc-space15 full-width ${getFieldClass(item)}`"
          >
            <div
              v-for="imageUrl in getUploadedImages(item)"
              class="lc-col-6 lc-col-xs4 lc-col-sm3 lc-col-md2 p5"
              :key="imageUrl"
            >
              <img :src="imageUrl" alt="" />
              <span
                v-if="!(disabled || getItemDisabled(item))"
                class="close"
                @click="onUploadedImageDelete(imageUrl, item)"
              >
                <i class="el-icon-close"></i>
              </span>
            </div>
          </viewer>
        </div>
        <div v-else-if="item.type === 'table'">
          <div :class="`card card-shadow full-width ${getFieldClass(item)}`" v-if="item.title || item.add">
            <div class="card-body">
              <div class="card-header flex flex flex-row flex-items-center flex-gap5">
                <span class="flex-flex-auto">
                  <strong v-if="item.title">{{ item.title }}</strong>
                </span>
                <el-button :size="item.add && item.add.buttonSize || 'small'" type="primary" @click="editTableModel(item)" v-if="!(disabled || getItemDisabled(item, 'add'))">{{ item.add && item.add.buttonText || '新增' }}</el-button>
              </div>
              <div class="card-content-padded">
                <tableView
                  :list="getTableList(item)"
                  :cols="getTableCols(item)"
                >
                </tableView>
              </div>
            </div>
          </div>
          <div :class="`full-width ${getFieldClass(item)}`" v-else>
            <tableView
              :list="getTableList(item)"
              :cols="getTableCols(item)"
            >
            </tableView>
          </div>
        </div>
        <div :class="`flex flex-row flex-wrap flex-items-center ${getFieldClass(item)}`" v-else-if="item.type === 'signature'">
          <viewer
            v-if="formData[item.id]"
            :images="[formData[item.id]]"
            class="lc-row lc-space16"
          >
            <img :src="formData[item.id]" alt="" />
          </viewer>
          <div>
            <el-button v-if="!(disabled || getItemDisabled(item))" size="mini" type="primary" @click="signatureDialog.visible = true">{{ formData[item.id] ? '重新签字' : '签字' }}</el-button>
          </div>
        </div>
        <div :class="`flex flex-row flex-wrap flex-items-center ${getFieldClass(item)}`" v-else-if="item.type === 'drawImage'">
          <el-button
            type="primary"
            size="mini"
            v-if="!(disabled || getItemDisabled(item))"
            class="mr10"
            :disabled="disabled || getItemDisabled(item)"
            @click="onDrawImage(item)"
          >
            点击画图
          </el-button>
          <viewer
            v-if="formData[item.id]"
            :images="[formData[item.id]]"
            class="lc-row lc-space16"
          >
            <img :src="formData[item.id]" alt="" />
          </viewer>
        </div>
        <div :class="`flex flex-column flex-wrap ${getFieldClass(item)}`" v-else-if="item.type === 'seal'">
          <viewer
            v-if="formData[item.id]"
            :images="[formData[item.id]]"
            class="lc-row lc-space16"
          >
            <img :src="formData[item.id]" alt="" />
          </viewer>
          <div v-if="!(disabled || getItemDisabled(item))" :class="`flex flex-row flew-wrap ${getFieldClass(item)}`">
            <span>
              <el-button size="mini" type="primary" @click="onMakeOnlineSealShow(item)">在线制作</el-button>
            </span>
            <span class="ml5">
              <el-button v-if="checkSealHasSignature(item)" size="mini" @click="signatureDialog.visible = true">{{ '手写签字' }}</el-button>
            </span>
            <OssUpload
              :bucket="oss.bucket"
              :basePath="oss.basePath"
              :region="oss.region"
              :dir-name="oss.dirName"
              :maxSize="oss.maxSize"
              :accept="item.accept"
              @uploaded="(data) => onUploadedSealImage(data, item)"
            >
              <el-button
                class="pointer ml5"
                :size="`mini`"
                >上传印章图片</el-button
              >
            </OssUpload>
          </div>
        </div>
        <div v-else-if="item.type === 'show'" :class="`${getFieldClass(item)}`">
          <span>{{ getItemDefaultData(item) }}</span>
        </div>
        <div v-else-if="item.type === 'newLine'" :class="`${getFieldClass(item)}`">
          <!-- 表单条目另起一行 -->
        </div>
        <p :class="`tal lh16 fs-12 mt5`" v-if="getFieldDescription(item)">{{getFieldDescription(item)}}</p>
        <p :class="`orange tal lh16 fs-12 mt5`" v-if="formData[`${item.id}_warningTip`]">{{formData[`${item.id}_warningTip`]}}</p>
      </el-form-item>
    </div>
    <FormEditDialog
      v-if="tableFormDialog.visible"
      :visible.sync="tableFormDialog.visible"
      :width="tableFormDialog.width"
      :title="tableFormDialog.title"
      :model="tableFormDialog.model"
      :auditType="auditType"
      :config="tableFormDialog.config"
      :options="options"
      :cols="tableFormDialog.cols"
      :oss="oss"
      @confirm="tableFormDialog.onConfirm"
    />
    <SignatureDialog
      v-if="signatureDialog.visible"
      :visible.sync="signatureDialog.visible"
      :oss="oss"
      @change="(result) => signatureDialog.onChange(result, item)"
    />
    <el-dialog
      :visible.sync="drawImageDialog.visible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="600px"
    >
      <ImageDraw
        :oss="drawImageDialog.oss"
        :imageSrc="drawImageDialog.imageSrc"
        :imagePos="drawImageDialog.imagePos"
        v-if="drawImageDialog.visible"
        @uploadFin="drawImageDialog.onUploadFin"
      ></ImageDraw>
    </el-dialog>
  </div>
</template>
<script>
import OssUpload from '@/common-base/components/upload';
import TreeSelect from '@riophae/vue-treeselect';
import FormEditDialog from '@/common-base/components/commonForm/FormEditDialog';
import TableView from '@/common-base/components/pubComponents/tableView';
import SignatureDialog from '@/common-base/components/commonForm/components/dialog/SignatureDialog';
import ImageDraw from '@/common-base/components/commonForm/components/draw/ImageDraw';
import { isImageUrl } from '@/common-base/components/commonForm/utils/stringUtils';

export default {
  name: 'FormItem',
  props: [
    'formData',
    'disabled',
    'auditType',
    'cols',
    'config',
    'options',
    'oss',
    'item',
    'type',
    'layout'
  ],
  components: { OssUpload, TreeSelect, FormEditDialog, SignatureDialog, TableView, ImageDraw },
  data() {
    const remoteOptions = {};
    const cols = typeof this.config.cols === 'function'? this.config.cols(this) : this.config.cols;
    cols?.forEach((item) => {
      if (item.remoteMethod && item.field?.options) {
        remoteOptions[item.field.options] = [];
      }
    });
    return {
      ...remoteOptions,
      tableFormDialog: {
        visible: false,
      },
      signatureDialog: {
        visible: false,
        onChange: (result, item) => {
          this.$emit('update:formData', {
            ...this.formData,
            [item.id]: result.url,
          });
          if (typeof item.onChange === 'function') {
            item.onChange(result, this);
          }
        }
      },
      drawImageDialog: {
        visible: false,
        oss: this.oss,
        imagePos: '2',
        imageSrc: '',
        onUploadFin: (url) => {
          this.$emit('update:formData', {
            ...this.formData,
            [this.item.id]: url,
          });
          if (typeof this.item.onChange === 'function') {
            this.item.onChange(url, this);
          }
          this.drawImageDialog.visible = false;
        }
      }
    };
  },
  watch: {
    options: {
      handler(newValue) {
        this.$emit('update:options', newValue);
      },
      deep: true
    },
    formData: {
      handler(newValue) {
        this.$emit('update:formData', newValue);
      },
      deep: true
    },
  },
  created() {
    this.init();
  },
  methods: {
    isImageUrl,
    init() {
      if (typeof this.item.init === 'function') {
        this.item.init(this);
      }
    },
    getItemLabel(item, suffix = '') {
      if (typeof item.label === 'function') {
        return item.label(this) || '';
      }
      return item.label?.trim() ? `${item.label.trim()}${suffix}` : '';
    },
    getTableList(item) {
      return (Array.isArray(this.formData[item.id]) ? this.formData[item.id] : []).map(v => ({
        ...v,
        _selfTable: this,
      }));
    },
    getTableCols(item) {
      const disabled = this.disabled || this.getItemDisabled(item);
      const tableCols = (item.cols || []).filter(v => v.label && v.listable !== false)
        .map((v) => ({
          ...v,
          label: `${v.label}${v.unit ? `（${v.unit}）` : ''}`,
          children: null
        }));
      const cols = [
        ...tableCols,
        disabled ? null : {
          label: '操作',
          fixed: 'right',
          width: '100',
          btns: [
            {
              name: '编辑',
              click: (row, rowIndex) => {
                this.editTableModel(item, row, rowIndex);
              },
              condition: (row, rowIndex) => {
                return !this.getItemDisabled(item, 'edit', row, rowIndex);
              }
            },
            {
              name: '删除',
              click: (row, index) => {
                this.deleteTableModel(index, item);
              },
              condition: (row, rowIndex) => {
                return !this.getItemDisabled(item, 'delete', row, rowIndex);
              }
            },
          ]
        }
      ].filter(Boolean);
      return cols;
    },
    editModel(item) {
      const editConfig = typeof item.editConfig === 'function'? item.editConfig(this) : item.editConfig;
      this.editTableModel({
       ...item,
        ...editConfig,
      });
    },
    editTableModel(item, row, rowIndex) {
      if (item.ootListConfig) {
        this.$emit('ootListPageShow', item.ootListConfig);
      } else {
        const initRow = typeof item.initRow === 'function' ? item.initRow(item, row, rowIndex, this) : item.initRow;
        const rowItem = row ? { ...row, _selfTable: undefined } : null;
        const model = initRow ? {
          ...(rowItem || {}),
        ...initRow,
        } : rowItem;
        this.tableFormDialog = {
          visible: true,
          title: row ? `编辑` : `新增`,
          width: item.rowField?.width,
          model,
          config: item,
          disabled: this.getItemDisabled(row),
          cols: item.rowField?.cols,
          options: this.options,
          oss: this.oss,
          onConfirm: (model) => {
            const tableList = Array.isArray(this.formData[item.id]) ? this.formData[item.id] : [];
            if (model) {
              if (typeof rowIndex === 'number') {
                tableList[rowIndex] = model;
              } else {
                tableList.push(model);
              }
            }
            this.$emit('update:formData', {
             ...this.formData,
              [item.id]: tableList,
            });
            if (typeof item.onConfirm === 'function') {
              item.onConfirm(item, row, rowIndex, this);
            }
          }
        }
      }
    },
    deleteTableModel(index, item) {
      const tableList = this.formData[item.id] || [];
      tableList.splice(index, 1);
      this.$emit('update:formData', {
       ...this.formData,
        [item.id]: tableList,
      });
    },
    getItemDisabled(item, disabledType, row, rowIndex) {
      if (!item) {
        return false;
      }
      if (typeof item.disabled === 'function') {
        return item.disabled(this, disabledType, row, rowIndex);
      }
      if (item.disabled === undefined) {
        return false;
      }
      return !!item.disabled;
    },
    getItemDefaultData(item) {
      return typeof item.defaultValue === 'function'
        ? item.defaultValue(this)
        : item.defaultValue;
    },
    getItemClass(item) {
      const itemClass = typeof item.itemClass === 'function' ? item.itemClass(this) : item.itemClass;
      const typeClass = `form-item form-item_${item.type || ''} form-item_${item.type || ''}-${this.layout || ''}-${item.size || 'small'} ${itemClass || ''}`;
      if (this.layout === 'row') {
        return typeClass;
      }
      if (this.layout === 'full') {
        return `${typeClass} lc-col-12 lc-col-xs12`;
      }
      return `${typeClass} lc-col-12 lc-col-xs${
        item.xs ||
        (['textarea', 'uploadImage', 'tagList', 'card', 'cardMobile', 'table', 'newLine', 'tabs'].includes(item.type) ? 12 : 6)
      }`;
    },
    getItemStyle(item) {
      if (typeof item.style === 'function') {
        return item.style(this);
      }
      return item.style;
    },
    getChildrenItems(item) {
      return item.children?.filter((child) => this.getItemShow(child, 'if'));
    },
    remoteMethod(query, item) {
      const searchWord = (query || '').trim();
      return item.remoteMethod(searchWord, this);
    },
    getDateType(item) {
      if (item.format === 'yyyy-MM-dd') {
        return 'date';
      }
      return 'datetime';
    },
    getDateFormat(item) {
      if (item.format === 'yyyy-MM-dd hh:mm:ss') {
        return 'yyyy-MM-dd HH:mm:ss';
      }
      return item.format;
    },
    getItemShow(item, validatorKey) {
      if (!item.validator) {
        return true;
      }
      if (item.validatorKey === 'if' && validatorKey === 'if') {
        return item.validator(this);
      }
      if (item.validatorKey === 'if' && validatorKey === 'show') {
        return item.validator(this);
      }
      if (item.validatorKey === 'show' && validatorKey === 'show') {
        return item.validator(this);
      }
      if (item.validatorKey === 'show' && validatorKey === 'if') {
        return true;
      }
    },
    onUploadedImage(data, item) {
      const imageUrl = `${this.oss.resourcesLocation + data.Key}`;
      if (item.accept?.length) {
        const regex = new RegExp(
          `\\.(${item.accept.map((v) => v.replace('.', '')).join('|')})$`,
          'i'
        );
        if (!regex.test(imageUrl)) {
          return this.$toast.error(
            `图片格式错误，请重新上传！（支持格式：${item.accept
              .map((v) => v.replace('.', ''))
              .join('、')}）`
          );
        }
      }

      const fileList = item.multipleKey
        ? [
            ...(this.formData[item.id] || []),
            {
              [item.multipleKey]: imageUrl
            }
          ]
        : imageUrl;
      this.$emit('update:formData', {
        ...this.formData,
        [item.id]: fileList
      });

      if (item.ocrMethod) {
        this.ocrImage(data, imageUrl, item);
      }
    },
    ocrImage(data, imageUrl, item) {
      /**
       * 压缩图片
       */
      const image = new Image();
      image.src = imageUrl;
      let reducedImage = imageUrl;
      if (image.width > 4096) {
        reducedImage =
          imageUrl + '?x-oss-process=image/resize,w_2000/quality,Q_100';
      }
      if (image.height > 4096) {
        reducedImage =
          imageUrl + '?x-oss-process=image/resize,h_2000/quality,Q_100';
      }
      if ((data.file.size / 1024 / 1024).toFixed(2) > 4) {
        reducedImage = imageUrl + '?x-oss-process=image/quality,Q_80';
      }
      item.ocrMethod(reducedImage, this);
    },
    onUploadedImageDelete(imageUrl, item) {
      const fileList = item.multipleKey
        ? this.formData[item.id].filter((v) => v[item.multipleKey] !== imageUrl)
        : undefined;
      this.$emit('update:formData', {
        ...this.formData,
        [item.id]: fileList
      });
    },
    getUploadedImages(item) {
      if (item.multipleKey) {
        return this.formData[item.id].map((v) => v[item.multipleKey]);
      }
      return [this.formData[item.id]];
    },
    onSelectTableShow(selectTable, type) {
      selectTable.onClick(this, type);
    },
    onTagListClose(tag, index, item) {
      const tagList = this.formData[item.id] || [];
      tagList.splice(index, 1);
      this.$emit('update:formData', {
        ...this.formData,
        [item.id]: tagList
      });
    },
    onTagListDialogShow(item) {
      this.$emit('tagListDialogShow', {
        id: item.id,
        field: item.field,
        model: this.formData[item.id],
        onConfirm: (tagList, context) => {
          context.formData = {
            ...context.formData,
            [item.id]: tagList
          };
          if (item.onConfirm) {
            item.onConfirm(tagList, context);
          }
        }
      });
    },
    onMakeOnlineSealShow(item) {
      this.$emit('sealPageShow', {
        onChange: (data, context) => {
          context.formData = {
            ...context.formData,
            [item.id]: data.base64Data
          };
          if (typeof item.onChange === 'function') {
            item.onChange(data, context);
          }
        }
      });
    },
    onUploadedSealImage(data, item) {
      const imageUrl = `${this.oss.resourcesLocation + data.Key}`;
      if (item.accept?.length) {
        const regex = new RegExp(
          `\\.(${item.accept.map((v) => v.replace('.', '')).join('|')})$`,
          'i'
        );
        if (!regex.test(imageUrl)) {
          return this.$toast.error(
            `图片格式错误，请重新上传！（支持格式：${item.accept
              .map((v) => v.replace('.', ''))
              .join('、')}）`
          );
        }
      }
      const reader = new FileReader();
      reader.readAsDataURL(data.file);
      reader.onload = (e) => {
        this.$emit('update:formData', {
         ...this.formData,
          [item.id]: e.target.result
        });

        if (typeof item.onChange === 'function') {
          item.onChange({
            base64Data: e.target.result,
            type: data.file?.type,
          }, this);
        }
      }
    },
    checkSealHasSignature(item) {
      if (typeof item.hasSignature === 'function') {
        return item.hasSignature(this);
      }
      if (typeof item.hasSignature === 'boolean') {
        return item.hasSignature;
      }

      return true;
    },
    getOptions(item) {
      let options = [];
      if (item.remoteMethod && item.field?.options) {
        options = this[item.field.options];
      }
      if (Array.isArray(item.field.options)) {
        options = item.field.options;
      }
      if (this.options && Array.isArray(this.options[item.field.options])) {
        options = this.options[item.field.options];
      }
      if (typeof item.field?.optionsFilter === 'function') {
        options = item.field?.optionsFilter(options, this);
      }
      return options || [];
    },
    getLabel(option, item) {
      if (typeof item.field?.labelRenderer === 'function') {
        return item.field.labelRenderer(option, this);
      }
      return option[item.field.labelKey];
    },
    onTreeSelectChange(value, item) {
      this.$set(this.formData, item.id, value);
      if (typeof item.onChange === 'function') {
        item.onChange(value, this);
      }
    },
    treeSelectNormalizer(node, instanceId, item) {
      if (typeof item.normalizer === 'function') {
        return item.normalizer(node, instanceId, this);
      }
      return { label: this.getLabel(node, item), id: node[item.field.valueKey], children: node.children || undefined };
    },
    treeSelectLoadOptions(value, item) {
      if (typeof item.loadOptions === 'function') {
        item.loadOptions(value, this);
      }
    },
    onFormItemSelectChange(value, item) {
      if (typeof item.onChange === 'function') {
        item.onChange(value, this);
      }
    },
    onFormItemRadioGroupChange(value, item) {
      if (typeof item.onChange === 'function') {
        item.onChange(value, this);
      }
    },
    onFormItemCheckboxGroupChange(value, item) {
      if (typeof item.onChange === 'function') {
        item.onChange(value, this);
      }
    },
    onFormItemDatePickerChange(value, item) {
      if (typeof item.onChange === 'function') {
        item.onChange(value, this);
      }
    },
    datePickerOptions(item) {
      if (typeof item.pickerOptions === 'function') {
        return item.pickerOptions(this);
      }
      return item.pickerOptions;
    },
    onResetSelectTableInput(item) {
      if (typeof item.onReset === 'function') {
        item.onReset(item, this);
      }
    },
    onSelectTableClose(element, elementIndex, item) {
      this.$emit('update:formData', {
       ...this.formData,
        [item.id]: this.formData[item.id].filter(
          (v, index) => index!== elementIndex
        )
      });
      if (typeof item.selectTable?.onClose === 'function') {
        item.selectTable.onClose(element, this);
      }
    },
    getLabelClass(item) {
      if (typeof item.labelClass === 'function') {
        return item.labelClass(this) || '';
      }
      return item.labelClass || '';
    },
    getFieldDescription(item) {
      if (typeof item.fieldDescription === 'function') {
        return item.fieldDescription(this);
      }
      return item.fieldDescription;
    },
    getTitleDescription(item) {
      if (typeof item.titleDescription === 'function') {
        return item.titleDescription(this);
      }
      return item.titleDescription;
    },
    getFieldClass(item) {
      if (typeof item.fieldClass === 'function') {
        return item.fieldClass(this);
      }
      return item.fieldClass || '';
    },
    getFieldWrapperClass(item) {
      if (typeof item.fieldWrapperClass === 'function') {
        return item.fieldWrapperClass(this);
      }
      return item.fieldWrapperClass || '';
    },
    getItemPlaceholder(item) {
      if (typeof item.placeholder === 'function') {
        return item.placeholder(this) || '';
      }
      return item.placeholder || '';
    },
    onDrawImage(item) {
      const imageSrc = typeof item.imageSrc === 'function' ? item.imageSrc(this) : item.imageSrc;
      const imagePos = typeof item.imagePos === 'function' ? item.imagePos(this) : item.imagePos;
      this.drawImageDialog.imageSrc = imageSrc;
      this.drawImageDialog.imagePos = imagePos || '2';
      this.drawImageDialog.visible = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.form-item_ {
  margin: 10px 0;
}
.cursor-not-allowed {
  cursor: not-allowed;
}
.color-disabled {
  color: #999;
}
.flex-gap5 {
  gap: 5px;
}
.plus-icon-wrapper {
  font-size: 26px;
  cursor: pointer;
  display: flex;
  align-items: center;
  &-cyan {
    color: #51afc9;
  }
  &-blue {
    color: #3f9eff;
  }
}
.el-radio-group label.el-radio {
  margin-right: 10px;
}
.close {
  position: absolute;
  top: 0;
  right: -10px;
  font-size: 22px;
  background: #a7a7a7;
  border-radius: 50%;
  color: #fff;
  width: 22px;
  height: 22px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}
.el-form-item.is-error {
  .el-input::v-deep {
    .el-input__inner {
      border-color: #f56c6c;
      &:focus {
        border-color: #f56c6c;
      }
    }
  }
  .el-textarea::v-deep {
    .el-textarea__inner {
      border-color: #f56c6c;
      &:focus {
        border-color: #f56c6c;
      }
    }
  }
}
::v-deep .vue-treeselect__input-container {
  line-height: 32px;
}
::v-deep .vue-treeselect--has-value .vue-treeselect__input {
  vertical-align: text-bottom;
}
::v-deep .vue-treeselect__single-value {
  font-size: .9285rem;
  color: #606266;
}
::v-deep .vue-treeselect__placeholder {
  font-size: .9285rem;
  color: #c0c4cc;
  font-weight: 300;
}
::v-deep .vue-treeselect--disabled .vue-treeselect__control {
  cursor: not-allowed;
  background-color: #fbfdff;
  border-color: #E4E7ED;
  color: #cbcfd6;
  font-size: .9285rem;
}
::v-deep .vue-treeselect--disabled .vue-treeselect__single-value {
  color: #cbcfd6;
  font-size: .9285rem;
}
.form-item_newLine {
  padding: 0;
  margin: 0;
  height: 0;
}
.form-item_text--small {
  min-height: 60px;
}
.card-mobile {
  border: 1px solid #ddd;
  border-top: 4px solid #85a5ff;
  border-radius: 8px;
  padding: 0 10px 10px 10px;
  margin-top: 10px;
}
.card-mobile-title {
  line-height: 2rem;
  padding: 8px 0;
}
.flex-column > .flex-flex-auto {
  overflow: hidden;
}
.el-checkbox-button {
  margin-right: 0;
}
.none {
  display: none;
}
.el-radio-button.is-active.judgement-button-0::v-deep .el-radio-button__inner {
  background-color: #909399;
  border-color: #909399;
  box-shadow: -1px 0 0 0 #909399;
}
::v-deep .el-radio-button__orig-radio:disabled:checked+.el-radio-button__inner {
  color: #ffffff;
  background-color: #b3d8ff;
  border-color: #b3d8ff;
  box-shadow: none;
}
.el-radio-button.is-active.is-disabled.judgement-button-0::v-deep .el-radio-button__inner {
  color: #ffffff;
  background-color: #d3d4d6;
  border-color: #d3d4d6;
}

.radio-group-item-image ::v-deep .el-radio-button__inner {
  padding: 1px;
}

/* 针对 Element UI（Vue 2）的样式 */
.radio-button-group {
  /* 确保父容器是块级，支持换行 */
  display: inline-block;
  /* 保留组件原有外层边框（可选，根据需求调整） */
  // border: 1px solid #dcdfe6;
  border-radius: 4px; /* 与组件默认圆角一致 */
  padding: 2px; /* 父容器内边距，避免按钮贴边 */
}

/* 修复换行后第一列按钮的左侧边框 */
.radio-button-group .el-radio-button {
  /* 关键：让按钮支持换行（Element UI 默认可能是 inline，需改为 inline-block） */
  display: inline-block;
  margin: 2px 0; /* 可选：增加上下间距，优化换行后的视觉效果 */
}

/* 核心：定位“换行后第一列”的按钮，显示左侧边框 */
.radio-button-group .el-radio-button:not(:first-child):nth-child(1n) {
  /* 覆盖默认的 border-left: none，显示左侧边框 */
  border-left: 1px solid #dcdfe6 !important; /* 颜色与组件默认边框一致 */
}

/* 保留相邻按钮的右侧边框（原逻辑，避免重复） */
.radio-button-group .el-radio-button + .el-radio-button {
  border-left: none !important; /* 相邻按钮仍隐藏左侧边框，只显示分割线 */
}

.checkbox-group-item-image ::v-deep .el-checkbox-button__inner {
  padding: 1px;
}

/* 针对 Element UI（Vue 2）的样式 */
.checkbox-button-group {
  /* 确保父容器是块级，支持换行 */
  display: inline-block;
  /* 保留组件原有外层边框（可选，根据需求调整） */
  // border: 1px solid #dcdfe6;
  border-radius: 4px; /* 与组件默认圆角一致 */
  padding: 2px; /* 父容器内边距，避免按钮贴边 */
}

/* 修复换行后第一列按钮的左侧边框 */
.checkbox-button-group .el-checkbox-button {
  /* 关键：让按钮支持换行（Element UI 默认可能是 inline，需改为 inline-block） */
  display: inline-block;
  margin: 2px 0; /* 可选：增加上下间距，优化换行后的视觉效果 */
}

/* 核心：定位“换行后第一列”的按钮，显示左侧边框 */
.checkbox-button-group .el-checkbox-button:not(:first-child):nth-child(1n) {
  /* 覆盖默认的 border-left: none，显示左侧边框 */
  border-left: 1px solid #dcdfe6 !important; /* 颜色与组件默认边框一致 */
}

/* 保留相邻按钮的右侧边框（原逻辑，避免重复） */
.checkbox-button-group .el-checkbox-button + .el-checkout-button {
  border-left: none !important; /* 相邻按钮仍隐藏左侧边框，只显示分割线 */
}

</style>
<style>
.viewer-canvas > img {
  background-color: #fff;
}
.lh16 {
  line-height: 16px;
}
</style>
