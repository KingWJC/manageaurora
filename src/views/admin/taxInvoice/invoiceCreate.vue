<template>
  <InvoiceForm :permissions="permissions" :params="$route.query" v-if="isHasAccessPermision" />
</template>

<script>
import InvoiceForm from '@/components/admin/taxInvoice/InvoiceForm';
import permissionsMixin from '@/common-base/mixins/permissions';
export default { mixins: [permissionsMixin], components: { InvoiceForm } };
</script>


