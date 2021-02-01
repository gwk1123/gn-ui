<template>
  <div class="app-container">

    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
          <el-form-item label="规则类型" prop="ruleType">
            <el-select
              v-model="queryParams.ruleType"
              placeholder="规则类型"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option
                v-for="dict in ruleOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
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
          v-hasPermi="['manual/ota_rule/add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['manual/ota_rule/remove']"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="otaRuleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" prop="id" width="120" />
      <el-table-column label="数据来源" prop="sourceType" width="100" />
      <el-table-column label="渠道代码" prop="channel" width="100" />
      <el-table-column label="规则类型" prop="bookGdsChannel" width="100" />
      <el-table-column label="航司" prop="airline" width="100" />
      <el-table-column label="出发地" prop="depAirport" width="100" />
      <el-table-column label="目的地" prop="arrAirport" width="100" />
      <el-table-column label="舱位" prop="cabin" width="100" />
      <el-table-column label="自定义内容一" prop="parameter1" width="100" />
      <el-table-column label="自定义内容一" prop="parameter2" width="100" />
      <el-table-column label="自定义内容一" prop="parameter3" width="100" />
      <el-table-column label="自定义内容一" prop="parameter4" width="100" />
      <el-table-column label="自定义内容一" prop="parameter5" width="100" />
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
            v-hasPermi="['manual/ota_rule/edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['manual/ota_rule/remove']"
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
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-form-item label="规则类型" prop="ruleType" label-width="150px">
            <el-select
              v-model="queryParams.ruleType"
              placeholder="规则类型"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option
                v-for="dict in ruleOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-row>


        <!--白名单 -->
        <div v-show ="this.queryParams.ruleType =='OTA-1' ">

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
              <el-form-item label="航司" prop="airline" label-width="150px">
                <el-input v-model="form.airline" placeholder="多个用英文的/分开" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="舱位" prop="cabin" label-width="150px">
                <el-input v-model="form.cabin" placeholder="多个用英文的/分开" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="出发地" prop="depAirport" label-width="150px">
                <el-input v-model="form.depAirport" placeholder="出发机场码 多个用英文的/分开 999表示全国" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="目的地" prop="arrAirport" label-width="150px">
                <el-input v-model="form.arrAirport" placeholder="抵达机场码 多个用英文的/分开 999表示全国" />
              </el-form-item>
            </el-col>
          </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="航班号" prop="parameter1" label-width="150px">
              <el-input v-model="form.parameter1" placeholder="航班号(不包含航司二字码) 格式：123/234 多个用英文的/分开" />
            </el-form-item>
          </el-col>
        </el-row>
        </div>

        <div v-show ="this.queryParams.ruleType =='OTA-3' ">
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
              <el-form-item label="航司" prop="airline" label-width="150px">
                <el-input v-model="form.airline" placeholder="多个用英文的/分开" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="推送的政策类型" prop="parameter1">
                <el-select
                  v-model="form.parameter1"
                  placeholder="请选择下拉选择"
                  clearable
                  size="small"
                  style="width: 240px"
                >
                  <el-option
                    v-for="dict in policyTypeOptions"
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
              <el-form-item label="出发地" prop="depAirport" label-width="150px">
                <el-input v-model="form.depAirport" placeholder="出发机场码 多个用英文的/分开 999表示全国" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="目的地" prop="arrAirport" label-width="150px">
                <el-input v-model="form.arrAirport" placeholder="抵达机场码 多个用英文的/分开 999表示全国" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="是否可以支付" prop="parameter2">
                <el-select
                  v-model="form.parameter2"
                  placeholder="请选择下拉选择"
                  clearable
                  size="small"
                  style="width: 240px"
                >
                  <el-option
                    v-for="dict in payOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="否可以生成PNR" prop="parameter3">
                <el-select
                  v-model="form.parameter3"
                  placeholder="请选择下拉选择"
                  clearable
                  size="small"
                  style="width: 240px"
                >
                  <el-option
                    v-for="dict in pnrOptions"
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
              <el-form-item label="是否PAT校验" prop="parameter4">
                <el-select
                  v-model="form.parameter4"
                  placeholder="请选择下拉选择"
                  clearable
                  size="small"
                  style="width: 240px"
                >
                  <el-option
                    v-for="dict in patOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="儿童是否适用" prop="parameter5">
                <el-select
                  v-model="form.parameter5"
                  placeholder="请选择下拉选择"
                  clearable
                  size="small"
                  style="width: 240px"
                >
                  <el-option
                    v-for="dict in childFalyOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>


        <!--OTA发布价格-->
        <div v-show ="this.queryParams.ruleType =='OTA-4' ">

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
              <el-form-item label="发布价格选择" prop="parameter1">
                <el-select
                  v-model="form.parameter1"
                  placeholder="请选择下拉选择"
                  clearable
                  size="small"
                  style="width: 240px"
                >
                  <el-option
                    v-for="dict in priceOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>





        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
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

