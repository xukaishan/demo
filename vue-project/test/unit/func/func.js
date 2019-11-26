/*
 * @Description: 
 * @Author: xuks
 * @Date: 2019-07-19 14:32:03
 * @LastEditTime: 2019-09-06 15:48:58
 */
export const msg = (message) => {
    let myMsg = document.createElement('div');
    myMsg.innerHTML = `<span class='my-msg-cancel-btn'></span><p>${message}</p>`;
    document.body.append(myMsg);
    myMsg.classList.add('my-msg');

    let my_msg_cancel_btn = document.querySelectorAll('.my-msg-cancel-btn')[0];
    my_msg_cancel_btn.addEventListener('click', () => {
        myMsg.remove();
    })
    setTimeout(function () {
        myMsg.remove();
    }, 2500)
}


/**防抖 延迟调用
 * @description: 
 * @param {type} 
 * @return: 
 */
export const debounce = (func, delay, immediate) => {
    var timer = null;
    return function () {
        var context = this;
        var args = arguments;
        if (timer) clearTimeout(timer);
        if (immediate) {
            var doNow = !timer;
            timer = setTimeout(function () {
                timer = null;
            }, delay);
            if (doNow) {
                func.apply(context, args);
            }
        } else {
            timer = setTimeout(function () {
                func.apply(context, args);
            }, delay);
        }
    }
}
/* 递归 */
function cpt_menu(arr) {
    return arr.map(itm => {
      return (
        (itm.children &&
          itm.children.length && {
            id: itm.index,
            tit: itm.label,
            children: cpt_menu(itm.children)
          }) || { id: itm.index, tit: itm.label }
      );
    });
  }