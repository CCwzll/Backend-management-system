<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="showDialog">添加</el-button></el-button>
    <el-table
     style="width: 100%" border :data="list">
      <el-table-column
        prop="prop"
        label="序号"
        width="80px"
        align="center"
        type="index"
        >
      </el-table-column>
       <el-table-column
        prop="tmName"
        label="品牌名称"
        width="width">
      </el-table-column>
       <el-table-column
        prop="logoUrl"
        label="品牌LOGO"
        width="width"
        > <template slot-scope="{row,$index}">
         <img :src="row.logoUrl" alt="" style="height:100px;width:120px">
        </template>
      </el-table-column> <el-table-column
        prop="prop"
        label="操作"
        width="width">
        <template slot-scope="{row,$index}">
         <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改</el-button>
         <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      :current-page="page" 
       :page-size="limit"
       :total="total"
       :page-count="5"
      :page-sizes="[3, 5, 10]"
      @current-change="getPageList"
      @size-change="handleSizeChange"
      layout=" prev, pager, next, jumper, -> ,sizes,total"
      align="center"
      >
    </el-pagination>
    <!-- 对话框 -->
    <el-dialog :title= "this.tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
      <!-- Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可 -->
      <!-- form表单 :model属性，这个属性的作用是,把表单的数据收集到那个对象的身上 ，将来表单验证，也需要这个属性 -->
      <el-form style="width:80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName" ></el-input>
        </el-form-item>
        <!-- 这里收集数据:不能使用v-model，因为不是表单元素action:设置图片上传的地址
            :on-success: 可以检测到图片上传成功，当图片上传成功，会执行一次
            :before-upload:可以在上传图片之前，会执行一次 -->
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl" >
          <el-upload
              class="avatar-uploader"
              action="/dev-api/admin/product/fileUpload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :plain="true" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    // 自定义校验规则
    var validateTmName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 8) {
        callback(new Error("长度在 2 到 8 个字符"));
      } else {
        callback();
      }
    };
    return {
      // 默认当前页
      page: 1,
      // 单页显示数据
      limit: 3,
      // 数据总条数
      total: 0,
      // 列表数据
      list: [],
      // 对话框的显示与隐藏
      dialogFormVisible: false,
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      // 表单验证
      rules: {
        // 品牌名验证规则
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "change" },
          // {
          //   min: 2,
          //   max: 8,
          //   message: "长度在 2 到 8 个字符",
          //   trigger: "change",
          // },
          // 自定义校验规则
          { validator: validateTmName, trigger: "change" },
        ],
        // 品牌logo验证规则
        logoUrl: [{ required: true, message: "请选择品牌图片" }],
      },
    };
  },
  mounted() {
    this.getPageList();
  },
  methods: {
    async getPageList(pager = 1) {
      this.page = pager;
      // 解构参数
      const { page, limit } = this;
      let result = await this.$API.tradeMark.reqTrdaeMarkList(page, limit);
      if (result.code == 200) {
        // 分别展示数据总条数和列表展示的数据
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },
    // 点击添加品牌
    showDialog() {
      this.dialogFormVisible = true;
      this.tmForm = {
        tmName: "",
        logoUrl: "",
      };
    },
    // 修改某一个品牌
    updateTradeMark(row) {
      this.dialogFormVisible = true;
      // 浅拷贝 将修改的数据带给服务器
      this.tmForm = { ...row };
    },
    // 上传图片
    handleAvatarSuccess(res, file) {
      //收集品牌图片数据
      //res:上传成功之后返回盯端数据
      //file:上传成功之后服务器返回前端数据
      this.tmForm.logoUrl = res.data;
    },
    // 图片上传前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 确认按钮 上传/修改品牌数据 [向服务器发请求]
    addOrUpdateTradeMark() {
      // 当表当验证通过后才书写业务逻辑 此处的success为布尔值
      this.$refs.ruleForm.validate(async (success) => {
        if (success) {
          this.dialogFormVisible = false;
          let result = await this.$API.tradeMark.reqAddOrUpdateTradeMark(
            this.tmForm
          );
          // 通过id判断添加商品还是修改商品
          if (result.code == 200) {
            // 弹出信息框
            this.$message({
              type: "success",
              message: this.tmForm.id ? "成功修改数据" : "添加成功",
            });
            // 如果添加品牌：停留在第一页，修改品牌，停留在当前页
            this.getPageList(this.tmForm.id ? page : 1);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 删除某一个品牌 带参 向服务器发请求
    deleteTradeMark(row) {
      // 弹框
      this.$confirm(`你确定删${row.tmName}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 当用户点击确定的时候会触发 向服务器请求成功才进行删除操作
          let result = await this.$API.tradeMark.reqDeleteTradeMark(row.id);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            // 再次获得数据列表 【列表数据长度>1保留在当前页，否则返回上一页】
            this.getPageList(this.list.length > 1 ? page : this.page - 1);
          }
        })
        // 当用户点击取消的时候会触发
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>
 
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>