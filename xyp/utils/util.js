
const wxuuid = function () {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid

}

function copyobj(a) {
  var c = {};
  c = JSON.parse(JSON.stringify(a));
  return c;
}
/**
 * 将小程序的API封装成支持Promise的API
 * @params fn {Function} 小程序原始API，如wx.login
 */
const wxPromisify = fn => {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        resolve(res)
      }

      obj.fail = function (res) {
        reject(res)
      }

      fn(obj)
    })
  }
}

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

/**
 * 毫秒时间戳，Java后台时间戳为毫秒
*/
function millisecondTimestamp(date) {
  return Date.parse(new Date()) / 1000.0;
}

function dateFormat(format, date) {
  let ret;
  let opt = {
    "Y+": date.getFullYear().toString(),        // 年
    "m+": (date.getMonth() + 1).toString(),     // 月
    "d+": date.getDate().toString(),            // 日
    "H+": date.getHours().toString(),           // 时
    "M+": date.getMinutes().toString(),         // 分
    "S+": date.getSeconds().toString()          // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(format);
    if (ret) {
      format = format.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
    };
  };
  return format;
}

function dateEarlierFromCurrent(differenceTimestamp) {
  let currentDate = new Date()
  let earlierDateTimestamp = currentDate.getTime() - differenceTimestamp
  return new Date(earlierDateTimestamp)
}

var formatNumber = function (n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}


function againAuthorizationWritePhotosAlbum(back) {
  wx.showModal({
    title: '温馨提示',
    content: '需要授权访问相册才能保存哦',
    success: function (res) {
      if (res.confirm) {
        wx.openSetting({
          success: function (res) {
            if (res.authSetting["scope.writePhotosAlbum"] == true) {
              back({
                isFirstWritePhotosAlbumAuthorization: false,
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

function requestWritePhotosAlbumAuthorization(back) {
  let isFirstWritePhotosAlbumAuthorization = wx.getStorageSync('isFirstWritePhotosAlbumAuthorization');
  console.log("isFirstWritePhotosAlbumAuthorization = " + isFirstWritePhotosAlbumAuthorization)
  
  if (isFirstWritePhotosAlbumAuthorization == false) {
    wx.setStorageSync("isFirstWritePhotosAlbumAuthorization", true);
    back({
      isFirstWritePhotosAlbumAuthorization: true,
      hasAuthorization: false
    })
  }
  else {
    wx.getSetting({
      success: function (res) {
        if (res.authSetting["scope.writePhotosAlbum"] == true) {
          back({
            isFirstWritePhotosAlbumAuthorization: false,
            hasAuthorization: true
          })
        }
        else {
          againAuthorizationWritePhotosAlbum(back)
        }
      }
    });
  }
}


function againAuthorizationUserLocation(back) {
  wx.showModal({
    title: '温馨提示',
    content: '需要授权访问访问您的位置才能更好的提供服务哦',
    success: function (res) {
      if (res.confirm) {
        wx.openSetting({
          success: function (res) {
            if (res.authSetting["scope.userLocation"] == true) {
              back({
                isFirstUserLocationAuthorization: false,
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

function requestUserLocationAuthorization(back) {
  let isFirstUserLocationAuthorization = wx.getStorageSync('isFirstUserLocationAuthorization');
  console.log("isFirstUserLocationAuthorization = " + isFirstUserLocationAuthorization)

  if (isFirstUserLocationAuthorization == false) {
    wx.setStorageSync("isFirstUserLocationAuthorization", true);
    back({
      isFirstUserLocationAuthorization: true,
      hasAuthorization: false
    })
  }
  else {
    wx.getSetting({
      success: function (res) {
        if (res.authSetting["scope.userLocation"] == true) {
          back({
            isFirstUserLocationAuthorization: false,
            hasAuthorization: true
          })
        }
        else {
          againAuthorizationUserLocation(back)
        }
      }
    });
  }
}


//https://www.jianshu.com/p/d90df82a07a9
//一定要在这里面注册，否则没有用
module.exports = {
  wxuuid: wxuuid,
  copyobj: copyobj,
  wxPromisify: wxPromisify,
  requestWritePhotosAlbumAuthorization: requestWritePhotosAlbumAuthorization,
  againAuthorizationWritePhotosAlbum: againAuthorizationWritePhotosAlbum,
  requestUserLocationAuthorization: requestUserLocationAuthorization,
  againAuthorizationUserLocation: againAuthorizationUserLocation,
  formatTime: formatTime,
  millisecondTimestamp: millisecondTimestamp,
  dateFormat: dateFormat,
  dateEarlierFromCurrent: dateEarlierFromCurrent,
}