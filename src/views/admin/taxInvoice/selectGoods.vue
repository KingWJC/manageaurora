<template>
  <SelectGoodsList :permissions="permissions" :params="$route.query" v-if="isHasAccessPermision" />
</template>

<script>
import SelectGoodsList from '@/components/admin/taxInvoice/SelectGoodsList';
import permissionsMixin from '@/common-base/mixins/permissions';
export default { mixins: [permissionsMixin], components: { SelectGoodsList } };
</script>



