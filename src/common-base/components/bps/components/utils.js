/*
 * @Author: tuWei
 * @Date: 2023-03-30 15:43:54
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-06-09 22:54:05
 */
import { commonUrl } from "./dit.js"

export function arrToStr(arr) {
  if (arr) {
      return arr.map(item => item.name).toString()
  }
}

 // 申请人连续多级上级
export function selectHumanLeaderslog(){
  return new Promise((resolve, reject) =>{
    let args = {
      id: this.CFG.userInfo.id
    };
    this.API.send(commonUrl.selectHumanLeaderslog, args, function (res) {
        res = res.serviceResult;
        // console.log(res);
        resolve(res)
      }, function () {
        reject('error')
    }, this);
  })
}
// 申请人直接上级
export function selectHumanLeaderlog(){
  return new Promise((resolve, reject) =>{
    let args = {
      id: this.CFG.userInfo.id
    };
    this.API.send(commonUrl.selectHumanLeaderlog, args, function (res) {
      res = res.serviceResult;
      resolve(res)
    }, function () {
      reject('error')
    }, this);
  })
}

// 获取组织类型
export function getOrgType(id){
  let args = {
    oprTokenId: id,
  }
  return new Promise((resolve)=>{
     this.API.send(commonUrl.getOrgType, args, (res)=> {
        res = res.serviceResult;
        resolve(res);
      }, function () {
      }, this)
  })
}

// 获取回退列表
export function getRollbackNodeList(id){
  return new Promise((resolve, reject) =>{
    let args = {
      id
    }
    this.API.send(commonUrl.rollbackNodeList, args, (res)=> {
      res = res.serviceResult;
      resolve(res);
    }, function () {
      reject();
    }, this)
  })
}

// 获取工单回退节点
export function getWorkRollbackNodeList(id){
  return new Promise((resolve, reject) =>{
    let args = {
      id
    }
    this.API.send(commonUrl.workRollbackNodeList, args, (res)=> {
      res = res.serviceResult;
      resolve(res);
    }, function () {
      reject();
    }, this)
  })
}

// 获取工单下一步节点
export function getWorkNextNodeList(id){
  return new Promise((resolve, reject) =>{
    let args = {
      id
    }
    this.API.send(commonUrl.workNextNodeList, args, (res)=> {
      res = res.serviceResult;
      resolve(res);
    }, function () {
      reject();
    }, this)
  })
}

export function openUrl(url){
  LonchJsApi.openUrl({
    routePath: url,
  })
}

// 获取用户信息
export function getUsersInfo(args){
  return new Promise((resolve, reject) =>{
    this.API.send(commonUrl.getBpsUsersInfo, args, (res)=> {
      res = res.serviceResult;
      resolve(res);
    }, function () {
      reject();
    }, this)
  })
}

