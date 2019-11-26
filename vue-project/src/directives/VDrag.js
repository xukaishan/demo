
const vDrag = {
    bind(el, { value }) {
        el.$value = value || true; // 用一个全局属性来存传进来的值，因为这个值在别的钩子函数里还会用到
        if (el.$value) {
            const target = el.children[0];
            const header = target.children[0];
            console.log('el=>',el);
            console.log('header=>',header);
            // 鼠标手型
            header.style.cursor = 'move';
    
            header.onmousedown = (e) => {
        
                // 记录按下时鼠标的坐标和目标元素的 left、top 值
                const currentX = e.clientX;
                const currentY = e.clientY
                const left = parseInt(getAttr(target, 'left'));
                const top = parseInt(getAttr(target, 'top'));
                
                document.onmousemove = (event) => {
                
                    // 鼠标移动时计算每次移动的距离，并改变拖拽元素的定位
                    const disX = event.clientX - currentX;
                    const disY = event.clientY - currentY;
                    target.style.left = `${left + disX}px`;
                    target.style.top = `${top + disY}px`;
                    
                    // 阻止事件的默认行为，可以解决选中文本的时候拖不动
                    return false
                }
                
                // 鼠标松开时，拖拽结束
                document.onmouseup = () => {
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            }
        }
    },
     // 每次重新打开 dialog 时，要将其还原
     update(el) {
        const target = el.children[0];
        target.style.left = '';
        target.style.top = '';
    },
    
    // 最后卸载时，清除事件绑定
    unbind(el) {
        const header = el.children[0].children[0];
        header.onmousedown = null;
    },
    // 当传进来的值更新的时候触发
    componentUpdated(el, { value }) {
        el.$value = value;
    },

}
const getAttr = (obj, key) => (
    obj.currentStyle
    ? obj.currentStyle[key]
    : window.getComputedStyle(obj, false)[key]
);


export default vDrag