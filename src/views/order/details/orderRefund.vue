<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">

      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.refundStatus"
          placeholder="退票状态"
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
          v-hasPermi="['manual/order_refund/add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['manual/order_refund/remove']"
        >删除
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="orderRefundList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['manual/order_refund/edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['manual/order_refund/remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>

      <el-table-column label="id" prop="id" width="120"/>
      <el-table-column label="GDS订单id" prop="orderNo" width="100"/>
      <el-table-column label="来源站点" prop="otaSiteCode" width="100"/>
      <el-table-column label="OTA退单号" prop="otaRefundNo" width="100"/>
      <el-table-column label="GDS订单id" prop="orderNo" width="100"/>
      <el-table-column label="关联订单id" prop="orderInfoId" width="100"/>
      <el-table-column label="申请原因" prop="applyRefundReason" width="100"/>
      <el-table-column label="退票状态" prop="refundStatus" width="100"/>
      <el-table-column label="退票申请时间" prop="applyDatetime" width="100"/>

      <el-table-column label="状态" align="supplierCode" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
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

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">


        <el-row>
          <el-col :span="6">
            <el-form-item label="关联订单id" prop="otaSiteCode">
              <el-input v-model="form.orderInfoId" placeholder="请输入大写字母" disabled="disabled"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="GDS的订单号" prop="otaOrderNo">
              <el-input v-model="form.otaOrderNo" placeholder="请输入大写字母"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="出票ID" prop="urgency">
              <el-input v-model="form.orderInfoIssueId" placeholder="只能录入航司二字码"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="OTA退单号" prop="urgency">
              <el-input v-model="form.otaRefundNo" placeholder="只能录入航司二字码"/>
            </el-form-item>
          </el-col>
        </el-row>


        <el-row>
          <el-col :span="6">
            <el-form-item label="站点" prop="otaSiteCode">
              <el-input v-model="form.otaSiteCode" placeholder="请输入大写字母" disabled="disabled"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="申请原因" prop="otaOrderNo">
              <el-input v-model="form.applyRefundReason" placeholder="请输入大写字母"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="退票状态" prop="urgency">
              <el-input v-model="form.refundStatus" placeholder="只能录入航司二字码"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="退票申请时间" prop="urgency">
              <el-input v-model="form.applyDatetime" placeholder="只能录入航司二字码"/>
            </el-form-item>
          </el-col>
        </el-row>


        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
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
  import {
    listOrderRefund,
    getOrderRefund,
    delOrderRefund,
    addOrderRefund,
    updateOrderRefund,
    changeOrderRefund
  } from "@/api/order/details/orderRefund";

  export default {
    name: "OrderRefund",
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
        orderRefundList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 日期范围
        dateRange: [],
        // 状态数据字典
        statusOptions: [],
        // //订单航段信息
        // orderSegmentList: [],
        // //订单乘客信息
        // orderPassengerList: [],
        // 查询参数
        queryParams: {
          current: 1,
          size: 10
        },
        // 表单参数
        form: {
          // orderInfoSegments: [],
          // orderSegmentList: [],
          // orderPassengerList: []
        },
        // 表单校验
        rules: {
          type: [
            // { required: true, message: "类型不能为空", trigger: "blur" }
          ]
        }
      };
    },
    created() {
      this.getList();
      this.getDicts("sys_normal_disable").then(response => {
        this.statusOptions = response.data;
      });
    },
    methods: {
      /** 查询角色列表 */
      getList() {
        this.loading = true;
        listOrderRefund(this.addDateRange(this.queryParams, this.dateRange)).then(
          responseData => {
            const response = responseData.data;
            this.orderRefundList = response.records;
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
        }).then(function () {
          return changeOrderRefund(row.id, row.status);
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function () {
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
          status: "0",
          // orderInfoSegments: [],
          remark: undefined
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
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加改签信息";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids;
        getOrderRefund(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改退票";
        });
      },
      /** 提交按钮 */
      submitForm: function () {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              updateOrderRefund(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                }
              });
            } else {
              addOrderRefund(this.form).then(response => {
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
        }).then(function () {
          return delOrderRefund(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function () {
        });
      }
    }
  };
</script>


