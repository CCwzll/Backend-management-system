<template>
  <el-card class="box-card" style="margin: 10px 0px">
    <div slot="header" class="clearfix">
      <!--  @tab-click="handleClick" -->
      <!-- 表头左侧内容 -->
      <el-tabs class="tab" v-model="activeName">
        <el-tab-pane label="销售额" name="saled"></el-tab-pane>
        <el-tab-pane label="访问量" name="visited"></el-tab-pane>
      </el-tabs>
      <!-- 表头右侧内容 -->
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">今年</span>
        <el-date-picker
          v-model="date"
          class="date"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="20">
          <!-- 容器 -->
          <div class="charts" ref="charts"></div>
        </el-col>
        <el-col :span="4">
          <h3>门店{{ title }}排名</h3>
          <ul>
            <li>
              <span class="rindex">1</span>
              <span class="tvalue">肯德基</span>
              <span class="rvalue">12306</span>
            </li>
            <li>
              <span class="rindex">2</span>
              <span class="tvalue">肯德基</span>
              <span class="rvalue">12306</span>
            </li>
            <li>
              <span class="rindex">3</span>
              <span class="tvalue">肯德基</span>
              <span class="rvalue">12306</span>
            </li>
            <li>
              <span class="rindex1">4</span>
              <span class="tvalue">肯德基</span>
              <span class="rvalue">12306</span>
            </li>
            <li>
              <span class="rindex1">5</span>
              <span class="tvalue">肯德基</span>
              <span class="rvalue">12306</span>
            </li>
            <li>
              <span class="rindex1">6</span>
              <span class="tvalue">肯德基</span>
              <span class="rvalue">12306</span>
            </li>
            <li>
              <span class="rindex1">7</span>
              <span class="tvalue">肯德基</span>
              <span class="rvalue">12306</span>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import * as echarts from "echarts";
import dayjs from "dayjs";
export default {
  name: "",
  data() {
    return {
      activeName: "saled",
      barCharts: null, //barCharts为局部变量，挂载到组件实例身上可以用this
      date: [], //收集时间
    };
  },
  methods: {
    // 获取今天日期
    setDay() {
      const day = dayjs().format("YYYY-MM-DD");
      this.date = [day, day];
    },
    //  获取这周的日期
    setWeek() {
      const star = dayjs().day(1).format("YYYY-MM-DD");
      const end = dayjs().day(7).format("YYYY-MM-DD");
      this.date = [star, end];
    },
    // 获取这个也的日期
    setMonth() {
      const star = dayjs().startOf("month").format("YYYY-MM-DD");
      const end = dayjs().endOf("month").format("YYYY-MM-DD");
      this.date = [star, end];
    },
    // 获取年
    setYear() {
      const star = dayjs().startOf("year").format("YYYY-MM-DD");
      const end = dayjs().endOf("year").format("YYYY-MM-DD");
      this.date = [star, end];
    },
  },
  mounted() {
    // 初始化charts实例
    this.barCharts = echarts.init(this.$refs.charts);
    // 数据设置
    this.barCharts.setOption({
      title: {
        text: this.title + "趋势",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [
            "一月",
            "二月",
            "三月",
            "三月",
            "三月",
            "三月",
            "三月",
            "三月",
            "三月",
            "三月",
            "三月",
            "三月",
          ],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: [99, 146, 200, 334, 390, 330, 220, 380, 200, 250, 179, 299],
          color: "pink",
        },
      ],
    });
  },
  computed: {
    // 计算属性 标题
    title() {
      return this.activeName == "saled" ? "销售额" : "访问量";
    },
  },
  // 监听 title的变化，更改新的值
  watch: {
    title() {
      // 重新修改标题数据
      this.barCharts.setOption({
        title: {
          text: this.title,
        },
      });
    },
  },
};
</script>

<style scoped>
* {
  padding: 0;
}
.clearfix {
  display: flex;
  justify-content: space-between;
  position: relative;
}
.tab {
  width: 100%;
}

.right {
  position: absolute;
  right: 0;
}
.right span {
  margin: 0 10px;
}
.date {
  margin: 0 10px;
}
.charts {
  width: 100%;
  height: 400px;
}
ul {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0;
}
ul li {
  display: flex;
  height: 8%;
  margin: 25px 0;
  align-items: center;
}

.rindex {
  float: left;
  width: 20px;
  height: 19px;
  border-radius: 50%;
  background: black;
  color: white;
  text-align: center;
}
.rvalue {
  float: right;
}
.tvalue {
  margin: 0 50px;
}
.rindex1 {
  float: left;
  width: 20px;
  height: 19px;
  background: white;
  color: black;
  text-align: center;
}
</style>