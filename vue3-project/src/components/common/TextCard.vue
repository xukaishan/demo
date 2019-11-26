<template>
  <div class="textCard">
    <div class="con" v-html="text.desc"></div>
    <div class="down">
      <img :src="require('@/assets/images/down.png')" height="100%" />
    </div>
  </div>
</template>

<script>
export default {
  name: "TextCard",
  components: {},
  props: {
    text: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {}
};
</script>


<style scoped lang='less'>
.textCard {
  width: 100%;
  .con {
    background: #fff;
    width: 96%;
    font-size: 0.3rem;
    border-radius: 0.1rem 0.1rem 0 0;
    padding: 0.3rem;
    margin: 0 2%;
    text-align: center;
  }
  .down {
    height: 0.28rem;
    width: 100%;
    text-align: center;
    margin-bottom: 0.3rem;
  }
}
</style>
