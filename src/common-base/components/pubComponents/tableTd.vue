<template>
  <el-table-column
    class="child-header"
    v-if="tdData.children"
    :label="tdData.label"
    :align="tdData.align ? tdData.align : 'center'"
  >
    <tableTd v-for="(child, i) in tdData.children" :key="i" :tdData="child"></tableTd>
  </el-table-column>

  <el-table-column
    v-else-if="tdData.btns"
    :fixed="getFixed(tdData)"
    :label="tdData.label"
    :align="tdData.align ? tdData.align : 'center'"
    :width="innerWidth > 768 ? tdData.width : 100"
  >
    <template slot-scope="scope">
      <template v-for="(btn, i) in tdData.btns">
        <span
          :key="i"
          class="link ml5 mr5"
          style="display: inline-block;"
          :style="{ color: getColor(btn,scope.row) }"
          v-if="condition(scope.row, btn, scope.$index)"
          @click="btnClick(scope.$index, btn, scope.row)">
            <i v-if="btn.icon" :class="btn.icon"></i>
            {{btn.render ? btn.render(scope.row) : btn.name}}
        </span>
      </template>
    </template>
  </el-table-column>

  <el-table-column
    v-else-if="tdData.link"
    :label="tdData.label"
    :prop="tdData.id"
    :show-overflow-tooltip="tdData.tooltip"
    :align="tdData.align ? tdData.align : 'center'"
    :sortable="tdData.sortable ? tdData.sortable : false"
    :min-width="tdData.width"
    >
    <template slot-scope="scope">
      <span class="link" @click="btnClick(scope.$index, tdData, scope.row)">
        <i v-if="tdData.icon" :class="tdData.icon"></i>
        {{scope.row[tdData.id] || tdData.defaultLink}}
      </span>
    </template>
  </el-table-column>

  <el-table-column
    v-else-if="tdData.linkImg"
    :label="tdData.label"
    :prop="tdData.id"
    :show-overflow-tooltip="tdData.tooltip"
    :align="tdData.align ? tdData.align : 'center'"
    :sortable="tdData.sortable ? tdData.sortable : false"
    :min-width="tdData.width"
    >
    <template slot-scope="scope">
      <span v-if="!scope.row[tdData.id]">暂无图片</span>
      <span v-else class="link" style="font-size: 30px;" @click="showFileView(scope.row, tdData, 'img')"><i class="el-icon-picture"></i></span>
    </template>
  </el-table-column>

  <el-table-column
    v-else-if="tdData.linkVideo"
    :label="tdData.label"
    :prop="tdData.id"
    :show-overflow-tooltip="tdData.tooltip"
    :align="tdData.align ? tdData.align : 'center'"
    :sortable="tdData.sortable ? tdData.sortable : false"
    :min-width="tdData.width"
    >
    <template slot-scope="scope">
      <span v-if="!scope.row[tdData.id]">暂无视频</span>
      <span v-else class="link" style="font-size: 30px;" @click="showFileView(scope.row, tdData, 'video')"><i class="el-icon-video-camera-solid"></i></span>
    </template>
  </el-table-column>

  <!-- render渲染tdData -->
  <el-table-column
    v-else-if="tdData.render"
    :fixed="getFixed(tdData)"
    :prop="tdData.id"
    :label="tdData.label"
    :show-overflow-tooltip="tdData.tooltip"
    :align="tdData.align ? tdData.align : 'center'"
    :sortable="tdData.sortable ? tdData.sortable : false"
    :min-width="tdData.width"
  >
    <template slot-scope="scope">
      <span v-html="tdData.render(scope.row)"></span>
    </template>
  </el-table-column>

  <!-- renderjxs渲染tdData -->
  <el-table-column
    v-else-if="tdData.renderjxs"
    :fixed="getFixed(tdData)"
    :prop="tdData.id"
    :label="tdData.label"
    :show-overflow-tooltip="tdData.tooltip"
    :align="tdData.align ? tdData.align : 'center'"
    :sortable="tdData.sortable ? tdData.sortable : false"
    :min-width="tdData.width"
  >
    <template slot-scope="scope">
      <lb-render
        :scope="scope"
        :render="tdData.renderjxs"
      />
    </template>
  </el-table-column>

  <!-- 编辑表格数据 -->
  <el-table-column
    v-else-if="tdData.isEdit"
    :prop="tdData.id"
    :label="tdData.label"
    :show-overflow-tooltip="tdData.tooltip"
    :align="tdData.align ? tdData.align : 'center'"
    :sortable="tdData.sortable ? tdData.sortable : false"
    :min-width="tdData.width"
  >
    <template slot-scope="scope">
      <div style="line-height: 40px;" v-if="tdData.defaultEdit || tdData.isEdit(scope.row)" class="flex flex-items-start">
        <formItem
          :config="tdData"
          :model="scope.row"
          :oss="tdData.oss"
        ></formItem>
        <span v-if="tdData.rightText">{{tdData.rightText}}</span>
      </div>
      <div v-else>
        <span v-html="scope.row[tdData.id]"></span>
        <span v-if="tdData.rightText">{{tdData.rightText}}</span>
      </div>
    </template>
  </el-table-column>

  <el-table-column v-else-if="tdData.selection"
  type="selection"  align="center" width="55"
  :selectable='canChcecked'></el-table-column>

  <el-table-column
    v-else-if="tdData.type == 'date'"
    :prop="tdData.id"
    :label="tdData.label"
    :show-overflow-tooltip="tdData.tooltip"
    :align="tdData.align ? tdData.align : 'center'"
    :sortable="tdData.sortable ? tdData.sortable : false"
    :min-width="tdData.width"
  >
    <template slot-scope="scope">
      <span v-if="tdData.type == 'date'">{{getData(tdData, scope.row)}}</span>
    </template>
  </el-table-column>
  <!-- 正常数据表格列表 -->
  <el-table-column
    v-else
    :prop="tdData.id"
    :fixed="getFixed(tdData)"
    :label="tdData.label"
    :show-overflow-tooltip="tdData.tooltip"
    :align="tdData.align ? tdData.align : 'center'"
    :sortable="tdData.sortable ? tdData.sortable : false"
    :min-width="tdData.width"
  ></el-table-column>

