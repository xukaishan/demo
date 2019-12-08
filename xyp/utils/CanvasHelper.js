function drawImage(imageURLPath, canvasID, back) {
  wx.getSystemInfo({
    success(res) {
      let pixelRatio = res.pixelRatio
      wx.getImageInfo({
        src: imageURLPath,
        success(res) {

          let aspectRatio = res.width / res.height
          let w = wx.getSystemInfoSync().windowWidth
          let h = w / aspectRatio
          let pixelCanvasWidth = w * pixelRatio
          let pixelCanvasHeight = h * pixelRatio

          const ctx = wx.createCanvasContext(canvasID)
          ctx.scale(1 / pixelRatio, 1 / pixelRatio)
          ctx.drawImage(imageURLPath, 0, 0, pixelCanvasWidth, pixelCanvasHeight)
          ctx.restore()
          ctx.draw()

          back({
            canvasWidth: w,
            canvasHeight: h
          })
        }
      })
    }
  })
}

function drawImageWithQRCodeIncludingMargin(imageURLPath,
  qrcodeImageURLPath,
  qrcodeBorderWdithRatio,
  qrcodeBorderFrameYRatio,
  boderMargin,
  canvasID,
  qrcodeBorderFill,
  back) {

  wx.getSystemInfo({
    success(res) {
      let pixelRatio = res.pixelRatio
      wx.getImageInfo({
        src: imageURLPath,
        success(res) {
          let aspectRatio = res.width / res.height
          let w = wx.getSystemInfoSync().windowWidth
          let h = w / aspectRatio
          let pixelCanvasWidth = w * pixelRatio
          let pixelCanvasHeight = h * pixelRatio

          let qrcodeBorderWdith = pixelCanvasWidth * qrcodeBorderWdithRatio
          let qrcodeBorderFrame = {
            x: pixelCanvasWidth * (1 - qrcodeBorderWdithRatio) / 2.0,
            y: pixelCanvasHeight * qrcodeBorderFrameYRatio,
            width: qrcodeBorderWdith,
            height: qrcodeBorderWdith
          }

          let qrcodeFrame = {
            x: boderMargin + qrcodeBorderFrame.x,
            y: boderMargin + qrcodeBorderFrame.y,
            width: -2 * boderMargin + qrcodeBorderFrame.width,
            height: -2 * boderMargin + qrcodeBorderFrame.height
          }

          const ctx = wx.createCanvasContext(canvasID)

          ctx.scale(1 / pixelRatio, 1 / pixelRatio)
          ctx.drawImage(imageURLPath, 0, 0, pixelCanvasWidth, pixelCanvasHeight)

          ctx.setFillStyle(qrcodeBorderFill)

          ctx.fillRect(
            qrcodeBorderFrame.x,
            qrcodeBorderFrame.y,
            qrcodeBorderFrame.width,
            qrcodeBorderFrame.height
          )

          ctx.drawImage(
            qrcodeImageURLPath,
            qrcodeFrame.x,
            qrcodeFrame.y,
            qrcodeFrame.width,
            qrcodeFrame.height
          );

          ctx.restore()
          ctx.draw()

          back({
            canvasWidth: w,
            canvasHeight: h
          })
        }
      })
    }
  })
}

function drawImageWithQRCode(imageURLPath, qrcodeImageURLPath, qrcodeWidthRatio, qrcodeFrameYRatio, canvasID, back) {
  wx.getSystemInfo({
    success(res) {
      let pixelRatio = res.pixelRatio
      wx.getImageInfo({
        src: imageURLPath,
        success(res) {
          let aspectRatio = res.width / res.height
          let w = wx.getSystemInfoSync().windowWidth
          let h = w / aspectRatio
          let pixelCanvasWidth = w * pixelRatio
          let pixelCanvasHeight = h * pixelRatio
          let qrcodeWdith = pixelCanvasWidth * qrcodeWidthRatio
          let qrcodeFrame = {
            x: pixelCanvasWidth * (1 - qrcodeWidthRatio) / 2.0,
            y: pixelCanvasHeight * qrcodeFrameYRatio,
            width: qrcodeWdith,
            height: qrcodeWdith
          }

          const ctx = wx.createCanvasContext(canvasID)

          ctx.scale(1 / pixelRatio, 1 / pixelRatio)
          if (imageURLPath) {
            ctx.drawImage(imageURLPath, 0, 0, pixelCanvasWidth, pixelCanvasHeight)
          }

          if (qrcodeImageURLPath) {
            ctx.drawImage(
              qrcodeImageURLPath,
              qrcodeFrame.x,
              qrcodeFrame.y,
              qrcodeFrame.width,
              qrcodeFrame.height
            );
          }

          ctx.restore()
          ctx.draw()

          back({
            canvasWidth: w,
            canvasHeight: h
          })
        }
      })
    }
  })
}

