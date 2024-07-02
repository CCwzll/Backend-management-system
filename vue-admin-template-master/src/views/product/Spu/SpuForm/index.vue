<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择着品牌" v-model="spu.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="(tm, index) in trademarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="SPU描述"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- :file-list为上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}] -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="imageList"
          :on-success="handlerSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还有${unSelectSaleAttr.length}项未选`"
          v-model="attrIdAndName"
        >
          <el-option
            :label="unSelect.name"
            :value="`${unSelect.id}:${unSelect.name}`"
            v-for="(unSelect, index) in unSelectSaleAttr"
            :key="unSelect.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrIdAndName"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column
            type="index"
            label="序号"
            width="150px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 
                   -->
              <el-tag
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- input与span进行切换 -->
              <!-- 
                @keyup.enter.native="handleInputConfirm"
                 -->
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <!--  @click="showInput" -->
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="spu.spuSaleAttrList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <!-- 子传父 -->
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "spuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      // spu起始是空对象，在修改的时候，会向服务器发请求，返回SPU信息的对象，在修改时可以利用这个服务器将最新的数据提交给服务器
      // 添加SPU，将新的数据存储于下面 v-model 收集
      spu: {
        category3Id: 0,
        // 描述
        description: "",
        // 收集品牌的id
        tmId: "",
        spuName: "",
        // 收集SPU图片的信息
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "",
          //   imgUrl: "",
          //   spuId: 0,
          // },
        ],
        // 平台属性与属性值的信息
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0
          //     }
          //   ]
          // }
        ],
      }, // 存储Spu信息
      trademarkList: [], //存储品牌信息
      imageList: [], //存储图片信息
      saleAttrList: [], //存储销售属性信息
      // 存储未选择销售属性的id
      attrIdAndName: "",
    };
  },
  methods: {
    // 删除图片的回调
    handleRemove(file, fileList) {
      // file 是要删除的的图片 最后将剩余的图片提交给服务器
      // fileList 是剩余的图片
      // 对于已有的图片 是有name 和 URL的 但是目前不用传给服务器，因为还未点击保存
      this.spuImageList = fileList; //收集剩余的图片
    },
    // 照片墙图片预览的回调【不用收集数据】
    handlePictureCardPreview(file) {
      // 把图片地址赋值给file
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 初始化SpuForm数据
    async initSpuData(spu) {
      // 获取Spu信息
      let SpuResult = await this.$API.spu.reqSpu(spu.id);
      if (SpuResult.code == 200) {
        this.spu = SpuResult.data;
      }
      // 获取品牌信息
      let trademarkListResult = await this.$API.spu.reqTrademarkList();
      if (trademarkListResult.code == 200) {
        this.trademarkList = trademarkListResult.data;
      }
      // 获取图片信息
      let spuImageList = await this.$API.spu.reqSpuImageList(spu.id);
      if (spuImageList.code == 200) {
        //由于:file-list 照片墙显示图片的数据需要数组，数组里面的元素需要有name与url字段
        //需要把服务器返回的数据进行修改
        let imgArr = spuImageList.data;
        imgArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        //  整理数组数据，重新赋值
        this.imageList = imgArr;
      }
      //获取平台全部销售属性信息
      let saleAttrList = await this.$API.spu.reqSaleAttrList();
      if (saleAttrList.code == 200) {
        this.saleAttrList = saleAttrList.data;
      }
    },
    // 图片上传的回调
    handlerSuccess(response, file, fileList) {
      this.imageList = fileList;
    },
    // 添加销售属性
    addSaleAttr() {
      //已经收集新增的销售属性
      // 把收集到的name和id进行字符串的分割 并存于spuSaleAttrList
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndName.split(":");
      // 向Spu的spuSaleAttrList新增的属性
      let newAttr = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] };
      this.spu.spuSaleAttrList.push(newAttr);
    },
    // 添加销售属性值 按钮回调
    addSaleAttrValue(row) {
      // 挂载在销售属性上的响应式数据inputVisible，控制button和input切换
      this.$set(row, "inputVisible", true);
      // 通过响应式数据inputValue字段，收集新的销售属性值
      this.$set(row, "inputValue", "");
    },
    // el-input失去焦点
    handleInputConfirm(row) {
      // 将input中的数据push到spuSaleAttrValueList中，携带baseSaleAttrId，inputValue
      const { baseSaleAttrId, inputValue } = row;
      // 属性值不能为空 【条件需要放前面】
      if (inputValue.trim() == "") {
        this.$message("属性值不能为空");
        return;
      }
      // 新增的属性不能重复
      let result = row.spuSaleAttrValueList.every(
        (item) => item.saleAttrValueName != inputValue
      );
      console.log(result);
      if (!result) return;
      // 新增销售属性值
      let newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue };
      // 新增
      row.spuSaleAttrValueList.push(newSaleAttrValue);

      // 切换input框
      row.inputVisible = false;
    },
    // 保存按钮 提交给服务器
    async addOrUpdateSpu() {
      // 整理照片墙的参数 都要携带imgName、imgUrl
      this.spu.spuImageList = this.imageList.map((item) => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.url,
        };
      });
      // 发请求,携带spu
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      if (result.code == 200) {
        // 提示
        this.$message({ type: "success", message: "保存成功" });
        // 成功后 通知父组件返回scene==0
        this.$emit("changeScene", {
          scene: 0,
          flag: this.spu.id ? "修改" : "添加",
        });
      }
      // 清除数据
      Object.assign(this._data, this.$options.data());
    },
    // 添加Spu
    async addSpu(category3Id) {
      // 添加spu时 收集category3id
      this.spu.category3Id = category3Id;
      // 获取品牌列表信息
      let trademarkListResult = await this.$API.spu.reqTrademarkList();
      if (trademarkListResult.code == 200) {
        this.trademarkList = trademarkListResult.data;
      }
      //获取销售属性信息
      let saleAttrList = await this.$API.spu.reqSaleAttrList();
      if (saleAttrList.code == 200) {
        this.saleAttrList = saleAttrList.data;
      }
    },
    // 取消按钮
    cancel() {
      this.$emit("changeScene", { scene: 0, flag: "" });
      // Object.assign ES6中的合并对象，将所有响应式数据合并
      // 将data中的数据重新赋值   清除数据
      // 得到配置对象中的data函数 执行的为空对象 ，赋值给this._data 即清空data
      Object.assign(this._data, this.$options.data());
    },
  },
  computed: {
    // 计算出还未选择的销售属性
    unSelectSaleAttr() {
      // 原本属性列表中只有三种属性 saleAttrList 过滤返回的是布尔值
      // 利用过滤返回的值与spu.spuSaleAttrList自身的值比较【every遍历】，留下没有的属性值
      let result = this.saleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName;
        });
      });
      return result;
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
