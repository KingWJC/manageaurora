export default {
  functional: true,
  props: {
    data: Array,
    render: Function,
  },
  render: (h, ctx) => {
    return ctx.props.render(h, ctx.props.data)
  },
}