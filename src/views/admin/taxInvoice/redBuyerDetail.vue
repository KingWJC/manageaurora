<template>
  <RedConfirmationBuyerDetail :permissions="permissions" :params="$route.query" v-if="isHasAccessPermision" />
</template>

<script>
import RedConfirmationBuyerDetail from '@/components/admin/taxInvoice/RedConfirmationBuyerDetail';
import permissionsMixin from '@/common-base/mixins/permissions';
export default { mixins: [permissionsMixin], components: { RedConfirmationBuyerDetail } };
</script>
