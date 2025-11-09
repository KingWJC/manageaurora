/*
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2024-06-06 18:57:54
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2024-07-12 23:37:45
 * @FilePath: \common-base\utils\crypto.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import CryptoJS from 'crypto-js';
import { JSEncrypt } from 'encryptlong';

/**
 * AES 加密
 * mode: ECB
 * padding: Pkcs7
 * @param {*} demand 
 * @param {*} secretKey 
 * @returns 
 */
function getAESEncryptString(demand, secretKey) {
  const demandString = JSON.stringify(demand || {});
  const result = CryptoJS.AES.encrypt(demandString, CryptoJS.enc.Utf8.parse(secretKey || ''), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString();
  return result;
}

/**
 * AES 解密成 String
 * mode: ECB
 * padding: Pkcs7
 * @param {*} demand 
 * @param {*} secretKey 
 * @returns 
 */
function getAESDecryptString(serviceResult, secretKey) {
  if (!serviceResult) {
    return serviceResult;
  }
  const result = CryptoJS.AES.decrypt(
    serviceResult,
    CryptoJS.enc.Utf8.parse(secretKey),
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }
  ).toString(CryptoJS.enc.Utf8);
  return result;
}

/**
 * AES 解密成对象
 * mode: ECB
 * padding: Pkcs7
 * @param {*} demand 
 * @param {*} secretKey 
 * @returns 
 */
function getAESDecryptObject(serviceResult, secretKey) {
  if (!serviceResult) {
    return serviceResult;
  }

  const result = JSON.parse(getAESDecryptString(serviceResult, secretKey));
  return result;
}

/**
 * RSA 加密
 * mode: pkcs1
 * @param {*} symmetricKey 
 * @param {*} publicKey 公钥
 * @returns 
 */
function getRSAEncryptString(symmetricKey, publicKey) {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);
  return encrypt.encryptLong(symmetricKey);
}
/**
 * RSA 解密
 * mode: pkcs1
 * @param {*} symmetricKey  
 * @param {*} privateKey 私钥
 * @returns 
 */
function getRSADecryptString(symmetricKey, privateKey) {
  const encrypt = new JSEncrypt();
  encrypt.setPrivateKey(privateKey);
  return encrypt.decryptLong(symmetricKey);
}
/**
 * MD5 散列
 * @param {*} string 
 * @returns 
 */
function getMD5String(string) {
  return CryptoJS.MD5(string).toString();
}
/**
 * 获取 cookie 里的密钥的 key
 */
function getCookieSKKey() {
  return process.env.VUE_APP_MODE === 'production' ? 'WEB-ID:SK' : 'WEB-ID:SK-TEST';
}

function getCookieSKKeyObject(str) {
  if (typeof str === 'string' && str.includes(':')) {
    const strArray = str.split(':');
    if (strArray.length === 2 && /^\d+$/.test(strArray[0]) && /^([a-z\d]+|)$/i.test(strArray[1])) {
      const terminalId = strArray[0]
      const sk = strArray[1];
      return { terminalId, sk };
    }
  }
  return null;
}

export {
  getAESEncryptString,
  getAESDecryptString,
  getAESDecryptObject,
  getMD5String,
  getRSAEncryptString,
  getRSADecryptString,
  getCookieSKKey,
  getCookieSKKeyObject,
};
