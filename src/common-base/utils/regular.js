/**
 * 验证该密码是否是弱密码
 * @param {*} password 
 */
const checkWeakPassword = (password) => {
  if(password) {
    // 只验证字符串
    if(typeof password !== 'string') {
      password = password.toString();
    }
    console.log('password:', password)
    return /^(?!^[a-zA-Z]+$|^\d+$|^[!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]{8,16}$/.test(password);
  } else {
    return false;
  }
}

export {
  checkWeakPassword
}