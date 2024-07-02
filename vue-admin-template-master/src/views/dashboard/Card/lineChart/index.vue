<template>
  <div class="lineCharts" ref="charts"></div>
</template>

<script>
// 下载 并 引入 echarts
import * as echarts from "echarts";
export default {
  name: "",
  mounted() {
    // 初始化echarts实例
    let lineCharts = echarts.init(this.$refs.charts);
    // 配置数据
    lineCharts.setOption({
      // x轴
      xAxis: {
        show: false,
        type: "category",
      },
      tooltip: {},
      // Y轴
      yAxis: {
        show: false,
      },
      // 系列
      series: [
        {
          type: "line",
          data: [10, 5, 22, 40, 15, 35, 7],
          //  拐点设置
          itemStyle: {
            opacity: 0,
          },
          //   线条颜色
          lineStyle: {
            color: "purple",
          },
          //   填充颜色 【文档中 series-color】
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "purple", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#fff", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
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
.lineCharts {
  width: 100%;
  height: 100%;
}
</style>>
