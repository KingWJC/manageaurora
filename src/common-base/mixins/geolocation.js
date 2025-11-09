export default {
  data () {
    return {
      watchPositionId: null,
      positionCoords: {},
      defaultOptions: {
        enableHighAcuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    };
  },
  beforeDestroy () {
    this.clearWatchPositionMixin();
  },
  methods: {
    getCurrentPositionMixin (success, error, options) {
      options = Object.assign({}, this.defaultOptions, options || {});
      if (LonchJsApi.isInMacAppV2() || LonchJsApi.isInCefV2()) {
        this.getPsitionFromAppMixin(success, error);
      } else if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
          if (typeof success === 'function') {
            success({
              longitude: position.coords.longitude, // 经度
              latitude: position.coords.latitude,// 纬度
              accuracy: position.coords.accuracy, // 准确度
              altitude: position.coords.altitude, // 海拔
              altitudeAccuracy: position.coords.altitudeAccuracy, // 海拔准确度
              heading: position.coords.heading //行进方向
            });
          }
        }, function (e) {
          if (typeof error === 'function') {
            error({
              code: e.code,
              message: e.message
            });
          }
        }, options);
      }
    },
    watchPositionMixin (success, error, options) {
      options = Object.assign({}, this.defaultOptions, options || {});
      if (this.watchPositionId) {
        this.clearWatchPositionMixin();
      }
      if (LonchJsApi.isInMacAppV2() || LonchJsApi.isInCefV2()) {
        this.watchPositionId = setInterval(function () {
          this.getPsitionFromAppMixin(success, error);
        }, options.timeout);
      } else if ('geolocation' in navigator) {
        this.watchPositionId = navigator.geolocation.watchPosition(function (position) {
          success({
            longitude: position.coords.longitude, // 经度
            latitude: position.coords.latitude,// 纬度
            accuracy: position.coords.accuracy, // 准确度
            altitude: position.coords.altitude, // 海拔
            altitudeAccuracy: position.coords.altitudeAccuracy, // 海拔准确度
            heading: position.coords.heading //行进方向
          });
        }, function (err) {
          if (typeof error === 'function') {
            error({
              code: err.code,
              message: err.message
            });
          }
        }, options);
      }
    },
    clearWatchPositionMixin () {
      if (!this.watchPositionId) {
        return;
      }
      if (LonchJsApi.isInMacAppV2() || LonchJsApi.isInCefV2()) {
        clearInterval(this.watchPositionId);
      } else {
        navigator.geolocation.clearWatch(this.watchPositionId);
      }
      this.watchPositionId = null;
    },
    getPsitionFromAppMixin (success, error) {
      this.API.send({command: 'cmdGetGeolocation'}, {},
        function (res) {
          if (typeof success === 'function') {
            success(res.serviceResult);
          }
        },
        function (err) {
          if (typeof error === 'function') {
            error(err);
          }
        },
        this,
        true
      );
    }
  }
};
