<template>
  <RedConfirmationCreate :permissions="permissions" :params="$route.query" v-if="isHasAccessPermision" />
</template>

<script>
import permissionsMixin from '@/common-base/mixins/permissions';
import RedConfirmationCreate from '@/components/admin/taxInvoice/RedConfirmationCreate.vue';
export default { mixins: [permissionsMixin], components: { RedConfirmationCreate } };
</script>



