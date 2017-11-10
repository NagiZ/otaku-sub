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
function getHeight (ele) {
  var heightArray = [].map.call(ele, function (v, i) {
    return v.offsetHeight
  })
  var totalHeight = heightArray.reduce(function (prev, curv, i) {
    return prev + curv
  }, 0)
  return totalHeight
}

var roomActions = {
  addMessage: addMessage
}
export default roomActions
