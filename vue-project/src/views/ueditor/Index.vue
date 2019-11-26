<template>
  <div class="ueditor">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        v-for="(itm,idx) in myData"
        :key="idx"
        :label="itm.label+'('+itm.num+')'"
        :name="idx+''"
      >
        <component :is="itm.comp" :rowItem="rowItemData" :options="defaultOptions"></component>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import RowItem from "@/components/RowItem.vue";
import ButtonBase from "@/components/MyButton.vue";
export default {
  data() {
    return {
      activeName: 0,
      myData: [
        {
          label: "用户管理",
          num: 0, 
          comp: "ButtonBase"
        },
        {
          label: "配置管理",
          num: 2,
          comp: "ButtonBase"
        },
        {
          label: "角色管理",
          num: 6,
          comp: "RowItem"
        },
        {
          label: "定时任务补偿",
          num: 8,
          comp: "ButtonBase"
        }
      ],
      rowItemData: {
        tit: "日期",
        class: "date",
        classId: "date2",
        list: [
          { id: "7", name: "最近7天" },
          { id: "30", name: "最近30天" },
          { id: "365", name: "最近一年" }
        ]
      },
      defaultOptions: {
        fontSize: 12,
        width: 70,
        heigth: 40,
        borderRadius: 20,
        color: "#fff",
        background: "#ccc"
      }
    };
  },
  components: { RowItem, ButtonBase },
  methods: {
    handleClick(tab, event) {
    //   console.log(tab, event);
    //   console.log('apiFn=>',this.apiFn().then(res=>{console.log('res=>',res);}).catch(err=>{console.log('err=>',err);}));
      console.log(Promise.all([this.apiFn(),this.apiListFn()]).then(res=>{console.log('res=>',res);}).catch(err=>{console.log('err=>',err);}));
    },
    apiFn(){
       /*  return this.$get('').then(res=>{
            if(res) return '1'
        }).catch(err=>{
            return Promise.reject('2')
        }) */
           return new Promise((resolve,reject)=>{
               setTimeout(function () {
                   
                   resolve('setTimeout apiFn resolve')
               },1000)
           
        })
    },
    apiListFn(){
        return new Promise((resolve,reject)=>{
           
               setTimeout(function () {
                   
                   reject('setTimeout apiListFn resolve')
               },5000)
          
        })
    }
  }
};
</script>

<style scoped lang='less'>
</style>