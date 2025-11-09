import dom from './dom'

function openUrl (url, target) {
  let form = dom.createElement('form', {action: url, target: target, method: 'get'});
  dom.appendTo(form, document.body);
  form.submit();
  dom.remove(form);
}

/**
 * 导出下载
 */
function downloadExportByUrl (url, method='get') {
  let frameName = 'downloadExportFrame'
  let frame
  if (!window.frames.downloadExportFrame) {
    frame = dom.createElement('iframe', {
      src: url,
      name: frameName,
      method: method,
      style: 'position:absolute;width:0;height:0;'
    }, document.body)
  } else {
    frame = window.frames.downloadExportFrame.frameElement
    frame.src = url
  }
  let timer = setInterval(function () {
    let iframeDoc = frame.contentDocument || frame.contentWindow.document
    if (iframeDoc.readyState == 'complete' || iframeDoc.readyState == 'interactive') {
      dom.remove(frame)
      clearInterval(timer);
      return;
    }
  }, 30000);
}

export default {
  downloadExportByUrl,
  openURL: openUrl
}
