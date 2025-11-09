/*
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2025-04-01 01:14:17
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-04-01 01:47:30
 * @FilePath: \manageaurora\src\config\module\ectapi.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const ectapi = {
  /**
   * 查询用户认证信息，不需要特殊参数，根据登录用户自动判断，如果想判断指定用户，传参： selectHumanId = 自然人id
   */
  authQueryPersonAuthInfoByHumanId: { module: 'ectapi', url: '/auth/queryPersonAuthInfoByHumanId', method: 'POST', comment: '查询用户认证信息，不需要特殊参数，根据登录用户自动判断，如果想判断指定用户，传参： selectHumanId = 自然人id' },
}

export default ectapi;
