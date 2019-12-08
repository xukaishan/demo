


function validatedGuideNickName (guideNickName) {
  if (!guideNickName ) {
    guideNickName = ''
  }
  return guideNickName
}

function getGuideNickName () {
  var that = this
  var guideNickName = wx.getStorageSync('guide.nickName')
  return that.validatedGuideNickName(mobilePhoneNum)
}

function setGuideNickName(guideNickName) {
  var that = this
  wx.setStorage({
    key: 'guide.nickName',
    data: that.validatedGuideNickName(guideNickName),
  })
}


module.exports = {
  validatedGuideNickName: validatedGuideNickName,
  getGuideNickName: getGuideNickName,
  setGuideNickName: setGuideNickName,
}