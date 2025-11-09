import webLog, {reportBehavior} from './../api/web-log';
import LonchJsApi from '../api/web-app';

export default {
  created () {
    webLog.reportBehavior({
      operation: 'page-created',
      url: window.location.href,
      evt: 'page-created',
      target: '',
      data: {}
    });
  },
  mounted () {
    this.isMounted = true;
    if (!LonchJsApi.isInApp() && !this.CFG.client.isMiniprogram && window.self === window.top) {
      document.addEventListener('visibilitychange', this.onReVisible);
    }
  },
  activated () {
    reportBehavior({
      operation: 'pageActivated',
      url: window.location.href,
      evt: 'page-activated',
      target: '',
      data: {}
    });
  },
  beforeDestroy () {
    reportBehavior({
      operation: 'page-destroy',
      url: window.location.href,
      evt: 'before-destroy',
      target: '',
      data: {}
    });
  },
  methods: {
    onReVisible (evt) {
      // 记录页面是否显示e.target.visibilityState === 'visible'
      reportBehavior({
        operation: 'visibility-change',
        url: window.location.href,
        evt: 'visibility-change',
        target: 'page-visibility',
        data: {
          visibilityState: evt.target.visibilityState
        }
      });
    }
  }
};
