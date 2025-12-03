<template>
  <InvoiceRedDetail :permissions="permissions"  v-if="isHasAccessPermision" />
</template>

<script>
import InvoiceRedDetail from '@/components/admin/taxInvoice/InvoiceRedDetail';
import permissionsMixin from '@/common-base/mixins/permissions';
export default { mixins: [permissionsMixin], components: { InvoiceRedDetail } };
</script>



