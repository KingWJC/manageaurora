<template>
  <RedConfirmationDetail :permissions="permissions" :params="$route.query" v-if="isHasAccessPermision" />
</template>

<script>
import permissionsMixin from '@/common-base/mixins/permissions';
import RedConfirmationDetail from '@/components/admin/taxInvoice/RedConfirmationDetail.vue';
export default { mixins: [permissionsMixin], components: { RedConfirmationDetail } };
</script>



