<template>
  <RedConfirmationBuyerList :permissions="permissions" :params="$route.query" v-if="isHasAccessPermision" />
</template>

<script>
import RedConfirmationBuyerList from '@/components/admin/taxInvoice/RedConfirmationBuyerList';
import permissionsMixin from '@/common-base/mixins/permissions';
export default { mixins: [permissionsMixin], components: { RedConfirmationBuyerList } };
</script>



