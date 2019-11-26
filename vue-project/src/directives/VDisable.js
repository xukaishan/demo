
const vDisable = {
    bind(el, { value }) {
        el.$value = value||true; // 用一个全局属性来存传进来的值，因为这个值在别的钩子函数里还会用到
        if(el.$value){
            el.style.cursor = 'not-allowed'
            el.style.disabled = 'true'
            el.style.pointerEvents = 'none'
        }
        
    },
    // 当传进来的值更新的时候触发
    componentUpdated(el, { value }) {
        el.$value = value;
    },
}

export default vDisable