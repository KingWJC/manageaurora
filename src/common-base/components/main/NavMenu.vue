<template>
  <div>
    <template v-for="(item) in menus">
      <!-- 含有子菜单 -->
      <template v-if="isShow(item)">
        <el-submenu v-if="item.children && item.children.length>0" :key="item.id" :index="item.id">
          <template slot="title">
            <icon color="#909399" hover="#606266" :name="item.children && item.children.length > 0 ? 'folder' : 'tickets'"/>
            <!-- <i :class="item.children && item.children.length > 0 ? 'lonch-icon-folder' : 'lonch-icon-tickets'"></i> -->
            <span>{{item.name || item.permissionName}}</span>
          </template>
          <NavMenu :menus="item.children"></NavMenu>
        </el-submenu>
        <el-menu-item v-else :key="item.id" :index="item.id">
          <icon color="#909399" hover="#606266" :name="item.children && item.children.length > 0 ? 'folder' : 'tickets'"/>
          <!-- <i :class="item.children && item.children.length > 0 ? 'lonch-icon-folder' : 'lonch-icon-tickets'"></i> -->
          <span>{{item.name || item.permissionName}}</span>
        </el-menu-item>
      </template>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'NavMenu',
    props: {
      menus: {
        type: Array,
        default () {
          return []
        }
      }
    },
    methods: {
      isShow(item) {
        return !/-unShow/.test(item.name);
      }
    }
  }
</script>
