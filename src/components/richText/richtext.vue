<!-- eslint-disable vue/v-on-event-hyphenation -->
<template>
  <div style="border: 1px solid #ccc">
    <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" mode="default" />
    <!--  :defaultConfig="editorConfig" -->
    <Editor style="height: 500px; overflow-y: hidden" v-model="valueHtml" mode="simple" @onCreated="handleCreated" />
  </div>
</template>
<script lang="ts" setup>
//在这里申明使用ts进行代码的校验
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref('')

// 模拟 ajax 异步获取内容
onMounted(() => {
  // setTimeout(() => {
  //     valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>'
  // }, 1500)
})

const toolbarConfig = {
  toolbarKeys: [
    // 菜单 key
    'headerSelect',
    'bold', // 加粗
    'italic', // 斜体
    'through', // 删除线
    'underline', // 下划线
    'bulletedList', // 无序列表
    'numberedList', // 有序列表
    'color', // 文字色彩
    'insertLink', // 插入链接
    'fontSize', // 字体大小
    'lineHeight', // 行高
    'delIndent', // 缩进
    'indent', // 增进
    'divider', // 分割线
    'insertTable', // 插入表格
    'justifyCenter', // 居中对齐
    'justifyJustify', // 两端对齐
    'justifyLeft', // 左对齐
    'justifyRight', // 右对齐
    'undo', // 撤销
    'redo', // 重做
    'clearStyle', // 革除格局
    'fullScreen', // 全屏
  ],
}
// const editorConfig = { placeholder: '请输入内容,最多输入200字...', maxLength: 200, type: 'textarea' }

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor: any) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}

// const insertHmtl = (scope: any) => {
//   const editor = editorRef.value
//   if (editor == null) return
//   editor.insertText(scope)
// }

defineExpose({
  valueHtml,
})
</script>
