<template>
  <div class="item-content">
    <div class="search-temp">
      <a-form
        labelAlign="left"
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
        <a-form-item label="正文" name="content">
          <richText class="search-temp-input" ref="textInstance" v-model:value="saveParam.content" autocomplete="off" />
        </a-form-item>
        <a-form-item label="添加附件">
          <a-upload
            v-model:file-list="fileList"
            name="files"
            :multiple="true"
            :maxCount="9"
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
import { ref, reactive, onMounted } from 'vue'
import richText from '@/components/richText/richText.vue'
import { message } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import { apiCreatThinkCodeLibrary, apiGetThinkCodeInfo, apiEditThinkCodeLibrary } from '@/service/api/thinkCodeLibrary'
import type { Rule } from 'ant-design-vue/es/form'
import type { UploadChangeParam } from 'ant-design-vue'

const route = useRoute()
const router = useRouter()
const categoryId = route.query?.id as string
const codeId = route.query?.codeId as string

const textInstance = ref<any>(null)

const uploadFileUrl = ref('/ecode_grant/file/upload')

const fileList = ref<any>([])

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
}

onMounted(() => {
  if (codeId) {
    getThinkCodeDetailInfo()
  }
})

interface SaveParam {
  title: string
  content: string
  attachments: string[]
  categoryId: string
  id: string
}

const saveParam = reactive<SaveParam>({
  title: '',
  content: '',
  attachments: [],
  categoryId: '',
  id: '',
})

const getThinkCodeDetailInfo = async () => {
  const { code, data } = await apiGetThinkCodeInfo(codeId)
  if (code === 20000) {
    saveParam.title = data.title
    saveParam.content = data.content
    textInstance.value.valueHtml = saveParam.content
    const att = data.attachments.filter((v: any) => v)
    if (att.length !== 0) {
      att.map((item: any) => {
        let strArry = item.split('\_\_')
        let nameStr = strArry[1].split('\?')
        let name = decodeURI(nameStr[0])
        fileList.value.push({ name: name, url: item, status: 'done', thumbUrl: item })
      })
    }
  }
}

let validateTitle = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('请输入标题')
  }
  return Promise.resolve()
}

//
let validateContent = async (_rule: Rule) => {
  if (textInstance?.value.valueHtml == '<p><br></p>') {
    console.log(textInstance?.value.valueHtml)
    return Promise.reject('请输入内容')
  }
  return Promise.resolve()
}

const rules: Record<string, Rule[]> = {
  title: [{ required: true, validator: validateTitle, trigger: 'blur' }],
  content: [{ required: true, validator: validateContent, trigger: 'change' }],
}

const handleFinish = async (values: SaveParam) => {
  console.log(values, saveParam)
  saveParam.content = textInstance.value.valueHtml
  saveParam.categoryId = categoryId
  const param = { ...saveParam }
  if (fileList.value?.length > 0) {
    let urls = []
    for (let [, item] of fileList.value.entries()) {
      if (item.status === 'done') {
        urls.push(item.url)
      }
    }
    param['attachments'] = urls
  } else {
    let attachment = null
    Object.assign(param, { attachment })
  }
  if (codeId) {
    param['id'] = codeId
    const { code, msg } = await apiEditThinkCodeLibrary(param)
    if (code === 20000) {
      message.success(msg)
      router.back()
    } else {
      message.error(msg)
    }
  } else {
    const { code, msg } = await apiCreatThinkCodeLibrary(param)
    if (code === 20000) {
      message.success(msg)
      router.back()
    } else {
      message.error(msg)
    }
  }
}

const handleFinishFailed = (errors: any) => {
  console.log(errors)
}

const handleValidate = (...args: any[]) => {
  console.log(args)
}

const handleChange = (info: UploadChangeParam) => {
  console.log(info.fileList)
  let resFileList = [...info.fileList]
  // 1. Limit the number of uploaded files
  //    Only to show two recent uploaded files, and old ones will be replaced by the new
  resFileList = resFileList.slice(-9)
  // 2. read from response and show file link
  resFileList = resFileList.map((file) => {
    if (file.response) {
      // Component will show file.url as link
      file.url = file.response.data[0]
    }
    return file
  })

  fileList.value = resFileList
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
