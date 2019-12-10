// component/select-tab/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        tabLists: {
            type: Array,
            value: [
                {
                    idx: '0',
                    label: '全部活动打卡',
                    type: 'drop',//select筛选，drop下拉
                    isOpen: false,
                    children: [
                        {
                            idx: '0',
                            label: '全部活动打卡',
                        },
                        {
                            idx: '0-1',
                            label: '活动打卡1',
                        },
                        {
                            idx: '0-2',
                            label: '活动打卡2',
                        },
                        {
                            idx: '0-3',
                            label: '活动打卡3',
                        },
                        {
                            idx: '0-4',
                            label: '活动打卡4',
                        },
                        {
                            idx: '0-5',
                            label: '活动打卡5',
                        },
                    ]
                },
                {
                    idx: '1',
                    label: '全部机型',
                    type: 'drop',
                    isOpen: false,
                    children: [
                        {
                            idx: '1',
                            label: '全部机型',
                        },
                        {
                            idx: '1-1',
                            label: '机型1',
                        },
                        {
                            idx: '1-2',
                            label: '机型2',
                        },
                    ]
                },
                {
                    idx: '2',
                    label: '打卡天数',
                    type: 'select',
                    isOpen: false,
                },
            ]
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        activeIdx: '0',
        activeSubIdx: '0-0',
        tabList: [],
    },
    attached: function () {
        this.setData({
            tabList: this.properties.tabLists
        })
    },
    /**
     * 组件的方法列表
     */
    methods: {
        handleTabItem (e) {
            let { item } = e.currentTarget.dataset;
            let arr = [...this.data.tabList];
            this.setData({
                activeIdx: item.idx,
                activeSubIdx: item.idx,
                tabList: arr.map(v => {
                    if (item.idx === v.idx) {
                        return Object.assign(item, {
                            isOpen: !item.isOpen
                        })
                    } else {
                        return v
                    }
                })
            })
            if( item.type === 'select'){
                this.triggerEvent("selectTabChange", item)
            }
        },
        selectTabChange (e) {
            let { idx, label } = e.target.dataset.subitem;
            let arr = [...this.data.tabList];
            this.setData({
                activeSubIdx: idx,
                tabList: arr.map(v => {
                    if (this.data.activeIdx === v.idx) {
                        return Object.assign(v, {
                            isOpen: !v.isOpen,
                            label,
                            idx
                        })
                    } else {
                        return v
                    }
                })
            })
            this.triggerEvent("selectTabChange", {idx, label})
        },
    }
})

