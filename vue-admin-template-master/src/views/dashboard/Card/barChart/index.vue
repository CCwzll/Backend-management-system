<template>
  <div class="barCharts" ref="charts"></div>
</template>

<script>
// 引入 echarts
import * as echarts from "echarts";
export default {
  name: "",
  mounted() {
    // 初始化echarts实例
    let barCharts = echarts.init(this.$refs.charts);
    // 配置数据
    barCharts.setOption({
      // x轴
      xAxis: {
        show: false,
        type: "category",
      },
      // 鼠标经过显示数据
      tooltip: {},
      // Y轴
      yAxis: {
        show: false,
      },
      // 系列
      series: [
        {
          type: "bar",
          data: [10, 15, 22, 40, 15, 35, 7, 15, 50],
          color: "red",
        },
      ],
      //   布局调试
      grid: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
    });
  },
};
</script>

<style scoped>
.barCharts {
  width: 100%;
  height: 100%;
}
</style>>