<script >
  import { listOtaRule, getOtaRule, delOtaRule, addOtaRule, updateOtaRule, changeOtaRuleStatus } from "@/api/manual/policy/otaRule";
  export default {
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
        otaRuleList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        //规则数据字典
        ruleOptions: [],
        // 状态数据字典
        statusOptions: [],
        sourceTypeOptions: [],
        channelOptions: [],
        policyTypeOptions: [],
        payOptions: [],
        pnrOptions: [],
        patOptions: [],
        childFalyOptions: [],
        priceOptions: []
        // 查询参数
        queryParams: {
          current: 1,
          size: 10,
          ruleType: undefined,
          status: undefined
        },
        // 表单参数
        form: {},
        rules: {
          ruleType: [
            { required: true, message: "规则类型不能为空", trigger: "blur" }
          ]
        }
      };
    },
    created() {
      this.getList();
      this.getDicts("OTA_RULE_TYPE").then(response => {
        this.ruleOptions = response.data;
      });
      this.getDicts("sys_normal_disable").then(response => {
        this.statusOptions = response.data;
      });

      this.getDicts("CTRIP_POLICY").then(response => {
        this.policyTypeOptions = response.data;
      });
      this.getDicts("SOURCE_TYPE").then(response => {
        this.sourceTypeOptions = response.data;
      });
      this.getDicts("CHANNEL").then(response => {
        this.channelOptions = response.data;
      });
      this.getDicts("sys_yes_no").then(response => {
        this.payOptions = response.data;
        this.pnrOptions = response.data;
        this.patOptions = response.data;
        this.childFalyOptions = response.data;
      });
      this.getDicts("RELEASE_PRICE_TYPE").then(response => {
        this.priceOptions = response.data;
      });

    },
    methods: {
      getList() {
        this.loading = true;
        listOtaRule(this.addDateRange(this.queryParams)).then(
          responseData => {
            const response = responseData.data;
            this.otaRuleList = response.records;
            this.total = response.total;
            this.loading = false;
          }
        );
      },
      // 状态修改
      handleStatusChange(row) {
        let text = row.status === "0" ? "启用" : "停用";
        this.$confirm('确认要"' + text + '""' + row.otaCode + '"编码吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeOtaRuleStatus(row.id, row.status);
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
          ruleType: undefined,
          airline: undefined,
          depAirport: undefined,
          arrAirport: undefined,
          cabin: undefined,
          sourceType: undefined,
          channel: undefined,
          parameter1: undefined,
          parameter2: undefined,
          parameter3: undefined,
          parameter4: undefined,
          parameter5: undefined,
          parameter6: undefined,
          parameter7: undefined,
          parameter8: undefined,
          status: "0",
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
        this.title = "添加规则";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids;
        getOtaRule(id).then(response => {
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
            this.form.otaCode = (otaStr.split("_")[0]).toUpperCase( );
            this.form.otaSiteCode = (otaStr.split("_")[1]).toUpperCase( );
            if (this.form.id != undefined) {
              updateOtaRule(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                }
              });
            } else {
              addOtaRule(this.form).then(response => {
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
          return delOtaRule(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
      }
 },

    set_cell_style({row, column, rowIndex, columnIndex}) {
      // console.log(row, "row")
      if (column.label === 'CT001') {
        return column.label = '携程一部';
      }
      if (column.label === 'CT002') {
        return column.label = '携程二部';
      }
    }


    };

</script>

