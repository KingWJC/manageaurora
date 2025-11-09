<template>
    <list :permissions="permissions" :params="$route.query" v-if="isHasAccessPermision"></list>
</template>

<script type="text/ecmascript-6">
import list from '@/components/admin/financeManage/settlementPriceApply/create'
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
