<!--
 * @Author: liwenjie liwenjie@lonch.com.cn
 * @Date: 2023-05-29 10:33:24
 * @LastEditors: liwenjie liwenjie@lonch.com.cn
 * @LastEditTime: 2023-06-03 01:22:18
 * @FilePath: \YYFc:\project\middleground\lonch-imsfe\src\common-base\components\pubComponents\render.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script>
export default {
  name: 'render',
  functional: true,
  props: {
    scope: {
      type: Object,
      default: () => {
        return {}
      }
    },
    render: {
      type: Function,
      default: () => {
        return false
      }
    }
  },
  render: (h, ctx) => {
    return ctx.props.render ? ctx.props.render(ctx.props.scope, h, ctx.props.scope.row) : ''
  }
}
</script>
