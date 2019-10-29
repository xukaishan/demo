<template>
  <div class>
    <yxpSelector :rowItem="rowItem1" @rowItemDateChange="rowItemSelectChange1" />
    <yxpSelector :rowItem="rowItem2" @rowItemSelectChange="rowItemSelectChange2" />
    <yxpSelector :rowItem="rowItem3" @rowItemSelectChange="rowItemSelectChange3" />
  </div>
</template>

<script>
import yxpSelector from "yxp_selector";
export default {
    name: 'ContentBase',
    components: {
        yxpSelector
    },
    data() {
        return {
            rowItem1: {
                tit: "日期",
                class: "date",
                classId: 'date2',
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
        }
    },
    methods: {
        rowItemSelectChange1(val) {
            console.log(val);
        },
        rowItemSelectChange2(val) {
            console.log(val);
        },
        rowItemSelectChange3(val) {
            console.log(val);
        }
    }
}
</script>

<style scope lang="less">
</style>
