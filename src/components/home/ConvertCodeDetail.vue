<template>
  <div class="convert-code-detail-wrapper">
    <div class="title-wrap">转换二维码颜色</div>
    <div class="content-wrap">
      <a-form labelAlign="right">
        <a-form-item label="转换对象类型">
          <a-select
            v-model:value="detailInfo.type"
            :options="transcodeTypeOptions"
            allowClear
            placeholder="请选择转换对象类型"
            :disabled="isEdit || isCheck"
          />
        </a-form-item>
        <a-form-item label="唯一编码" :extra="detailInfo.name">
          <a-input
            v-model:value="detailInfo.targetCode"
            placeholder="请输入工程编码/统一社会信用代码/身份证号"
            :disabled="isEdit || isCheck"
            @blur="handleQueryCodeInfo"
          />
        </a-form-item>
        <a-form-item label="转换后码颜色">
          <a-select
            v-model:value="detailInfo.targetCodeColor"
            :options="codeColorTypeOptions"
            allowClear
            placeholder="请选择转换后码颜色"
            :disabled="isCheck"
          />
        </a-form-item>
        <a-form-item label="转码原因">
          <a-textarea v-model:value="detailInfo.reason" :rows="4" placeholder="请输入转码原因" :disabled="isCheck" />
        </a-form-item>
        <a-form-item label="添加附件">
          <a-upload
            v-model:file-list="attachmentList"
            action="#"
            list-type="picture-card"
            :before-upload="false"
            accept=".jpg, .jpeg, .png"
            :disabled="isCheck"
          >
            <div v-if="attachmentList.length < 5">
              <upload-outlined />
              <div style="margin-top: 8px">请选择文件</div>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item
          label="请设置转码时限"
          extra="设置的时限内，二维码颜色会保持您当前设置的转码颜色不变更，到期后系统将依据赋码规则，重新赋码"
        >
          <a-date-picker
            v-model:value="detailInfo.codeExpire"
            valueFormat="YYYY-MM-DD HH:mm:ss"
            show-time
            :disabled="isCheck"
          />
        </a-form-item>
      </a-form>
    </div>
    <div class="handle-wrap" v-if="!isCheck">
      <a-button type="primary" :loading="confirmLoading" @click="handleConfirm">确定</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { UploadOutlined } from '@ant-design/icons-vue'
import { transcodeTypeOptions, codeColorTypeOptions } from '@/enums/homeEnum'
import { apiGetTargetCodeInfo, apiSaveTranscodeInfo, apiGetTranscodeDetail } from '@/service/api/home'
import { useRoute } from 'vue-router'
import { actionTypeEnum } from '@/enums/commonEnum'
import { message } from 'ant-design-vue'

const route = useRoute()

const detailInfo = reactive<any>({
  type: null,
  targetCode: '',
  targetCodeColor: null,
  reason: '',
  codeExpire: '',
  name: '',
  targetId: '',
})

const detailId = ref('')

const handleType = ref<number>(actionTypeEnum.ADD)

const attachmentList = ref<any[]>([])

const confirmLoading = ref(false)

const isEdit = computed(() => handleType.value === actionTypeEnum.EDIT)

const isCheck = computed(() => handleType.value === actionTypeEnum.CHECK)

onMounted(() => {
  if (route.query.handleType !== undefined) {
    handleType.value = parseInt(route.query.handleType as string)
    getTranscodeDetail()
  }
})

/**
 * @desc 查询唯一编码相关信息
 */
const handleQueryCodeInfo = async () => {
  if (detailInfo.type && detailInfo.targetCode) {
    const { code, data } = await apiGetTargetCodeInfo({
      objectCode: detailInfo.targetCode,
      type: detailInfo.type,
    })
    if (code === 20000) {
      detailInfo.name = data.name
      detailInfo.targetId = data.id
    }
  }
}

/**
 * @desc 获取详情
 */
const getTranscodeDetail = async () => {
  const { code, data } = await apiGetTranscodeDetail({ id: route.query.id as string })
  if (code === 20000) {
    const { id, type, targetCode, targetCodeColor, reason, codeExpire, name, targetId } = data
    detailId.value = id
    Object.assign(detailInfo, {
      type,
      targetCode,
      targetCodeColor,
      reason,
      codeExpire,
      name,
      targetId,
    })
    if (Array.isArray(data.attachmentList)) {
      attachmentList.value = data.attachmentList.map((item: any, index: number) => ({
        uid: index,
        status: 'done',
        url: item,
      }))
    }
  }
}

/**
 * @desc 提交信息
 */
const handleConfirm = async () => {
  let params = { ...detailInfo }
  if (handleType.value === actionTypeEnum.EDIT) {
    params = { ...params, id: detailId.value }
  }
  for (let [index, item] of attachmentList.value.entries()) {
    if (item.size && item.size > 3145728) {
      message.warning(`第${index + 1}张图片大于3M，请重新上传`)
      return
    }
    if (item.status === 'done') {
      params['attExist'] = params['attExist'] ? `${params['attExist']},${item.url}` : item.url
    } else {
      params['attachment' + index] = item.originFileObj
    }
  }
  confirmLoading.value = true
  const { code } = await apiSaveTranscodeInfo(params)
  confirmLoading.value = false
  if (code === 20000) {
    if (handleType.value === actionTypeEnum.ADD) {
      message.success('新增成功')
    } else {
      message.success('编辑成功')
    }
  }
}
</script>

<style lang="less" scoped>
.convert-code-detail-wrapper {
  padding: 14px;
  background-color: #ffffff;
  .title-wrap {
    font-weight: bold;
  }
  .content-wrap {
    width: 50%;
    margin-top: 28px;
    ::v-deep(.ant-form) {
      .ant-form-item {
        .ant-form-item-label {
          width: 120px;
        }
        .ant-form-item-control {
          .ant-picker {
            width: 100%;
          }
        }
      }
    }
  }
  .handle-wrap {
    margin-top: 28px;
    padding-left: 120px;
  }
}
</style>
