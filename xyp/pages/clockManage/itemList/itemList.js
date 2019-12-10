// pages/clockManage/itemList/itemList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    itemList: {
        type: Array,
        value: [
            {
                ava: '../../../images/me-active.png',
                name: '阿木木',
                day: 14,
                all: 20,
                isPatch:false,
            },
            {
                ava: '../../../images/me-active.png',
                name: '光辉使者',
                day: 10,
                all: 20,
                isPatch:false,
            },
            {
                ava: '../../../images/me-active.png',
                name: '费雷尔卓德',
                day: 7,
                all: 20,
                isPatch:true,
            },
            {
                ava: '../../../images/me-active.png',
                name: '盖伦',
                day: 5,
                all: 25,
                isPatch:false,
            },
        ]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
