<template>
  <div class="calculation-formula-mask">
    <div class="flex flex-items-center calculation-formula-content">
      <div class="calculation-formula-content-top">
        <div class="flex flex-items-center pl20">
          <img
            alt=""
            class="calculation-formula-icon"
            src="https://resources.lonch.com.cn/ybd/image/20241205-task-progress-icon1.png"
          />
          <div class="ml10 b fs-l">单据{{flowObj.formId}}流程进展</div>
        </div>
      </div>
      <div class="calculation-formula-content-box" ref="containerBox"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
      >
        <div id="container" ref="container"></div>
      </div>
      <div class="calculation-formula-content-bottom flex flex-content-center">
        <el-button type="primary" @click="closeFlow">
          我知道了
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Graph } from '@antv/x6';
export default {
  props: ['flowObj'],
  components: {
  },
  data() {
    return {
      graph: null,
      /**
       * 节点默认属性数据
       */
       portsData: {
        groups: {
          top: {
            position: 'top',
            attrs: {
              circle: {
                magnet: true,
                stroke: 'black',
                r: 4
              },
            },
          },
          bottom: {
            position: 'bottom',
            attrs: {
              circle: {
                magnet: true,
                stroke: 'black',
                r: 4,
              },
            },
          },
          left: {
            position: 'left',
            attrs: {
              circle: {
                magnet: true,
                stroke: 'black',
                r: 4,
              },
            },
          },
          right: {
            position: 'right',
            attrs: {
              circle: {
                magnet: true,
                stroke: 'black',
                r: 4,
              },
            },
          },
        },
        items: [
          {
            id: 'port_1',
            group: 'bottom',
          },{
            id: 'port_2',
            group: 'top',
          },{
            id: 'port_3',
            group: 'left',
          },{
            id: 'port_4',
            group: 'right',
          }
        ]
      },
      scale: 1, // 初始缩放比例
      lastDistance: 0, // 初始缩放比例
      startDistance: 0, // 两个手指的初始距离
      isZooming: false, // 是否正在缩放
      lastTouchX: 0, // 上次触摸的 X 坐标
      lastTouchY: 0, // 上次触摸的 Y 坐标
      delta: {
        x: 0,
        y: 0
      },
      isDragging: false, // 是否正在拖动
    };
  },
  watch: {
    // 缩放
    scale: {
      deep: true,
      handler: function(val) {
        if(val === 1) {
          return;
        }
        this.scaleX6();
      }
    },
    // 移动
    delta: {
      deep: true,
      handler: function() {
        this.moveX6();
      }
    }
  },
  methods: {
    scaleX6() {
      const oldScale = this.graph.scale().sx;
      this.graph.scale(oldScale * this.scale);
      this.scale = 1;
    },
    moveX6() {
      this.graph.translateBy(this.delta.x, this.delta.y);
    },
    test() {
      console.log(this.graph.scale())
    },
    /**
     *获取数据
     */
    getData(data) {
      let service = { module: 'conductor', url: '/taskFlowInstance/viewByFormId', method: 'POST', comment: '' };
      this.API.send(
        service,
        data,
        function (res) {
          if (res.opFlag) {
            res = { ...res.serviceResult };
            this.graphData = res.graph || {};
            let obj = {
              edges: [],
              nodes: []
            };
            /**
             * 判断是否有节点
             */
            if (this.graphData.cells && this.graphData.cells.length) {
              this.graphData.cells.forEach((item, index) => {
                item.zIndex = index + 1;

                item.attrs = item.attrs ? item.attrs : {};
                /**
                 * attrs 设置节点样式
                 * fill背景颜色
                 * 4异常 5超时为红色 dbc5c5
                 * 3成功为绿色 b4edb8  2ed771(与开始颜色一样)
                 * 1未执行为灰色 cfdfdd
                 * 2执行中为黄色 E6A23C
                 */
                /**
                 * 椭圆和方框设置填充颜色
                 */
                if (
                  item.shape === 'custom-nodeTuo' ||
                  item.shape === 'custom-taskNode'
                ) {
                  /**
                   * 可以根据数据状态判断 进行颜色设置
                   * status 1未执行 2执行中 3成功 4异常 5超时
                   */
                  if (item.attrs.param.status === '1') {
                    item.attrs.body = { fill: '#cfdfdd' };
                    /**
                     * 节点背景动画
                     * 未起效 待研究
                     */
                    // item.style = {
                    //   fill: '#cfdfdd',
                    //   transition: 'fill 1s'
                    // }
                  } else if (item.attrs.param.status === '2') {
                    item.attrs.body = { fill: '#E6A23C' };
                  } else if (item.attrs.param.status === '3') {
                    item.attrs.body = { fill: '#2ed771' };
                  } else if (
                    item.attrs.param.status === '4' ||
                    item.attrs.param.status === '5'
                  ) {
                    item.attrs.body = { fill: '#dbc5c5' };
                  }
                }
                if (item.shape === 'custom-logicNode') {
                  /**
                   * 可以根据数据状态判断 进行颜色设置
                   * refPoints: "0,10 10,0 20,10 10,20" 设置菱形形状
                   */
                  if (item.attrs.param.status === '1') {
                    item.attrs.body = {
                      fill: '#cfdfdd',
                      refPoints: '0,10 10,0 20,10 10,20'
                    };
                  } else if (item.attrs.param.status === '2') {
                    item.attrs.body = {
                      fill: '#E6A23C',
                      refPoints: '0,10 10,0 20,10 10,20'
                    };
                  } else if (item.attrs.param.status === '3') {
                    item.attrs.body = {
                      fill: '#2ed771',
                      refPoints: '0,10 10,0 20,10 10,20'
                    };
                  } else if (
                    item.attrs.param.status === '4' ||
                    item.attrs.param.status === '5'
                  ) {
                    item.attrs.body = {
                      fill: '#dbc5c5',
                      refPoints: '0,10 10,0 20,10 10,20'
                    };
                  } else {
                    item.attrs.body = { refPoints: '0,10 10,0 20,10 10,20' };
                  }
                }

                /**
                 * 连接线数据放入edges数组
                 */
                if (item.shape === 'edge') {
                  item.attrs.line = { stroke: '#8f8f8f' };
                  item.connector = { name: 'rounded' };
                  obj.edges.push(item);
                } else {
                  /**
                   * 节点数据放入nodes数组
                   */
                  item.ports = this.portsData;
                  /**
                   * 设置节点大小size 因为接口没有返这个字段
                   */
                  // if(item.shape === 'custom-startNode' || item.shape === 'custom-endNode'){
                  // item.size = {height: 45, width: 45};
                  // }
                  // if(item.shape === 'custom-taskNode'){
                  // item.size = {height: 40, width: 100};
                  // }
                  // if(item.shape === 'custom-logicNode'){
                  // item.size = {height: 60, width: 100};
                  // item.attrs.body = {refPoints: "0,10 10,0 20,10 10,20"};
                  // }
                  obj.nodes.push(item);
                }
              });

              // 渲染流程节点和链接线
              this.graph.fromJSON(obj);
              // 将画布中元素缩小或者放大一定级别，让画布正好容纳所有元素，可以通过 maxScale 配置最大缩放级别
              /**
               * 当流程图节点个数大于10时执行填满画布
               */
              if (obj.nodes && obj.nodes.length > 10) {
                this.graph.zoomToFit();
              }
            }
          }
          // this.$forceUpdate()
        },
        function () {},
        this
      );
    },
    // 初始化画布
    initGraph() {
      /**
       * 流程图宽高
       */
      let screenWidth = this.$refs.containerBox ? this.$refs.containerBox.offsetWidth : 480;
      let screenHeight = this.$refs.containerBox ? this.$refs.containerBox.offsetHeight : 480;
      // 渲染画布
      this.graph = new Graph({
        container: this.$refs.container,
        // 画布背景
        background: {
          color: '#F2F7FA'
        },
        // 画布的线条样式
        grid: {
          visible: true, // 渲染网格背景
          size: 15 // 网格大小 10px
        },
        width: screenWidth,
        height: screenHeight,
        // 开启画布平移
        panning: true,
        // 按下ctrl键 滚动滚轮进行法大缩小
        mousewheel: {
          enabled: true,
          maxScale: 4,
          minScale: 0.2
        },
        // 连接线
        connecting: {
          allowBlank: false, // 是否允许连接到画布空白位置的点
          allowLoop: false, // 是否允许创建循环连线，即边的起始节点和终止节点为同一节点
          allowNode: true, // 是否允许边连接到节点（非节点上的连接桩）
          allowEdge: false, // 是否允许边连接到另一个边
          allowPort: true, // 是否允许边连接到连接桩
          allowMulti: true, //是否允许在相同的起始节点和终止之间创建多条边
          highlight: true,
          createEdge() {
            return this.createEdge({
              shape: 'edge',
              router: {
                name: 'manhattan',
                args: {
                  startDirections: ['top', 'right', 'bottom', 'left'],
                  endDirections: ['top', 'right', 'bottom', 'left']
                }
              },
              connector: {
                name: 'rounded'
                // args: { radius: 10, },
              },
              attrs: {
                line: {
                  stroke: '#8f8f8f',
                  strokeWidth: 2
                }
              },
              tools: ['edge-editor'] // 文本编辑器
            });
          }
        },
        // 连接桩样式
        highlighting: {
          // 连接桩吸附连线时在连接桩外围围渲染一个包围框
          magnetAdsorbed: {
            name: 'stroke',
            args: {
              attrs: {
                fill: '#8f8f8f',
                fillOpacity: '0.3',
                stroke: '#fff',
                strokeOpacity: '0'
              }
            }
          }
        },
        /**
         * 通过Graph的构造参数interacting可实现限制交互行为
         */
        interacting: false
      });

      // 自定义节点1  圆形 开始
      Graph.registerNode(
        'custom-startNode',
        {
          inherit: 'circle', // 继承于 rect 节点
          markup: [
            {
              tagName: 'circle', // 标签名称
              selector: 'body' // 选择器
            },
            {
              tagName: 'image',
              selector: 'img'
            },
            {
              tagName: 'text',
              selector: 'label'
            }
          ],
          attrs: {
            body: {
              stroke: '#8f8f8f',
              strokeWidth: 1,
              fill: '#2ed771',
              rx: 6,
              ry: 6
            },
            text: {
              fontSize: 14,
              fill: '#666666'
            }
          },
          ports: this.portsData
        },
        true
      );
      // 自定义节点2  圆形 结束
      Graph.registerNode(
        'custom-endNode',
        {
          inherit: 'circle', // 继承于 rect 节点
          markup: [
            {
              tagName: 'circle', // 标签名称
              selector: 'body' // 选择器
            },
            {
              tagName: 'image',
              selector: 'img'
            },
            {
              tagName: 'text',
              selector: 'label'
            }
          ],
          attrs: {
            body: {
              stroke: '#8f8f8f',
              strokeWidth: 1,
              fill: '#e299bd',
              rx: 6,
              ry: 6
            },
            text: {
              fontSize: 14,
              fill: '#666666'
            }
          },
          ports: this.portsData
        },
        true
      );
      // 自定义节点3  方框
      Graph.registerNode(
        'custom-taskNode',
        {
          inherit: 'rect', // 继承于 rect 节点
          markup: [
            {
              tagName: 'rect', // 标签名称
              selector: 'body' // 选择器
            },
            {
              tagName: 'image',
              selector: 'img'
            },
            {
              tagName: 'text',
              selector: 'label'
            }
          ],
          attrs: {
            body: {
              stroke: '#8f8f8f',
              strokeWidth: 1,
              fill: '#fff',
              rx: 6,
              ry: 6
            },
            text: {
              fontSize: 14,
              fill: '#666666'
            }
          },
          ports: this.portsData
        },
        true
      );
      // 自定义节点4  椭圆
      Graph.registerNode(
        'custom-nodeTuo',
        {
          inherit: 'ellipse', // 继承于 rect 节点
          markup: [
            {
              tagName: 'ellipse', // 标签名称
              selector: 'body' // 选择器
            },
            {
              tagName: 'image',
              selector: 'img'
            },
            {
              tagName: 'text',
              selector: 'label'
            }
          ],
          attrs: {
            body: {
              stroke: '#8f8f8f',
              strokeWidth: 1,
              fill: '#fff',
              rx: 6,
              ry: 6
            },
            text: {
              fontSize: 14,
              fill: '#666666'
            }
          },
          ports: this.portsData
        },
        true
      );
      /**
       * 自定义节点5  菱形
       */
      Graph.registerNode(
        'custom-logicNode',
        {
          inherit: 'polygon',
          width: 80,
          height: 50,
          attrs: {
            body: {
              strokeWidth: 1,
              stroke: '#8f8f8f',
              fill: '#fff'
            },
            text: {
              fontSize: 14,
              fill: '#666666'
            }
          },
          ports: this.portsData
        },
        true
      );
      /**
       * 获取数据
       */
      this.getData({ formId: this.flowObj.formId });
    },
    closeFlow() {
      this.$emit('closeFlow');
    },
    // 触摸开始
    onTouchStart(event) {
      if (event.touches.length === 2) {
        this.isZooming = true;
        this.scale = 1;
        this.startDistance = this.getDistance(event.touches);
      } else if (event.touches.length === 1) {
        this.isDragging = true;
        const touch = event.touches[0];
        this.lastTouchX = touch.pageX;
        this.lastTouchY = touch.pageY;
      }
    },
    // 触摸移动
    onTouchMove(event) {
      if (this.isZooming && event.touches.length === 2) {
        const distance = this.getDistance(event.touches);
        const scaleChange = distance / this.startDistance;
        this.scale = Math.max(0.1, Math.min(5, this.scale * scaleChange));
        this.startDistance = distance;
      } else if (this.isDragging && event.touches.length === 1) {
        const touch = event.touches[0];
        const deltaX = touch.pageX - this.lastTouchX;
        const deltaY = touch.pageY - this.lastTouchY;

        this.delta = {
          x: deltaX,
          y: deltaY
        }

        // 更新上次触摸坐标
        this.lastTouchX = touch.pageX;
        this.lastTouchY = touch.pageY;
      }
    },
    // 触摸结束
    onTouchEnd() {
      this.isZooming = false;
      this.isDragging = false;
    },
    // 计算两指之间的距离
    getDistance(touches) {
      const dx = touches[0].pageX - touches[1].pageX;
      const dy = touches[0].pageY - touches[1].pageY;
      return Math.sqrt(dx * dx + dy * dy);
    }
  },
  mounted() {
    this.initGraph();
  }
};
</script>

<style lang="scss" scoped>
@keyframes openCalculationFormula {
  from {
    top: 45%;
    opacity: 0;
  }
  to {
    top: 50%;
    opacity: 1;
  }
}
.calculation-formula {
  &-icon {
    display: block;
    width: 24px;
    height: 24px;
    cursor: pointer;
  }
  &-content {
    touch-action: none;
    user-select: none;
    animation: openCalculationFormula 0.3s ease-in-out forwards;
    
    background: #fff;
    width: 960px;
    max-width: 90%;
    height: 600px;
    max-height: 90%;
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
    overflow: hidden;
    &-box {
      flex: 1 1 auto;
      overflow: hidden;
      width: 100%;
    }
    &-top {
      border-bottom: #dbdbdb 1px solid;
      background: #efefef;
      color: rgb(129, 129, 129);
      width: 100%;
      padding: 20px 0;
      flex-shrink: 0;
      div {
        word-break: break-word;
      }
    }
    &-bottom {
      border-top: #dbdbdb 1px solid;
      background: #efefef;
      width: 100%;
      padding: 20px 0;
      flex-shrink: 0;
    }
  }
  &-mask {
    z-index: 12;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0);
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
