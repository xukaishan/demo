<template>
  <div class="ueditor">
    <div class="cav" id="cav">
      <canvas id="canvas"></canvas>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      canvasPaint: {} //定义一个全局对象，把canvas的各种状态存进去
    };
  },
  components: {},
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const canvasPaint = this.canvasPaint;
      canvasPaint.canvas = document.getElementById("canvas");
      canvasPaint.ctx = document.getElementById("canvas").getContext("2d");
      canvasPaint.ctx.lineCap = "round"; //让结束线帽呈现圆滑状
      canvasPaint.ctx.lineJoin = "round"; //交汇时呈现圆滑状
      canvasPaint.ctx.strokeWidth = 5; //描边宽度
      canvasPaint.ctx.lineWidth = 5; //线条宽度
      // 监听开始滑动
      canvasPaint.canvas.addEventListener(
        "touchstart",
        this.startEventHandler,
        { passive: false }
      );
      console.log(canvasPaint)
    },
    startEventHandler() {
       console.log('touchstart')
      event.preventDefault();
      const canvasPaint = this.canvasPaint;
      canvasPaint.ctx.beginPath(); //每次都是一个新路径,不写会和上个字的最后一笔连起来
      canvasPaint.canvas.addEventListener("touchmove", this.moveEventHandler, {
        passive: false
      });
      canvasPaint.canvas.addEventListener("touchend", this.endEventHandler, {
        passive: false
      });
    },
    moveEventHandler() {
      console.log('touchmove')
      event.preventDefault();
      const canvasPaint = this.canvasPaint; 
      var coverPos = canvasPaint.canvas.getBoundingClientRect();
      canvasPaint.mouseX = event.touches[0].clientX - coverPos.left;
      canvasPaint.mouseY = event.touches[0].clientY - coverPos.top;
     
        //后续为拖动画布功能设置的状态
        canvasPaint.ctx.lineTo(
          //使用lineTo将移动过的坐标绘制成线
          canvasPaint.mouseX,
          canvasPaint.mouseY
        );
        console.log(canvasPaint,coverPos,event)
        canvasPaint.ctx.stroke(); //绘制
    },
    endEventHandler() {
      event.preventDefault();
       console.log('touchend')
      const canvasPaint = this.canvasPaint;
      //抬起手指时取消move和end事件的监听
      canvasPaint.canvas.removeEventListener(
        "touchmove",
        this.moveEventHandler,
        false
      );
      canvasPaint.canvas.removeEventListener(
        "touchend",
        this.endEventHandler,
        false
      );
    },
    clearCanvas() {
      canvasPaint.ctx.clearRect(
        0,
        0,
        canvasPaint.canvas.width,
        canvasPaint.canvas.height
      );
    }
  }
};
</script>

<style scoped lang='less'>
.cav {
  width: 100%;
  height: 500px;
  box-sizing: border-box;
  border: 1px solid #f1f1f1;
  #canvas{
    z-index: 1000;
    color: black;
    width: 100%;
    height: 100%;
  }
}
</style>