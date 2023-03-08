export const saveBlob2Excel = (response: any, filename: any, type = 'application/vnd.ms-excel') => {
  const blob = new Blob([response], {
    type: type || 'application/vnd.ms-excel',
  })
  // 设置文件名
  const fileName = filename || '_.xlsx'
  // 对于<a>标签，只有 Firefox 和 Chrome（内核）支持 download 属性
  if ('download' in document.createElement('a')) {
    // 创建 a 标签
    const link = document.createElement('a')
    // 设置 a 的链接地址，用 createObjectURL 方法创建一个url下载地址
    link.href = window.URL.createObjectURL(blob)
    // 设置下载地址的文件名
    link.download = fileName
    // 让浏览器自动点击 a 的超链接
    link.click()
    // 释放内存
    window.URL.revokeObjectURL(blob)
  } else {
    // IE 浏览器兼容方法
    window.navigator.msSaveBlob(blob, fileName)
  }
}
