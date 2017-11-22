// @c1: avator显示区域
// @c2：图片显示区域
// @img：图片载体
// @fi：input
// @size/tag：c1尺寸/c2移动flag

function changeAvator(fi, c1, c2, img, size) {
  fi.click()
  var ctx1 = c1.get(0).getContext('2d')
  var ctx2 = c2.get(0).getContext('2d')
  fi.change(function (e) {
    // console.log('change')
    var tag = false
    var file = fi.get(0).files[0]
    var reader = new FileReader()
    reader.onload = function (result) {
      img.attr('src', result.target.result)
      img.get(0).onload = function (e) {
        ctx2.drawImage(img.get(0), 0, 0, c2.get(0).width, c2.get(0).height)
        c2.mousedown(function (de) {
          de.stopPropagation()
          tag = true
          c2.mousemove(function (me) {
            me.stopPropagation()
            if (!tag) {
              return
            }
            var w = c2.get(0).width
            var h = c2.get(0).height
            var x = rangeS(me.clientX - 32, c2.offset().left + w, c2.offset().left, size, c2.get(0).width)
            var y = rangeS(me.clientY - 32, c2.offset().top + h, c2.offset().top, size, c2.get(0).height)
            ctx1.clearRect(0, 0, c1.get(0).width, c1.get(0).height)
            ctx1.drawImage(c2.get(0), x, y, size, size, 0, 0, c1.get(0).width, c1.get(0).height)
          })
        })
        c2.mouseup(function (ue) {
          ue.stopPropagation()
          tag = false
          c2.get(0).onmouseover = function () {
            return false
          }
          // var data = c1.get(0).toDataURL('image/jpeg', 0.90)
          // data = window.atob(data.split(',')[1])
          // // console.log(data)
          // var uint8 = new Uint8Array(data.length)
          // for (var i = 0; i < data.length; i++) {
          //  uint8[i] = data.charCodeAt(i)
          // }
          // var blob = new Blob(uint8, {type: 'image/jpeg'})
          // var formData = new FormData()
          // formData.append('avatar', blob, name + '.jpg')
          // fd = formData
          // console.log(fd)
        })
      }
    }
    reader.readAsDataURL(file)
  })
}

function rangeS (num, upline, baseline, range, len) {
  if (num < baseline) {
    num = 0
  } else if (num + range > upline) {
    num = len - range
  } else {
    num = num - baseline
  }
  return num
}

function ctoFormData (c, name) {
  var dataUrl = c.toDataURL('image/jpeg', 0.90)
  var data = window.atob(dataUrl.split(',')[1])
  var uint8 = new Uint8Array(data.length)
  for (var i = 0; i < data.length; i++) {
    uint8[i] = data.charCodeAt(i)
  }
  var blob = new Blob([uint8], {type: 'image/jpeg'})
  var formData = new FormData()
  name = name + '.jpg'
  formData.append('avatar', blob, name)
  return formData
}

var indexAction = {
  'changeA': changeAvator,
  'canvasData': ctoFormData
}

export default indexAction