function drawImageAspectHeightWithQRCode(posterURLPath, qrcodeImageURLPath, qrcodeWidthRatio, qrcodeFrameYRatio, canvasID, back) {
  if (!posterURLPath || !qrcodeImageURLPath) {
    console.log("posterURLPath 或者 qrcodeImageURLPath 不能为空")
    return
  }

  wx.getSystemInfo({
    success(res) {
      let pixelRatio = res.pixelRatio
      wx.getImageInfo({
        src: posterURLPath,
        success(res) {
          let windowWidth = wx.getSystemInfoSync().windowWidth
          let windowHeight = wx.getSystemInfoSync().windowHeight
          let qrcodeWdith = w * qrcodeWidthRatio
          let h = windowHeight
          let w = h

          let pixelCanvasWidth = w * pixelRatio
          let pixelCanvasHeight = h * pixelRatio
          let pixelWindowWidth = windowWidth * pixelRatio
          let pixelWindowHeight = windowHeight * pixelRatio
          let pixelQrcodeSize = w * pixelRatio * qrcodeWidthRatio
          let pixelMargin = { top: 0 * pixelRatio, left: 0 * pixelRatio, bottom: 10 * pixelRatio, right: 10 * pixelRatio, }

          let qrcodeFrame = {
            x: (pixelCanvasWidth + pixelWindowWidth) / 2.0 - pixelQrcodeSize - pixelMargin.right,
            y: (pixelCanvasHeight + pixelWindowHeight) / 2.0 - pixelQrcodeSize - pixelMargin.bottom,
            width: pixelQrcodeSize,
            height: pixelQrcodeSize
          }

          const ctx = wx.createCanvasContext(canvasID)

          ctx.scale(1 / pixelRatio, 1 / pixelRatio)
          ctx.drawImage(posterURLPath, 0, 0, pixelCanvasWidth, pixelCanvasHeight)
          ctx.drawImage(qrcodeImageURLPath, qrcodeFrame.x, qrcodeFrame.y, qrcodeFrame.width, qrcodeFrame.height);
          ctx.restore()
          ctx.draw()

          back({
            canvasWidth: w,
            canvasHeight: h,
            canvasMarginLeft: -(w - windowWidth) / 2.0,
          })
        }
      })
    }
  })
}


//二维码位置 1-左上 2-左下 3-居中 4-右上 5-右下
function drawImageAspectHeightWithQrcodePosition(posterURLPath, qrcodeImageURLPath, qrcodePosition, canvasID, back) {
  //合法值效验
  if (!posterURLPath) {
    console.log("\n\n\n posterURLPath 不能空或者null \n\n\n")
    return
  }
  if (!qrcodeImageURLPath) {
    console.log("\n\n\n qrcodeImageURLPath 不能为空或者null \n\n\n")
    return
  }
  if (qrcodePosition == null || qrcodePosition < 1 || qrcodePosition > 5) {
    qrcodePosition = 5
  }
  if (!canvasID) {
    console.log("\n\n\n canvasID不能空或null \n\n\n")
    return
  }
  if (!back) {
    console.log("\n\n\n back不能空或null \n\n\n")
  }
 
  wx.getSystemInfo({
    success(res) {
      let pixelRatio = res.pixelRatio
      wx.getImageInfo({
        src: posterURLPath,
        success(res) {

          let windowWidth = wx.getSystemInfoSync().windowWidth
          let windowHeight = wx.getSystemInfoSync().windowHeight
          let canvasHeight = windowHeight
          let canvasWidth = canvasHeight
          let qrcodeWidthRatio = 0.15//
          let qrcodeWdith = canvasWidth * qrcodeWidthRatio

          let pixelCanvasWidth = canvasWidth * pixelRatio
          let pixelCanvasHeight = canvasHeight * pixelRatio
          let pixelWindowWidth = windowWidth * pixelRatio
          let pixelWindowHeight = windowHeight * pixelRatio
          let pixelQrcodeSize = canvasWidth * pixelRatio * qrcodeWidthRatio
          let pixelMargin = { top: 10 * pixelRatio, left: 10 * pixelRatio, bottom: 10 * pixelRatio, right: 10 * pixelRatio, }

          var x = (pixelCanvasWidth + pixelWindowWidth) / 2.0 - pixelQrcodeSize - pixelMargin.right
          var y = (pixelCanvasHeight + pixelWindowHeight) / 2.0 -pixelQrcodeSize - pixelMargin.bottom

          //二维码位置 1-左上 2-左下 3-居中 4-右上 5-右下
          switch (qrcodePosition) {
            case 1: {
              x = (pixelCanvasWidth - pixelWindowWidth) / 2.0  + pixelMargin.left
              y = (pixelCanvasHeight - pixelWindowHeight) / 2.0 + pixelMargin.bottom
            }
            break;

            case 2: {
              x = (pixelCanvasWidth - pixelWindowWidth) / 2.0 + pixelMargin.left
              y = (pixelCanvasHeight + pixelWindowHeight) / 2.0 - pixelQrcodeSize - pixelMargin.bottom
            }
              break;
            case 3: {
              x = (pixelCanvasWidth  - pixelQrcodeSize) / 2.0 
              y = (pixelCanvasHeight - pixelQrcodeSize) / 2.0
            }
              break;
            case 4: {
              var x = (pixelCanvasWidth + pixelWindowWidth) / 2.0 - pixelQrcodeSize - pixelMargin.right
              var y = (pixelCanvasHeight - pixelWindowHeight) / 2.0 + pixelMargin.top
            }
              break;
            case 5: {
            }
              break;
              default:
              break;
          }


          let qrcodeFrame = {
            x: x,
            y: y,
            width: pixelQrcodeSize,
            height: pixelQrcodeSize
          }

          const ctx = wx.createCanvasContext(canvasID)

          ctx.scale(1 / pixelRatio, 1 / pixelRatio)
          ctx.drawImage(posterURLPath, 0, 0, pixelCanvasWidth, pixelCanvasHeight)
          ctx.drawImage(qrcodeImageURLPath, qrcodeFrame.x, qrcodeFrame.y, qrcodeFrame.width, qrcodeFrame.height);
          ctx.restore()
          ctx.draw()

          back({
            canvasWidth: canvasWidth,
            canvasHeight: canvasHeight,
            canvasMarginLeft: -(canvasWidth - windowWidth) / 2.0,
          })
        }
      })
    }
  })
}


