// component/header-tab.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        options: {
            type: Object,
            value: {
                headerTabList: [
                    {
                        id: '1',
                        name: '打卡管理'
                    },
                    {
                        id: '2',
                        name: '打卡统计'
                    },
                    {
                        id: '3',
                        name: '打卡活动'
                    },
                ],
                selectIdDef: '1',
            },
        }
    },
    /**
     * 组件的初始数据
     */
    data: {
        select:'1'
    },
    attached() {
        this.setData({
            select: this.properties.options.selectIdDef
        });
    },
    /**
     * 组件的方法列表
     */
    methods: {
        headTabChange (e) {
            let { item } = e.currentTarget.dataset;
            this.setData({
                select: item.id
            });
            this.triggerEvent('headTabChange', item)
        }
    }
})
