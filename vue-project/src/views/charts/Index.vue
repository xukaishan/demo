<template>
  <div class="charts">
    <MyButton @btnClick="btnClick" :on-handler='onHandler'>excel</MyButton>
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
import { Promise } from 'q';
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
      this.handClick().then(res=>{
        console.log('res',res)
      }).catch(err=>{
        console.log(2,err)
      })
    },
    handClick(){
      return this.$get("/getExcelData").then(res => {
        if(res) {
          console.log(res);
          this.tableData = res[0].data;
          return res;
          // return Promise.resolve(res)
        };
      }).catch(err=>{
        console.log(1,err);
        return Promise.reject(err)
      });
    },
    onHandler(val){
        console.log('val=>',val);
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