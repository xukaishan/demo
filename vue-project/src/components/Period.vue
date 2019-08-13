<template>
  <div class="period">
    <div class="nav">
      <div class="navbar" @click="isShow=!isShow">
        <span class="navtit barItem">{{seleResult||'全部'}}</span>
        <span class="barItem">
          <i class="icon"></i>
        </span>
      </div>
      <div class="content" v-show="isShow">
        <div class="item">
          <span class="itemTit spanItem" @click="allHandlerClick">全部</span>
        </div>
        <div class="item" v-for="item in navArr" :key="item.id">
          <span class="itemTit spanItem" @click="itemHandlerClick(item)">{{item.name}}</span>
          <div class="sub">
            <span
              class="subItem spanItem"
              @click="subItemHandlerClick(item,v)"
              v-for="v in item.subjectList"
              :key="v.id"
            >{{v.name}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Nav",
  props: {
    navArr: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      isShow: false,
      seleResult: "",
      params: {
        periodId: "",
        subjectName: ""
      }
    };
  },
  computed: {},
  mounted() {},
  watch: {
    params: {
      deep: true,
      handler(val) {
        this.$emit("navChange", this.params);
        this.isShow = false;
      }
    }
  },
  methods: {
    /* 全部 */
    allHandlerClick() {
      this.params = {};
      this.style(event, "全部");
    },
    /* 学段 */
    itemHandlerClick(item) {
      this.params = {
        periodId: item.id
      };
      this.style(event, `${item.name}`);
    },
    /* 科目 */
    subItemHandlerClick(item, v) {
      this.params = {
        periodId: item.id,
        subjectName: v.name
      };
      this.style(event, `${item.name}-${v.name}`);
    },
    style(e, text) {
      (document.querySelectorAll(".period .spanItem") || []).forEach(itm => {
        itm.style.background = "#fff";
        itm.style.color = "#000";
      });
      e.currentTarget.style.background = "#2ed095";
      e.currentTarget.style.color = "#fff";
      this.seleResult = text;
    }
  }
};
</script>

<style scoped lang='less'>
.period {
  .nav {
    width: 200px;
    font-size: 14px;
    .navbar {
      border-radius: 6px 6px 0 0;
      text-align: center;
      background: #2ed095;
      cursor: pointer;
      display: flex;
      height: 34px;
      .barItem {
        display: inline-block;
        width: 50%;
        text-align: left;
        padding-right: 5px;
      }
      .navtit {
        line-height: 34px;
        color: #fff;
        text-align: right;
      }
      .icon {
        display: inline-block;
        height: 34px;
        width: 34px;
        background-repeat: no-repeat;
        background-position: 50%;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAOCAYAAADJ7fe0AAAANElEQVQokWP8////fwYKAROlBjAwMDCwMDAwMFJsSGNjI8UuYaRCkFAvTEZjBxWMxg4mAACzUQ8i/7d+cgAAAABJRU5ErkJggg==);
      }
    }
    .content {
      padding: 10px;
      border: 1px solid #2ed095;
      border-top: none;
      .item {
        border-bottom: 1px solid #2ed095;
        padding: 10px 0;
        &:last-child {
          border: none;
        }
        .spanItem {
          cursor: pointer;
          border-radius: 5px;
          padding: 3px 6px;
          margin-right: 12px;
        }
        .itemTit {
          display: inline-block;
          color: #2ed095;
        }
        .sub {
          .subItem {
            display: inline-block;
            margin-top: 10px;
            margin-right: 5px;
          }
        }
      }
    }
  }
}
</style>
