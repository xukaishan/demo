<template>
  <div class="gradeSelect">
    <div class="tit">请先设置年级</div>
    <div class="gradeGroup">
      <p class="gradeTit">请先选择年级</p>
      <ul class="group">
        <li
          :class="{groupItem:true,active:flag===itm.id}"
          v-for="itm in gradeData"
          :key="itm.id"
          @touchstart="handleTouchStart(itm)"
        >{{itm.name}}</li>
      </ul>
    </div>
    <div class="btn active" @click="btnHandleClick">确定</div>
  </div>
</template>

<script>
export default {
  name: "GradeSelect",
  data() {
    return {
      gradeData: [
        {
          id: 1,
          name: "一年级"
        },
        {
          id: 2,
          name: "二年级"
        },
        {
          id: 3,
          name: "三年级"
        },
        {
          id: 4,
          name: "四年级"
        },
        {
          id: 5,
          name: "五年级"
        },
        {
          id: 6,
          name: "六年级"
        }
      ],
      flag: 1,
      value: { id: 1, name: "一年级" }
    };
  },
  created() {
    this.value = JSON.parse(localStorage.getItem("gradeInfo")) || this.value;
    this.flag =
      (JSON.parse(localStorage.getItem("gradeInfo")) &&
        JSON.parse(localStorage.getItem("gradeInfo")).id) ||
      this.value.id;
  },
  methods: {
    handleTouchStart(itm) {
      this.flag = itm.id;
      this.value = itm;
    },
    btnHandleClick() {
      localStorage.setItem("gradeInfo", JSON.stringify(this.value));
      this.$router.push({
        path: "/contentBase"
      });
    }
  }
};
</script>

<style scoped lang="less">
.gradeSelect {
  background: #fff;
  margin: 0 3%;
  padding: 0 0.32rem;
  border-radius: 0.2rem 0.2rem 0 0;
  height: 80vh;
  position: relative;
  bottom: 5vh;
  .tit {
    text-align: center;
    font-size: 0.4rem;
    font-weight: 700;
    padding: 0.8rem 0;
  }
  .gradeGroup {
    .gradeTit {
      font-size: 0.36rem;
      line-height: 0.36rem;
      font-weight: 600;
      &::before {
        content: "";
        display: inline-block;
        border: 1px solid #fa972e;
        height: 0.36rem;
        width: 0px;
        vertical-align: top;
        margin: 0 0.1rem;
      }
    }
    .group {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .groupItem {
        width: 30%;
        height: 0.6rem;
        border: 1px solid #fa972e;
        border-radius: 0.3rem;
        color: #fa972e;
        line-height: 0.6rem;
        text-align: center;
        margin-top: 0.6rem;
      }
    }
  }
  .btn {
    width: 40%;
    height: 0.8rem;
    border: 1px solid #fa972e;
    border-radius: 0.4rem;
    color: #fa972e;
    line-height: 0.8rem;
    text-align: center;
    position: absolute;
    bottom: 1.8rem;
    left: 50%;
    transform: translateX(-50%);
  }
  .active {
    color: #fff !important;
    background: #fa972e;
  }
}
</style>
