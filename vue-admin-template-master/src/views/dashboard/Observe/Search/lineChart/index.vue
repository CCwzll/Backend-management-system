<template>
  <div>
    <div class="header">
      <span class="searchUser">搜索用户数</span>
      <svg
        t="1717064181450"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="1423"
        width="16"
        height="16"
      >
        <path
          d="M512 97.52381c228.912762 0 414.47619 185.563429 414.47619 414.47619s-185.563429 414.47619-414.47619 414.47619S97.52381 740.912762 97.52381 512 283.087238 97.52381 512 97.52381z m0 73.142857C323.486476 170.666667 170.666667 323.486476 170.666667 512s152.81981 341.333333 341.333333 341.333333 341.333333-152.81981 341.333333-341.333333S700.513524 170.666667 512 170.666667z m36.571429 268.190476v292.571428h-73.142858V438.857143h73.142858z m0-121.904762v73.142857h-73.142858v-73.142857h73.142858z"
          p-id="1424"
          fill="#cdcdcd"
        ></path>
      </svg>
    </div>
    <div class="main">
      <span class="main_header">1264</span>
      <span class="main_content">17.1</span>
      <svg
        t="1717140717499"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2636"
        width="32"
        height="32"
      >
        <path
          d="M834 640.851 511.851 320.667 193 640.517Z"
          fill="#1afa29"
          p-id="2637"
        ></path>
      </svg>
      <svg
        t="1717141316431"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="4101"
        width="32"
        height="32"
      >
        <path
          d="M863.321996 251.674996 194.108395 251.674996 528.677333 621.186771Z"
          fill="#d81e06"
          p-id="4102"
        ></path>
      </svg>
    </div>
    <div class="footer">
      <div class="charts" ref="charts"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "",
  mounted() {
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
          smooth: true,
          type: "line",
          data: [10, 5, 22, 30, 15, 35, 7],
          //  拐点设置
          itemStyle: {
            opacity: 0,
          },
          //   线条颜色
          lineStyle: {
            color: "blue",
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
                  color: "blue", // 0% 处的颜色
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
.searchUser {
  margin-right: 20px;
  color: rgb(65 97 96 / 76%);
}
.main {
  margin: 20px 0;
}
.main_header {
  font-size: 20px;
  margin-right: 30px;
}
.charts {
  width: 100%;
  height: 50px;
}
</style>