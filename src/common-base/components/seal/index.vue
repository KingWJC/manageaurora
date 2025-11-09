<template>
  <div class="viewport-fixed">
    <div class="viewport-header viewport-header-padded flex flex-column flex-content-center" >
      <div class="flex flex-content-between">
        <div class="flex flex-items-start">
          <i class="icon-back" @click="sealConfig.show = false"></i>
        </div>
      </div>
    </div>
    <div class="viewport-view">
      <div class="viewport-view-body flex flex-column">
        <div class="seal p15">
          <h2 class="seal-title">在线印章生成</h2>
          <el-row :gutter="10">
            <el-col :span="12" :xs="24">
              <el-form ref="form" size="small" :model="form" label-width="80px">
                <el-tabs type="border-card" value="1" >
                  <el-tab-pane label="基础参数" name="1">
                    <el-form-item label="印章样式">
                      <el-select @change="changeStyle" v-model="sealStyle" placeholder="请选择印章样式">
                        <el-option label="圆形公章1" value="seal-circle-style1"></el-option>
                        <el-option label="圆形公章2" value="seal-circle-style2"></el-option>
                        <el-option label="圆形公章3" value="seal-circle-style3"></el-option>
                        <el-option label="圆形公章4" value="seal-circle-style4"></el-option>
                        <el-option label="椭圆形公章1" value="seal-ellipse-style1"></el-option>
                        <el-option label="椭圆形公章2" value="seal-ellipse-style2"></el-option>
                        <el-option label="正方形人名章-两字1" value="seal-square-style1"></el-option>
                        <el-option label="正方形人名章-两字2" value="seal-square-style2"></el-option>
                        <el-option label="正方形人名章-三字1" value="seal-square-style3"></el-option>
                        <el-option label="正方形人名章-三字2" value="seal-square-style4"></el-option>
                        <el-option label="正方形公章1" value="seal-square-style5"></el-option>
                        <el-option label="正方形公章2" value="seal-square-style6"></el-option>
                        <el-option label="长方形公章1" value="seal-rectangle-style1"></el-option>
                        <el-option label="长方形公章2" value="seal-rectangle-style2"></el-option>
                        <el-option label="菱形公章1" value="seal-rhombus-style1"></el-option>
                        <el-option label="菱形公章2" value="seal-rhombus-style2"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="印章大小">
                      <el-input v-model="form.sealSize" type="text" class="custom-input" v-if="sealStyle === 'seal-rectangle-style1' || sealStyle === 'seal-rectangle-style2'"></el-input>
                      <el-input v-model="form.sealSize" type="number" class="custom-input" controls-position="right" :min="1" :max="100" v-else></el-input>
                    </el-form-item>
                    <el-form-item label="印章颜色" >
                      <div class="flex-box">
                        <el-input v-model="form.sealColor" class="custom-input"></el-input>
                        <el-color-picker v-model="form.sealColor"></el-color-picker>
                        <span class="tips">印章颜色作为文字颜色，背景使用透明色</span>
                      </div>
                    </el-form-item>
                  </el-tab-pane>
                  <el-tab-pane label="老化" name="2" >
                    <el-form-item label="老化方式">
                      <el-select v-model="form.sealOldType" placeholder="请选择老化方式">
                        <el-option label="无" value="none"></el-option>
                        <el-option label="噪点" value="noise"></el-option>
                      </el-select>
                      <span class="tips">选择印章老化的算法</span>
                    </el-form-item>
                    <el-form-item label="噪点方向" v-if="form.sealOldType === 'noise'">
                      <el-select v-model="form.sealOldParameter.sealNoiseDirection" placeholder="请选择噪点方向">
                        <el-option label="全局" value="noise1"></el-option>
                        <el-option label="从上到下" value="noise2"></el-option>
                        <el-option label="从下到上" value="noise3"></el-option>
                        <el-option label="从左到右" value="noise4"></el-option>
                        <el-option label="从右到左" value="noise5"></el-option>
                        <el-option label="中心到边缘" value="noise6"></el-option>
                        <el-option label="边缘到中心" value="noise7"></el-option>
                      </el-select>
                      <span class="tips">噪点添加的渐变方向</span>
                    </el-form-item>
                    <el-form-item label="起始强度" v-if="form.sealOldType === 'noise'">
                      <el-input v-model="form.sealOldParameter.start" type="number" controls-position="right" :min="1" :max="99" class="custom-input"></el-input>
                      <span class="tips">噪点的起始强度，范围为[1,99]</span>
                    </el-form-item>
                    <el-form-item label="结束强度" v-if="form.sealOldType === 'noise'">
                      <el-input v-model="form.sealOldParameter.end" type="number" controls-position="right" :min="1" :max="99" class="custom-input"></el-input>
                      <span class="tips">噪点的结束强度，范围为[1,99]</span>
                    </el-form-item>
                  </el-tab-pane>
                  <el-tab-pane label="主文字" name="3" v-if="form.hasOwnProperty('mainFont')">
                    <el-form-item label="文本">
                      <el-input v-model="form.mainFont.fontText" class="custom-input"></el-input>
                      <span class="tips" v-if="sealStyle==='seal-square-style5' || sealStyle==='seal-square-style6' || sealStyle==='seal-rectangle-style2'">\n是文字折行的标志</span>
                    </el-form-item>
                    <el-form-item label="样式">
                      <el-radio-group v-model="form.mainFont.bold">
                        <el-radio :label="true">加粗</el-radio>
                        <el-radio :label="false">常规</el-radio>
                      </el-radio-group>
                      <span class="tips">文字是否加粗</span>
                      
                    </el-form-item>
                    <el-form-item label="字体">
                      <el-select v-model="form.mainFont.fontFamily" placeholder="请选择字体">
                        <el-option label="方正舒体" value="方正舒体"></el-option>
                        <el-option label="方正姚体" value="方正姚体"></el-option>
                        <el-option label="黑体" value="黑体"></el-option>
                        <el-option label="宋体" value="宋体"></el-option>
                        <el-option label="仿宋" value="仿宋"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="文字大小">
                      <el-input v-model="form.mainFont.fontSize" type="number" controls-position="right" :min="1" :max="100" class="custom-input"></el-input>
                    </el-form-item>
                    <el-form-item label="字距">
                      <el-input v-model="form.mainFont.fontSpace" type="number" controls-position="right" :min="1" :max="100" class="custom-input"></el-input>
                      <span class="tips">字与字之间的距离</span>
                    </el-form-item>
                    <el-form-item label="边距">
                      <el-input v-model="form.mainFont.lineDistance" type="number" controls-position="right" :min="1" :max="100" class="custom-input"></el-input>
                      <span class="tips">文字与边线之间的距离</span>
                    </el-form-item>
                  </el-tab-pane>
                  <el-tab-pane label="中心内容" name="4" v-if="form.hasOwnProperty('centerFont')">
                    <el-form-item label="内容类型">
                      <el-radio-group v-model="form.centerFont.style" disabled> 
                        <el-radio :label="3">文字</el-radio>
                        <el-radio :label="6">图片</el-radio>
                        印章中心内容，支持文本和图片LOGO
                      </el-radio-group>
                      <span class="tips">印章中心内容</span>
                    </el-form-item>
                    <el-form-item label="文本">
                      <el-input v-model="form.centerFont.fontText" class="custom-input"></el-input>
                      <!-- <span class="tips" v-if="sealStyle==='seal-ellipse-style2'">\n是文字折行的标志</span> -->
                      <span class="tips">为空则不使用中心文本</span>
                    </el-form-item>
                    <el-form-item label="样式">
                      <el-radio-group v-model="form.centerFont.bold">
                        <el-radio :label="true">加粗</el-radio>
                        <el-radio :label="false">常规</el-radio>
                        
                        <span class="tips">文字是否加粗</span>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item label="字体">
                      <el-select v-model="form.centerFont.fontFamily" placeholder="请选择字体">
                        <el-option label="方正舒体" value="fangzhengshuti"></el-option>
                        <el-option label="方正姚体" value="fangzhengyaoti"></el-option>
                        <el-option label="黑体" value="黑体"></el-option>
                        <el-option label="宋体" value="宋体"></el-option>
                        <el-option label="仿宋" value="fangsong"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="文字大小">
                      <el-input v-model="form.centerFont.fontSize" type="number" controls-position="right" :min="1" :max="100" class="custom-input"></el-input>
                    </el-form-item>
                    <el-form-item label="字距">
                      <el-input v-model="form.centerFont.fontSpace" type="number" controls-position="right" :min="1" :max="100" class="custom-input"></el-input>
                      <span class="tips">字与字之间的距离</span>
                    </el-form-item>
                  </el-tab-pane>
                  <el-tab-pane label="副文字"  name="5" v-if="form.hasOwnProperty('viceFont')">
                    <el-form-item label="文本">
                      <el-input v-model="form.viceFont.fontText" class="custom-input"></el-input>
                      <span class="tips">为空则不使用副文本</span>
                    </el-form-item>
                    <el-form-item label="样式">
                      <el-radio-group v-model="form.viceFont.bold">
                        <el-radio :label="true">加粗</el-radio>
                        <el-radio :label="false">常规</el-radio>
                      </el-radio-group>
                      <span class="tips">文字是否加粗</span>
                      
                    </el-form-item>
                    <el-form-item label="字体">
                      <el-select v-model="form.viceFont.fontFamily" placeholder="请选择字体">
                        <el-option label="方正舒体" value="方正舒体"></el-option>
                        <el-option label="方正姚体" value="方正姚体"></el-option>
                        <el-option label="黑体" value="黑体"></el-option>
                        <el-option label="宋体" value="宋体"></el-option>
                        <el-option label="仿宋" value="仿宋"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="文字大小">
                      <el-input v-model="form.viceFont.fontSize" type="number" controls-position="right" :min="1" :max="100" class="custom-input"></el-input>
                    </el-form-item>
                    <el-form-item label="字距">
                      <el-input v-model="form.viceFont.fontSpace" type="number" controls-position="right" :min="1" :max="100" class="custom-input"></el-input>
                      <span class="tips">字与字之间的距离</span>
                    </el-form-item>
                    <el-form-item label="边距">
                      <el-input v-model="form.viceFont.lineDistance" type="number" controls-position="right" :min="1" :max="100" class="custom-input"></el-input>
                      <span class="tips">文字与边线之间的距离</span>
                    </el-form-item>
                  </el-tab-pane>
                  <el-tab-pane label="抬头文字" name="6" v-if="form.hasOwnProperty('titleFont')">
                    <el-form-item label="文本">
                      <el-input v-model="form.titleFont.fontText" class="custom-input"></el-input>
                    </el-form-item>
                    <el-form-item label="样式">
                      <el-radio-group v-model="form.titleFont.bold">
                        <el-radio :label="true">加粗</el-radio>
                        <el-radio :label="false">常规</el-radio>
                      </el-radio-group>
                      <span class="tips">文字是否加粗</span>
                      
                    </el-form-item>
                    <el-form-item label="字体">
                      <el-select v-model="form.titleFont.fontFamily" placeholder="请选择字体">
                        <el-option label="方正舒体" value="方正舒体"></el-option>
                        <el-option label="方正姚体" value="方正姚体"></el-option>
                        <el-option label="黑体" value="黑体"></el-option>
                        <el-option label="宋体" value="宋体"></el-option>
                        <el-option label="仿宋" value="仿宋"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="文字大小">
                      <el-input v-model="form.titleFont.fontSize" type="number" controls-position="right" :min="1" :max="100" class="custom-input"></el-input>
                    </el-form-item>
                    <el-form-item label="字距">
                      <el-input v-model="form.titleFont.fontSpace" type="number" controls-position="right" :min="1" :max="100" class="custom-input"></el-input>
                      <span class="tips">字与字之间的距离</span>
                    </el-form-item>
                    <el-form-item label="边距">
                      <el-input v-model="form.titleFont.lineDistance" type="number" controls-position="right" :min="1" :max="100" class="custom-input"></el-input>
                      <span class="tips">文字与中心内容之间的距离</span>
                    </el-form-item>
                  </el-tab-pane>
                  <el-tab-pane label="外边线" name="7" v-if="form.hasOwnProperty('borderCircle')">
                    <el-form-item label="线条宽度">
                      <el-input v-model="form.borderCircle.lineSize" type="number" controls-position="right" :min="1" :max="100" class="custom-input"></el-input>
                      <span class="tips">边线线条的宽度</span>
                    </el-form-item>
                    <el-form-item label="边距" v-if="form.borderCircle.hasOwnProperty('lineDistance')">
                      <el-input v-model="form.borderCircle.lineDistance" type="number" controls-position="right" :min="1" :max="100" class="custom-input"></el-input>
                      <span class="tips">线条到印章边缘的距离</span>
                    </el-form-item>
                    <el-form-item label="X轴半径" v-if="form.borderCircle.hasOwnProperty('width')">
                      <el-input  v-model="form.borderCircle.width" type="number" controls-position="right" :min="1" :max="100" class="custom-input fl"></el-input> &nbsp;&nbsp;
                      <div class="fl desc tips">
                          边线 X 轴的半径，需小于印章大小的一半。<br />
                          如果 X 轴半径 = Y 轴半径，则边线为圆形。<br />
                          如果 X 轴半径 > Y 轴半径，则边线为椭圆。
                      </div>
                    </el-form-item>
                    <el-form-item label="Y轴半径" v-if="form.borderCircle.hasOwnProperty('height')">
                      <el-input v-model="form.borderCircle.height" type="number" controls-position="right" :min="1" :max="100" class="custom-input"></el-input>
                      <span class="tips">边线 Y 轴的半径，需小于印章大小的一半。</span>
                      
                    </el-form-item>
                  </el-tab-pane>
                </el-tabs>
                <el-form-item label="" class="btn-group">
                  <!-- <el-button type="primary" @click="onSubmit">生成</el-button> -->
                  <el-button @click="downloadImage">下载</el-button>
                  <el-button type="primary" @click="useSeal">使用当前印章</el-button>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="12" :xs="24">
              <h3 class="m0">生成结果:</h3>
              <canvas class="seal-canvas" id="seal-canvas"></canvas>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Seal',
  props: ['sealConfig'],
  // 数据
  data() {
    return {
      sealStyle: 'seal-circle-style1', // 印章样式
      formDefault: {
        sealSize: 250, // 印章大小
        sealColor: '#ff0000', // 印章颜色
        sealOldType: 'none', // 印章老化
        sealOldParameter:{
          sealNoiseDirection: 'noise1', // 噪点方向: 全局,从上到下,从下到上,从左到右,从右到左,中心到边缘,边缘到中心
          start: 20, // 起始强度
          end: 80 // 结束强度
        },
        mainFont:{ 
          fontText: '在线示例专用章', // 文本
          bold: true, // 字体是否加粗
          fontFamily: '仿宋', // 字体
          fontSize: 25, // 字体大小
          fontSpace: 10, // 字与字之间的距离
          lineDistance: 10, // 文字与边线之间的距离
        },

      },
      form: {
        sealSize: 250, // 印章大小
        sealColor: '#ff0000', // 印章颜色
        sealOldType: '', // 印章老化
      },
      // centerFontHeight: 0,
      canvas: null,
      ctx: null
    }
  },
  mounted() {
    this.initCanvas();
    this.drawSeal();
  },
  watch:{
    form:{
      handler(){
        this.onSubmit()
      },
      deep: true
    },
    sealStyle:{
      handler(){
        this.onSubmit()
      }
    },
    // sealSize:{
    //   handler(){
    //     this.changeSealSize()
    //   }
    // }
  },
  // 定义方法
  methods: {
    onSubmit() {
      this.clearSeal();
      this.drawSeal();
    },
    initCanvas() {
      this.canvas = document.getElementById('seal-canvas');
      this.canvas.width = this.form.sealSize;
      this.canvas.height = this.form.sealSize;
      this.ctx = this.canvas.getContext('2d');

      this.cfgList = {
        'seal-circle-style1': {
          centerFont:{
            style: 3, 
            fontText: '★', 
            bold: false,
            fontFamily: '仿宋',
            fontSize: 80,
            fontSpace: 10
          },
          borderCircle:{
            width: 120, // 边线 X 轴的半径，需小于印章大小的一半。
            height: 120, // 边线 Y 轴的半径，需小于印章大小的一半。
            lineSize: 3, // 线条宽度
          },
        },
        'seal-circle-style2': {
          centerFont:{
            style: 3, 
            fontText: '★', 
            bold: false,
            fontFamily: '仿宋',
            fontSize: 80,
            fontSpace: 10
          },
          viceFont:{
            fontText: '123456789C0123', // 文本
            bold: true, // 字体是否加粗
            fontFamily: '仿宋', // 字体
            fontSize: 15, // 字体大小
            fontSpace: 3, // 字与字之间的距离
            lineDistance: 12, // 文字与边线之间的距离
          },
          borderCircle:{
            width: 120, // 边线 X 轴的半径，需小于印章大小的一半。
            height: 120, // 边线 Y 轴的半径，需小于印章大小的一半。
            lineSize: 3, // 线条宽度
          },
        },
        'seal-circle-style3': {
          centerFont:{
            style: 3, 
            fontText: '★', 
            bold: false,
            fontFamily: '仿宋',
            fontSize: 80,
            fontSpace: 10
          },
          titleFont:{
            "fontText": "示例抬头文字",// 文本
            "bold": true, // 字体是否加粗
            "fontFamily": "仿宋",// 字体
            "fontSize": 22, // 字体大小
            "fontSpace": 2, // 字与字之间的距离
            "lineDistance": 5 // 文字与边线之间的距离
          },
          borderCircle:{
            width: 120, // 边线 X 轴的半径，需小于印章大小的一半。
            height: 120, // 边线 Y 轴的半径，需小于印章大小的一半。
            lineSize: 3, // 线条宽度
          },
        },
        'seal-circle-style4': {
          centerFont:{
            style: 3, 
            fontText: '★', 
            bold: false,
            fontFamily: '仿宋',
            fontSize: 80,
            fontSpace: 10
          },
          titleFont:{
            "fontText": "示例抬头文字",// 文本
            "bold": true, // 字体是否加粗
            "fontFamily": "仿宋",// 字体
            "fontSize": 22, // 字体大小
            "fontSpace": 2, // 字与字之间的距离
            "lineDistance": 5 // 文字与边线之间的距离
          },
          viceFont:{
            fontText: '123456789C0123', // 文本
            bold: true, // 字体是否加粗
            fontFamily: '仿宋', // 字体
            fontSize: 15, // 字体大小
            fontSpace: 2, // 字与字之间的距离
            lineDistance: 12, // 文字与边线之间的距离
          },
          borderCircle:{
            width: 120, // 边线 X 轴的半径，需小于印章大小的一半。
            height: 120, // 边线 Y 轴的半径，需小于印章大小的一半。
            lineSize: 3, // 线条宽度
          },
        },
        'seal-ellipse-style1': {
          centerFont:{
            style: 3, 
            fontText: '★', 
            bold: false,
            fontFamily: '仿宋',
            fontSize: 80,
            fontSpace: 10
          },
          titleFont:{
            "fontText": "示例抬头文字",// 文本
            "bold": false, // 字体是否加粗
            "fontFamily": "仿宋",// 字体
            "fontSize": 22, // 字体大小
            "fontSpace": 2, // 字与字之间的距离
            "lineDistance": 5 // 文字与边线之间的距离
          },
          borderCircle:{
            width: 120, // 边线 X 轴的半径，需小于印章大小的一半。
            height: 90, // 边线 Y 轴的半径，需小于印章大小的一半。
            lineSize: 3, // 线条宽度
          },
        },
        'seal-ellipse-style2': {
          centerFont:{
            style: 3, 
            fontText: '1234567890C1234', 
            bold: false,
            fontFamily: '仿宋',
            fontSize: 20,
            fontSpace: 10
          },
          titleFont:{
            "fontText": "发货专用",// 文本
            "bold": true, // 字体是否加粗
            "fontFamily": "仿宋",// 字体
            "fontSize": 22, // 字体大小
            "fontSpace": 2, // 字与字之间的距离
            "lineDistance": 5 // 文字与边线之间的距离
          },
          borderCircle:{
            width: 120, // 边线 X 轴的半径，需小于印章大小的一半。
            height: 90, // 边线 Y 轴的半径，需小于印章大小的一半。
            lineSize: 3, // 线条宽度
          },
        },
        'seal-square-style1': {
          borderCircle:{
            lineSize: 3, // 线条宽度
          },
        },
        'seal-square-style2': {
          borderCircle:{
            lineSize: 3, // 线条宽度
          },
        },
        'seal-square-style3': {
          borderCircle:{
            lineSize: 3, // 线条宽度
          },
        },
        'seal-square-style4': {
          borderCircle:{
            lineSize: 3, // 线条宽度
          },
        },
        'seal-square-style5': {
          borderCircle:{
            lineSize: 3, // 线条宽度
            lineDistance: 15, // 线条到印章边缘的距离
          },
        },
        'seal-square-style6': {
          viceFont:{
            fontText: '123456789C0123', // 文本
            bold: true, // 字体是否加粗
            fontFamily: '仿宋', // 字体
            fontSize: 15, // 字体大小
            fontSpace: 2, // 字与字之间的距离
            lineDistance: 12, // 文字与边线之间的距离
          },
          borderCircle:{
            lineSize: 3, // 线条宽度
            lineDistance: 15, // 线条到印章边缘的距离
          },
        },
        'seal-rectangle-style1': {
          borderCircle:{
            lineSize: 3, // 线条宽度
            lineDistance: 15, // 线条到印章边缘的距离
          },
        },
        'seal-rectangle-style2': {
          borderCircle:{
            lineSize: 3, // 线条宽度
            lineDistance: 15, // 线条到印章边缘的距离
          },
        },
        'seal-rhombus-style1': {
          borderCircle:{
            lineSize: 3, // 线条宽度
            width: 60, // 边线 X 轴的半径，需小于印章大小的一半。
            height: 30, // 边线 Y 轴的半径，需小于印章大小的一半。
          },
        },
        'seal-rhombus-style2': {
          borderCircle:{
            lineSize: 3, // 线条宽度
            width: 100, // 边线 X 轴的半径，需小于印章大小的一半。
            height: 50, // 边线 Y 轴的半径，需小于印章大小的一半。
          },
        },
      }

      this.changeStyle('seal-circle-style1');
    },
    // 改变印章大小
    // changeSealSize(){
    //   this.onSubmit()
    // },
    // 切换印章样式
    changeStyle(value){
      this.form = {...this.formDefault, ...this.cfgList[value]};
      
      switch(this.sealStyle){
        case 'seal-circle-style1':
        case 'seal-circle-style2':
        case 'seal-circle-style3':
        case 'seal-circle-style4':
          this.form.mainFont.fontText = "在线示例专用章";
          break;
        case 'seal-ellipse-style1':
          this.form.mainFont.fontText = "在线示例专用章";
          break;
        case 'seal-ellipse-style2':
          this.form.mainFont.fontText = "在线示例专用章";
          break;
        case 'seal-square-style1':
        case 'seal-square-style2':
          this.form.mainFont.fontText = "黎明";
          this.form.mainFont.fontSize = 55;
          break;
        case 'seal-square-style3':
        case 'seal-square-style4':
          this.form.mainFont.fontText = "张学友";
          this.form.mainFont.fontSize = 55;
          break;
        case 'seal-square-style5':
        case 'seal-square-style6':
          this.form.mainFont.fontText = "在线示例\\n有限公司\\n财务专用章";
          this.form.mainFont.fontSize = 43;
          this.form.mainFont.lineDistance = 20;
          break;
        case 'seal-rectangle-style1':
          this.form.sealSize = "180,80";
          this.form.mainFont.fontText = "现金收讫";
          this.form.mainFont.fontSize = 30;
          this.form.mainFont.fontSpace = 2;
          this.form.mainFont.lineDistance = 20;
          break;
        case 'seal-rectangle-style2':
          this.form.sealSize = "250,180";
          this.form.mainFont.fontText = "在线示例\\n有限公司\\n财务专用章";
          this.form.mainFont.fontSize = 30;
          this.form.mainFont.lineDistance = 15;
          break;
        case 'seal-rhombus-style1':
          this.form.mainFont.fontText = "作废";
          this.form.mainFont.fontSize = 25;
          this.form.mainFont.fontSpace = 2;
          break;
        case 'seal-rhombus-style2':
          this.form.mainFont.fontText = "LONCH.NET\\n管制文件";
          this.form.mainFont.fontSize = 20;
          this.form.mainFont.fontSpace = 2;
          this.form.mainFont.lineDistance = 10;
          break;
      }
    },
    // 清除印章
    clearSeal () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    // 绘制印章
    drawSeal(){
      // 长方形印章 需要特殊处理
      if(this.sealStyle === 'seal-rectangle-style1' || this.sealStyle === 'seal-rectangle-style2' ){
        this.canvas.width = this.form.sealSize.split(/[，,]/)[0].trim();
        this.canvas.height = this.form.sealSize.split(/[，,]/)[1].trim();
      }else{
        this.canvas.width = this.form.sealSize;
        this.canvas.height = this.form.sealSize;
      }

      switch(this.sealStyle){
        case 'seal-circle-style1':
        case 'seal-circle-style2':
        case 'seal-circle-style3':
        case 'seal-circle-style4':
          this.drawCircleSeal();
          break;
        case 'seal-ellipse-style1':
          this.drawEllipseSeal1();
          break;
        case 'seal-ellipse-style2':
          this.drawEllipseSeal2();
          break;
        case 'seal-square-style1':
          this.drawSquareSeal1();
          break;
        case 'seal-square-style2':
          this.drawSquareSeal2();
          break;
        case 'seal-square-style3':
          this.drawSquareSeal3();
          break;
        case 'seal-square-style4':
          this.drawSquareSeal4();
          break;
        case 'seal-square-style5':
          this.drawSquareSeal5();
          break;
        case 'seal-square-style6':
          this.drawSquareSeal6();
          break;
        case 'seal-rectangle-style1':
          this.drawRectangleSeal1();
          break;
        case 'seal-rectangle-style2':
          this.drawRectangleSeal2();
          break;
        case 'seal-rhombus-style1':
          this.drawRhombusSeal1();
          break;
        case 'seal-rhombus-style2':
          this.drawRhombusSeal2();
          break;
      }

      // 添加印章老化效果
      let sealOldParameter = this.form.sealOldParameter;
      const noiseColor = { r: 0, g: 0, b: 0, a: 0 }; // 噪点颜色（黑色）
      const wearDensity = 0.1; // 磨损密度（控制磨损的数量和频率）
      const fadeFactor = 0.7; // 褪色因子（0到1之间，越小越褪色）
      if (this.form.sealOldType === 'noise'){
        this.addNoiseWithDirectionAndIntensity(sealOldParameter, noiseColor,wearDensity,fadeFactor);
      }
    },
    // 绘制圆形公章
    drawCircleSeal () {
      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;

      // 设置字体样式
      this.ctx.font = `${this.form.mainFont.bold ? 'bold' : ''} ${this.form.mainFont.fontSize}px ${this.form.mainFont.fontFamily}`;
      this.ctx.fillStyle = this.form.sealColor;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';

      // 绘制边框圆
      this.drawCircle(centerX, centerY, this.form.borderCircle.width, this.form.sealColor);

      // 绘制主文本（沿着圆弧）
      let text = this.form.mainFont.fontText;
      // let radius = this.form.borderCircle.width;
      let fontSpace = this.form.mainFont.fontSpace;
      let lineDistance = this.form.mainFont.lineDistance;
      // 预计算文字宽度
      const textWidths = text.split('').map(char => this.ctx.measureText(char).width);

      // 计算每个字符（包括间距）在圆弧上所占的弧度
      const anglePerChar = 1;

      // 绘制主文字
      this.drawTextAlongArc(this.ctx, centerX, centerY, textWidths, fontSpace, lineDistance, anglePerChar);

      // 绘制副文字
      if( this.form.hasOwnProperty('viceFont') ){
        // 设置副文本字体
        this.ctx.font = `${this.form.viceFont.bold ? 'bold' : ''} ${this.form.viceFont.fontSize}px ${this.form.viceFont.fontFamily}`;
  
        let subText = this.form.viceFont.fontText;
        // let subRadius = this.form.borderCircle.width;
        let subFontSpace = this.form.viceFont.fontSpace;
        let subLineDistance = this.form.viceFont.lineDistance;

        // 预计算文字宽度
        const subTextWidths = subText.split('').map(char => this.ctx.measureText(char).width);
  
        // 绘制副文字
        this.drawSubTextAlongArc(this.ctx, centerX, centerY, subTextWidths, subFontSpace, subLineDistance, anglePerChar);
      }

      // 绘制中心文本
      this.ctx.font = `${this.form.centerFont.bold ? 'bold' : ''} ${this.form.centerFont.fontSize}px ${this.form.centerFont.fontFamily}`;
      // this.centerFontHeight = this.ctx.measureText(this.form.centerFont.fontText).height;
      // console.log('this.centerFontHeight',this.centerFontHeight);
      this.ctx.fillText(this.form.centerFont.fontText, centerX, centerY);

      // 绘制抬头文字
      if( this.form.hasOwnProperty('titleFont') ){
        this.drawTitileFont(this.ctx,this.form.titleFont.fontSpace);
      }
    },
    // 绘制椭圆形公章1
    drawEllipseSeal1 () {
      // 中心
      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;
      // 长短轴半径
      const radiusX = parseInt( this.form.borderCircle.width );
      const radiusY = parseInt( this.form.borderCircle.height );

      // 设置字体样式
      this.ctx.font = `${this.form.mainFont.bold ? 'bold' : ''} ${this.form.mainFont.fontSize}px ${this.form.mainFont.fontFamily}`;
      this.ctx.fillStyle = this.form.sealColor;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';

      // 绘制边框圆
      this.drawEllipse (centerX, centerY, radiusX, radiusY, 0, 0,  2 * Math.PI);

      // 绘制主文本（沿着圆弧）
      let text = this.form.mainFont.fontText;
      // let radius = this.form.borderCircle.width;
      let fontSpace = this.form.mainFont.fontSpace;
      let lineDistance = this.form.mainFont.lineDistance;
      // 预计算文字宽度
      const textWidths = text.split('').map(char => this.ctx.measureText(char).width);

      // 计算每个字符（包括间距）在圆弧上所占的弧度
      const anglePerChar = 1;

      // 绘制主文字
      this.drawTextAlongEllipse(this.ctx, centerX, centerY, textWidths, fontSpace, lineDistance, anglePerChar);

      // 绘制副文字
      if( this.form.hasOwnProperty('viceFont') ){
        // 设置副文本字体
        this.ctx.font = `${this.form.viceFont.bold ? 'bold' : ''} ${this.form.viceFont.fontSize}px ${this.form.viceFont.fontFamily}`;
  
        let subText = this.form.viceFont.fontText;
        // let subRadius = this.form.borderCircle.width;
        let subFontSpace = this.form.viceFont.fontSpace;
        let subLineDistance = this.form.viceFont.lineDistance;

        // 预计算文字宽度
        const subTextWidths = subText.split('').map(char => this.ctx.measureText(char).width);
  
        // 绘制副文字
        this.drawSubTextAlongArc(this.ctx, centerX, centerY, subTextWidths, subFontSpace, subLineDistance, anglePerChar);
      }

      // 绘制中心文本
      this.ctx.font = `${this.form.centerFont.bold ? 'bold' : ''} ${this.form.centerFont.fontSize}px ${this.form.centerFont.fontFamily}`;
      // this.centerFontHeight = this.ctx.measureText(this.form.centerFont.fontText).height;
      // console.log('this.centerFontHeight',this.centerFontHeight);
      this.ctx.fillText(this.form.centerFont.fontText, centerX, centerY);

      // 绘制抬头文字
      if( this.form.hasOwnProperty('titleFont') ){
        this.drawTitileFont(this.ctx,this.form.titleFont.fontSpace);
      }
    },
    // 绘制椭圆形公章2
    drawEllipseSeal2 () {
      // 中心
      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;
      // 长短轴半径
      const radiusX = parseInt( this.form.borderCircle.width );
      const radiusY = parseInt( this.form.borderCircle.height );

      // 设置字体样式
      this.ctx.font = `${this.form.mainFont.bold ? 'bold' : ''} ${this.form.mainFont.fontSize}px ${this.form.mainFont.fontFamily}`;
      this.ctx.fillStyle = this.form.sealColor;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';

      // 绘制边框圆
      this.drawEllipse (centerX, centerY, radiusX, radiusY, 0, 0,  2 * Math.PI);

      // 绘制主文本（沿着圆弧）
      let text = this.form.mainFont.fontText;
      // let radius = this.form.borderCircle.width;
      let fontSpace = this.form.mainFont.fontSpace;
      let lineDistance = this.form.mainFont.lineDistance;
      // 预计算文字宽度
      const textWidths = text.split('').map(char => this.ctx.measureText(char).width);

      // 计算每个字符（包括间距）在圆弧上所占的弧度
      const anglePerChar = 1;

      // 绘制主文字
      this.drawTextAlongEllipse(this.ctx, centerX, centerY, textWidths, fontSpace, lineDistance, anglePerChar);

      // 绘制副文字
      if( this.form.hasOwnProperty('viceFont') ){
        // 设置副文本字体
        this.ctx.font = `${this.form.viceFont.bold ? 'bold' : ''} ${this.form.viceFont.fontSize}px ${this.form.viceFont.fontFamily}`;
  
        let subText = this.form.viceFont.fontText;
        // let subRadius = this.form.borderCircle.width;
        let subFontSpace = this.form.viceFont.fontSpace;
        let subLineDistance = this.form.viceFont.lineDistance;

        // 预计算文字宽度
        const subTextWidths = subText.split('').map(char => this.ctx.measureText(char).width);
  
        // 绘制副文字
        this.drawSubTextAlongArc(this.ctx, centerX, centerY, subTextWidths, subFontSpace, subLineDistance, anglePerChar);
      }

      // 绘制中心文本
      this.ctx.font = `${this.form.centerFont.bold ? 'bold' : ''} ${this.form.centerFont.fontSize}px ${this.form.centerFont.fontFamily}`;
      // this.centerFontHeight = this.ctx.measureText(this.form.centerFont.fontText).height;
      // console.log('this.centerFontHeight',this.centerFontHeight);
      this.ctx.fillText(this.form.centerFont.fontText, centerX, centerY);

      // 绘制抬头文字
      if( this.form.hasOwnProperty('titleFont') ){
        this.drawTitileFont(this.ctx,this.form.titleFont.fontSpace);
      }
    },
    // 绘制边框圆
    drawCircle (x, y, radius, color) {
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
      // this.ctx.fillStyle = color;
      // this.ctx.fill();
      this.ctx.lineWidth = this.form.borderCircle.lineSize;
      this.ctx.strokeStyle = color;
      this.ctx.stroke();
      this.ctx.closePath();
    },
    // 绘制边框椭圆
    drawEllipse (x, y, radiusX, radiusY, rotation, startAngle, endAngle) {
      this.ctx.beginPath();
      this.ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, false);
      this.ctx.closePath();

      this.ctx.lineWidth = this.form.borderCircle.lineSize;
      this.ctx.strokeStyle = this.form.sealColor;
      this.ctx.stroke();
    },
    // 绘制主文本
    drawTextAlongArc (ctx, centerX, centerY, textWidths, textSpacing,lineDistance, anglePerChar) {
      let radius = this.form.borderCircle.width;
      let text = this.form.mainFont.fontText;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      textSpacing = parseInt(textSpacing);
      lineDistance = parseInt(lineDistance);

      const textLength = text.length;
      const midIndex = Math.floor(textLength / 2);
      let startAngle ;
      if(text.length % 2 === 0){
        startAngle = 1.5 * Math.PI * (radius-lineDistance-textWidths[0]/2) - midIndex * (textWidths[0] + textSpacing) + 0.5 * (textWidths[0] + textSpacing); // 从圆弧左侧开始
      }else{
        startAngle = 1.5 * Math.PI * (radius-lineDistance-textWidths[0]/2) - midIndex * (textWidths[0] + textSpacing) ; // 从圆弧左侧开始

      }

      // 绘制文字
      for (let i = 0; i < textLength; i++) {
        const charWidth = textWidths[i];
        const charAngle = (startAngle + (i * (charWidth + textSpacing)) * anglePerChar)/(radius-lineDistance-charWidth/2);
        // console.log('charAngle',charAngle);
        const charX = centerX + (radius-lineDistance-charWidth/2) * Math.cos(charAngle);
        const charY = centerY + (radius-lineDistance-charWidth/2) * Math.sin(charAngle);
        ctx.save();
        ctx.translate(charX, charY);
        ctx.rotate(charAngle + Math.PI / 2);
        ctx.fillText(text[i], 0, 0);
        ctx.restore();
      }
    },
    // 绘制椭圆主文本
    drawTextAlongEllipse (ctx, centerX, centerY, textWidths, textSpacing,lineDistance, anglePerChar) {
      let text = this.form.mainFont.fontText;
      // 长短轴半径
      const radiusX = parseInt( this.form.borderCircle.width );
      const radiusY = parseInt( this.form.borderCircle.height );

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      textSpacing = parseInt(textSpacing);
      lineDistance = parseInt(lineDistance);

      const textLength = text.length;
      const midIndex = Math.floor(textLength / 2);
      let startAngle ;
      if(text.length % 2 === 0){
        startAngle = 1.5 * Math.PI * (radiusX-lineDistance-textWidths[0]/2) - midIndex * (textWidths[0] + textSpacing) + 0.5 * (textWidths[0] + textSpacing); // 从圆弧左侧开始
      }else{
        startAngle = 1.5 * Math.PI * (radiusX-lineDistance-textWidths[0]/2) - midIndex * (textWidths[0] + textSpacing) ; // 从圆弧左侧开始

      }

      // 绘制文字
      for (let i = 0; i < textLength; i++) {
        const charWidth = textWidths[i];
        const charAngle = (startAngle + (i * (charWidth + textSpacing)) * anglePerChar)/(radiusX-lineDistance-charWidth/2);
        // console.log('charAngle',charAngle);
        // const charX = centerX + (radiusY+(radiusX-radiusY)*Math.abs(charAngle-1.5*Math.PI)/(0.5*Math.PI)-lineDistance-charWidth/2) * Math.cos(charAngle);
        const charX = centerX + (radiusX-lineDistance-charWidth/2) * Math.cos(charAngle);
        const charY = centerY + (radiusY-lineDistance-charWidth/2) * Math.sin(charAngle);
        ctx.save();
        ctx.translate(charX, charY);
        ctx.rotate(charAngle + Math.PI / 2);
        ctx.fillText(text[i], 0, 0);
        ctx.restore();
      }
    },
    // 绘制副文本
    drawSubTextAlongArc (ctx, centerX, centerY, textWidths, textSpacing,lineDistance, anglePerChar) {
      let text = this.form.viceFont.fontText;
      let radius = this.form.borderCircle.width;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      textSpacing = parseInt(textSpacing);
      lineDistance = parseInt(lineDistance);

      const textLength = text.length;
      const midIndex = Math.floor(textLength / 2);
      let startAngle ;
      if(text.length % 2 === 0){
        startAngle = 0.5 * Math.PI * (radius-lineDistance-textWidths[0]/2) - midIndex * (textWidths[0] + textSpacing) + 0.5 * (textWidths[0] + textSpacing); // 从圆弧左侧开始
      }else{
        startAngle = 0.5 * Math.PI * (radius-lineDistance-textWidths[0]/2) - midIndex * (textWidths[0] + textSpacing) ; // 从圆弧左侧开始
      }

      // 绘制文字
      for (let i = textLength - 1; i >= 0; i--) {
        console.log(text[i]);
        const charWidth = textWidths[i];
        const charAngle = (startAngle + (i * (charWidth + textSpacing)) * anglePerChar)/(radius-lineDistance-charWidth/2);
        const charX = centerX + (radius-lineDistance-charWidth/2) * Math.cos(charAngle);
        const charY = centerY + (radius-lineDistance-charWidth/2) * Math.sin(charAngle);
        ctx.save();
        ctx.translate(charX, charY);
        ctx.rotate(charAngle + Math.PI * 1.5);
        ctx.fillText(text[textLength-1-i], 0, 0);
        ctx.restore();
      }
    },
    // 绘制抬头文字
    drawTitileFont(ctx,textSpacing){
      // const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;

      textSpacing = parseInt(textSpacing);

      // 抬头文字的设置
      ctx.font = `${this.form.titleFont.bold ? 'bold' : ''} ${this.form.titleFont.fontSize}px ${this.form.titleFont.fontFamily}`;;
      ctx.fillStyle = this.form.sealColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top'; // 设置文本基线为顶部，便于计算位置

      // 计算抬头文字的位置
      // const textWidth = ctx.measureText(titleText).width;
      const titleText = this.form.titleFont.fontText;
      let textX ; // 水平居中
      let textY = centerY + this.form.centerFont.fontSize / 2 + parseInt(this.form.titleFont.lineDistance); // 位于中心文字下方，且留出一定的间距

      // 绘制抬头文字(无法指定字符间距)
      // ctx.fillText(titleText, textX, textY);

      // 绘制抬头文字
      // console.log(this.canvas.width);
      // console.log(ctx.measureText(titleText).width);
      let ttWidth = ctx.measureText(titleText[0]).width;
      let nSpace = Math.floor(titleText.length/2);
      if(titleText.length % 2 !== 0){
        textX = this.canvas.width / 2 - ttWidth * nSpace - textSpacing * nSpace ;
      }else{
        textX = this.canvas.width / 2 - ttWidth * nSpace - textSpacing * nSpace + ttWidth / 2 + textSpacing / 2;
      }
      let totalWidth = 0;
      for (let i = 0; i < titleText.length; i++) {
        // console.log(totalWidth);
        // console.log(ctx.measureText(titleText[i]).width,textSpacing);
        ctx.fillText(titleText[i], textX + totalWidth, textY);
        totalWidth += ctx.measureText(titleText[i]).width + textSpacing;
      }
    },
    // 添加噪点 
    addNoiseWithDirectionAndIntensity(sealOldParameter, noiseColor,wearDensity,fadeFactor) {
        const ctx = this.canvas.getContext('2d');
        const width = this.canvas.width;
        const height = this.canvas.height;
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        let { sealNoiseDirection, start, end } = sealOldParameter;

        // 根据噪点方向设置遍历像素的方式
        const directions = {
          // 全局
          'noise1': () => {
            // 全局随机分布，不需要特殊处理
            for (let i = 0; i < data.length; i += 4) {
              // ...（后续代码与全局分布相同）
              addNoiseAtPixel(i,0,0)
            }
            addWear()
          },
          // 从上到下
          'noise2': () => {
            for (let y = 0; y < height; y++) {
              for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                // ...（根据y计算强度并添加噪点）
                addNoiseAtPixel(i,x,y)
              }
            }
          },
          // 从下到上
          'noise3': () => {
            for (let y = height - 1; y >= 0; y--) {
              for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                // ...（根据y计算强度并添加噪点）
                addNoiseAtPixel(i,x,height-y-1)
              }
            }
          },
          // 从左到右
          'noise4': () => {
              for (let y = 0; y < height; y++) {
                  for (let x = 0; x < width; x++) {
                      const i = (y * width + x) * 4;
                      addNoiseAtPixel(i, x, y);
                  }
              }
          },
          // 从右到左
          'noise5': () => {
              for (let y = 0; y < height; y++) {
                  for (let x = width - 1; x >= 0; x--) {
                      const i = (y * width + x) * 4;
                      addNoiseAtPixel(i, width-x-1, y);
                  }
              }
          },
          // 从中心到边缘
          'noise6': () => {
              const centerX = width / 2;
              const centerY = height / 2;
              const maxDistance = Math.max(centerX, centerY);

              for (let distance = 2; distance <= maxDistance; distance+=1) {
                  for (let angle = 0; angle < 2 * Math.PI; angle += 0.01) {
                      const x = centerX + Math.cos(angle) * distance;
                      const y = centerY + Math.sin(angle) * distance;

                      if (x >= 0 && x < width && y >= 0 && y < height) {
                          // const i = (Math.floor(y) * width + Math.floor(x)) * 4;
                          const i = Math.floor(y * width + x) * 4;
                          addNoiseAtPixel(i, x, y);
                      }
                  }
              }
          },
          // 从边缘到中心
          'noise7': () => {
              const centerX = width / 2;
              const centerY = height / 2;
              const maxDistance = Math.max(centerX, centerY);

              for (let distance = maxDistance; distance > 0; distance--) {
                  for (let angle = 0; angle < 2 * Math.PI; angle += 0.01) {
                      const x = centerX + Math.cos(angle) * distance;
                      const y = centerY + Math.sin(angle) * distance;

                      if (x >= 0 && x < width && y >= 0 && y < height) {
                          const i = (Math.floor(y) * width + Math.floor(x)) * 4;
                          addNoiseAtPixel(i, x, y);
                      }
                  }
              }
          }
        };

        // 检查方向是否有效，并调用相应的函数
        if (directions[sealNoiseDirection]) {
            directions[sealNoiseDirection]();
        } else {
            console.error('无效的噪点方向');
        }

        // 计算强度并添加噪点的通用逻辑
        function addNoiseAtPixel(i, x, y) {
            // console.log('i',i);

            // 将字符串形式的start转为数值
            start = parseInt(start);
            end = parseInt(end);

            if (data[i + 3] > 0) { // 检查透明度
                const intensityRange = end - start;

                let intensity = 0;
                // 根据方向计算强度 
                // 从上到下/从下到上
                if(sealNoiseDirection === 'noise2' || sealNoiseDirection === 'noise3'){
                  intensity = start + (y / (height - 1)) * intensityRange;
                }
                // 从左到右/从右到左
                else if(sealNoiseDirection === 'noise4' || sealNoiseDirection === 'noise5'){
                  intensity = start + (x / (width - 1)) * intensityRange;
                }
                // 从中心到边缘/从边缘到中心
                else if(sealNoiseDirection === 'noise6' || sealNoiseDirection === 'noise7'){
                  const centerX = width / 2;
                  const centerY = height / 2;
                  const distanceFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
                  const maxDistanceFromCenter = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));
                  
                  // console.log('start',start);
                  intensity = start + (distanceFromCenter / maxDistanceFromCenter) * intensityRange;
                  // intensity = (distanceFromCenter / maxDistanceFromCenter) * intensityRange;
                  // console.log(distanceFromCenter,maxDistanceFromCenter);
                  // console.log(sealNoiseDirection,'intensity',intensity);
                  if (sealNoiseDirection === 'noise7') {
                      // console.log('noise7');
                      intensity = end - intensity; // 反向强度
                  }
                  // console.log('(intensity / end)',i,distanceFromCenter,maxDistanceFromCenter,intensity,intensityRange,(intensity / end));
                }
                if (Math.random() < (intensity / end)) {
                    // data[i] = noiseColor.r;
                    // data[i + 1] = noiseColor.g;
                    // data[i + 2] = noiseColor.b;
                    // data[i + 3] = noiseColor.a;
                    let r = Math.random();
                    data[i] = Math.max(0, data[i] * r);
                    data[i + 1] = Math.max(0, data[i + 1] * r);
                    data[i + 2] = Math.max(0, data[i + 2] * r);
                    data[i + 3] = r;
                }
            }
        }
        // 磨损效果：随机在印章上添加一些“磨损”
        function addWear() {
            // 定义磨损的形状和大小
            const wearSize = 5; // 磨损区域的大小
            for (let i = 0; i < data.length; i += 4 * wearSize * wearSize) {
                // 随机选择一个点作为磨损的中心
                const x = Math.floor(Math.random() * width);
                const y = Math.floor(Math.random() * height);
                const index = (y * width + x) * 4;

                // 检查该点是否在印章内（即Alpha值大于0）
                if (data[index + 3] > 0) {
                    // 在该点周围创建一个磨损区域
                    for (let dx = -wearSize; dx <= wearSize; dx++) {
                        for (let dy = -wearSize; dy <= wearSize; dy++) {
                            const nx = x + dx;
                            const ny = y + dy;
                            // 确保坐标在画布范围内
                            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                                const nIndex = (ny * width + nx) * 4;
                                // 以一定的概率使像素变为透明或接近背景的颜色
                                if (Math.random() < wearDensity) {
                                    data[nIndex + 3] = 0; // 设置为完全透明
                                    // 可选：也可以改变颜色来模拟不同的磨损效果
                                    // data[nIndex] = ...;
                                    // data[nIndex + 1] = ...;
                                    // data[nIndex + 2] = ...;
                                }
                            }
                        }
                    }
                }
            }
        }

        // 在每个方向的实现中调用addNoiseAtPixel函数来添加噪点

        // 将修改后的图像数据放回画布
        ctx.putImageData(imageData, 0, 0);
    },
    // 绘制正方形人名章(两字)
    drawSquareSeal1 () {
      // 印章的大小
      const stampSize = this.canvas.width/2;

      // 设置字体和字号（可以根据需要调整）
      this.ctx.font = `${this.form.mainFont.bold ? 'bold' : ''} ${this.form.mainFont.fontSize}px ${this.form.mainFont.fontFamily}`;

      // 设置文本对齐方式为居中和垂直居中
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';

      // let fontSize = this.form.mainFont.fontSize;

      // 调整字体大小以适配印章高度
      // let adjustFontSize = () => {
      //   // 设置当前字体大小
      //   this.ctx.font = `${fontSize}px ${this.form.mainFont.fontFamily}`;
        
      //   // 测量文本宽度
      //   const textWidth = this.ctx.measureText(this.form.mainFont.fontText).width;

      //   // 检查文本高度是否适合印章高度
      //   if (textWidth < stampSize) {
      //     // 如果文本高度小于印章高度，则增加字体大小
      //     fontSize += 1;
      //     // 递归调用以继续调整
      //     adjustFontSize();
      //   } 
        // else if (textWidth > stampSize) {
        //   // 如果文本高度大于印章高度，则减小字体大小（这里可能需要更精细的调整）
        //   fontSize -= 1;
        //   // 由于减小后可能需要再次检查，因此也使用递归
        //   adjustFontSize();
        // }
        // 如果文本高度恰好等于或非常接近印章高度，则递归将自然停止
      // }

      // 调整字体大小以适应印章
      // adjustFontSize();
      
      // 测量人名的宽度
      // const textWidth = this.ctx.measureText(this.form.mainFont.fontText).width;

      // 计算印章和文本的位置
      const stampX = (this.canvas.width - stampSize) / 2;
      const stampY = (this.canvas.height - stampSize) / 2;
      const textX = stampX + stampSize / 2;
      const textY = stampY + stampSize / 2;

      // 绘制印章的边框（红色边框，线宽为2）
      this.ctx.strokeStyle = this.form.sealColor;
      this.ctx.lineWidth = this.form.borderCircle.lineSize;
      this.ctx.beginPath();
      this.ctx.rect(stampX, stampY, stampSize, stampSize);
      this.ctx.stroke();

      // 绘制人名文本（黑色文本）
      this.ctx.fillStyle = this.form.sealColor;
      this.ctx.fillText(this.form.mainFont.fontText, textX, textY);
    },
    // 绘制正方形人名章(两字)
    drawSquareSeal2 () {
      // 印章的大小
      const stampSize = this.canvas.width/2;

      // 设置字体和字号（可以根据需要调整）
      this.ctx.font = `${this.form.mainFont.bold ? 'bold' : ''} ${this.form.mainFont.fontSize}px ${this.form.mainFont.fontFamily}`;

      // 设置文本对齐方式为居中和垂直居中
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';

      // 计算印章和文本的位置
      const stampX = (this.canvas.width - stampSize) / 2;
      const stampY = (this.canvas.height - stampSize) / 2;
      const textX1 = stampX + stampSize * 3 / 4;
      const textY1 = stampY + stampSize / 4;
      const textX2 = stampX + stampSize * 3 / 4;
      const textY2 = stampY + stampSize * 3 / 4;
      const textX3 = stampX + stampSize / 4;
      const textY3 = stampY + stampSize / 2;

      // 绘制印章的边框（红色边框，线宽为2）
      this.ctx.strokeStyle = this.form.sealColor;
      this.ctx.lineWidth = this.form.borderCircle.lineSize;
      this.ctx.beginPath();
      this.ctx.rect(stampX, stampY, stampSize, stampSize);
      this.ctx.stroke();

      // 绘制人名文本（黑色文本）
      this.ctx.fillStyle = this.form.sealColor;
      this.ctx.fillText(this.form.mainFont.fontText[0] || '', textX1, textY1);
      this.ctx.fillText(this.form.mainFont.fontText[1] || '', textX2, textY2);
      this.ctx.fillText('印', textX3, textY3);
    },
    // 绘制正方形人名章(三字)
    drawSquareSeal3 () {
      // 印章的大小
      const stampSize = this.canvas.width/2;

      // 设置字体和字号（可以根据需要调整）
      this.ctx.font = `${this.form.mainFont.bold ? 'bold' : ''} ${this.form.mainFont.fontSize}px ${this.form.mainFont.fontFamily}`;

      // 设置文本对齐方式为居中和垂直居中
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';

      // 计算印章和文本的位置
      const stampX = (this.canvas.width - stampSize) / 2;
      const stampY = (this.canvas.height - stampSize) / 2;
      const textX1 = stampX + stampSize * 3 / 4;
      const textY1 = stampY + stampSize / 4;
      const textX2 = stampX + stampSize * 3 / 4;
      const textY2 = stampY + stampSize * 3 / 4;
      const textX3 = stampX + stampSize / 4;
      const textY3 = stampY + stampSize / 2;

      // 绘制印章的边框（红色边框，线宽为2）
      this.ctx.strokeStyle = this.form.sealColor;
      this.ctx.lineWidth = this.form.borderCircle.lineSize;
      this.ctx.beginPath();
      this.ctx.rect(stampX, stampY, stampSize, stampSize);
      this.ctx.stroke();

      // 绘制人名文本（黑色文本）
      this.ctx.fillStyle = this.form.sealColor;
      this.ctx.fillText(this.form.mainFont.fontText[0] || '', textX1, textY1);
      this.ctx.fillText(this.form.mainFont.fontText[1] || '', textX2, textY2);
      this.ctx.fillText(this.form.mainFont.fontText[2] || '', textX3, textY3);
    },
    // 绘制正方形人名章(三字)
    drawSquareSeal4 () {
      // 印章的大小
      const stampSize = this.canvas.width/2;

      // 设置字体和字号（可以根据需要调整）
      this.ctx.font = `${this.form.mainFont.bold ? 'bold' : ''} ${this.form.mainFont.fontSize}px ${this.form.mainFont.fontFamily}`;

      // 设置文本对齐方式为居中和垂直居中
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';

      // 计算印章和文本的位置
      const stampX = (this.canvas.width - stampSize) / 2;
      const stampY = (this.canvas.height - stampSize) / 2;
      const textX1 = stampX + stampSize * 3 / 4;
      const textY1 = stampY + stampSize / 4;
      const textX2 = stampX + stampSize * 3 / 4;
      const textY2 = stampY + stampSize * 3 / 4;
      const textX3 = stampX + stampSize / 4;
      const textY3 = stampY + stampSize / 4;
      const textX4 = stampX + stampSize / 4;
      const textY4 = stampY + stampSize * 3 / 4;

      // 绘制印章的边框（红色边框，线宽为2）
      this.ctx.strokeStyle = this.form.sealColor;
      this.ctx.lineWidth = this.form.borderCircle.lineSize;
      this.ctx.beginPath();
      this.ctx.rect(stampX, stampY, stampSize, stampSize);
      this.ctx.stroke();

      // 绘制人名文本（黑色文本）
      this.ctx.fillStyle = this.form.sealColor;
      this.ctx.fillText(this.form.mainFont.fontText[0] || '', textX1, textY1);
      this.ctx.fillText(this.form.mainFont.fontText[1] || '', textX2, textY2);
      this.ctx.fillText(this.form.mainFont.fontText[2] || '', textX3, textY3);
      this.ctx.fillText('印', textX4, textY4);
    },
    // 绘制正方形公章
    drawSquareSeal5 () {
      // 印章的大小
      const stampSize = this.canvas.width - 2 * this.form.borderCircle.lineDistance;

      // 设置字体和字号（可以根据需要调整）
      this.ctx.font = `${this.form.mainFont.bold ? 'bold' : ''} ${this.form.mainFont.fontSize}px ${this.form.mainFont.fontFamily}`;

      // 设置文本对齐方式为居中和垂直居中
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';

      // 计算印章和文本的位置
      const stampX = (this.canvas.width - stampSize) / 2;
      const stampY = (this.canvas.height - stampSize) / 2;
      let textArr = this.form.mainFont.fontText.split('\\n');
      
      const textX = this.canvas.width / 2;
      let textY = 0;
      let vSpace = (stampSize - textArr.length * this.form.mainFont.fontSize - 2 * this.form.mainFont.lineDistance) / (textArr.length - 1);
      
      vSpace = vSpace <= 0 ? 0 : vSpace;

      console.log('vSpace', vSpace);

      textArr.forEach((text,index)=>{
        if(index === 0){
          textY = parseInt(this.form.borderCircle.lineDistance) + parseInt(this.form.mainFont.lineDistance) + this.form.mainFont.fontSize / 2;
        }else{
          textY = parseInt(this.form.borderCircle.lineDistance) + parseInt(this.form.mainFont.lineDistance) + this.form.mainFont.fontSize / 2 + index * (parseInt(this.form.mainFont.fontSize) + vSpace);
        }
        this.ctx.fillStyle = this.form.sealColor;
        this.ctx.fillText(text || '', textX, textY);
      })

      // 绘制印章的边框（红色边框，线宽为2）
      this.ctx.strokeStyle = this.form.sealColor;
      this.ctx.lineWidth = this.form.borderCircle.lineSize;
      this.ctx.beginPath();
      this.ctx.rect(stampX, stampY, stampSize, stampSize);
      this.ctx.stroke();
    },
    // 绘制正方形公章
    drawSquareSeal6 () {
      // 印章的大小
      const stampSize = this.canvas.width - 2 * this.form.borderCircle.lineDistance;

      // 设置字体和字号（可以根据需要调整）
      this.ctx.font = `${this.form.mainFont.bold ? 'bold' : ''} ${this.form.mainFont.fontSize}px ${this.form.mainFont.fontFamily}`;

      // 设置文本对齐方式为居中和垂直居中
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';

      // 计算印章和文本的位置
      const stampX = (this.canvas.width - stampSize) / 2;
      const stampY = (this.canvas.height - stampSize) / 2;
      let textArr = this.form.mainFont.fontText.split('\\n');
      
      const textX = this.canvas.width / 2;
      let textY = 0;
      let vSpace = (stampSize - textArr.length * this.form.mainFont.fontSize - 3 * this.form.mainFont.lineDistance - this.form.viceFont.fontSize) / (textArr.length - 1);
      
      vSpace = vSpace <= 0 ? 0 : vSpace;

      textArr.forEach((text,index)=>{
        if(index === 0){
          textY = parseInt(this.form.borderCircle.lineDistance) + parseInt(this.form.mainFont.lineDistance) + this.form.mainFont.fontSize / 2;
        }else{
          textY = parseInt(this.form.borderCircle.lineDistance) + parseInt(this.form.mainFont.lineDistance) + this.form.mainFont.fontSize / 2 + index * (parseInt(this.form.mainFont.fontSize) + vSpace);
        }
        this.ctx.fillStyle = this.form.sealColor;
        this.ctx.fillText(text || '', textX, textY);
      })

      // 绘制副文字
      this.drawVoiceFontWithSquare(this.ctx,this.form.viceFont.fontSpace);

      // 绘制印章的边框（红色边框，线宽为2）
      this.ctx.strokeStyle = this.form.sealColor;
      this.ctx.lineWidth = this.form.borderCircle.lineSize;
      this.ctx.beginPath();
      this.ctx.rect(stampX, stampY, stampSize, stampSize);
      this.ctx.stroke();
    },
    // 绘制正方形公章-副文字
    drawVoiceFontWithSquare(ctx,textSpacing){
      // const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;

      textSpacing = parseInt(textSpacing);

      // 副文字的设置
      ctx.font = `${this.form.viceFont.bold ? 'bold' : ''} ${this.form.viceFont.fontSize}px ${this.form.viceFont.fontFamily}`;;
      ctx.fillStyle = this.form.sealColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom'; // 设置文本基线为底部，便于计算位置

      // 计算副文字的位置
      const titleText = this.form.viceFont.fontText;
      let textX ; // 水平居中
      let textY = 2 * centerY - parseInt(this.form.borderCircle.lineDistance) - parseInt(this.form.viceFont.lineDistance); // 位于边线上方，且留出一定的间距

      // 绘制副文字
      let ttWidth = ctx.measureText(titleText[0]).width;
      let nSpace = Math.floor(titleText.length/2);
      if(titleText.length % 2 !== 0){
        textX = this.canvas.width / 2 - ttWidth * nSpace - textSpacing * nSpace ;
      }else{
        textX = this.canvas.width / 2 - ttWidth * nSpace - textSpacing * nSpace + ttWidth / 2 + textSpacing / 2;
      }
      let totalWidth = 0;
      for (let i = 0; i < titleText.length; i++) {
        ctx.fillText(titleText[i], textX + totalWidth, textY);
        totalWidth += ctx.measureText(titleText[i]).width + textSpacing;
      }
    },
    
    // 绘制长方形公章
    drawRectangleSeal1 () {
      // 印章的大小
      const stampSizeWidth = this.canvas.width - 2 * this.form.borderCircle.lineDistance;
      const stampSizeHeight = this.canvas.height - 2 * this.form.borderCircle.lineDistance;

      // 设置字体和字号（可以根据需要调整）
      this.ctx.font = `${this.form.mainFont.bold ? 'bold' : ''} ${this.form.mainFont.fontSize}px ${this.form.mainFont.fontFamily}`;
      this.ctx.fillStyle = this.form.sealColor;

      // 设置文本对齐方式为居中和垂直居中
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';

      // 计算印章和文本的位置
      const stampX = (this.canvas.width - stampSizeWidth) / 2;
      const stampY = (this.canvas.height - stampSizeHeight) / 2;

      // 计算主文字的位置
      const titleText = this.form.mainFont.fontText;
      let textX ; // 水平居中
      let textY = this.canvas.height / 2; // 垂直居中

      // 绘制主文字
      let ttWidth = this.ctx.measureText(titleText[0]).width;
      let textSpacing = parseInt(this.form.mainFont.fontSpace);
      let nSpace = Math.floor(titleText.length/2);

      if(titleText.length % 2 !== 0){
        textX = this.canvas.width / 2 - ttWidth * nSpace - textSpacing * nSpace ;
      }else{
        textX = this.canvas.width / 2 - ttWidth * nSpace - textSpacing * nSpace + ttWidth / 2 + textSpacing / 2;
      }
      let totalWidth = 0;
      for (let i = 0; i < titleText.length; i++) {
        this.ctx.fillText(titleText[i], textX + totalWidth, textY);
        totalWidth += this.ctx.measureText(titleText[i]).width + textSpacing;
      }

      // 绘制印章的边框（红色边框，线宽为2）
      this.ctx.strokeStyle = this.form.sealColor;
      this.ctx.lineWidth = this.form.borderCircle.lineSize;
      this.ctx.beginPath();
      this.ctx.rect(stampX, stampY, stampSizeWidth, stampSizeHeight);
      this.ctx.stroke();
    },
    // 绘制长方形公章2
    drawRectangleSeal2 () {
      // 印章的大小
      const stampSizeWidth = this.canvas.width - 2 * this.form.borderCircle.lineDistance;
      const stampSizeHeight = this.canvas.height - 2 * this.form.borderCircle.lineDistance;

      // 设置字体和字号（可以根据需要调整）
      this.ctx.font = `${this.form.mainFont.bold ? 'bold' : ''} ${this.form.mainFont.fontSize}px ${this.form.mainFont.fontFamily}`;

      // 设置文本对齐方式为居中和垂直居中
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';

      // 计算印章和文本的位置
      const stampX = (this.canvas.width - stampSizeWidth) / 2;
      const stampY = (this.canvas.height - stampSizeHeight) / 2;
      let textArr = this.form.mainFont.fontText.split('\\n');
      
      const textX = this.canvas.width / 2;
      let textY = 0;
      let vSpace = (stampSizeHeight - textArr.length * this.form.mainFont.fontSize - 2 * this.form.mainFont.lineDistance) / (textArr.length - 1);
      
      vSpace = vSpace <= 0 ? 0 : vSpace;

      console.log('vSpace', vSpace);

      textArr.forEach((text,index)=>{
        if(index === 0){
          textY = parseInt(this.form.borderCircle.lineDistance) + parseInt(this.form.mainFont.lineDistance) + this.form.mainFont.fontSize / 2;
        }else{
          textY = parseInt(this.form.borderCircle.lineDistance) + parseInt(this.form.mainFont.lineDistance) + this.form.mainFont.fontSize / 2 + index * (parseInt(this.form.mainFont.fontSize) + vSpace);
        }
        this.ctx.fillStyle = this.form.sealColor;
        this.ctx.fillText(text || '', textX, textY);
      })

      // 绘制印章的边框（红色边框，线宽为2）
      this.ctx.strokeStyle = this.form.sealColor;
      this.ctx.lineWidth = this.form.borderCircle.lineSize;
      this.ctx.beginPath();
      this.ctx.rect(stampX, stampY, stampSizeWidth, stampSizeHeight);
      this.ctx.stroke();
    },
    // 绘制菱形公章
    drawRhombusSeal1 () {
      // 菱形的中心坐标
      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;

      // 菱形的水平对角线长度的一半（即菱形的一个顶点到中心的距离）
      const halfDiagonalH = parseInt(this.form.borderCircle.width);
      const halfDiagonalV = parseInt(this.form.borderCircle.height);

      // 计算菱形的四个顶点坐标
      const top = centerY - halfDiagonalV;
      const bottom = centerY + halfDiagonalV;
      const left = centerX - halfDiagonalH;
      const right = centerX + halfDiagonalH;

      // 菱形的四个顶点
      const vertices = [
        { x: centerX, y: top },
        { x: right, y: centerY },
        { x: centerX, y: bottom },
        { x: left, y: centerY }
      ];

      // 开始绘制路径
      this.ctx.beginPath();
      this.ctx.moveTo(vertices[0].x, vertices[0].y);
      for (let i = 1; i < vertices.length; i++) {
        this.ctx.lineTo(vertices[i].x, vertices[i].y);
      }
      this.ctx.closePath(); // 闭合路径，回到起点

      // 设置字体和字号（可以根据需要调整）
      this.ctx.font = `${this.form.mainFont.bold ? 'bold' : ''} ${this.form.mainFont.fontSize}px ${this.form.mainFont.fontFamily}`;
      this.ctx.fillStyle = this.form.sealColor;

      // 设置文本对齐方式为居中和垂直居中
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';

      // 绘制印章的边框（红色边框，线宽为2）
      this.ctx.strokeStyle = this.form.sealColor;
      this.ctx.lineWidth = this.form.borderCircle.lineSize;
      this.ctx.stroke();

      // 计算主文字的位置
      const titleText = this.form.mainFont.fontText;
      let textX ; // 水平居中
      let textY = this.canvas.height / 2; // 垂直居中

      // 绘制主文字
      let ttWidth = this.ctx.measureText(titleText[0]).width;
      let textSpacing = parseInt(this.form.mainFont.fontSpace);
      let nSpace = Math.floor(titleText.length/2);

      if(titleText.length % 2 !== 0){
        textX = this.canvas.width / 2 - ttWidth * nSpace - textSpacing * nSpace ;
      }else{
        textX = this.canvas.width / 2 - ttWidth * nSpace - textSpacing * nSpace + ttWidth / 2 + textSpacing / 2;
      }
      let totalWidth = 0;
      for (let i = 0; i < titleText.length; i++) {
        this.ctx.fillText(titleText[i], textX + totalWidth, textY);
        totalWidth += this.ctx.measureText(titleText[i]).width + textSpacing;
      }
    },
    // 绘制菱形公章
    drawRhombusSeal2 () {
      // 菱形的中心坐标
      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;

      // 菱形的水平对角线长度的一半（即菱形的一个顶点到中心的距离）
      const halfDiagonalH = parseInt(this.form.borderCircle.width);
      const halfDiagonalV = parseInt(this.form.borderCircle.height);

      // 计算菱形的四个顶点坐标
      const top = centerY - halfDiagonalV;
      const bottom = centerY + halfDiagonalV;
      const left = centerX - halfDiagonalH;
      const right = centerX + halfDiagonalH;

      // 菱形的四个顶点
      const vertices = [
        { x: centerX, y: top },
        { x: right, y: centerY },
        { x: centerX, y: bottom },
        { x: left, y: centerY }
      ];

      // 开始绘制路径
      this.ctx.beginPath();
      this.ctx.moveTo(vertices[0].x, vertices[0].y);
      for (let i = 1; i < vertices.length; i++) {
        this.ctx.lineTo(vertices[i].x, vertices[i].y);
      }
      this.ctx.closePath(); // 闭合路径，回到起点

      // 设置字体和字号（可以根据需要调整）
      this.ctx.font = `${this.form.mainFont.bold ? 'bold' : ''} ${this.form.mainFont.fontSize}px ${this.form.mainFont.fontFamily}`;
      this.ctx.fillStyle = this.form.sealColor;

      // 设置文本对齐方式为居中和垂直居中
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';

      // 绘制印章的边框（红色边框，线宽为2）
      this.ctx.strokeStyle = this.form.sealColor;
      this.ctx.lineWidth = this.form.borderCircle.lineSize;
      this.ctx.stroke();

      // 绘制文本
      let textArr = this.form.mainFont.fontText.split('\\n');
      
      const textX = this.canvas.width / 2;
      let textY = 0;
      let vSpace = parseInt(this.form.mainFont.lineDistance);

      let ttHeight = parseInt(this.form.mainFont.fontSize);
      // let textSpacing = parseInt(this.form.mainFont.fontSpace);
      let nSpace = Math.floor(textArr.length/2);

      if(textArr.length % 2 !== 0){
        textY = this.canvas.width / 2 - ttHeight * nSpace - vSpace * nSpace ;
      }else{
        textY = this.canvas.width / 2 - ttHeight * nSpace - vSpace * nSpace + ttHeight / 2 + vSpace / 2;
      }

      textArr.forEach((text,index)=>{
        textY += index * (ttHeight + vSpace);
        this.ctx.fillStyle = this.form.sealColor;
        this.ctx.fillText(text || '', textX, textY);
      })

    },
    // 下载图片
    downloadImage () {
      // 创建一个下载链接
      const link = document.createElement('a');
      link.href = this.canvas.toDataURL('image/png'); // 可以是 'image/png' 或 'image/jpeg'
      link.download = 'sealCanvasImage.png'; // 设置下载文件的名称

      // 触发下载
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    // 使用当前印章
    useSeal () {
      let pngBase64 = this.canvas.toDataURL('image/png');
      this.sealConfig.okFn(pngBase64);
      this.sealConfig.show = false;
    }
  }
}
</script>

<style scoped lang="scss">
.custom-input {
  width: 300px;
}
.seal-title{
  padding-bottom: 15px;
}
.el-tabs--border-card{
  width: 100%;
}
.fl{
  float: left;
}
.desc{
  padding-left: 5px;
}
.flex-box{
  display: flex;
}
.tips{
  color: #999;
  padding-left: 10px;
}
.btn-group{
  margin-top: 10px;
}
.m0{
  margin: 0;
}
.el-form-item{
  padding: 8px 0;
}
::v-deep .btn-group .el-form-item__content{
  margin-left: 0px !important;
  
}
</style>
