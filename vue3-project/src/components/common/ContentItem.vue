<template>
  <div class="contentItem">
    <div class="tit" v-if="content.icon && content.tit">
      <img :src="content.icon" width="6%" />
      <span class="strong">{{content.tit.split('&')[0]}}</span>
      {{content.tit.split('&')[1] && '&nbsp;-&nbsp;' + content.tit.split('&')[1]||''}}
    </div>
    <div class="wrapper">
      <div
        class="item"
        v-for="(itm,idx) in content.list"
        :key="idx"
        :class="{borderBottom:content.list.length!==1 && idx!==content.list.length-1}"
      >
        <div class="title">{{itm.tit}}</div>
        <div class="desc" v-html="itm.desc"></div>
        <div class="videoBox" @click.stop="videoBoxHandleClick(idx,itm,$event)">
          <div class="bgBox" v-if="index!==idx">
            <img :src="itm.bg" width="100%" />
            <img class="playIcon" :src="playIcon" width="14%" />
          </div>
          <video
            v-else
            :ref="idx"
            width="100%"
            controls
            autoplay
            :poster="itm.bg"
            webkit-playsinline="isiPhoneShowPlaysinline"
            playsinline="isiPhoneShowPlaysinline"
            @click="$event.stopPropagation()"
            @pause="videoPauseAndEnd(itm,$event)"
          >
            <source :src="itm.video" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import action from "@/assets/js/videoCount.js";
export default {
  name: "ContentItem",
  components: {},
  props: {
    content: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      playIcon: require("@assets/images/paly.png"),
      videoShow: false,
      index: "", //点击的index
      startTime: 0,
      endTime: 0
    };
  },
  mounted() {
    // console.log("contentItem=>mounted");
  },
  beforeDestroy() {
    // console.log("contentItem=>beforeDestroy");
  },
  destroyed() {
    // console.log("contentItem=>destroyed");
  },
  methods: {
    videoBoxHandleClick(idx, itm, event) {
      // console.log(itm);
      this.index = idx;
      this.$nextTick(() => {
        if (event.currentTarget.children[0])
          event.currentTarget.children[0].play();

        event.currentTarget.children[0].removeEventListener(
          "play",
          this.videoPlay
        );
      
        event.currentTarget.children[0].addEventListener(
          "play",
          this.videoPlay(itm)
        );
      });
    },
    /* 视频开始播放 */
    videoPlay(itm) {
      // console.log("startTime", action.start(), itm);
      // this.startTime = action.start();
    },
    /* 视频结束播放 */
    videoPauseAndEnd(itm, event) {
      // console.log("endTime", action.end(), itm);
      // action.send({
      //   actionStartTimestamp: this.startTime,
      //   actionEndTimestamp: action.end(),
      //   actionName: itm.tit
      // });
      this.index = "";//还原封面图片盒子（销毁播放器）
    }
  }
};
</script>


<style scoped lang='less'>
.contentItem {
  .tit {
    display: flex;
    align-items: center;
    padding: 0.36rem 0 0.26rem;
    .strong {
      font-weight: 600;
      margin-left: 0.1rem;
    }
  }
  .wrapper {
    background: #fff;
    border-radius: 0.1rem;
    padding: 0.2rem;
    .item {
      margin-top: 0.2rem;
      padding-bottom: 0.24rem;
      &.borderBottom {
        border-bottom: 1px solid #eaeaea;
      }
      &:first-child {
        margin-top: 0;
      }
      .title {
        font-weight: 700;
        line-height: 0.54rem;
        &:before {
          content: "|";
          display: inline-block;
          color: #ff8017;
          margin-right: 0.1rem;
        }
      }
      .desc {
        font-size: 0.26rem;
        padding-bottom: 0.24rem;
      }
      .videoBox {
        position: relative;
        width: 100%;
        font-size: 0;
        video {
          display: block;
        }
        .bgBox {
          margin: 0 auto;
          width: 100%;
          img {
            display: block;
          }
          .playIcon {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
      }
    }
  }
}
</style>
