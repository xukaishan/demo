<template>
  <div class="headerTab">
    <div class="head">
      <img :src="imgSrc" />
      <div class="selector" @touchstart="selectorTouchStart">{{val.name}}</div>
    </div>
    <div class="tabBox">
      <div class="textBox">
        <TextCard :text="textCardData" />
      </div>
      <div class="tab">
        <router-link to="/contentBase/BaseOral">
          <span
            class="item"
            :class="{active:$route.path=='/contentBase/BaseOral'||$route.path=='/contentBase'}"
          >基础口语</span>
        </router-link>
        <router-link to="/contentBase/RaiseOral">
          <span
            class="item"
            :class="{active:$route.path=='/contentBase/RaiseOral'}"
          >拔高口语</span>
        </router-link>
        <router-link to="/contentBase/PracticalOral">
          <span class="item" :class="{active:$route.path=='/contentBase/PracticalOral'}">实操口语</span>
        </router-link>
      </div>
      <!-- 路由出口 -->
      <div class="pageRouter">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import TextCard from "@/components/common/TextCard";
export default {
  name: "HeaderTab",
  components: { TextCard },
  props: {},
  data() {
    return {
      imgSrc: require("@assets/images/head.png"),
      textCardData: {}
    };
  },
  created() {
    this.val = JSON.parse(localStorage.getItem("gradeInfo"));
    this.textCardData = [
      {
        desc:
        "你可能死记硬背低效学习英语，<br/>我选择将口语融入生活，<br/>学口语，就用优学派。"
      },
      {
        desc:
        "还在死记硬背低效学英语？<br/>不要再学“哑巴英语”了！<br/>用优学派，学习将英语口语融入日常生活，<br/>一起来试试下面这些精品课程吧！"
      }
    ][[3,4,5,6].includes(this.val.id) && 1 || 0 ]
  },
  mounted() {},
  methods: {
    selectorTouchStart() {
      this.$router.push("/");
    }
  }
};
</script>


<style scoped lang='less'>
.headerTab {
  font-size: 0;
  background: #fff;

  .head {
    position: relative;
    img {
      width: 100%;
    }
    .selector {
      position: absolute;
      width: 1.56rem;
      height: 0.6rem;
      background: #fff;
      border-radius: 0.3rem;
      top: 18px;
      right: 6px;
      display: flex;
      align-items: center;
      font-size: 0.3rem;
      color: #ff8017;
      &::before {
        content: "";
        display: block;
        width: 0.3rem;
        height: 0.3rem;
        background-image: url("../../assets/images/select.png");
        background-size: cover;
        margin: 0 5px;
      }
    }
  }
  .tabBox {
    position: absolute;
    top: 80%;
    left: 0;
    .textBox {
    }
    .tab {
      width: 100%;
      background: #fff;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #f1f1f1;
      a {
        display: inline-block;
        width: 30%;
      }
      .item {
        display: inline-block;
        width: 100%;
        font-size: 0.34rem;
        font-weight: 600;
        text-align: center;
        line-height: 0.8rem;
        box-sizing: border-box;
        &.active {
          border-bottom: 2px solid #ff8017;
          color: #ff8017;
        }
      }
    }
    .pageRouter {
      font-size: 0.3rem;
    }
  }
}
</style>
