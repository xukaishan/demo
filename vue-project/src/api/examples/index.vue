<template>
  <div class="examples">
    <button @click="btnHandler1">测试1</button>
    <button @click="btnHandler2">测试2</button>
    <button @click="btnHandler3">测试3</button>
  </div>
</template>

<script>
import api from '../proxy'
export default {
  name: 'examples',
  components: {
      
  },
  props: {
      
  },
  data () {
    return {
      list:[1,2,3]
    }
  },
  computed: {
      
  },
  created () {
      
  },
  mounted () {
      
  },
  methods: {
      btnHandler1 () {
          let params = {
              name:'xxx111',
              age:32,
          }
          api.getList(params).then(res => {
              console.log('res1=>', res);
          })
      },
      btnHandler2 () {
          let params = {
              name:'xxx222',
              age:32,
              list:[{a:1,b:2}]
          }
          api.updateList(params).then(res => {
              console.log('res2=>', res);
          })
      },
      btnHandler3 () {
          let params = {
              name:'xxx333',
              age:32,
              list:[{a:1,b:2}]
          }
          api.updateUser(params).then(res => {
              console.log('res3=>', res);
          })
      },
  }
}
</script>

<style scoped lang="">

</style>
