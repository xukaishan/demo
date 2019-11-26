<template>
  <el-menu default-active="2" router class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
    <el-submenu index="/">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>home</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/idx">idx</el-menu-item>
        <el-menu-item index="/">index</el-menu-item>
        <el-menu-item index="/index1">index1</el-menu-item>
        <el-menu-item index="/index2">index2</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-menu-item index="/Charts">
      <i class="el-icon-menu"></i>
      <span slot="title">charts</span>
    </el-menu-item>
    <el-menu-item index="/Table">
      <i class="el-icon-document"></i>
      <span slot="title">table</span>
    </el-menu-item>
    <el-menu-item index="/Test">
      <i class="el-icon-setting"></i>
      <span slot="title">test</span>
    </el-menu-item>
    <el-submenu index="/Ueditor">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>Ueditor</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/Ueditor">index</el-menu-item>
        <el-menu-item index="/UeditorBase">UeditorBase</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
    name: "Nav",
    data() {
        return {};
    },
    props: {

    },
    mounted() {
        // console.log(this.$root)
    },
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        }
    }
};
</script>

<style scoped lang="less">
</style>