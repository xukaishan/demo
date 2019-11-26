import disable from './VDisable';
import drag from './VDrag';
// 自定义指令
const directives = {
  disable,
  drag
};
// 这种写法可以批量注册指令
export default {
  install(Vue) {
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key]);
    });
  },
};
