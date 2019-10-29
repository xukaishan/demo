<template>
  <div class="compositionBase">
    <ContentBar :content="initData.content"/>
  </div>
</template>

<script>

import ContentBar from "@/components/common/ContentBar";
import grade from "@/assets/js/data";

export default {
  name: "BaseOral",
  components: {
    ContentBar
  },
  props: {},
  data() {
    return {
      initData: {
        content: {}
      }
    };
  },
  created() {
    this.setData(); 
  },
  methods: {
    setData() {
      this.initData =
        grade["grade" + JSON.parse(localStorage.getItem("gradeInfo")).id]["0"];
    }
  },
  beforeRouteEnter(to, from, next) {
    if (!localStorage.getItem("gradeInfo")) {
      next("/");
    } else {
      next();
    }
  }
};
</script>


<style scoped>
.compositionBase {
  margin: 0 3% 0.4rem;
}
</style>
