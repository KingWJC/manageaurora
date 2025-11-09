<template>
  <SelectPersonList :permissions="permissions" :params="$route.query" v-if="isHasAccessPermision" />
</template>

<script>
import SelectPersonList from '@/components/admin/taxInvoice/SelectPersonList';
import permissionsMixin from '@/common-base/mixins/permissions';
export default { mixins: [permissionsMixin], components: { SelectPersonList } };
</script>



