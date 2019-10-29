<template>
  <div class="home">
    <!-- <Menu :list="list"></Menu> -->
    <el-button type="text" @click="dialogVisible = true">点击打开 Dialog</el-button>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose" v-drag="true">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!--  <Nav :navArr="navArr" @navChange="navChange" /> -->
    <!--   <VideoBase/> -->
    <!--  <el-table :data="tableData" :span-method="arraySpanMethod" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="180"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="amount1" sortable label="数值 1"></el-table-column>
      <el-table-column prop="amount2" sortable label="数值 2"></el-table-column>
      <el-table-column prop="amount3" sortable label="数值 3"></el-table-column>
    </el-table>-->
    
   
    <yxpSelector :rowItem="rowItem1" @rowItemDateChange="rowItemSelectChange1" />

    <yxpSelector :rowItem="rowItem01" @rowItemDateChange="rowItemSelectChange01" />
    <yxpSelector :rowItem="rowItem2" @rowItemSelectChange="rowItemSelectChange2" />
    <yxpSelector :rowItem="rowItem3" @rowItemSelectChange="rowItemSelectChange3" />
  </div>
</template>

<script>
import Menu from "@/components/Menu.vue";
import Nav from "@/components/Period.vue";
import VideoBase from "@/components/VideoBase.vue";
import yxpSelector from "yxp_selector";
export default {
    components: {
        Menu,
        Nav,
        VideoBase,
        yxpSelector
    },
    data() {
        return {
            dialogVisible: false,
            list: this.$store.getters["get_menuitems"],
            updateList: [
                {
                    index: "02",
                    label: "一级菜单02",
                    children: [
                        {
                            index: "020201",
                            label: "二级菜单01"
                        },
                        {
                            index: "020202",
                            label: "二级菜单02"
                        }
                    ]
                }
            ],
            navArr: [
                {
                    id: "12312",
                    name: "小学",
                    subjectList: [
                        {
                            id: "12345",
                            name: "语文"
                        },
                        {
                            id: "12344",
                            name: "数学"
                        },
                        {
                            id: "12343",
                            name: "英语"
                        },
                        {
                            id: "12342",
                            name: "马来语"
                        }
                    ]
                },
                {
                    id: "12382",
                    name: "初中",
                    subjectList: [
                        {
                            id: "12385",
                            name: "语文"
                        },
                        {
                            id: "12384",
                            name: "数学"
                        },
                        {
                            id: "12383",
                            name: "英语"
                        },
                        {
                            id: "12382",
                            name: "马来语"
                        }
                    ]
                },
                {
                    id: "1382",
                    name: "高中",
                    subjectList: [
                        {
                            id: "12345585",
                            name: "语文"
                        },
                        {
                            id: "123465784",
                            name: "数学"
                        },
                        {
                            id: "12768383",
                            name: "英语"
                        }
                    ]
                }
            ],
            tableData: [{
                id: '12987122',
                name: '王小虎',
                amount1: '234',
                amount2: '3.2',
                amount3: 10
            }, {
                id: '12987123',
                name: '王小虎',
                amount1: '165',
                amount2: '4.43',
                amount3: 12
            }, {
                id: '12987124',
                name: '王小虎',
                amount1: '324',
                amount2: '1.9',
                amount3: 9
            }, {
                id: '12987125',
                name: '王小虎',
                amount1: '621',
                amount2: '2.2',
                amount3: 17
            }, {
                id: '12987126',
                name: '王小虎',
                amount1: '539',
                amount2: '4.1',
                amount3: 15
            }],
            rowItem1: {
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
            rowItem2: {
                tit: "学期",
                class: "trem",
                list: [
                    { id: "00000", name: "全一册" },
                    { id: "11111", name: "上学期" },
                    { id: "22222", name: "下学期" }
                ]
            },
            rowItem3: {
                tit: "年级",
                class: "grade",
                list: [{ id: "12345", name: "一年级" },
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
                { id: "128403", name: "高三" }]
            },
        };
    },
    computed: {
        cp_menuitems() {
            return this.$store.getters["get_menuitems"];
        }
    },
    watch: {
        cp_menuitems: {
            immediate: true,
            deep: true,
            handler(val) {
                this.list = val
            }
        }
    },
    mounted() {
        //  console.log(this.$el);
    },
    methods: {
        /* 递归换键名 */
        cpt_menu(arr) {
            return arr.map(itm => {
                return (
                    (itm.children &&
                        itm.children.length && {
                            id: itm.index,
                            tit: itm.label,
                            children: this.cpt_menu(itm.children)
                        }) || { id: itm.index, tit: itm.label }
                );
            });
        },
        btnFn() {
            this.$store.dispatch('ac_update_menu', this.updateList)
        },
        navChange(data) {
            console.log(data)
        },
        arraySpanMethod({ row, column, rowIndex, columnIndex }) {
            if (rowIndex % 2 === 0) {
                if (columnIndex === 0) {
                    return [1, 2];
                } else if (columnIndex === 1) {
                    return [1, 1];
                }
            }
        },
        rowItemSelectChange1(val) {
            console.log(val);
        },
        rowItemSelectChange01(val) {
            console.log(val);
        },
        rowItemSelectChange2(val) {
            console.log(val);
        },
        rowItemSelectChange3(val) {
            console.log(val);
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => { });
        },
        
       
    }
};
</script>

<style scoped lang="less">
</style>