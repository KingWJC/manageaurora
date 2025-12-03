<template>
  <RedConfirmationSellerList :permissions="permissions" v-if="isHasAccessPermision" />
</template>

<script>
import RedConfirmationSellerList from '@/components/admin/taxInvoice/RedConfirmationSellerList';
import permissionsMixin from '@/common-base/mixins/permissions';
export default { mixins: [permissionsMixin], components: { RedConfirmationSellerList } };
</script>



