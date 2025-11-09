<template>
  <RedConfirmationCreate :permissions="permissions" :params="$route.query" :readonly="true" v-if="isHasAccessPermision" />
</template>

<script>
import RedConfirmationCreate from '@/components/admin/taxInvoice/RedConfirmationCreate.vue';
import permissionsMixin from '@/common-base/mixins/permissions';
export default { mixins: [permissionsMixin], components: { RedConfirmationCreate } };
</script>



