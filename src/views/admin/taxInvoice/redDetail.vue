<template>
  <InvoiceRedDetail :permissions="permissions" :params="$route.query" v-if="isHasAccessPermision" />
</template>

<script>
import InvoiceRedDetail from '@/components/admin/taxInvoice/InvoiceRedDetail';
import permissionsMixin from '@/common-base/mixins/permissions';
export default { mixins: [permissionsMixin], components: { InvoiceRedDetail } };
</script>



