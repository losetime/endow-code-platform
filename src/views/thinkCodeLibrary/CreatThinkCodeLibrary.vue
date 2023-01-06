<template>
  <div class="item-content">
    <div class="search-temp">
      <a-form :label-col="labelCol" labelAlign="left">
        <a-form-item label="标题" v-bind="saveParam.name">
          <a-input v-model:value="saveParam.name" placeholder="请输入标题" />
        </a-form-item>
        <a-form-item label="正文" v-bind="saveParam.content">
          <richText class="search-temp-input" ref="textInstance" />
        </a-form-item>
        <a-form-item label="添加附件" v-bind="saveParam.attachment">
          <a-upload
            v-model:file-list="fileList"
            name="file"
            :multiple="true"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            @change="handleChange"
          >
            <a-button>
              <upload-outlined />
              添加附件
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item class="button-item">
          <a-button type="primary">确定</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import richText from '@/components/richText/richText.vue'
import { message } from 'ant-design-vue'

interface FileItem {
  uid: string
  name?: string
  status?: string
  response?: string
  url?: string
}

interface FileInfo {
  file: FileItem
  fileList: FileItem[]
}
const labelCol = { span: 2 }
const textInstance = ref<any>(null)

const fileList = ref<FileItem[]>()

const saveParam = reactive<any>({
  title: '',
  content: '',
  attachment: [],
})

const handleChange = (info: FileInfo) => {
  if (info.file.status !== 'uploading') {
    console.log(info.file, info.fileList)
  }
  if (info.file.status === 'done') {
    message.success(`${info.file.name} file uploaded successfully`)
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} file upload failed.`)
  }
}
</script>

<style lang="less" scoped>
.item-content {
  margin: 14px;
  padding: 14px;
  background-color: #ffffff;

  .search-temp {
    padding: 32px;
    background: #fff;
    display: flex;
    align-items: center;
  }

  .search-temp-label {
    color: #000000a6;
    font-size: 14px;
    margin-right: 10px;
  }

  .button-item {
    display: flex;
    justify-content: flex-start;
  }
}
</style>
