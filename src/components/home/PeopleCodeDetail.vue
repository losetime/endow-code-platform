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
      <div class="title-wrap">
        <span>{{ detailInfo?.name }}</span>
        <span>{{ detailInfo?.workFlag === '1' ? '在职' : '离职' }}</span>
      </div>
      <div class="info-wrap">
        <p>证件号码：{{ detailInfo?.identity }}</p>
        <p>任职公司：{{ detailInfo?.companyName }}</p>
        <p>人员性质：{{ detailInfo?.workerNature }}</p>
        <p>三种人：{{ detailInfo?.userRole }}</p>
        <p>准入状态：{{ detailInfo?.passFlag === '0' ? '未准入' : '已准入' }}，有效期至{{ detailInfo?.passExpire }}</p>
      </div>
      <div class="code-wrap">
        <img :src="imgUrl" alt="二维码" />
        <p :style="{ color: formatQRcodeColor(detailInfo.codeColor) }">
          {{ formatQRcodeText(detailInfo.codeColor) }}
        </p>
      </div>
      <div class="handle-wrap">
        <a-button type="primary" @click="handleDownload">下载</a-button>
        <a-button type="primary" @click="handlePrint" disabled>打印</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// import { message } from 'ant-design-vue'
import { formatQRcodeText, formatQRcodeColor } from '@/enums/homeEnum'
import { createQRCode } from '@/utils/base'
import { saveAs } from 'file-saver'

const visible = ref<boolean>(false)

const title = ref<string>('查看二维码')

const detailInfo = ref<any>({})

const imgUrl = ref('')

// const confirmLoading = ref(false)

/**
 * @desc 初始化对话框
 */
const initModal = (initInfo: any) => {
  detailInfo.value = initInfo
  imgUrl.value = createQRCode(initInfo.infoCode, initInfo.codeColor)
  visible.value = true
}

/**
 * @desc 下载
 */
const handleDownload = async () => {
  saveAs(imgUrl.value, `${detailInfo.value.name}.png`)
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
  .title-wrap {
    padding-left: 20%;
    span {
      &:first-child {
        font-weight: bold;
        font-size: 18px;
        margin-right: 10px;
      }
    }
  }
  .info-wrap {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 14px 0 28px 0;
    p {
      width: 60%;
      margin-bottom: 6px;
    }
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
