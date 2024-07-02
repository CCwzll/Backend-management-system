<template>
  <el-card>
    <div slot="header" class="header">
      <div class="Cy-header">
        <span>销售额类别占比</span>
        <el-radio-group v-model="value">
          <el-radio-button label="全部渠道"></el-radio-button>
          <el-radio-button label="线上"></el-radio-button>
          <el-radio-button label="线下"></el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div>
      <div class="charts" ref="charts"></div>
    </div>
  </el-card>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "",
  data() {
    return {
      // 默认值
      value: "全部渠道",
    };
  },
  mounted() {
    let paiChart = echarts.init(this.$refs.charts);
    paiChart.setOption({
      title: {
        top: "center",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          padAngle: 5,
          itemStyle: {
            borderRadius: 10,
          },
          label: {
            show: true,
            position: "outsize",
          },

          labelLine: {
            show: false,
          },
          data: [
            { value: 1048, name: "Search Engine" },
            { value: 735, name: "Direct" },
            { value: 580, name: "Email" },
            { value: 484, name: "Union Ads" },
            { value: 300, name: "Video Ads" },
          ],
        },
      ],
    });
    // 添加鼠标移动事件
    paiChart.on("mouseover", (params) => {
      // 获取鼠标移动到的时间
      const { name, value } = params.data;
      // 重新赋值
      paiChart.setOption({
        title: {
          text: name,
          subtext: value,
        },
      });
    });
  },
};
</script>

<style scoped>
.header {
  border-bottom: 1px solid #d9d9d9;
}
.Cy-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.charts {
  width: 100%;
  height: 300px;
}
</style>