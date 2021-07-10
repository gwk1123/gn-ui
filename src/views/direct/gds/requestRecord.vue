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

      <el-form-item label="站点" prop="otaSiteCode">
        <el-input
          v-model="queryParams.otaSiteCode"
          placeholder="请输入站点编码"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="生单关联id" prop="referenceId">
        <el-input
          v-model="queryParams.referenceId"
          placeholder="请输入生单关联id"
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

    <el-table v-loading="loading" :data="requestRecordList" >
      <el-table-column label="id" prop="id" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="站点" prop=" " align="center" class-name="small-padding fixed-width" />
      <el-table-column label="订单编码" prop="reservationNo" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="OTA订单号" prop="otaReservationNo" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="GDS系统" rop="gdsChannel" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="office号" prop="officeNo" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="API方法" prop="apiMethod" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="search时间" prop="searchTime" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="API请求时间" prop="requestTime" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="关联UUID" prop="apiUid" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="生单关联id" prop="referenceId" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="出发日期" prop="depDate" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="回程日期" prop="retDate" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="成人数量" prop="adultNumber" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="行程类型" prop="tripType" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="销售航司" prop="marketingAirline" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="出发机场" prop="depAirport" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="到达机场" prop="arrAirport" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="是否成功" prop="successFlag" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="错误信息描述" prop="errorMessage" align="center" class-name="small-padding fixed-width" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.current"
      :limit.sync="queryParams.size"
      @pagination="getList"
    />
  </div>
</template>

<script>
  import { listRequestRecord } from "@/api/direct/gds/requestRecord";

  export default {
    name: "ReservationOrder",
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
        // 总条数
        total: 0,
        // GDS表格数据
        requestRecordList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 日期范围
        dateRange: [],
        // 状态数据字典
        statusOptions: [],
        apiMethodOptions: [],
        successFlagOptions: [],
        // 查询参数
        queryParams: {
          current: 1,
          size: 10,
          referenceId: undefined,
          otaSiteCode: undefined,
          successFlag: undefined,
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
      this.getDicts("direct_success_flag").then(response => {
        this.successFlagOptions = response.data;
      });
    },
    methods: {
      /** 查询角色列表 */
      getList() {
        this.loading = true;
        listRequestRecord(this.addDateRange(this.queryParams, this.dateRange)).then(
          responseData => {
            const response = responseData.data;
            this.requestRecordList = response.records;
            this.total = response.total;
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
    }
  };
</script>
