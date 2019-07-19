<template>
  <div class="upload">
    <MyButton @btnClick="btnClick">上传</MyButton>

    <div class="uploadDialog" :class="{'none':isHide}">
      <div class="header">
        <span class>文件上传</span>
        <span class="closeDialog"></span>
      </div>

      <p class="fileName">{{upLoadFileObj.fileName}}</p>
      <div class="progressBarBox">
        <progress id="progressBar" class="progressBar" :value="progressValue" :max="progressMax"></progress>
        <label for="percentage">
          <span id="percentage">{{percentage}}</span>
        </label>
      </div>
      <label for="time">
        <span id="time">{{time}}</span>
      </label>
      <br />
      <input
        style="display:none"
        type="file"
        id="file"
        ref="inputFileElement"
        @change="UpladFile"
        name="myfile"
      />
      <div class="cancleUploadFile">
        <MyButton @btnClick="cancleUploadFile">取消</MyButton>
      </div>
    </div>
  </div>
</template>

<script>
import MyButton from "@/components/MyButton.vue";
import cancleUploadBtn from "@/components/MyButton.vue";
import { setTimeout } from 'timers';

//图片上传
var xhr, ot, oloaded;
export default {
  data() {
    return {
      isHide: true,
      progressValue: 0,
      progressMax: 100,
      percentage: "",
      time: "",
      upLoadFileObj: {
        fileName: "测试文件名字"
      }
    };
  },
  components: {
    MyButton,
    cancleUploadBtn
  },
  methods: {
    btnClick() {
      this.$refs.inputFileElement.click();
    },
    //上传文件方法
    UpladFile() {
      if (!document.getElementById("file").files.length) return;
      this.isHide = false;
      var fileObj = document.getElementById("file").files[0]; // js 获取文件对象
      var url = "http://localhost:3000" + "/api/upload"; // 接收上传文件的后台地址

      this.upLoadFileObj.fileName = fileObj.name;
      var form = new FormData(); // FormData 对象
      form.append("file", fileObj); // 文件对象

      xhr = new XMLHttpRequest(); // XMLHttpRequest 对象
      xhr.open("post", url, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
      xhr.onload = this.uploadComplete; //请求完成
      xhr.onerror = this.uploadFailed; //请求失败

      xhr.upload.onprogress = this.progressFunction; //上传进度调用方法实现
      xhr.upload.onloadstart = function() {
        //上传开始执行方法
        ot = new Date().getTime(); //设置上传开始时间
        oloaded = 0; //设置上传开始时，以上传的文件大小为0
      };

      xhr.send(form); //开始上传，发送form数据
    },

    //上传成功响应
    uploadComplete(evt) {
      //服务断接收完文件返回的结果
      var res = JSON.parse(evt.target.response);
      if (res.errcode == 0) {
        this.$msg(res.errmsg); //使用自定义封装组件
        this.formartUpLoad();
      } else {
        this.$msg("上传失败！请重试");
      }
    },
    //上传失败
    uploadFailed(evt) {
      this.$msg("上传失败！请重试");
    },
    //取消上传
    cancleUploadFile() {
      xhr.abort();
      this.formartUpLoad();
      this.$msg("上传已取消！");
    },
    formartUpLoad() {
      //关闭上传框及上传复位
      setTimeout(()=>{
        this.isHide = true;
        this.progressMax = 100;
        this.progressValue = 0;
        this.percentage = "";
      },1000)
    },

    //上传进度实现方法，上传过程中会频繁调用该方法
    progressFunction(evt) {
      // event.total是需要传输的总字节，event.loaded是已经传输的字节。如果event.lengthComputable不为真，则event.total等于0
      if (evt.lengthComputable) {
        this.progressMax = evt.total;
        this.progressValue = evt.loaded;
        this.percentage = Math.round((evt.loaded / evt.total) * 100) + "%";
      }
      var nt = new Date().getTime(); //获取当前时间
      var pertime = (nt - ot) / 1000; //计算出上次调用该方法时到现在的时间差，单位为s
      ot = new Date().getTime(); //重新赋值时间，用于下次计算
      var perload = evt.loaded - oloaded; //计算该分段上传的文件大小，单位b
      oloaded = evt.loaded; //重新赋值已上传文件大小，用以下次计算
      //上传速度计算

      var speed = perload / pertime; //单位b/s
      var bspeed = speed;
      var units = "b/s"; //单位名称
      if (speed / 1024 > 1) {
        speed = speed / 1024;
        units = "k/s";
      }
      if (speed / 1024 > 1) {
        speed = speed / 1024;
        units = "M/s";
      }
      speed = speed.toFixed(1);
      //剩余时间
      var resttime = ((evt.total - evt.loaded) / bspeed).toFixed(1);
      this.time = "速度：" + speed + units + "，剩余时间：" + resttime + "s";
      if (bspeed == 0) time.innerHTML = "上传已取消";
    }
  }
};
</script>

<style lang="less" scoped>
.none {
  display: none !important;
}
.upload {
  .uploadDialog {
    font-size: 10px;
    width: 450px;
    height: 180px;
    padding: 20px;
    box-sizing: border-box;
    background-color: #fff;
    border: 1px solid #f3f3f3;
    box-shadow: 0px 0px 10px 1px;
    border-radius: 12px;
    position: fixed;
    top: 35vh;
    left: 40vw;
    z-index: 999;
    overflow: hidden;
    .fileName {
      margin: 10px 0;
    }
    .progressBarBox {
      margin-bottom: 6px;
      .progressBar {
        height: 15px;
        width: 350px;
      }
    }
    .cancleUploadFile {
      display: flex;
      justify-content: flex-end;
      margin: 20px 0;
    }
  }
}
</style>