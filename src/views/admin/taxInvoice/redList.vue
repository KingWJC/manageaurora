<template>
  <InvoiceRedList :permissions="permissions" v-if="isHasAccessPermision" />
</template>

<script>
import InvoiceRedList from '@/components/admin/taxInvoice/InvoiceRedList';
import permissionsMixin from '@/common-base/mixins/permissions';
export default { mixins: [permissionsMixin], components: { InvoiceRedList } };
</script>



