const groupBy = (arr, key) =>
  arr.reduce((acc, e) => {
    ;(acc[e[key]] = acc[e[key]] || []).push(e)
    return acc
  }, {})

module.exports = {
  groupBy
}
