<template>
  <InvoiceBlueDetail :permissions="permissions" v-if="isHasAccessPermision" />
</template>

<script>
import InvoiceBlueDetail from '@/components/admin/taxInvoice/InvoiceBlueDetail';
import permissionsMixin from '@/common-base/mixins/permissions';
export default { mixins: [permissionsMixin], components: { InvoiceBlueDetail } };
</script>



