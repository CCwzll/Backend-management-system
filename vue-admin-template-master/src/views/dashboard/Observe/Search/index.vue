<template>
  <el-card>
    <div slot="header">
      <div class="search_header">
        <span>线上热门搜索</span>
        <!-- 下拉菜单 -->
        <el-dropdown>
          <span class="el-dropdown-link">
            <svg
              t="1717137537052"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="875"
              width="28"
              height="28"
            >
              <path
                d="M455.68 527.36a66.56 66.56 0 1 0 133.12 0 66.56 66.56 0 0 0-133.12 0z m-302.08 0a66.56 66.56 0 1 0 133.12 0 66.56 66.56 0 0 0-133.12 0z m583.68 0a66.56 66.56 0 1 0 133.12 0 66.56 66.56 0 0 0-133.12 0z"
                fill="#383838"
                p-id="876"
              ></path>
            </svg>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item>双皮奶</el-dropdown-item>
            <el-dropdown-item>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="search_body">
        <el-row :gutter="20">
          <el-col :span="12"><lineChart></lineChart></el-col>
          <el-col :span="12"><lineChart></lineChart></el-col>
        </el-row>
        <!-- table -->
        <el-table style="width: 100%; margin: 30px 0" border>
          <el-table-column type="index" label="排名" width="80">
          </el-table-column>
          <el-table-column label="搜索关键字"> </el-table-column>
          <el-table-column label="用户数" sortable> </el-table-column>
          <el-table-column label="周涨幅" sortable> </el-table-column>
        </el-table>
        <!-- \@size-change="handleSizeChange"
      @current-change="handleCurrentChange" -->
        <el-pagination
          layout="prev, pager, next"
          :total="1000"
          class="pagination"
        >
        </el-pagination>
      </div>
    </div>
    <!-- card body -->
  </el-card>
</template>

<script>
import lineChart from "./lineChart";
export default {
  name: "",
  components: { lineChart },
};
</script>

<style scoped>
.search_header {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #d9d9d9;
  margin: 10px 0;
}
.pagination {
  float: right;
}
</style>