function saveImage(canvasID, back) {
  let isWhole = false

  if (!isWhole) {
    wx.getSystemInfo({
      success(res) {
        let pixelRatio = res.pixelRatio
        let windowWidth = wx.getSystemInfoSync().windowWidth
        let windowHeight = wx.getSystemInfoSync().windowHeight
        let canvasHeight = windowHeight
        let canvasWidth = canvasHeight

        let pixelWindowWidth = windowWidth * pixelRatio
        let pixelWindowHeight = windowHeight * pixelRatio
       
        wx.canvasToTempFilePath({
          x: (canvasWidth - windowWidth)/2.0,
          y: 0,
          width: windowWidth,
          height: windowHeight,
          destWidth: pixelWindowWidth,
          destHeight: pixelWindowHeight,
          canvasId: canvasID,
          success(res) {
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: (res) => {
                console.log(res)
                back({
                  success: true
                })
                wx.showToast({
                  title: '保存成功',
                  icon: 'success'
                })
              },
              fail: (err) => { }
            })
          }
        })
      }
    })
  }
  else {
    wx.canvasToTempFilePath({
      canvasId: canvasID,
      success(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: (res) => {
            console.log(res)
            back({
              success: true
            })
            wx.showToast({
              title: '成功保存到相册',
              icon: 'success'
            })

          },
          fail: (err) => { }
        })
      }
    })
  }
}

function saveImageToPhotosAlbum(canvasID, back) {
  let isFirstWritePhotosAlbumAuthorization = wx.getStorageSync('isFirstWritePhotosAlbumAuthorization');
  console.log("isFirstWritePhotosAlbumAuthorization = " + isFirstWritePhotosAlbumAuthorization)

  if (isFirstWritePhotosAlbumAuthorization == false) {
    wx.setStorageSync("isFirstWritePhotosAlbumAuthorization", true);
    saveImage(canvasID, back)
  }
  else {
    wx.getSetting({
      success: function (res) {
        if (res.authSetting["scope.writePhotosAlbum"] == true) {
          saveImage(canvasID, back)
        }
        else {
          againAuthorizationWritePhotosAlbum()
        }
      }
    });
  }
}

function againAuthorizationWritePhotosAlbum() {
  wx.showModal({
    title: '温馨提示',
    content: '需要授权访问相册才能保存哦',
    success: function (res) {
      if (res.confirm) {
        wx.openSetting({
          success: function (res) {
            if (res.authSetting["scope.writePhotosAlbum"] == true) {
              saveImage(canvasID, back)
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

module.exports = {
  drawImage: drawImage,
  drawImageWithQRCode: drawImageWithQRCode,
  drawImageWithQRCodeIncludingMargin: drawImageWithQRCodeIncludingMargin,
  saveImageToPhotosAlbum: saveImageToPhotosAlbum,
  saveImage: saveImage,
  againAuthorizationWritePhotosAlbum: againAuthorizationWritePhotosAlbum,
  drawImageAspectHeightWithQRCode: drawImageAspectHeightWithQRCode,
  drawImageAspectHeightWithQrcodePosition: drawImageAspectHeightWithQrcodePosition,
}