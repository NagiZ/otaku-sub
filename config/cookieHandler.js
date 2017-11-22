function getCookieItem (key) {
  var arr = document.cookie.split('; ')
  var t = null
  arr.forEach(function (v) {
    var k = v.split('=')[0]
    var value = v.split('=')[1]
    if (k === key) {
      t = value
    }
  })
  return t
}

function setCookieItem (key, value) {
  var str = [key, '=', value].join('')
  document.cookie = str
}

var cookieHandler = {
  getCookieItem: getCookieItem,
  setCookieItem: setCookieItem
}

export default cookieHandler
