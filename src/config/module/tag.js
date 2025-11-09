/*
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2025-03-29 02:37:31
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-03-31 15:13:18
 * @FilePath: \manageaurora\src\config\module\tag.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
  @Author: zouzhe
  @Date: 2023-08-09 10:29:12
  @LastEditors: zouzhe
  @Email: zouzhe@lonch.com.cn
  @LastEditTime: 2023-09-08 15:55:12
  @Description: file content
 */
const tag = {
  // -------------搜索标签--------------
  searchTag: {
    module: 'tag',
    url: '/search/tag',
    method: 'POST',
    comment: '搜索标签',
  },
  dataAddTag: { module: 'tag', url: '/data/addTag', method: 'POST', comment: '打标签' },
  dataBatchDelTags: {
    module: 'tag',
    url: '/data/batchDelTags',
    method: 'POST',
    comment: '批量删除标签',
  },
  dataQueryTags: {
    module: 'tag',
    url: '/data/queryTags',
    method: 'POST',
    comment: '通过元数据查询标签列表',
  },
  dataAddTagToGroup: {
    module: 'tag',
    url: '/data/batchAddTagToGroup',
    method: 'POST',
    comment: '商户创建标签'
  },
  dataQueryTagsInGroup: {
    module: 'tag',
    url: '/data/queryTagsInGroup',
    method: 'POST',
    comment: '查询商户标签列表'
  },
  dataBatchQueryTagsInGroup: {
    module: 'tag',
    url: '/data/batchQueryTagsInGroup',
    method: 'POST',
    comment: '批量查询标签列表(按分组查)'
  },
  delDelTagFromGroup: {
    module: 'tag',
    url: '/data/delTagFromGroup',
    method: 'POST',
    comment: '删除标签'
  },
  delTag: {
    module: 'tag',
    url: '/data/delTag',
    method: 'POST',
    comment: '删除待选标签'
  },
  batchAddTags: {
    module: 'tag',
    url: '/data/batchAddTags',
    method: 'POST',
    comment: '添加标签（实际是打标签）'
  },
  addTagToGroup: {
    module: 'tag',
    url: '/data/addTagToGroup',
    method: 'POST',
    comment: '添加标签'
  },
  tagDataQueryTags: {
    module: 'tag',
    url: '/data/queryTags',
    method: 'POST',
    comment: '查询标签'
  }
};
export default tag;
