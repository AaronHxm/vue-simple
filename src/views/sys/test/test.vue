<template>
  <div>
    <el-button @click="cli" />
    <xftm-cascader
      ref="XftmCascader"
      :multiple="true"
      :show-all-levels="true"
      size="medium "
      style="width: 600px"
      :selemodel="qwe"
      req-type="get"
      url="/datadic/getAllAreaMap"
      value="areaCode"
      label="areaDesc"
      children="childer"
      akey="areaCode"
      child-key="childer"
      parent-key="preCode"

    />

  </div>

</template>

<script>
import XftmCascader from '../../../components/cascader/cascader'
import XftmSelect from "../../../components/Select/select";

export default {
  name: 'Test',
  components: {XftmSelect, XftmCascader },
  data() {
    return {
      qwe: [
        'zhinan', 'shejiyuanze', 'xiaolv'
      ]
    }
  },
  methods: {
    cli() {
      console.log(this.$refs.XftmCascader.getSelectedPublicValue())
      console.log(this.$refs.XftmCascader.getSelectedPrivateValue())
      console.log(this.$refs.XftmCascader.getSelectedObject())
    }
  }
}
</script>

<style scoped>

</style>
