<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { wxShare } from "@/assets/js/wx.js";
export default {
  name: "App",
  mounted() {
    //微信分享
    wxShare({
      ctx: "http://upad.youxuepai.com/youxuepaiNetworkCenter/",
      url: window.location.href,
      imgUrl: "http://www.noahedu.com/market/images/share.jpg",
      title: "优学派精品口语课",
      desc: "优学派精品口语课"
    });
  },
  beforeDestroy(){
   
  }
  
};
</script>

<style>
body{
  background: #fff!important;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  color: #2c3e50;
  font-size: 0.3rem;
}
</style>
