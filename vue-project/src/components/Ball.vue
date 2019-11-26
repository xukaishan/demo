<template>
  <div class="Ball">
    <div id="list-demo" class="demo">
      <button v-on:click="add">Add</button>
      <button v-on:click="remove">Remove</button>
      <transition-group name="list" tag="div">
        <span v-for="(item,idx) in cp_list" :key="item+idx" class="list-item"></span>
      </transition-group>
    </div>
  </div>
</template>

<script>
export default {
    name: 'Ball',
    components: {

    },
    props: {

    },
    data() {
        return {
            items: [false],
            nextNum: 10
        }
    },
    computed: {
        cp_list(){
            return this.items.filter(v=>true) 
        }
    },
    created() {

    },
    mounted() {

    },
    methods: {
        add: function () {
            this.items.push(true)
        },
        remove: function () {
            this.items= this.items.filter(v=>v===false)
        },
    }
}
</script>

<style scoped lang="less">
.list-item {
  display: none;
  margin-right: 10px;
  opacity: 0;
  background: #2ED095;
  border-radius: 50%;
  width: 15px;
  height: 15px;
}
.list-enter-active, .list-leave-active {
  transition: all .5s;
  opacity: 1;
  display: inline-block;
}
.list-enter{
  transform: translate3d(-10px,300px,0);
}
</style>
