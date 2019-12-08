<template>
<<<<<<< Updated upstream
  <div class="rowItem" :class="rowItem.class">
=======

  <div class="rowItem" :class="(rowItem.classId||rowItem.class)">
>>>>>>> Stashed changes
    <div class="tit">{{rowItem.tit}}</div>
    <!-- 全部 -->
    <div
      class="all itm"
      :class="{active:1}"
      @click="allHandlerClick"
      v-if="rowItem.list&&rowItem.list.length&&rowItem.class!=='date'"
    >全部</div>
    <!-- 列表 -->
    <div
      class="wrapper"
      :class="{notShowAll:notShowAll,dateStyle:rowItem.class==='date'}"
      v-if="rowItem.list&&rowItem.list.length"
    >
      <ul class="list" ref="ulel">
        <li
          class="item itm"
          :class="{active:item.id==rowItem.list[0].id&&rowItem.class=='date',activeFirst:item.id==rowItem.list[0].id}"
          v-for="item in rowItem.list"
          :key="item.id"
          @click="itemHandlerClick(item)"
        >{{item.name}}</li>
      </ul>
    </div>
    <!-- 查看更多 -->
    <div
      v-if="rowItem.list&&rowItem.list.length&&rowItem.class!=='date'"
      class="lookMore"
      v-show="showMore"
      @click="notShowAll=!notShowAll"
    >{{notShowAll&&"查看更多"||'收起'}}</div>
    <!-- 日期选择器 -->
    <div v-else-if="rowItem.class==='date'">
      <el-date-picker
        v-model="dateData"
        size="small"
        type="daterange"
        range-separator="-"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :clearable="false"
        @change="datePickerChange"
      ></el-date-picker>
    </div>
    <!-- 自定义插槽内容 -->
    <div class="slotEl" v-else>
      <slot name="con_slot"></slot>
    </div>
  </div>
  
</template>
<script>
export default {
    name: "RowItem",
    componentName: 'RowItem',
    props: {
        rowItem: {
            type: Object,
            default() {
                return {
                    tit: "",
                    class: "", //类型,为date时为日期选择组件，可以作为类名
                    list: [
                        {
                            id: "",
                            name: ""
                        }
                    ]
                };
            }
<<<<<<< Updated upstream
        },
        fn:Function

    },
    data() {
        return {
            params: {
                id: "",
                name: ""
            },
            showMore: true,
            notShowAll: true,
            dateData: [],
            dateDataInit: true
        };
    },
    watch: {
        params: {
            deep: true,
            handler(val) {
                if (this.rowItem.class !== "date") {
                    this.$emit("rowItemSelectChange", this.params);
                }
            }
        },
        dateData: {
            deep: true,
            handler(val) {
                if (!this.dateDataInit) {
                    this.$emit("rowItemDateChange", this.dateData);
                    this.fn('fn执行')
                }
            }
        }
=======
          ]
        };
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
      notShowAll: true,
      dateData: [],
      dateDataInit: true
    };
  },
  watch: {
    params: {
      deep: true,
      handler(val) {
        if (this.rowItem.class !== "date") {
          this.$emit("rowItemSelectChange", this.params);
        }
      }
    },
    dateData: {
      deep: true,
      handler(val) {
        if (!this.dateDataInit) {
          this.$emit("rowItemDateChange", this.dateData);
        }
      }
    }
  },
  computed: {},
  mounted() {
    if (this.rowItem.class === "date") {
      this.initDatePicker();
    }
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
      if (!this.params.id || !this.params.name) return;
      this.params = {};
      this.style();
    },
    itemHandlerClick(item) {
      if (this.params.id === item.id && this.params.name === item.name) return;
      if (this.rowItem.class === "date") {
        this.dateData = this.dateData || [];
        this.dateData.splice(0, 1, this.computeDate(parseInt(item.id)));
        this.dateData.splice(1, 1, this.computeDate(0));
        this.$nextTick(()=>{
          this.dateDataInit = false;
        })
      }
      this.params = item;
      this.style();
>>>>>>> Stashed changes
    },
    computed: {},
    created() {
        this.$on('RowItemTest',this.RowItemTestFn)
    },
    mounted() {
        console.log('this.$el=>', this.$el);
        if (this.rowItem.class === "date") {
            this.initDatePicker();
        }
        this.isShowLookMore();
        window.addEventListener("resize", this.isShowLookMore);
    },
<<<<<<< Updated upstream
    beforeDestroy() {
        window.removeEventListener("resize", this.isShowLookMore);
=======
    initDatePicker() {
      document
        .querySelectorAll(
          `.${this.rowItem.classId || this.rowItem.class} .activeFirst`
        )[0]
        .click();    
>>>>>>> Stashed changes
    },
    methods: {
        RowItemTestFn(val){
            console.log('RowItemTest=>',val);
        },
        isShowLookMore() {
            this.showMore =
                this.$refs.ulel && this.$refs.ulel.getBoundingClientRect().height > 38;
        },
        allHandlerClick() {
            if (!this.params.id || !this.params.name) return;
            this.params = {};
            this.style();
        },
        itemHandlerClick(item) {
            if (this.params.id === item.id && this.params.name === item.name) return;
            if (this.rowItem.class === "date") {
                this.dateData = this.dateData || [];
                this.dateData.splice(0, 1, this.computeDate(parseInt(item.id)));
                this.dateData.splice(1, 1, this.computeDate(0));
                this.$nextTick(() => {
                    this.dateDataInit = false;
                });
            }
            this.params = item;
            this.style();
        },
        style() {
            (
                this.$el.querySelectorAll(
                    `.${this.rowItem.class} .itm`
                ) || []
            ).forEach(itm => {
                itm.classList.remove("active");
            });
            if (event) event.currentTarget.classList.add("active");
        },
        datePickerChange(val) {
            this.params = {};
            this.style();
            if (!val) {
                this.initDatePicker();
            }
            // this.$emit("rowItemSelectChange", this.dateData);
        },
        initDatePicker() {
            this.$el
                .querySelectorAll(
                    `.${this.rowItem.class} .activeFirst`
                )[0]
                .click();
        },
        //获取指定时间
        computeDate(n) {
            var s;
            var n = n;
            var d = new Date();
            var year = d.getFullYear();
            var mon = d.getMonth() + 1;
            var day = d.getDate();
            if (day <= n) {
                if (mon > 1) {
                    mon = mon - 1;
                } else {
                    year = year - 1;
                    mon = 12;
                }
            }
            d.setDate(d.getDate() - n);
            year = d.getFullYear();
            mon = d.getMonth() + 1;
            day = d.getDate();
            s =
                year +
                "-" +
                (mon < 10 ? "0" + mon : mon) +
                "-" +
                (day < 10 ? "0" + day : day);
            return s;
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
  .all {
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
  .dateStyle {
    width: 300px;
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
