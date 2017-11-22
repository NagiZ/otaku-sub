//add message to message-list/area and then scroll
//@toAdd: {message, type, from}
function addMessage (list, toAdd, boxEle, scrollEle) {
  var stp = getHeight(boxEle) > scrollEle.height() ? getHeight(boxEle) : scrollEle.height()
  // list.push(toAdd)
  scrollEle.animate({
    scrollTop: stp
  })
}

//finger out height of all message items box
function getHeight (ele, scrollEle) {
  var heightArray = [].map.call(ele, function (v, i) {
    return v.offsetHeight + 20
  })
  var totalHeight = heightArray.reduce(function (prev, curv, i) {
    return prev + curv
  }, 0)
  var h = totalHeight > scrollEle.height() ? totalHeight : scrollEle.height()
  return h
}

var roomActions = {
  getHeight: getHeight
}
export default roomActions
