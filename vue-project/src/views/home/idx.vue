<template>
  <div class>
    <!-- <MyButton @btnClick="btnClick" :on-handler="onHandler">excel</MyButton> -->
    <!-- <el-select v-model="value" placeholder="请选择" @change="change">
      <el-option v-for="item in cities" :key="item.value" :label="item.label" :value="item.value">
        <span style="float: left">{{ item.label }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
      </el-option>
    </el-select>-->
    <el-select
      v-model="value"
      filterable
      remote
      reserve-keyword
      placeholder="请输入关键词"
      :remote-method="remoteMethod"
      :loading="loading"
    >
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
  </div>
</template>

<script>
import MyButton from "@/components/MyButton.vue";
export default {
    name: '',
    data() {
        return {
            options: [],
            value: [],
            list: [],
            loading: false,
            states: ["阿凡达", "问问", "去玩儿",
                "未确认废弃物", "去玩儿", "人情味儿",
                "Connecti阿斯顿发生cut", "王二", "王二",
                "宣传部", "微软", "Ida清热ho", "我问他",
                ],
            cities: [{
                value: 'Beijing',
                label: '北京'
            }, {
                value: 'Shanghai',
                label: '上海'
            }, {
                value: 'Nanjing',
                label: '南京'
            }, {
                value: 'Chengdu',
                label: '成都'
            }, {
                value: 'Shenzhen',
                label: '深圳'
            }, {
                value: 'Guangzhou',
                label: '广州'
            }],

        }
    },
    components: {
        MyButton
    },
    computed: {

    },
    mounted() {
        this.list = this.states.map(item => {
            return { value: item, label: item };
        });
    },
    methods: {
        change(val) {
            console.log('val=>', val);
            console.log('value=>', this.value);
        },
        btnClick(data) {
            console.log('data=>', data);
            /*  const params = {
                 extensions: {
                     query: { id: "249431a8e4d85e459f6c29eb808e76d0" },
                 },
                 operationName: "",
                 query: "",
                 variables: { size: 20, after: "", afterPosition: "" }
             }
              this.$post("", params).then(res => {
                 console.log(res);
             }); */
            const params = {
                id: '1181845144564015106',
                qualified: 0
            }
            this.$post("/reviewTaskList/updateQualified", params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(res => {
                console.log(res);
            });

        },
        onHandler(val) {
            console.log('val=>', val);
        },
        remoteMethod(query) {
            console.log('this.value=>',this.value);
            if (query !== '') {
                this.loading = true;
                setTimeout(() => {
                    this.loading = false;
                    this.options = this.list.filter(item => {
                        return item.label.toLowerCase()
                            .indexOf(query.toLowerCase()) > -1;
                    });
                }, 200);
            } else {
                this.options = [];
            }
        }
    }
}



</script>

<style scope lang="">
</style>
