<template>
  <div class="home">
   <div><img :src="require('@assets/images/head.png')" width="100%"></div>
   <GradeSelect/>
  </div>
</template>

<script>
import GradeSelect from '@/components/GradeSelect'
export default {
  name: 'Home',
  components:{
    GradeSelect
  }
}
</script>

<style scope lang="less">
.home{
  overflow: hidden;
  height: 100vh;
}
</style>
