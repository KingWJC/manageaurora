export default {
  data () {
    return {
      activatedCount: -1
    };
  },
  mounted () {
    if (this.$refs.viewBody) {
      window.addEventListener('resize', this.updateGridHeight, false);
    }
  },
  activated () {
    if (this.activatedCount >= 0 && typeof this.updateCurrentPage === 'function') {
      this.updateCurrentPage();
    }
    this.activatedCount++;
  },
  methods: {
    updateGridHeight () {
      if (this.$refs.viewBody) {
        this.$nextTick(() => {
          const heightDifference = this.heightDifference || 30
          let viewHeight = this.$refs.viewBody.offsetHeight - heightDifference;
          let gridHeight = typeof this.gridHeight === 'string'? Number(this.gridHeight.replace(/px$/, '')) : 0;
          if (viewHeight > 0 && Math.abs(gridHeight - viewHeight) > 5) {
            this.gridHeight = viewHeight + 'px';
          }
        });
      }
    }
  }
};
