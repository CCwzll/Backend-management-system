<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="!isShowTable"
      ></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <!-- 表格 展示平台属性 【先静态】 -->
        <el-table style="width: 100%" border :data="attrList">
          <!-- 序号 -->
          <el-table-column
            type="index"
            label="序号"
            width="100px"
            align="center"
          >
          </el-table-column>
          <!-- 属性名称 -->
          <el-table-column prop="attrName" label="属性名称" width="150px">
          </el-table-column>
          <!-- 属性值列表 -->
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
                style="margin: 0 50px"
                >{{ attrValue.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column prop="prop" label="操作" width="150px">
            <template slot-scope="{ row, $index }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- [难点] 添加属性值 | 修改属性值 的结构-->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名attrName"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table style="width: 100%" border :data="attrInfo.attrValueList">
          <el-table-column
            type="index"
            label="序号"
            width="100px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <!-- span 与 input 来回切换 -->
              <el-input
                placeholder="请输入属性值名称"
                v-model="row.valueName"
                size="mini"
                v-if="row.flag"
                @blur="changeFlag(row)"
                @keyup.native.enter="changeFlag(row)"
                :ref="$index"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                :title="`确定删除${row.valueName}?`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="addOrUpdateAttr"
          :disabled="attrInfo.attrValueList.length < 1"
          >保存</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      // 存储子组件传来的id
      category1Id: "",
      category2Id: "",
      category3Id: "",
      // 商品属性
      attrList: [],
      // 是否展示table 开始默认展示table
      isShowTable: true,
      // 存储属性值信息
      attrInfo: {
        // 属性名
        attrName: "",
        // 此处数据占位
        attrValueList: [
          // attrId=0, 此处占位 还未添加已存在一行
          // attrName= "",
        ], //属性值，因为属性值可以有多个因此用数组，每一个属性值都是一个对象需要attrId，valueName
        categoryId: 0, // 携带三级分类的id ，因为对象中的排列为无序性，不可以用this.category3Id
        categoryLevel: 3,
      },
    };
  },
  methods: {
    // 自定义事件回调
    getCategoryId({ categoryId, level }) {
      // 区分三级分类的id 并将数据存储在父组件data中
      if (level == 1) {
        this.category1Id = categoryId;
        // 当一级分类id发生变化的时候 其他两级id置空
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        // 代表三级分类的id已存在
        this.category3Id = categoryId;
        // 发请求获取品牌属性
        this.getAttrList();
      }
    },
    //获取品牌属性
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    // 添加属性值的回调
    addAttrValue() {
      // 向属性值数组 push新增的元素
      this.attrInfo.attrValueList.push({
        // 【新增是没有id的，但是修改时我已经存在服务器传来的id，所以当修改的时候一定要带上原有的id】
        attrId: this.attrInfo.id, //这个id是有服务器返回的，目前还向服务器发请求，所以暂时设为undefined
        attrName: "",
        flag: true, ///flag属性:给每一个属性值添加一个标记flag，用户切换査看模式与编辑模式，好处:每一个属性值可以控制自己的模式切换
      });
      // 点击添加的时候也需要自动聚焦
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    // 添加属性按钮的回调
    addAttr() {
      // 切换显示table
      this.isShowTable = false;
      // 清除数据，同时拿到3id的数据
      this.attrInfo = {
        attrName: "",
        // 此处数据占位
        attrValueList: [],
        categoryId: this.category3Id, // 携带三级分类的id ，因为对象中的排列为无序性，不可以用this.category3Id
        categoryLevel: 3,
      };
    },
    // 修改某一个属性
    updateAttr(row) {
      this.isShowTable = false;
      // 当取消修改时，数据仍然修改，这里不可使用浅拷贝，因为数组中又包含对象。故用深拷贝，引入lodash
      // 深浅拷贝为面试重点
      this.attrInfo = cloneDeep(row);
      // 修改某个元素时，将相应的属性元素添加上flag标记
      // $set 它必须用于向响应式对象上添加新property，因为Vue无法探测普通的新增 property;(target[目标],propertyName/index【添加到响应式属性】,value【值】)
      this.attrInfo.attrValueList.forEach((item) => {
        this.$set(item, "flag", false);
      });
    },
    // 失去焦点事件，切换成span 【row为最新添加的属性值，查重与空格】
    changeFlag(row) {
      // 当出现属性值为空的时候，给用户提示
      if (row.valueName.trim() == "") {
        this.$message("请输入正确的属性值");
        return;
      }
      // 当出现重复的属性值 【row为最新添加的属性值】
      let isRepat = this.attrInfo.attrValueList.some((item) => {
        // item为已有的所有值 所以 !== 是将自己排除
        // 将row跟已有的属性值进行判断，若不相等，则返回row值
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      });
      if (isRepat) return;
      // 编辑模式变成查看模式
      row.flag = false;
    },
    // 点击input框 自动聚焦 注意重绘与重拍问题 nextTick
    toEdit(row, index) {
      row.flag = true;
      // 利用ref获取input的节点，已实现自动聚焦。index为变量 不可以$refs.index
      // 注：点击span切换为input的时候，浏览器需要时间进行页面的重绘与重拍 所以需要等DOM全部加载完毕在进行聚焦
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    // 删除属性值名称 不用向服务发请求
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1);
    },
    // 完成添加和修改 向服务发请求
    async addOrUpdateAttr() {
      //整理参数:1,如果用户添加很多属性值，且属性值为空的不应该提交给服务器 [过滤]
      //提交给服务器数据当中不应该出现flag字段
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          if (item.valueName != "") {
            // 删除flag属性
            delete item.flag;
            return true;
          }
        }
      );
      try {
        // 等待服务器发请求
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        this.$message({ type: "success", message: "保存成功" });
        this.isShowTable = true;
        //  再次获得品牌属性
        this.getAttrList();
      } catch (error) {
        alert(new Error("faile"));
      }
    },
  },
};
</script>

<style>
</style>