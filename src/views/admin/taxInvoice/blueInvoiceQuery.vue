<template>
  <InvoiceBlueQuery :permissions="permissions" :params="$route.query" v-if="isHasAccessPermision" />
</template>

<script>
import InvoiceBlueQuery from '@/components/admin/taxInvoice/InvoiceBlueQuery';
import permissionsMixin from '@/common-base/mixins/permissions';
export default { mixins: [permissionsMixin], components: { InvoiceBlueQuery } };
</script>

<style scoped>

</style>
