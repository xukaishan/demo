<template>
  <div class="charts">
    <MyButton @btnClick="btnClick">excel</MyButton>
    <div class="content">
      <table class="mytable">
        <thead class="mythead">
          <tr>
            <th v-for='(item,index) in tableData[0]' :key='index'>{{item}}</th>
          </tr>
        </thead>
        <tbody class="mytbody">
          <tr v-for='(item,index) in tableBodyData' :key='index'>
            <td v-for="(v,i) in item" :key='i'>{{v}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import MyButton from "@/components/MyButton.vue";
export default {
  data() {
    return {
      tableData:[]
    };
  },
  components: {
    MyButton
  },
  computed:{
    tableBodyData(){
      const arr = [...this.tableData]
      arr.splice(0,1);
      return arr   
    }
  },
  methods: {
    btnClick() {
      this.$get("/getExcelData").then(res => {
        console.log(res);
          this.tableData = res[0].data
      });
    }
  }
};
</script>

<style scoped lang='less'>
.charts{
  .content{
    .mytable{
      border-collapse: collapse;
      td,th{
        border: 1px solid #ddd;
      }
      .mythead{

      }
      .mytbody{

      }
    }
  }
}
</style>