/**
 * Notice.js
 * bill Liao
 */

//https://www.liaojian.top/blog/2018/04/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%8F%8D%E5%90%91%E4%BC%A0%E5%80%BC.html

module.exports = {
  /**
   * 观察者通过 register 方法订阅相关的事件和对应的回调函数
   * event: 订阅的事件名称
   * selector: 回调的函数
   * ctx: 观察者对象
  */
  //notification
  register: function (event, selector, ctx) {
    if (typeof selector != "function") {
      console.error('selector must be a function')
      return
    }

    this._stores = this._stores || {}
    this._stores[event] = this._stores[event] || []
    this._stores[event].push({
      cb: selector,
      ctx: ctx
    })
  },

  /**
   * 被观察者通过 post 方法将事件发出去
   * event: 订阅事件的名称
   * parma: 可选，传递出去的参数
  */
  post: function (event) {
    this._stores = this._stores || {}
    var store = this._stores[event]
    if (store) {
      store = store.slice(0)
      var args = [].slice.call(arguments, 1)
      for (var i = 0, len = store.length; i < len; i++) {
        store[i].cb.apply(store[i].ctx, args)
      }
    }
  },

  /**
   * 当改页面的生命周期结束时，调用 remove 方法移除订阅
   * event: 订阅事件的名称
   * selector: 回调的函数 
   */
  remove: function (event, selector) {
    this._stores = this._stores || {}
    if (!arguments.length) {
      this._stores = {}
      return
    }

    var store = this._stores[event]
    if (!store) {
      return
    }

    if (arguments.length === 1) {
      delete this._stores[event]
      return
    }

    var len = store.length
    for (var i = 0; i < len; i++) {
      var cb = store[i].cb
      if (cb === selector) {
        store.splice(i, 1)
        break
      }
    }
    return
  }
}