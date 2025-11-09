<template>
  <InvoiceBlueList :permissions="permissions" :params="$route.query" v-if="isHasAccessPermision" />
</template>

<script>
import InvoiceBlueList from '@/components/admin/taxInvoice/InvoiceBlueList';
import permissionsMixin from '@/common-base/mixins/permissions';
export default { mixins: [permissionsMixin], components: { InvoiceBlueList } };
</script>