</template>
<script type="text/ecmascript-6">
import formItem from "./formItem";
import LbRender from './render'
export default {
  name: 'tableTd',
  props: ['tdData', 'list', 'showFileConfig'],
  components: { formItem, LbRender },
  data () {
    return {
      innerWidth: window.innerWidth
    }
  },
  created(){
  },
  methods: {
    getData(config, row) {
      if (!row[config.id]) {
        return '';
      }
      const format = config.format || 'yyyy-MM-dd'
      return this.utils.formatDate(row[config.id], format)
    },
    getFixed(tdData) {
      // if (window.innerWidth < 768) {
      //   return;
      // }
      return tdData.fixed;
    },
    canChcecked(row, index) {
      if (this.tdData.canChcecked) {
        return this.tdData.canChcecked(row, index)
      }
      return true;
    },
    /**
     * btnConfig 按钮配置
     */
    condition(tableData, btn, index) {
      if (btn.condition) {
        return btn.condition(tableData, index);
      }
      return true;
    },

    getColor(btn, row) {
      if(typeof btn.isDisabled  === 'function' && btn.isDisabled(row)) {
        return '#999';
      }
      // return btn.color ? btn.color : btn.getColor ? btn.getColor(row) : ''
      // 修改为不嵌套三元表达式
      let color = '';
      if (btn.color) {
        color = btn.color;
      } else if (btn.getColor) {
        color = btn.getColor(row);
      }
      return color;
    },

    /**
     * 设置表格勾选数据
     */
    btnClick(index, btn, row) {
      if(typeof btn.isDisabled  === 'function' && btn.isDisabled(row)) {
        return;
      }
      if (btn.click) {
        btn.click(row, index, this.list);
      }
    },

    showFileView(data, item, type) {
      if (item.servicesConfig) {
        let args = item.servicesConfig.args || {};
        if (item.servicesConfig.argsKeys) {
          for (const key in item.servicesConfig.argsKeys) {
            args[key] = data[item.servicesConfig.argsKeys[key]];
          }
        }
        this.API.send(item.servicesConfig.url, args, function (res) {
          res = res.serviceResult;
          this.showFileConfig.fileData = [];
          res.forEach(i => {
            if (i.src) {
              this.showFileConfig.fileData.push(i.src);
            }
          });
          if (!this.showFileConfig.fileData.length) {
            this.$toast({text: '暂无图片'});
            return;
          }
          this.showFileConfig.title = item.label;
          this.showFileConfig.type = type;
          this.showFileConfig.show = true;
        }, function () {
        }, this)
      } else {
        this.showFileConfig.title = item.label;
        this.showFileConfig.type = type;
        this.showFileConfig.show = true;
        this.showFileConfig.fileData = data[item.id];
        if (typeof this.showFileConfig.fileData === 'string') {
          this.showFileConfig.fileData = this.showFileConfig.fileData.split('$@$');
        }
      }
    },
  }
};
</script>
