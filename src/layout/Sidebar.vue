<template>
  <a-layout-sider
    width="200"
    v-model:collapsed="sidebarStatus"
    :trigger="null"
    collapsible
    class="layout-sider-wrapper"
  >
    <a-menu mode="inline" :selectedKeys="navKey" @select="handleSelectKeys" theme="dark">
      <template v-for="item in sidebarMenu" :key="item.name">
        <a-sub-menu :key="item.path" v-if="isVisibleNextRoute(item)">
          <template #icon>
            <Iconfont :type="item.meta.icon" class="icon-font" />
          </template>
          <template #title>{{ item.meta.title }}</template>
          <template v-for="subItem in item.children">
            <a-menu-item v-if="isVisibleRoute(subItem)" :key="subItem.name">
              <template #icon>
                <Iconfont :type="subItem.meta.icon" class="icon-font" />
              </template>
              <span>{{ subItem.meta.title }}</span>
            </a-menu-item>
          </template>
        </a-sub-menu>
        <a-menu-item :key="item.name" v-else>
          <template #icon>
            <Iconfont :type="item.meta.icon" class="icon-font" />
          </template>
          <span>{{ item.meta.title }}</span>
        </a-menu-item>
      </template>
    </a-menu>
  </a-layout-sider>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '@/store'
import Iconfont from '@/components/common/Iconfont.vue'
import { isVisibleNextRoute, isVisibleRoute } from '@/utils/base'

const route = useRoute()
const router = useRouter()
const store = useStore()

// 所有二级导航菜单
const sidebarMenu = computed<Array<any>>(() => route.matched[0].children)

// 匹配当前二级导航
const navKey = ref<string[]>([])

// 侧边栏打开/收起
const sidebarStatus = computed(() => store.state.sidebarStatus)

watchEffect(() => {
  if (route.matched[0].children.length > 0) {
    navKey.value = isVisibleNextRoute(route.matched[1])
      ? ([route.matched[2].name] as string[])
      : ([route.matched[1].name] as string[])
  }
})

/**
 * @desc 选择菜单
 */
const handleSelectKeys = ({ selectedKeys }: { selectedKeys: Array<string> }) => {
  navKey.value = selectedKeys
  router.replace({ name: selectedKeys[0] })
}
</script>

<style lang="less" scoped>
.layout-sider-wrapper {
  height: calc(100vh - 64px);
  overflow-y: auto;

  // background: rgba(3, 21, 56, 1);
  .anticon {
    font-size: 20px;
    // color: red;
  }

  /*滚动条样式*/
  &::-webkit-scrollbar {
    width: 6px;
    height: 8px;
    background-color: rgba(255, 254, 254, 0);
    border-radius: 6px;
  }

  &::-webkit-scrollbar-track-piece {
    background-color: rgba(255, 255, 255, 0.1);
    -webkit-border-radius: 6px;
  }

  &::-webkit-scrollbar-thumb:vertical {
    height: 5px;
    background-color: rgba(204, 204, 204, 0);
    -webkit-border-radius: 6px;
  }

  &::-webkit-scrollbar-thumb:horizontal {
    width: 5px;
    background-color: rgba(204, 204, 204, 0);
    -webkit-border-radius: 6px;
  }

  &::-webkit-scrollbar-corner {
    background: rgba(0, 0, 0, 0);
  }

  &::-webkit-scrollbar-track-piece {
    background: #d3dce600;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #99a9bf00;
    border-radius: 20px;
  }
}
</style>
