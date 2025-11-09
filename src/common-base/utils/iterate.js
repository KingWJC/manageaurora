export default function (obj, callback) {
  for (let key in obj){
    if (key.toString() !== "length" && Object.prototype.hasOwnProperty.call(obj, key)){
      callback.call(obj, key, obj[key]);
    }
  }
  return obj;
}
