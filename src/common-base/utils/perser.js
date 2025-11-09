import dom from './dom'
import utils from './utils'

/**
 * 解析字符串xml
 * contentType
 * text/xml,text/html
 */
function perser (text, contentType) {
  try {
    let domParser = new DOMParser()
    return domParser.parseFromString(text, contentType)
  } catch (e) {
    return null
  }
}

/**
 * [perserHTML 解析字符串为HTMLElement对象]
 * @param  {[type]} text [description]
 * @return {[type]}      [description]
 */
function perserHTML (text) {
  let persed = perser(text, 'text/html')
  return toDocumentFragment(persed.body)
}

/**
 * [perserXML 解析字符串为XML对象]
 */
function perserXML (text) {
  return perser(text, 'text/xml')
}

/**
 * 转换为DocumentFragment,支持传入字符串和document对象
 */
function toDocumentFragment (el) {
  let df = document.createDocumentFragment(),
    clone = el
  if (typeof clone === 'string') {
    clone = dom.createElement('div', {innerHTML: clone})
  }
  while (clone.childNodes.length > 0) {
    dom.appendTo(clone.childNodes[0], df)
  }
  return df
}
/**
 * xml 转换为 Json 如果xml为字符串，需要先转换为XML对象
 * nodeType
 * 1:Element
 * 2:Attribute
 * 3:Text
 * 4:CDATA Section
 * 5:Entity Reference
 * 6:Entity
 * 7:Processing Instruction
 * 8:Comment
 * 9:Document
 * 10:Document Type
 * 11:Document Fragment
 * 12:Notation
 */
function xml2Json (xml){
  if(typeof xml === 'string'){
    xml = perserXML(xml)
  }
  let json={}, i
  if (xml.nodeType == 1){
    // do attributes
    if (xml.attributes.length > 0){
      for (i=0; i < xml.attributes.length; i++){
        let attrs = xml.attributes.item(i)
        json["-" + attrs.nodeName] = attrs.nodeValue
      }
    }
  }else if (xml.nodeType == 3 && !/^\s+$/.test(xml.nodeValue)){
    json = xml.nodeValue
  }
  // do children
  if (xml.hasChildNodes()){
    for (i = 0; i < xml.childNodes.length; i++){
      let item = xml.childNodes.item(i)
      let nodeName = item.nodeName
      if (item.nodeType == 1){
        //Element
        if (typeof(json) == "string"){
          let old = json
          json = {}
          json["#text"] = old
          json[nodeName] = xml2Json(item)
        }else if (typeof(json[nodeName]) == "undefined"){
          json[nodeName] = xml2Json(item)
        }else{
          if (typeof(json[nodeName].length) == "undefined"){
            let old = json[nodeName]
            json[nodeName] = []
            json[nodeName].push(old)
          }
          json[nodeName].push(xml2Json(item))
        }
      }else if (item.nodeType == 3 && !/^\s+$/.test(item.nodeValue)){
        //Text
        if (utils.isEmptyObject(json)){
          json = item.nodeValue
        }else{
          //#text
          json[nodeName] = item.nodeValue
        }
      }
    }
  }
  return json
}
export default {
  perser,
  perserHTML,
  perserXML,
  xml2Json,
  toDocumentFragment
}
