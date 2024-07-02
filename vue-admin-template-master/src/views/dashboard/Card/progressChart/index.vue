<template>
  <div class="progressChart" ref="charts"></div>
</template>

<script>
// 引入 echarts
import * as echarts from "echarts";
export default {
  name: "",
  mounted() {
    // 初始化echarts实例
    let progressChart = echarts.init(this.$refs.charts);
    // 配置数据
    progressChart.setOption({
      // x轴
      xAxis: {
        show: false,
        min: 0,
        max: 100,
      },
      tooltip: {},
      // Y轴
      yAxis: {
        show: false,
        type: "category",
      },
      // 系列
      series: [
        {
          type: "bar",
          data: [78],
          color: "pink",
          // 柱状图宽度
          barWidth: 10,
          // 背景
          showBackground: true,
          backgroundStyle: {
            color: "#eee",
          },
          //文本标签
          label: {
            show: true,
            // 改变文本内容
            formatter: "|",
            color: "red",
            // 文本标签位置
            position: "right",
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
.progressChart {
  width: 100%;
  height: 100%;
}
</style>>
