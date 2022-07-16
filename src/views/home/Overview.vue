<template>
  <div class="overview-wrapper">
    <div class="statistics-row-wrap">
      <div class="statistics-title">赋码概况</div>
      <div class="content-wrap">
        <div class="row-item-wrap" v-for="item in statsInfo" :key="item.codeType">
          <p class="item-title">{{ formatStatsName(item.codeType) }}</p>
          <p class="count-wrap">
            <span>{{ item.totalNum }}</span>
            <span>个</span>
          </p>
          <div class="compare-wrap">
            <span>相比昨日</span>
            <span>{{ item.todayNum }}个</span>
            <Iconfont type="icon-xiangshang" />
          </div>
        </div>
      </div>
    </div>
    <div class="row-wrap">
      <div class="row-item-wrap">
        <p class="chart-title">企业码概况</p>
        <div class="chart-wrap">
          <Pie :series="chartData.enterpriseCode" :color="colors" />
        </div>
      </div>
      <div class="row-item-wrap">
        <p class="chart-title">人员码概况</p>
        <div class="chart-wrap">
          <Pie :series="chartData.peopleCode" :color="colors" />
        </div>
      </div>
      <div class="row-item-wrap">
        <p class="chart-title">工程码概况</p>
        <div class="chart-wrap">
          <Pie :series="chartData.projectCode" :color="colors" />
        </div>
      </div>
    </div>
    <div class="row-wrap">
      <div class="row-item-wrap">
        <p class="chart-title">近12个月赋码数量</p>
        <div class="chart-wrap">
          <Bar :series="chartData.endowCodeCount.series" :x-axis="chartData.endowCodeCount.xAxis" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, reactive } from 'vue'
import Pie from '@/components/charts/Pie.vue'
import Bar from '@/components/charts/Bar.vue'
import { apiGetOverviewInfo } from '@/service/api/home'

const colors = ['#1BC38F', '#FFBC00', '#FF5434']

const statsInfo = ref<any[]>([])

const chartData = reactive<any>({
  enterpriseCode: [],
  peopleCode: [],
  projectCode: [],
  endowCodeCount: {
    series: [],
    xAxis: [],
  },
})

onBeforeMount(() => {
  getOverviewInfo()
})

/**
 * @desc 获取统计和图表数据
 */
const getOverviewInfo = async () => {
  const type = ['calSum', 'codeColorNum', 'yearNum']
  for (let item of type.values()) {
    const { code, data } = await apiGetOverviewInfo({ type: item })
    if (code === 20000) {
      switch (item) {
        case 'calSum':
          statsInfo.value = data
          break
        case 'codeColorNum':
          data.forEach((val: any) => {
            switch (val.codeType) {
              case 'codeCompany':
                chartData.enterpriseCode = [createPieData(val)]
                break
              case 'codeProject':
                chartData.projectCode = [createPieData(val)]
                break
              case 'codeEmployee':
                chartData.peopleCode = [createPieData(val)]
                break
            }
          })
          break
        case 'yearNum':
          chartData.endowCodeCount = {
            series: [{ type: 'bar', data: data.num, barMaxWidth: 50 }],
            xAxis: data.month,
          }
          break
      }
    }
  }
}

/**
 * @desc 生成饼图数据
 */
const createPieData = (val: any) => {
  return {
    type: 'pie',
    label: {
      show: false,
    },
    radius: ['40%', '70%'],
    center: ['25%', '50%'],
    data: [
      {
        value: val.greenNum,
        name: '绿码',
      },
      {
        value: val.yellowNum,
        name: '黄码',
      },
      {
        value: val.redNum,
        name: '红码',
      },
    ],
  }
}

/**
 * @desc 统计概况名称
 */
const formatStatsName = (val: string) => {
  switch (val) {
    case 'all':
      return '累计赋码'
    case 'codeCompany':
      return '企业码'
    case 'codeProject':
      return '工程码'
    case 'codeEmployee':
      return '人员码'
  }
}
</script>

<style lang="less" scoped>
.overview-wrapper {
  .statistics-row-wrap {
    padding: 14px;
    background-color: #ffffff;
    .statistics-title {
      margin-bottom: 14px;
      font-weight: bold;
    }
    .content-wrap {
      display: flex;
      .row-item-wrap {
        flex: 1;
        .count-wrap {
          width: 100%;
          height: 50px;
          line-height: 50px;
          span:first-child {
            font-size: 20px;
            font-weight: bold;
          }
        }
        .compare-wrap {
          span:nth-child(2) {
            margin: 5px;
            color: rgba(255, 84, 52, 1);
          }
          .anticon {
            color: rgba(255, 84, 52, 1);
          }
        }
        .table-wrap {
          width: 100%;
          height: 292px;
          margin-top: 10px;
        }
      }
    }
  }
  .row-wrap {
    display: flex;
    margin-top: 14px;
    .row-item-wrap {
      flex: 1;
      padding: 14px;
      margin-right: 14px;
      background-color: #ffffff;
      &:last-child {
        margin-right: 0;
      }
      .chart-title {
        margin-bottom: 14px;
        font-weight: bold;
      }
      .chart-wrap {
        width: 100%;
        height: 240px;
      }
    }
  }
}
</style>
