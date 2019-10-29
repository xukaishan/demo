<template>
  <div class="home">
    <el-upload
      class="upload-demo"
      action="http://localhost:3000/api/question/excel/upload"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      multiple
      :limit="3"
      :name="fileDatas"
      :data="params"
      :on-exceed="handleExceed"
      :on-success="handleSuccess"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    <el-button size="small" type="primary" @click="toggle">切换</el-button>
    <transition name="fade">
      <RowItem v-show="show" :rowItem="rowItem1" @rowItemSelectChange="rowItemSelectChange1" />
    </transition>
    
      <my-video :sources="itm.sources" :options="itm.options" v-for="(itm,idx) in video" :key='idx'></my-video>
    
  </div>
</template>

<script>
import RowItem from "@/components/RowItem.vue";
import myVideo from 'vue-video'
export default {
    components: {
        RowItem,
        myVideo
    },
    data() {
        return {
            params: {
                id: 1,
                name: 'kaola'
            },
            fileDatas: 'fileDatas',
            show: true,
            rowItem1: {
                tit: "年级",
                class: "grade",
                list: [{ id: "12345", name: "一年级" },
                { id: "12344", name: "二年级" },
                { id: "12343", name: "三年级" }]
            },
            video: [
                {
                    sources: [{
                        src: 'http://jayvideo.youxuepai.com/market/course/jiag01.mp4',
                        type: 'video/mp4'
                    }],
                    options: {
                        autoplay: false,
                        volume: 0.6,
                        poster: 'http://jayvideo.youxuepai.com/market/course/jiag01.jpg'
                    }
                },
                {
                    sources: [{
                        src: 'http://jayvideo.youxuepai.com/market/course/jiag02.mp4',
                        type: 'video/mp4'
                    }],
                    options: {
                        autoplay: false,
                        volume: 0.6,
                        poster: 'http://jayvideo.youxuepai.com/market/course/jiag02.jpg'
                    }
                },
            ],
        };
    },
    computed: {

    },
    watch: {

    },
    mounted() {
        this.getData('type').then(data => {
            return this.checkType(data)
        }).then(res => {
            console.log('res=>', res);
        }).catch(err => {
            console.log('err=>', err);
        })
    },
    methods: {
        toggle() {
            setTimeout(() => {
                this.rowItem1.list = [
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
                this.show = !this.show;
            }, 1000)
        },
        rowItemSelectChange1(val) {
            console.log('val=>', val);
        },
        handleSuccess(response, file, fileList) {
            console.log('response=>', response);
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${file.name}？`);
        },
        getData(type) {
            return new Promise((resolve, reject) => {
                setTimeout(function () {
                    console.log('1=>', 1);
                    if (type === 'type1') {
                        resolve(1)
                    } else {
                        reject(2)
                    }
                }, 30);
            })
        },
        checkType(num) {
            if (num === 1) {
                return Promise.resolve('num=1')
            } else {
                return Promise.reject('num=2')
            }
        }
    }
};
</script>

<style scoped lang="less">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>