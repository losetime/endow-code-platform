<template>
  <a-modal
    v-model:visible="visible"
    :title="title"
    :destroyOnClose="true"
    :afterClose="handleCancel"
    :footer="false"
    width="500px"
  >
    <div class="detail-wrapper">
      <div class="code-wrap">
        <img :src="imgUrl" alt="二维码" />
      </div>
      <div class="info-wrap">设备编码：{{ detailInfo.vrSn }}</div>
      <div class="handle-wrap">
        <a-button type="primary" @click="handleDownload">下载</a-button>
        <a-button type="primary" @click="handlePrint" disabled>打印</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { createQRCode } from '@/utils/base'
import { saveAs } from 'file-saver'

const visible = ref<boolean>(false)

const title = ref<string>('查看二维码')

const detailInfo = ref<any>({})

const imgUrl = ref('')

/**
 * @desc 初始化对话框
 */
const initModal = (initInfo: any) => {
  detailInfo.value = initInfo
  imgUrl.value = createQRCode(initInfo.qrCode)
  visible.value = true
}

/**
 * @desc 下载
 */
const handleDownload = async () => {
  saveAs(imgUrl.value, `${detailInfo.value.vrSn}.png`)
}

/**
 * @desc 打印
 */
const handlePrint = () => {}

/**
 * @desc 取消操作
 */
const handleCancel = () => {
  visible.value = false
}

defineExpose({
  initModal,
})
</script>

<style lang="less" scoped>
.detail-wrapper {
  .info-wrap {
    text-align: center;
    margin: 28px 0;
  }
  .code-wrap {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img {
      width: 200px;
    }
    p {
      font-weight: bold;
      font-size: 15px;
      margin-top: 5px;
    }
  }
  .handle-wrap {
    display: flex;
    justify-content: center;
    margin: 28px 0;
    .ant-btn {
      width: 120px;
      &:first-child {
        margin-right: 14px;
      }
    }
  }
}
</style>
