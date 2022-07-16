import { getEnterpriseNature, getEnterpriseType, transcodeTypeOptions } from '@/enums/homeEnum'

/**
 * @desc 企业码
 */
export const EnterpriseCodeColumns = [
  {
    title: '企业名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '统一社会信用代码',
    key: 'licenseCode',
    dataIndex: 'licenseCode',
  },
  {
    title: '企业性质',
    customRender: ({ record }: { record: any }) => getEnterpriseNature(record.orgNature),
  },
  {
    title: '企业类别',
    customRender: ({ record }: { record: any }) => getEnterpriseType(record.companyType),
  },
  {
    title: '码类型',
    key: 'slotOne',
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 200,
  },
]

/**
 * @desc 人员码
 */
export const PeopleCodeColumns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '身份证号',
    key: 'identity',
    dataIndex: 'identity',
  },
  {
    title: '联系电话',
    key: 'mobile',
    dataIndex: 'mobile',
  },
  {
    title: '职称/工种',
    key: 'post',
    dataIndex: 'post',
  },
  {
    title: '任职企业',
    key: 'companyName',
    dataIndex: 'companyName',
  },
  {
    title: '码类型',
    key: 'slotOne',
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 200,
  },
]

/**
 * @desc 工程码
 */
export const ProjectCodeColumns = [
  {
    title: '工程名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '工程编码',
    key: 'projectCode',
    dataIndex: 'projectCode',
  },
  {
    title: '工程类型',
    key: 'projectType',
    dataIndex: 'projectType',
  },
  {
    title: '工程状态',
    key: 'workStatus',
    dataIndex: 'workStatus',
  },
  {
    title: '码类型',
    key: 'slotOne',
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 200,
  },
]

/**
 * @desc 码转色
 */
export const CodeConvertColumns = [
  {
    title: '转码对象类型',
    customRender: ({ record }: { record: any }) => {
      const findItem = transcodeTypeOptions.find((val: any) => val.value === record.type)
      if (findItem) {
        return findItem.label
      } else {
        return ''
      }
    },
  },
  {
    title: '转码对象',
    key: 'name',
    dataIndex: 'name',
  },
  {
    title: '发布状态',
    customRender: ({ record }: { record: any }) => (record.status === '0' ? '已发布' : '未发布'),
  },
  {
    title: '生效状态',
    key: 'effectStatus',
    dataIndex: 'effectStatus',
  },
  {
    title: '创建时间',
    key: 'createTime',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 200,
  },
]

/**
 * @desc 未处理申诉
 */
export const NotHandleAppealColumns = [
  {
    title: '申诉对象类型',
    customRender: ({ record }: { record: any }) => {
      const findItem = transcodeTypeOptions.find((val: any) => val.value === record.type)
      if (findItem) {
        return findItem.label
      } else {
        return ''
      }
    },
  },
  {
    title: '申诉对象名称',
    key: 'name',
    dataIndex: 'name',
  },
  {
    title: '申诉对象编码',
    key: 'objectCode',
    dataIndex: 'objectCode',
  },
  {
    title: '码颜色',
    key: 'slotOne',
  },
  {
    title: '申诉说明',
    key: 'desc',
    dataIndex: 'desc',
  },
  {
    title: '申诉时间',
    key: 'createTime',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 200,
  },
]

/**
 * @desc 已处理申诉
 */
export const AlreadyHandleAppealColumns = [
  {
    title: '申诉对象类型',
    customRender: ({ record }: { record: any }) => {
      const findItem = transcodeTypeOptions.find((val: any) => val.value === record.type)
      if (findItem) {
        return findItem.label
      } else {
        return ''
      }
    },
  },
  {
    title: '申诉对象名称',
    key: 'name',
    dataIndex: 'name',
  },
  {
    title: '申诉对象编码',
    key: 'objectCode',
    dataIndex: 'objectCode',
  },
  {
    title: '码颜色',
    key: 'slotOne',
  },
  {
    title: '申诉说明',
    key: 'desc',
    dataIndex: 'desc',
  },
  {
    title: '申诉时间',
    key: 'createTime',
    dataIndex: 'createTime',
  },
  {
    title: '处理时间',
    key: 'updateTime',
    dataIndex: 'updateTime',
  },
]
