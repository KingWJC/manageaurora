<template>
  <QuotaOps :permissions="permissions"  v-if="isHasAccessPermision" />
</template>

<script>
import QuotaOps from '@/components/admin/taxInvoice/QuotaOps';
import permissionsMixin from '@/common-base/mixins/permissions';
export default { mixins: [permissionsMixin], components: { QuotaOps } };
</script>


