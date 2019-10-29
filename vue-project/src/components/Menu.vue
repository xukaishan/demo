<template>
  <div class="menu">
    <div v-for="(v,i) in list" :key="i" class="menu-item">
      <div class="label" @click="labelHandler(i,v)" :ref="i">
        {{v.label}}
        <div v-if="v.children&&v.children.length" class="sub-item" ref="subItem">
          <Menu :list="v.children"></Menu>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Menu",
  data() {
    return {};
  },
  props: {
    list: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  mounted() {
    // console.log(this.$root)
  },
  methods: {
    labelHandler(i, v) {
        event.stopPropagation()
      if (!v.children || !v.children.length) {
        return;
      }
     
      let len = v.children.length;
      this.$refs[i][0].style.height =
        event.target.offsetHeight + len * 40 + "px";
    }
  }
};
</script>

<style scoped lang="less">
.menu {
  width: 200px;
  background: #f1f1f1;
  overflow: hidden;
  .menu-item {
    text-indent: 20px;
  }
  .label {
    line-height: 40px;
    cursor: pointer;
    box-sizing: border-box;
   
  }
  .sub-item {
    padding-left: 30px;
  }
}
</style>