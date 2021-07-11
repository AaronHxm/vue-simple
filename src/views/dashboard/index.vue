<template>
<!--  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
  </div>-->
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'

export default {
  name: '先锋',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  components: { adminDashboard},
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
