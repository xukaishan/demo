<template>
  <div class="contentBar">
    <div class="conBox">
      <ContentItem v-for="(itm,idx) in content['0']" :key="idx" :content="itm" />
    </div>
  </div>
</template>

<script>
import ContentItem from "@/components/common/ContentItem";

export default {
  name: "ContentBar",
  components: {
    ContentItem,
  },
  props: {
    content: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  computed: {
  },
  created() {
   
  }
};
</script>

<style scoped lang="less">
.contentBar {
}
</style>
