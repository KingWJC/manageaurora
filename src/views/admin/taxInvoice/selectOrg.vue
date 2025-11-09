<template>
  <SelectOrgList :permissions="permissions" :params="$route.query" v-if="isHasAccessPermision" />
</template>

<script>
import SelectOrgList from '@/components/admin/taxInvoice/SelectOrgList';
import permissionsMixin from '@/common-base/mixins/permissions';
export default { mixins: [permissionsMixin], components: { SelectOrgList } };
</script>



