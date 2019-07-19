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