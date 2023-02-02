<template>
  <div class="item-content">
    <div class="search-temp">
      <a-form
        labelAlign="left"
        ref="formInstance"
        :model="saveParam"
        :rules="rules"
        v-bind="layout"
        @finish="handleFinish"
        @validate="handleValidate"
        @finishFailed="handleFinishFailed"
      >
        <a-form-item label="标题" name="title">
          <a-input v-model:value="saveParam.title" placeholder="请输入标题" autocomplete="off" />
        </a-form-item>
        <a-form-item label="正文">
          <richText class="search-temp-input" ref="textInstance" v-model:value="saveParam.content" autocomplete="off" />
        </a-form-item>
        <a-form-item label="添加附件">
          <a-upload
            v-model:file-list="fileList"
            name="file"
            :multiple="true"
            :action="uploadFileUrl"
            @change="handleChange"
          >
            <a-button>
              <upload-outlined />
              添加附件
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item class="button-item">
          <a-button type="primary" html-type="submit">确定</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import richText from '@/components/richText/richText.vue'
import { message } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import { apiCreatThinkCodeLibrary } from '@/service/api/thinkCodeLibrary'
import type { Rule } from 'ant-design-vue/es/form'

const route = useRoute()
const router = useRouter()
const categoryId = route.query?.id as string
const formInstance = ref<any>()

const textInstance = ref<any>(null)

const baseUrl = import.meta.env.VITE_API_DOMAIN
const uploadFileUrl = ref(baseUrl + 'ecode_grant/file/upload')

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

const fileList = ref<any[]>([])

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
}

interface SaveParam {
  title: string
  content: string
  attachment: string[]
  categoryId: string
}

const saveParam = reactive<SaveParam>({
  title: '',
  content: '',
  attachment: [],
  categoryId: '',
})

let validateTitle = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('请输入标题')
  }
  return Promise.resolve()
}

const rules: Record<string, Rule[]> = {
  title: [{ required: true, validator: validateTitle, trigger: 'blur' }],
}

const handleFinish = async (values: SaveParam) => {
  console.log(values, saveParam)
  saveParam.content = textInstance.value.valueHtml
  saveParam.categoryId = categoryId
  const param = { ...saveParam }
  if (fileList.value.length > 0) {
    let attachment = fileList.value
      .map((item: any) => {
        return {
          name: item.response.data.fileName,
          url: item.response.data.url,
        }
      })
      .filter((v) => v)
    Object.assign(param, { attachment })
  } else {
    let attachment = null
    Object.assign(param, { attachment })
  }

  const { code, msg } = await apiCreatThinkCodeLibrary(param)
  if (code === 20000) {
    message.success(msg)
    router.back()
  } else {
    message.error(msg)
  }
}

const handleFinishFailed = (errors: any) => {
  console.log(errors)
}

const handleValidate = (...args: any[]) => {
  console.log(args)
}

/**
 * 确定
 */
// const handleConfirm = async () => {

// formInstance.value.validate(async (valid: boolean) => {
//   if (valid) {
//     const param = { ...saveParam }
//     saveParam.categoryId = categoryId
//     if (fileList.value.length > 0) {
//       let attachment = fileList.value
//         .map((item: any) => {
//           return {
//             name: item.response.data.fileName,
//             url: item.response.data.url,
//           }
//         })
//         .filter((v) => v)
//       Object.assign(param, { attachment })
//     } else {
//       let attachment = null
//       Object.assign(param, { attachment })
//     }

//     const { code, msg } = await apiCreatThinkCodeLibrary(param)
//     if (code === 20000) {
//       message.success(msg)
//       router.back()
//       resetFields()
//     } else {
//       message.error(msg)
//     }
//   }
// })
// }

const handleChange = (info: FileInfo) => {
  if (info.file.status !== 'uploading') {
    console.log(info.file, info.fileList)
  }
  if (info.file.status === 'done') {
    message.success(`${info.file.name} 文件上传成功`)
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} 文件上传失败`)
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
