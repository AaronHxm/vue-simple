/**
 *
 * @param sNodes 数据
 * @param key 当前主键
 * @param parentKey fid
 * @param childKey
 * @returns {Array}
 */
export function reconstruction(sNodes, key,parentKey,childKey) {
  const r = []
  const tmpMap = {}

  //先把数组整理成map的形式
  for (let i = 0, l = sNodes.length; i < l; i++) {
    // key为 对象的"id"的值， value就是就该对象
    tmpMap[sNodes[i][key]] = sNodes[i]
  }

  //遍历，组织成子孙节点
  for (let i = 0, l = sNodes.length; i < l; i++) {
    //查找当前节点的父节点是否存在，如果存在就把当前节点放入到父节点的子孙列表中
    if (tmpMap[sNodes[i][parentKey]] && sNodes[i][key] != sNodes[i][parentKey]) {
      if (!tmpMap[sNodes[i][parentKey]][childKey])
        tmpMap[sNodes[i][parentKey]][childKey] = []
      tmpMap[sNodes[i][parentKey]][childKey].push(sNodes[i])
    } else {
      //如果不存在就直接放入到一个新的列表中
      r.push(sNodes[i])
    }
  }
  return r
}
