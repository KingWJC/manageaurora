import config from './defaultFormInitializations'
export default function (form) {
  // let types
  let type
  let cfg = {}
  for (let item in form) {
    type = item.type
    if (type === 'submit' || type === 'button' || type === 'reset' || type === 'fieldset') {
      return
    }
    for (let eventType in config) {
      let obj = config[eventType]
      // types = obj.types.split(',')
      cfg[eventType] = obj.handler
    }
    for (let key in cfg) {
      item.addEventListener(key, cfg[key], false)
    }
  }
}
