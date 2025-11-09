export default {
  props: {
    permissions: {
      type: Object,
      default() {
        return {
          codes: {},
          names: {}
        }
      }
    },
    params: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data () {
    return {
      isMounted: false
    }
  },
  mounted () {
    this.isMounted = true;
  },
  methods: {
    showLoading (text) {
      this.loading = this.$loading({
        lock: true,
        text: text,
        background: 'rgba(0, 0, 0, 0.5)'
      });
    },
    closeLoading () {
      if (this.loading) {
        this.loading.close();
        this.loading = null;
      }
    }
  }
};
