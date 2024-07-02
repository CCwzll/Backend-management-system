<template>
  <div>
    <el-card style="margin: 20px 0">
      <!-- 引入全局组件 -->
     <CategorySelect
        @getCategoryId="getCategoryId"
        :show="scene!=0"
      ></CategorySelect>
      </categorySelect>
    </el-card>
    <el-card>
      <!-- 有三部分进行 -->
      <div v-show="scene==0">
        <!-- 添加SPU按钮 -->
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" width="100px">
          </el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="spu描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width" style="margin:20px">
            <template slot-scope="{ row, $index }">
              <el-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加Sku"
                @click="addSku(row)"
              ></el-button>
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="编辑Spu"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu全部sku列表"
                @click="handler(row)"
              ></el-button>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
              >
              <el-button type="danger" icon="el-icon-delete" size="mini" style="margin:10px" title="删除spu"  slot="reference"  @click="deleteSpu(row)" ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="page"
          :page-sizes="[3, 5, 7]"
          :page-size="limit"
          layout="prev,pager,next,jumper,->,sizes,total"
          :total="total"
          style="text-align: center"
          @current-change="getSpuList" 
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>
      <div>
        <!-- 引入子组件 -->
        <SpuForm v-show="scene==1" @changeScene="changeScene" ref="spu"></SpuForm>
        <SkuForm v-show="scene==2"@changeScenes="changeScenes" ref="sku"></SkuForm>
      </div>
      <el-dialog :title="`${spu.spuName}的sku`" :visible.sync="dialogTableVisible" :before-close="handleClose">
        <el-table
            :data="skuList"
            style="width: 100%"  v-loading="loading" border>
            <el-table-column
                prop="skuName"
                label="名称"
                width="width">
            </el-table-column>
            <el-table-column
                prop="price"
                label="价格"
                width="width">
            </el-table-column>
            <el-table-column
                prop="weight"
                label="重量"
                width="width">
            </el-table-column>
            <el-table-column
              
                label="默认图片"
                width="width">
                <template slot-scope="{row,$index}">
                    <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px">
                </template>
            </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { Loading } from "element-ui";
import SkuForm from "./SkuForm/index.vue";
import SpuForm from "./SpuForm/index.vue";
export default {
  name: "Spu",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      page: 1, //当前第几页
      limit: 3, //每页显示数据
      records: [], //spu列表的数据
      total: 0, // 分页器一共展示数据
      scene: 0, //场景转变 0为spu数据列表 1为添加|修改spu 2为修改sku
      dialogTableVisible: false, //对话框起始状态
      spu: {}, //声明spu，进行数据展示
      skuList: [], //存放sku列表的数据
      loading: true,
    };
  },
  components: {
    SkuForm,
    SpuForm,
  },
  methods: {
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        this.getSpuList();
      }
    },
    // 获取SPU列表数据
    async getSpuList(pager = 1) {
      this.page = pager;
      // 带参 先解构参数
      const { page, limit, category3Id } = this;
      let result = await this.$API.spu.reqGetSpuList(page, limit, category3Id);
      if (result.code == 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    // 分页器每页展示的数据个数
    handleSizeChange(limit) {
      this.limit = limit;
      // 再次发请求
      this.getSpuList();
    },
    // 添加Spu
    addSpu() {
      this.scene = 1;
      // 通知子组件Spuform发请求
      this.$refs.spu.addSpu(this.category3Id);
    },
    // 修改Spu
    updateSpu(row) {
      this.scene = 1;
      // ※父组件通过$refs获取子组件的数据和方法
      this.$refs.spu.initSpuData(row);
    },
    // 子传父 自定义事件 【Spu列表】
    changeScene({ scene, flag }) {
      this.scene = scene;
      if (flag == "修改") {
        // 当子组件上传新的数据时，需要再次获取spu列表进行展示,并留在当前页
        this.getSpuList(this.page);
      } else {
        // 保存返回第一页
        this.getSpuList();
      }
    },
    // 删除Spu
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message({ type: "success", message: "删除成功" });
        // 发请求 如果数据列表的长度大于1 则留在当前页面
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
      }
    },
    // 添加Sku
    addSku(row) {
      this.scene = 2;
      // 父组件调用子组件的方法
      this.$refs.sku.getData(this.category1Id, this.category2Id, row);
    },
    // 子传父 自定义事件 修改场景 【Sku列表】
    changeScenes(scene) {
      this.scene = scene;
    },
    // 展示sku列表
    async handler(spu) {
      this.dialogTableVisible = true;
      this.spu = spu;
      //发请求
      let result = await this.$API.spu.reqSkuList(spu.id);
      if (result.code == 200) {
        this.skuList = result.data;
        this.loading = false;
      }
    },
    // 关闭对话框回调
    handleClose(done) {
      // loading再次变为真
      this.loading = true;
      // 清除数据
      this.skuList = [];
      // 管理对话框
      done();
    },
  },
};
</script>

<style>
</style>