import type { AxiosResponse } from 'axios'
import { isString, isObject } from 'lodash-es'
import { formatQRcodeColor } from '@/enums/homeEnum'
import QRCode from 'qrcode'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

/**
 * @description: 将对象作为参数添加到URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * @example
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj) ==> www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl: string, obj: any): string {
  let parameters = ''
  let url = ''
  for (const key in obj) {
    parameters += key + '=' + encodeURIComponent(obj[key]) + '&'
  }
  parameters = parameters.replace(/&$/, '')
  if (/\?$/.test(baseUrl)) {
    url = baseUrl + parameters
  } else {
    url = baseUrl.replace(/\/?$/, '?') + parameters
  }
  return url
}

/**
 * @description 合并对象
 * @param src 合并来源
 * @param target 合并目标
 */
export function deepMerge<T = any>(src: any, target: any): T {
  let key: string
  for (key in target) {
    src[key] =
      src[key] && src[key].toString() === '[object Object]'
        ? deepMerge(src[key], target[key])
        : (src[key] = target[key])
  }
  return src
}

/**
 * @desc 获取当前字符串长度
 */
export const getStringLen = (str: string) => {
  if (isString(str)) {
    let lens = 0 // 中文算2个字
    for (let i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) >= 0 && str.charCodeAt(i) <= 255) {
        lens = lens + 1
      } else {
        lens = lens + 2
      }
    }
    return lens
  } else {
    console.warn('获取字符串长度：参数必须是字符串')
    return 0
  }
}

/**
 * @description 下载文件
 * @param res blob文件流
 * @returns
 * @example
 */
export const downloadFiles = (res: AxiosResponse): void => {
  const fileName = res.headers['content-disposition'].split(';')[1].substr(10)
  if ('msSaveOrOpenBlob' in window.navigator) {
    ;(window.navigator as any).msSaveOrOpenBlob(res.data, fileName)
  } else {
    const elink = document.createElement('a')
    elink.download = fileName
    elink.href = URL.createObjectURL(res.data)
    elink.click()
    URL.revokeObjectURL(elink.href) // 释放URL 对象
  }
}

/**
 * @desc 格式化对象，去除字符串两边空格，格式化moment时间
 */
export const formatParams = (obj: any, dateFormat?: string) => {
  const convertObj = Object.assign({}, obj)
  for (const item in convertObj) {
    if (convertObj[item] === undefined || convertObj[item] === null || convertObj[item] === '') {
      delete convertObj[item]
    } else if (typeof convertObj[item] === 'string') {
      convertObj[item] = convertObj[item].trim()
    } else if (convertObj[item] instanceof Object) {
      if (convertObj[item]._isAMomentObject) {
        convertObj[item] = convertObj[item].format(dateFormat ? dateFormat : 'YYYY-MM-DD')
      }
    }
  }
  return convertObj
}

interface IFieldNames {
  id?: string
  children?: string
}
/**
 * @desc 通过树的某一结点获取所有包含的父级节点
 * @param tree 要搜索的树结构
 * @param func 比较节点的函数，比如：(data: any) => data.id === 要比较的节点
 * @param path 存储变量
 * @param fieldNames 自定义字段，包含id字段和子节点字段，可选，默认{ id: 'id', children: 'children' }
 */
export const findTreePath = (tree: any, func: Function, path: number[], fieldNames?: IFieldNames) => {
  let customfield = { id: 'id', children: 'children' }
  if (isObject(fieldNames)) {
    customfield = { ...customfield, ...fieldNames }
  }
  if (!tree) return []
  for (const data of tree) {
    path.push(data[customfield.id])
    if (func(data)) return path
    if (data[customfield.children]) {
      const findChildren: any = findTreePath(data[customfield.children], func, path, fieldNames)
      if (findChildren.length) return findChildren
    }
    path.pop()
  }
  return []
}

/**
 * @desc 将base64图片转化为文件对象
 */
export const dataURLtoFile = (dataurl: string, filename: string) => {
  // 获取到base64编码
  const arr = dataurl.split(',')
  // 将base64编码转为字符串
  const bstr = window.atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n) // 创建初始化为0的，包含length个元素的无符号整型数组
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, {
    type: 'image/jpeg',
  })
}

/**
 * @desc 判断下一层路由是否存在且需要显示在菜单上
 */
export const isVisibleNextRoute = (route: any) => {
  const nextRoutes = route.children
  if (nextRoutes && nextRoutes.length > 0) {
    for (const item of nextRoutes.values()) {
      if (item.meta.visible) {
        return true
      }
    }
    return false
  } else {
    return false
  }
}

/**
 * @desc 判断当前路由是否存在且需要显示在菜单上
 */
export const isVisibleRoute = (route: any) => {
  if (route.meta.visible) {
    return true
  } else {
    return false
  }
}

/**
 * @desc 生成二维码
 */
export const createQRCode = (text: string, color?: string): string => {
  let imgUrl = ''
  const opts: any = {
    errorCorrectionLevel: 'H',
    type: 'image/jpeg',
    quality: 0.3,
    margin: 1,
    color: {
      dark: color ? formatQRcodeColor(color) : '#000000',
      light: '#FFFFFF',
    },
    width: 300,
  }
  QRCode.toDataURL(text, opts, function (err: any, url: string) {
    if (err) throw err
    imgUrl = url
  })
  return imgUrl
}

/**
 * @desc 打包下载二维码
 */
export const downloadQRCode = (fileList: { name: string; file: string }[]) => {
  const zip = new JSZip()
  const img: any = zip.folder('images')
  fileList.forEach((item: any) => {
    img.file(`${item.name}.png`, item.file.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''), { base64: true })
  })
  zip.generateAsync({ type: 'blob' }).then(function (content) {
    console.log('content--', content)
    saveAs(content, 'download.zip')
  })
}
