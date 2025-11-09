<template>
    <list :params = "$route.query" :permissions="permissions" v-if="isHasAccessPermision"></list>
</template>

<script type="text/ecmascript-6">
import list from '@/components/admin/financeManage/settlementPriceAdjust/list'
import permissionsMixin from '@/common-base/mixins/permissions'
export default {
  mixins: [permissionsMixin],
  components: {
    list
  },
  data () {
    return {

    }
  }
}
</script>
