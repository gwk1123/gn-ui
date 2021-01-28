<style>
  .el-card__header {
    background-color: #D9EDF7;
  }
</style>

<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">

      <el-form-item label="政策id" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入政策id"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="航司" prop="airline">
        <el-input
          v-model="queryParams.airline"
          placeholder="请输入航司"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="GDS状态"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['manual/policy_global/add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['manual/policy_global/remove']"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="policyGlobalList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" prop="id" width="120" />
      <el-table-column label="数据渠道" prop="channel" width="100" />
      <el-table-column label="航司" prop="airline" width="100" />
      <el-table-column label="出发地" prop="depAirport" width="100" />
      <el-table-column label="抵达地" prop="arrAirport" width="100" />
      <el-table-column label="销售开始日期" prop="saleStartDate" width="100" />
      <el-table-column label="销售结束日期" prop="saleEndDate" width="100" />
      <el-table-column label="班期限制" prop="weekLimit" width="100" />
      <el-table-column label="产品类型" prop="productType" width="100" />
      <el-table-column label="报价类型" prop="rePriceType" width="100" />
      <el-table-column label="行程类型" prop="tripType" width="100" />
      <el-table-column label="前返点" prop="beforeCommission" width="100" />
      <el-table-column label="前返现金" prop="beforeAmount" width="100" />
      <el-table-column label="后返点" prop="afterCommission" width="100" />
      <el-table-column label="后返现金" prop="afterAmount" width="100" />
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['manual/policy_global/edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['manual/policy_global/remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.current"
      :limit.sync="queryParams.size"
      @pagination="getList"
    />

    <!-- 添加或修改配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-card >
          <div slot="header" >
            <span>运价信息</span>
          </div>
          <div>


        <el-row>
          <el-col :span="12">
            <el-form-item label="数据来源" prop="sourceType">
              <el-select
                v-model="form.sourceType"
                placeholder="请选择下拉选择"
                clearable
                size="small"
                style="width: 240px"
              >
                <el-option
                  v-for="dict in sourceTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据渠道" prop="channel">
              <el-select
                v-model="form.channel"
                placeholder="请选择下拉选择"
                clearable
                size="small"
                style="width: 240px"
              >
                <el-option
                  v-for="dict in channelOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
        <el-form-item label="航司" prop="airline">
          <el-input v-model="form.airline" placeholder="请输入航司二字码" />
        </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="班期限制" prop="weekLimit">
          <el-input v-model="form.weekLimit" placeholder="请输入1/2/3/4/5/6/7" />
        </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
        <el-form-item label="出发地" prop="depAirport">
          <el-input v-model="form.depAirport"  placeholder="请输入机场三字码,多个用英文的/分开 999表示全国" />
        </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="抵达地" prop="arrAirport">
          <el-input v-model="form.arrAirport"  placeholder="请输入机场三字码,多个用英文的/分开 999表示全国" />
        </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
        <el-form-item label="排除航线" prop="airRouteExcept">
          <el-input v-model="form.airRouteExcept"  placeholder="当机场999时适用 格式单向|999-SZX/双向|999-CAN/双向|999-HUZ/双向|999-ZUH" />
        </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="航班号限制" prop="flightNumLimit">
              <el-select
                v-model="form.flightNumLimit"
                placeholder="请选择下拉选择"
                clearable
                size="small"
                style="width: 240px"
              >
                <el-option
                  v-for="dict in flightNumLimitOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="航班号" prop="flightNum">
          <el-input v-model="form.flightNum"  placeholder="航班号(不包含航司二字码) 格式：123/234 多个用英文的/分开" />
        </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
        <el-form-item label="舱位" prop="cabin">
          <el-input v-model="form.cabin"  placeholder="多个用英文的/分开" />
        </el-form-item>
          </el-col>
          <el-col :span="12">
          <el-form-item label="舱位排除" prop="cabinExcept">
          <el-input v-model="form.cabinExcept"  placeholder="多个用英文的/分开" />
        </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="销售时间" prop="field119">
              <el-date-picker type="daterange" v-model="form.saleDates" format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd" :style="{width: '100%'}" start-placeholder="开始日期" end-placeholder="结束日期"
                              range-separator="至" clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="旅行时间" prop="field119">
              <el-date-picker type="daterange" v-model="form.travelDates" format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd" :style="{width: '100%'}" start-placeholder="开始日期" end-placeholder="结束日期"
                              range-separator="至" clearable></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="适用起飞时间段" prop="depTimeLimit">
              <el-input v-model="form.depTimeLimit"  placeholder="格式 HHMM-HHMM 多个用英文的/分开" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="班期限制" prop="weekLimit">
              <el-input v-model="form.weekLimit"  placeholder="格式：1/2/3/4/5/6/7" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="最早提前出票时限" prop="beginValidDay">
              <el-input v-model="form.beginValidDay"  placeholder="最早提前出票时限 正整数，大于等于0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最晚提前出票时限" prop="latestValidDay">
              <el-input v-model="form.latestValidDay"  placeholder="最晚提前出票时限 正整数，大于等于0" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="政策工作时间" prop="workTimeLimit">
              <el-input v-model="form.workTimeLimit"  placeholder="政策工作时间限制 格式：00:00-23:59 多个用英文的/分开" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品类型" prop="productType">
              <el-input v-model="form.productType"  placeholder="产品类型" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="报价类型" prop="rePriceType">
              <el-select
                v-model="form.rePriceType"
                placeholder="请选择下拉选择"
                clearable
                size="small"
                style="width: 240px"
              >
                <el-option
                  v-for="dict in rePriceTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="行程类型" prop="tripType">
              <el-select
                v-model="form.tripType"
                placeholder="请选择下拉选择"
                clearable
                size="small"
                style="width: 240px"
              >
                <el-option
                  v-for="dict in tripTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="最低票面价" prop="minTicketPrice">
              <el-input v-model="form.minTicketPrice"  placeholder="正整数，大于等于0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最高票面价" prop="maxTicketPrice">
              <el-input v-model="form.maxTicketPrice"  placeholder="正整数，大于等于0" />
            </el-form-item>
          </el-col>
        </el-row>

          </div>
        </el-card>

        <el-card >
          <div slot="header" >
            <span>价格信息</span>
          </div>
          <div>

            <el-row>
              <el-col :span="12">
                <el-form-item label="前返点" prop="beforeCommission">
                  <el-input v-model="form.beforeCommission"  placeholder="单位%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="前返现金" prop="beforeAmount">
                  <el-input v-model="form.beforeAmount"  placeholder="正整数，大于等于0" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="后返点" prop="afterCommission">
                  <el-input v-model="form.afterCommission"  placeholder="单位%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="后返现金" prop="afterAmount">
                  <el-input v-model="form.afterAmount"  placeholder="正整数，大于等于0" />
                </el-form-item>
              </el-col>
            </el-row>

          </div>
        </el-card>


        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="出票备注" prop="ticketRemark">
          <el-input v-model="form.ticketRemark" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { listPolicyGlobal, getPolicyGlobal, delPolicyGlobal, addPolicyGlobal, updatePolicyGlobal, changePolicyGlobalStatus } from "@/api/manual/policy/policyGlobal";

  export default {
    name: "Ota",
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
        // OTA表格数据
        policyGlobalList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 日期范围
        dateRange: [],
        // 状态数据字典
        statusOptions: [],
        sourceTypeOptions: [],
        channelOptions: [],
        flightNumLimitOptions: [],
        rePriceTypeOptions: [],
        tripTypeOptions: [],
        // 查询参数
        queryParams: {
          current: 1,
          size: 10,
          // productType: undefined,
          // priceType: undefined,
          // airline: undefined,
          // tripType: undefined,
          // permitTransit: undefined,
          status: undefined
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          // otaCode: [
          //   { required: true, message: "OTA编码不能为空", trigger: "blur" }
          // ],
          // otaCname: [
          //   { required: true, message: "OTA中文名不能为空", trigger: "blur" }
          // ],
          // otaEname: [
          //   { required: true, message: "OTA英文名不能为空", trigger: "blur" }
          // ]
        }
      };
    },
    created() {
      this.getList();
      this.getDicts("sys_normal_disable").then(response => {
        this.statusOptions = response.data;
      });
      this.getDicts("manual_source_type").then(response => {
        this.sourceTypeOptions = response.data;
      });
      this.getDicts("manual_channel").then(response => {
        this.channelOptions = response.data;
      });
      this.getDicts("manual_flight_num_limit").then(response => {
        this.flightNumLimitOptions = response.data;
      });
      this.getDicts("manual_re_price_type").then(response => {
        this.rePriceTypeOptions = response.data;
      });
      this.getDicts("manual_trip_type").then(response => {
        this.tripTypeOptions = response.data;
      });

    },
    methods: {
      /** 查询角色列表 */
      getList() {
        this.loading = true;
        listPolicyGlobal(this.addDateRange(this.queryParams, this.dateRange)).then(
          responseData => {
            const response = responseData.data;
            this.policyGlobalList = response.records;
            this.total = response.total;
            this.loading = false;
          }
        );
      },
      // 角色状态修改
      handleStatusChange(row) {
        let text = row.status === "0" ? "启用" : "停用";
        this.$confirm('确认要"' + text + '""' + row.otaCode + '"编码吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changePolicyGlobalStatus(row.id, row.status);
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function() {
          row.status = row.status === "0" ? "1" : "0";
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          sourceType: undefined,
          channel: undefined,
          airline: undefined,
          arrAirport: undefined,
          depAirport: undefined,
          airRouteExcept: undefined,
          flightNumLimit: "0",
          flightNum: undefined,
          cabin: undefined,
          cabinExcept: undefined,
          depTimeLimit: undefined,
          weekLimit: undefined,
          saleDates: undefined,
          travelDates: undefined,
          beginValidDay: undefined,
          latestValidDay: undefined,
          workTimeLimit: undefined,
          productType: undefined,
          rePriceType: "2",
          tripType: "2",
          minTicketPrice: undefined,
          maxTicketPrice: undefined,
          beforeCommission: undefined,
          beforeAmount: undefined,
          afterCommission: undefined,
          afterAmount: undefined,
          status: "0",
          ticketRemark: undefined
        };
        this.resetForm("form");
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
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length!=1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加站点";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids;
        getPolicyGlobal(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改站点";
        });
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            const path = this.$route.path;
            //跟据路由的路径获取平台和站点
            const otaStr = path.split("/")[2];
            // this.form.otaCode = (otaStr.split("_")[0]).toUpperCase( );
            this.form.otaSiteCode = (otaStr.split("_")[1]).toUpperCase( );
            if (this.form.id != undefined) {
              updatePolicyGlobal(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                }
              });
            } else {
              addPolicyGlobal(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
                }
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$confirm('是否确认删除id为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delPolicyGlobal(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
      }
    }
  };
</script>
