/**
 * @desc 转码对象类型
 */
export const transcodeTypeOptions = [
  {
    label: '企业码',
    value: '1',
  },
  {
    label: '人员码',
    value: '2',
  },
  {
    label: '工程码',
    value: '3',
  },
]

/**
 * @desc 码颜色类型
 */
export const codeColorTypeOptions = [
  {
    label: '绿码',
    value: 'green',
  },
  {
    label: '黄码',
    value: 'yellow',
  },
  {
    label: '红码',
    value: 'red',
  },
]

/**
 * @desc 企业性质
 */
export const getEnterpriseNature = (enterpriseNature: string) => {
  switch (enterpriseNature) {
    case '01':
      return '业主'
    case '03':
      return '省变电'
    case '04':
      return '省管主业(集体)'
    case '05':
      return '外包'
  }
}

/**
 * @desc 企业类别
 */
export const getEnterpriseType = (enterpriseType: string) => {
  switch (enterpriseType) {
    case '0':
      return '施工企业'
    case '1':
      return '勘察设计'
    case '2':
      return '监理公司'
    case '3':
      return '厂家服务'
    case '4':
      return '设备制造'
    case '5':
      return '其他'
  }
}

/**
 * @desc 二维码实际值
 */
export const formatQRcodeText = (codeColor: string) => {
  switch (codeColor) {
    case 'green':
      return '绿码'
    case 'yellow':
      return '黄码'
    case 'red':
      return '红码'
  }
}

/**
 * @desc 二维码颜色
 */
export const formatQRcodeColor = (codeColor: string) => {
  switch (codeColor) {
    case 'green':
      return '#1BC38F'
    case 'yellow':
      return '#FFBC00'
    case 'red':
      return '#FF5434'
  }
}
