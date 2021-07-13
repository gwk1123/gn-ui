<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item label="GDS编码" prop="gdsCode">
        <el-input
          v-model="queryParams.gdsCode"
          placeholder="请输入GDS编码"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="接口方法" prop="apiMethod">
        <el-select
          v-model="queryParams.apiMethod"
          placeholder="接口方法"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in apiMethodOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="是否成功" prop="successFlag">
        <el-select
          v-model="queryParams.successFlag"
          placeholder="是否成功"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in successFlagOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="carrierCabinBlackList" >
      <el-table-column label="航司" prop="carrier" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="航班号" prop="flightNumber" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="舱位" prop="cabin" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="出发时间" prop="depTime" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="GDS系统" rop="gds" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="office号" prop="officeId" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="API方法" prop="apiMethod" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="创建时间" prop="createTime" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="渠道" prop="channelName" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="失效时间" prop="displayFailureTime" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="状态" prop="statusName" align="center" class-name="small-padding fixed-width" />

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['direct/carrier_cabin_black/remove']"
          >删除</el-button>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
  import { listCarrierCabinBlack, delCarrierCabinBlack } from "@/api/direct/gds/carrierCabinBlack";

  export default {
    name: "CarrierCabinBlack",
    data() {
      return {
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // GDS表格数据
        carrierCabinBlackList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 日期范围
        dateRange: [],
        // 状态数据字典
        statusOptions: [],
        // 查询参数
        queryParams: {
          apiMethod: undefined
        }
      };
    },
    created() {
      this.getList();
      this.getDicts("sys_normal_disable").then(response => {
        this.statusOptions = response.data;
      });
      this.getDicts("direct_api_method").then(response => {
        this.apiMethodOptions = response.data;
      });
    },
    methods: {
      /** 查询角色列表 */
      getList() {
        this.loading = true;
        listCarrierCabinBlack(this.addDateRange(this.queryParams, this.dateRange)).then(
          responseData => {
            this.carrierCabinBlackList = responseData.data;
            this.loading = false;
          }
        );
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.current = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.dateRange = [];
        this.resetForm("queryForm");
        this.handleQuery();
      },
      /** 删除按钮操作 */
      handleDelete(row) {

        this.$confirm('是否确认删除?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delCarrierCabinBlack(row);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
      }
    }
  };
</script>
