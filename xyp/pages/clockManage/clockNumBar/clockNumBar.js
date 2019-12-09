// pages/clockManage/clockNumBar.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },
    /**
     * 组件的初始数据
     */
    data: {
        active: '1'
    },

    /**
     * 组件的方法列表
     */
    methods: {
        numBarChange (e) {
            let { iscompleted } = e.currentTarget.dataset;
            this.setData({
                active: iscompleted
            })
            this.triggerEvent('numBarChange', iscompleted)
        }
    }
})
