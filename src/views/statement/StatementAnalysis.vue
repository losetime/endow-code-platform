<template>
  <div class="item-content">
    <div class="handle-wrap">
      <a-tabs v-model:activeKey="activeKey" :tab-position="tabPosition" :tabBarGutter="20" size="small">
        <a-tab-pane class="item-tab" key="1" tab="赋码分析">
          <a-button type="primary">导出报表</a-button>
          <div class="item-statement">
            <a-table
              :columns="columns"
              :data-source="data"
              bordered
              size="middle"
              :scroll="{ x: 'calc(700px + 50%)', y: 240 }"
            />
          </div>
        </a-tab-pane>
        <a-tab-pane class="item-tab" key="2" tab="日志分析">Content of Tab 2</a-tab-pane>
        <a-tab-pane class="item-tab" key="3" tab="监督管理分析">Content of Tab 3</a-tab-pane>
        <a-tab-pane class="item-tab" key="4" tab="施工风险分析">Content of Tab 4</a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const tabPosition = ref('left')
const activeKey = ref('1')
type TableDataType = {
  key: number
  name: string
  age: number
  street: string
  building: string
  number: number
  companyAddress: string
  companyName: string
  gender: string
}
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 100,
    fixed: 'left',
    filters: [
      {
        text: 'Joe',
        value: 'Joe',
      },
      {
        text: 'John',
        value: 'John',
      },
    ],
    onFilter: (value: string, record: TableDataType) => record.name.indexOf(value) === 0,
  },
  {
    title: 'Other',
    children: [
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        width: 200,
        sorter: (a: TableDataType, b: TableDataType) => a.age - b.age,
      },
      {
        title: 'Address',
        children: [
          {
            title: 'Street',
            dataIndex: 'street',
            key: 'street',
            width: 200,
          },
          {
            title: 'Block',
            children: [
              {
                title: 'Building',
                dataIndex: 'building',
                key: 'building',
                width: 100,
              },
              {
                title: 'Door No.',
                dataIndex: 'number',
                key: 'number',
                width: 100,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Company',
    children: [
      {
        title: 'Company Address',
        dataIndex: 'companyAddress',
        key: 'companyAddress',
        width: 200,
      },
      {
        title: 'Company Name',
        dataIndex: 'companyName',
        key: 'companyName',
      },
    ],
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    key: 'gender',
    width: 80,
    fixed: 'right',
  },
]
const data = [...Array(100)].map((_, i) => ({
  key: i,
  name: 'John Brown',
  age: i + 1,
  street: 'Lake Park',
  building: 'C',
  number: 2035,
  companyAddress: 'Lake Street 42',
  companyName: 'SoftLake Co',
  gender: 'M',
}))
</script>

<style lang="less" scoped>
.item-content {
  height: 100%;

  .handle-wrap {
    height: 100%;
    display: flex;
    justify-content: space-between;
  }

  .item-tab {
    background-color: #ffffff;
  }

  .item-statement {
    margin-top: 14px;
  }
}
</style>
