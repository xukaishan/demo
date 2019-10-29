<template>
  <div class="Index2">
    <Ball ref='Ball'/>
  </div>
</template>

<script>
import Ball from '@/components/Ball.vue' 
export default {
  name: 'Index2',
  components: {
      Ball
  },
  props: {
      
  },
  data () {
    return {
      
    }
  },
  computed: {
      
  },
  created () {
      
  },
  mounted () {
      console.log('this.$refs.Ball.add()=>',this.$refs.Ball.add());
  },
  methods: {
      
  }
}
</script>

<style scoped lang="">

</style>
