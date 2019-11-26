<template>
  <div>
    <RowItem :rowItem="rowItem0" @rowItemDateChange="rowItemSelectChange0" :fn='fn'/>
    <br />
    <RowItem :rowItem="rowItem01" @rowItemDateChange="rowItemSelectChange01" />
<br /><br />1111
     <yxpSelector :rowItem="rowItem0" @rowItemDateChange="rowItemSelectChange0" />
<br />
    <yxpSelector :rowItem="rowItem01" @rowItemDateChange="rowItemSelectChange01" />
   
    <br /> 
    <RowItem :rowItem="rowItem1" @rowItemSelectChange="rowItemSelectChange1" /> 
    <br /> 
    <RowItem :rowItem="rowItem2" @rowItemSelectChange="rowItemSelectChange2">
      <div slot="con_slot">
        <i-input v-model="value" placeholder="请输入..." style="width: 300px"></i-input>
        <i-button @click="resviewHandlerClick">查询</i-button>
      </div>
    </RowItem>
    <br />
    <RowItem :rowItem="rowItem3">
      <template slot="con_slot">
        <i-input v-model="value" placeholder="请输入.." style="width: 300px"></i-input>
        <i-button @click="resviewHandlerClick">查询</i-button>
      </template>
    </RowItem>
  
  </div>
</template>

<script>
import RowItem from "@/components/RowItem.vue";
import yxpSelector from "yxp_selector";
import Emitter from '@/mixins/emitter.js'
export default {
  components: {
    RowItem,
    yxpSelector
  },
   mixins: [Emitter],
  data() {
    return {
      value: "",
      rowItem0: {
        tit: "日期",
        class: "date",
        list: [
          { id: "7", name: "最近7天" },
          { id: "30", name: "最近30天" },
          { id: "365", name: "最近一年" }
        ]
      },
      rowItem01: {
        tit: "日期",
        class: "date",
        list: [
          { id: "7", name: "最近7天" },
          { id: "30", name: "最近30天" },
          { id: "365", name: "最近一年" }
        ]
      },
      rowItem1: {
        tit: "年级",
        class: "grade",
        list: []
      },
      rowItem2: {
        tit: "学期",
        class: "trem",
        list: [
          { id: "22345", name: "全一册" },
          { id: "22344", name: "上学期" },
          { id: "22343", name: "下学期" }
        ]
      },
      rowItem3: {
        tit: "审核人",
        class: "resview"
      }
    };
  },
  mounted(){
    setTimeout(()=>{
      this.rowItem1.list=[
          { id: "12345", name: "一年级" },
          { id: "12344", name: "二年级" },
          { id: "12343", name: "三年级" },
          { id: "12342", name: "四年级" },
          { id: "12341", name: "五年级" },
          { id: "12340", name: "六年级" },
          { id: "123401", name: "七年级" },
          { id: "123402", name: "八年级" },
          { id: "113403", name: "九年级" },
          { id: "124401", name: "高一" },
          { id: "127402", name: "高二" },
          { id: "128403", name: "高三" }
        ]
    },3000)
  },
  methods: {
    resviewHandlerClick() {
      console.log(this.value);
    },
    rowItemSelectChange0(val) {
      console.log(val);
      this.broadcast('RowItem','RowItemTest','RowItemTestdata')
    },
    rowItemSelectChange01(val) {
      console.log(val);
    },
    rowItemSelectChange1(val) {
      console.log(val);
    },
    rowItemSelectChange2(val) {
      console.log(val);
    },
    fn(fn){
            console.log('fn=>',fn);
        }
  }
};
</script>

<style scoped lang='less'>
</style>