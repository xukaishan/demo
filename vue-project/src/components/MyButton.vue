<template>
  <div class="MyButton">
    <button class="btn" ref="btn" @click="handleClick">
       <slot>按钮</slot>
    </button>
  </div>
</template>

<script>
/*
 *@params options 配置样式
 *@params btnClick 组件点击绑定事件
 */

export default {
  name: "MyButton",
  props: {
    options: {
      type: Object,
      default() {
        return {};
      }
    },
    onHandler:{
        type: Function,
        default: () => {},
    }
  },
  data() {
    return {
      defaultOptions: {
        fontSize: 12,
        width: 70,
        heigth: 20,
        borderRadius: 20,
        color: "#fff",
        background: "#ccc"
      }
    };
  },
  computed: {
    styles() {
      return Object.assign({},this.defaultOptions,this.options);
    }
  },
  mounted() {
    this.setOptions();
  },
  methods: {
    setOptions() {
      let btn = this.$refs.btn;
      let {
        fontSize,
        width,
        heigth,
        color,
        background,
        borderRadius
      } = this.styles;

      btn.style.width = width + "px";
      btn.style.heigth = heigth + "px";
      btn.style.lineHeight = heigth + "px";
      btn.style.fontSize = fontSize + "px";
      btn.style.borderRadius = borderRadius + "px";
      btn.style.color = color;
      btn.style.background = background;
    },
    handleClick(e) {
      this.$emit("btnClick",'123');
      this.onHandler("btnClick");
      
    }
  }
};
</script>

<style scoped lang='less'>
.MyButton {
  .btn {
    outline-style: none;
    border: 0;
    cursor: pointer;
    text-align: center;
  }
}
</style>
