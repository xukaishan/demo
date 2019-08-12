<template>
  <div class="rowItem" :class="rowItem.class">
    <div class="tit">{{rowItem.tit}}</div>
    <div
      class="all itm"
      :class="{active:1}"
      @click="allHandlerClick"
      v-if="rowItem.list&&rowItem.list.length"
    >全部</div>
    <div class="wrapper" :class="{notShowAll:notShowAll}" v-if="rowItem.list&&rowItem.list.length">
      <ul class="list" ref="ulel">
        <li
          class="item itm"
          v-for="item in rowItem.list"
          :key="item.id"
          @click="itemHandlerClick(item)"
        >{{item.name}}</li>
      </ul>
    </div>
    <div
      v-if="rowItem.list&&rowItem.list.length"
      class="lookMore"
      v-show="showMore"
      @click="notShowAll=!notShowAll"
    >{{notShowAll&&"查看更多"||'收起'}}</div>

    <div class="slotEl" v-else>
      <slot name="con_slot"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "RowItem",
  props: {
    rowItem: {
      type: Object,
      default() {
        return {
          tit: "",
          class: "", //绑定的类名
          list: [
            {
              id: "",
              name: ""
            }
          ]
        };
      }
    },
    default: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      params: {
        id: "",
        name: ""
      },
      showMore: true,
      notShowAll: true
    };
  },
  watch: {
    params: {
      deep: true,
      handler(val) {
        this.$emit("rowItemSelectChange", this.params);
      }
    }
  },
  computed: {},
  mounted() {
    this.isShowLookMore();
    window.addEventListener("resize", this.isShowLookMore);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.isShowLookMore);
  },
  methods: {
    isShowLookMore() {
      this.showMore =
        this.$refs.ulel && this.$refs.ulel.getBoundingClientRect().height > 38;
    },
    allHandlerClick() {
      this.params = {};
      this.style();
    },
    itemHandlerClick(item) {
      this.params = item;
      this.style();
    },
    style() {
      (document.querySelectorAll(`.${this.rowItem.class} .itm`) || []).forEach(
        itm => {
          itm.classList.remove("active");
        }
      );
      event.currentTarget.classList.add("active");
    }
  }
};
</script>
<style lang="less">
.rowItem {
  display: flex;
  white-space: nowrap;
  line-height: 28px;
  font-size: 14px;
  cursor: pointer;
  .tit {
    min-width: 80px;
    color: #303133;
    font-weight: 700;
    height: 28px;
    margin-bottom: 10px;
  }
  .all{
      min-width: 50px;
  }
  .all,
  .item {
    margin: 0px 10px;
    padding: 0 10px;
    border-radius: 5px;
    height: 28px;
  }
  .wrapper {
    width: 80%;
    .list {
      display: flex;
      flex-wrap: wrap;
      .item {
        margin-bottom: 10px;
      }
    }
  }

  .notShowAll {
    height: 28px;
    overflow: hidden;
  }
  .lookMore {
    min-width: 80px;
    text-align: center;
    margin-left: auto;
    color: #2ed095;
    height: 28px;
    margin-bottom: 10px;
  }
  .active {
    background: #2ed095;
    color: #fff;
  }
  .slotEl {
    padding-left: 10px;
  }
}
</style>