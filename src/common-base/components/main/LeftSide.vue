<template>
  <div class="left-side flex-flex-none" v-show="isShow">
    <div class="left-side-mask" @click="closeLeftSide"></div>
    <div class="viewport full-height">
      <div class="full-height" v-if="isHideDefaultSide">
        <slot name="leftSide"></slot>
      </div>
      <div class="viewport-body" v-else>
        <div class="viewport-header viewport-header-padded viewport-header-l flex flex-column flex-content-center">
          <div class="panel tal">
            <img src="./lcs-logo-white.png" v-if="CFG.clientType=='3'" style="height: 48px;width: auto;display: block;">
            <img src="./lcs-logo.png" v-else style="height: 48px;width: auto;display: block;">
          </div>
        </div>
        <div class="viewport-view full-height">
          <div class="viewport-view-body full-height">
            <div class="viewport-header viewport-header-padded flex flex-column flex-content-center">
              <div>
                <el-input class="full-width"
                          size="small"
                          v-model="filterKeywords"
                          prefix-icon="el-icon-search"
                          @input="filterMenuList"
                          placeholder="搜索">
                </el-input>
              </div>
            </div>
            <div class="viewport-view full-height">
              <div class="viewport-view-body full-height">
                <el-menu
                  :default-active="currentId"
                  @select="handleSelect"
                  class="el-menu-vertical-demo">
                  <nav-menu :menus="fileterMenuTree"></nav-menu>
                </el-menu>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavMenu from './NavMenu';

function matchedMenus (arr, keyword) {
  let matched = [];
  let regExp = new RegExp('(' + keyword + ')', 'i');
  arr.forEach(function (item) {
    if (regExp.test(item.name)) {
      // 匹配本级菜单
      matched.push(item);
    } else if (item.children && item.children.length > 0) {
      // 不匹配本级菜单，检查是否匹配子菜单
      let matchedChildren = matchedMenus(item.children, keyword);
      if (matchedChildren.length > 0) {
        item.children = matchedChildren;
        matched.push(item);
      }
    }
  });
  return matched;
}

// 过滤无资源菜单（不显示没有资源的菜单及子菜单）
function filterNoPermissionNode (list) {
  let arr = [];
  list.forEach(function (item) {
    if (item.type == '1') {
      arr.push(item);
    } else if (item.type == '0' && item.children && item.children.length > 0) {
      let children = filterNoPermissionNode(item.children);
      if (children.length > 0) {
        item.children = children;
        arr.push(item);
      }
    }
  });
  return arr;
}

export default {
  name: 'LeftSide',
  components: {
    NavMenu
  },
  props: {
    permissions: {
      type: Array,
      default () {
        return [];
      }
    },
    dataOwnerOrgId: {
      type: String,
      default: ''
    },
    isShow: {
      type: Boolean,
      default: true
    },
    // 是否自动关闭左侧菜单
    isAutoCloseLeftSide: {
      type: Boolean,
      default: false
    },
    /**
     * 是否隐藏默认左侧菜单
     */
    isHideDefaultSide: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isCollapse: false,
      currentIndex: '',
      currentId: '',
      menuList: [],
      fileterMenuTree: [],
      filterKeywords: ''
    };
  },
  created () {
    //this.initProductMenuList(this.permissions);
    this.menuList = this.CFG.permissionTree;
    this.fileterMenuTree = this.utils.deepCopy(this.CFG.permissionTree);
  },
  methods: {
    closeLeftSide () {
      this.$emit('close-left-side');
    },
    menuSelected () {
      if (this.isAutoCloseLeftSide) {
        this.closeLeftSide();
      }
    },
    getDomainByOriginName (name = 'manage') {
      let origins = this.CFG.origins;
      for (let item in origins) {
        let orgin = origins[item];
        if (orgin.name === name) {
          return orgin.domain;
        }
      }
      return '';
    },
    getUrlByDomain (path, domain) {
      let url
      if (/^http[s]?:\/\//.test(path)) {
        let origin = new URL(path).origin;
        let originRegStr = '^' + origin.replace(/\//g, '\\\/').replace(/[.]/g, '\\.');
        let pathname ='/index.html';
        let newPathName = domain + pathname;
        // 切换版本入口
        let re = new RegExp(originRegStr + '(\\/v\\d+\\.\\d+\\.\\d+)?\\/(index\\.html)?');
        url = path.replace(re, newPathName);
      } else {
        url = domain + '/index.html' + '#' + path;
      }
      return url;
    },
    handleSelect (key) {
      if (this.currentId === key) {
        return;
      }
      this.currentId = key;
      // 是否自动关闭
      if (this.isAutoCloseLeftSide) {
        this.closeLeftSide();
      }
      let menu = this.getPermissionById(key);
      LonchJsApi.openMenu(menu);
    },
    initProductMenuList (arr) {
      let menuList = [];
      for (let index in arr) {
        let menu = arr[index];
        if (menu.type === '0' || menu.type === '1') {
          menuList.push(menu);
        }
      }
      let menuTree = this.utils.array2tree(this.utils.deepCopy(menuList), 'id', 'parentid');
      this.menuList = filterNoPermissionNode(menuTree);
      this.fileterMenuTree = this.utils.deepCopy(this.menuList);
    },
    getPermissionById (id) {
      let permissions = this.permissions;
      for (let i = 0, l = permissions.length; i < l; i++) {
        let item = permissions[i];
        if (item.id === id) {
          return item;
        }
      }
      return {};
    },
    /**
     *  如果匹配主菜单，则显示所有子菜单
     *  如果匹配子菜单，则匹配主菜单+匹配的子菜单
     */
    filterMenuList (keyword) {
      if (keyword) {
        this.fileterMenuTree = matchedMenus(this.utils.deepCopy(this.menuList), keyword);
      } else {
        this.fileterMenuTree = this.menuList;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.el-menu,.is-active{
  min-width: 100%!important;
  width: max-content;
}
</style>
