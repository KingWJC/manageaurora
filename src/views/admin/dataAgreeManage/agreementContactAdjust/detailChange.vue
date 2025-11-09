<template>
    <detail :permissions="permissions" v-if="isHasAccessPermision" :params="$route.query"></detail>
</template>

<script type="text/ecmascript-6">
import detail from '@/components/admin/dataAgreeManage/agreementContactAdjust/detailChange'
import permissionsMixin from '@/common-base/mixins/permissions'
export default {
  mixins: [permissionsMixin],
  components: {
    detail
  },
  data () {
    return {

    }
  }
}
</script>
