<template>
  <InvoiceList :permissions="permissions" :params="$route.query" v-if="isHasAccessPermision" />
</template>

<script>
import InvoiceList from '@/components/admin/taxInvoice/InvoiceList';
import permissionsMixin from '@/common-base/mixins/permissions';
export default { mixins: [permissionsMixin], components: { InvoiceList } };
</script>


