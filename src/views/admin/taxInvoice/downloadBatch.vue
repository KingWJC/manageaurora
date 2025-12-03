<template>
  <InvoiceDownloadList :permissions="permissions" v-if="isHasAccessPermision" />
</template>

<script>
import InvoiceDownloadList from '@/components/admin/taxInvoice/InvoiceDownloadList';
import permissionsMixin from '@/common-base/mixins/permissions';
export default { mixins: [permissionsMixin], components: { InvoiceDownloadList } };
</script>



