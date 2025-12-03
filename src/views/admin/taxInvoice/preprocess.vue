<template>
  <Preprocess :permissions="permissions" v-if="isHasAccessPermision" />
</template>

<script>
import Preprocess from '@/components/admin/taxInvoice/Preprocess';
import permissionsMixin from '@/common-base/mixins/permissions';
export default { mixins: [permissionsMixin], components: { Preprocess } };
</script>


