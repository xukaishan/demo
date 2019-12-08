function againAuthorizationSubscribeMessage(back) {
  wx.showModal({
    title: '温馨提示',
    content: '需要授权订阅消息才能更好的提供服务哦',
    success: function (res) {
      if (res.confirm) {
        wx.openSetting({
          success: function (res) {
            if (res.authSetting["scope.SubscribeMessage"] == true) {
              back({
                isFirstSubscribeMessageAuthorization: false,
                hasAuthorization: true,
              })
            }
            else {
              wx.showToast({
                title: '授权失败',
              })
            }
          }
        });
      }
    }
  })
}


function requestSubscribeMessageAuthorization(back) {
  let isFirstSubscribeMessageAuthorizationStorageKey = 'isFirstSubscribeMessageAuthorization'
  let isFirstSubscribeMessageAuthorization = wx.getStorageSync(isFirstSubscribeMessageAuthorizationStorageKey);
  console.log("isFirstSubscribeMessageAuthorization = " + isFirstSubscribeMessageAuthorization)

  if (isFirstSubscribeMessageAuthorization == false) {
    wx.setStorageSync(isFirstSubscribeMessageAuthorizationStorageKey, true);
    back({
      isFirstSubscribeMessageAuthorization: true,
      hasAuthorization: false
    })
  }
  else {
    wx.getSetting({
      success: function (res) {
        if (res.authSetting["scope.SubscribeMessage"] == true) {
          back({
            isFirstSubscribeMessageAuthorization: false,
            hasAuthorization: true
          })
        }
        else {
          againAuthorizationSubscribeMessage(back)
        }
      }
    });
  }
}




//一定要在这里面注册，否则没有用
module.exports = {
  requestUserLocationAuthorization: requestUserLocationAuthorization,
  againAuthorizationUserLocation: againAuthorizationUserLocation,
}