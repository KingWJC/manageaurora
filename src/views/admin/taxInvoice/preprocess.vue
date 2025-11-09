<template>
  <Preprocess :permissions="permissions" :params="$route.query" v-if="isHasAccessPermision" />
</template>

<script>
import Preprocess from '@/components/admin/taxInvoice/Preprocess';
import permissionsMixin from '@/common-base/mixins/permissions';
export default { mixins: [permissionsMixin], components: { Preprocess } };
</script>


