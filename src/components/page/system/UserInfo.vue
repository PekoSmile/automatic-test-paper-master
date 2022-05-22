<template>
    <div>
        <div>
            <Row>
                <div  class="el-row" style="margin-right: 50%">
                    <el-input v-model="search" style="width: 50%;"
                              placeholder="请输入ID或姓名或班级搜索">
                    </el-input>
                  <el-button type="primary" class="glocal_button"
                             @click="queryUserInfoByBaseQuery">查询
                  </el-button>
                  <el-button type="primary" class="glocal_button"
                             @click="addUserView=true">导入用户
                  </el-button>
                  <el-dialog  title="批量导入用户"
                              :visible.sync="addUserView"
                              width="30%">

                      <el-button style="margin-left:25%"size="mini" type="warning" @click="frontDownload">下载模板</el-button>
                      <el-button style="margin-left:10%" size="mini" type="success" @click="submitUpload">上传文件</el-button>

                    <el-upload
                        ref="upload"
                        action="/zj/login/importUser.htm"
                        :limit="1"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :file-list="fileList"
                        :auto-upload="false"
                        :before-upload="beforeUpload"
                        :http-request="GoUpload"
                    >
                      <div>
                        <el-button slot="trigger"size="mini" type="primary">选取文件</el-button>
                        <div slot="tip" class="el-upload__tip">
                          只能上传excel文件，且不超过5MB
                        </div>
                        <div slot="tip" class="el-upload-list__item-name">{{file.fileName}}</div>
                      </div>
                    </el-upload>

                  </el-dialog>
                </div>
                <div>

                </div>
            </Row>
        </div>
        <div>
            <el-table
                    :data="tableData"
                    height="550"
                    border
                    style="width: 100%">
                <el-table-column
                        type="index"
                        width="50">
                </el-table-column>
                <el-table-column
                        prop="userId"
                        label="人员id"
                >
                </el-table-column>
                <el-table-column
                        prop="userName"
                        label="人员姓名"
                >
                </el-table-column>

                <el-table-column
                        prop="className"
                        label="班级"
                >
                </el-table-column>
                <el-table-column
                        prop="typeId"
                        label="所属角色"
                >
                    <template slot-scope="scope">{{ scope.row.typeId === 0 ? '学生' :'管理员'}}</template>
                </el-table-column>
                <el-table-column
                        prop="password"
                        label="用户密码"
                >
                </el-table-column>
                <el-table-column
                        prop="isDelete"
                        label="是否删除"
                >
                    <template slot-scope="scope">{{ scope.row.isDelete === 0 ? '否' : '是' }}</template>
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        label="创建时间"
                >
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作"
                        width="150">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row);queryClassList()" type="text">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <Page :total="total"
                  show-total
                  show-sizer
                  :page-size-opts="[10, 20, 30, 40, 10000]"
                  v-show="tableDataShow"
                  @on-change="changePage"
                  @on-page-size-change="changePageSize"
                  style="text-align: center;"
            />
        </div>
        <el-dialog title="用户修改" :visible.sync="dialogFormVisible" center width="30%" :destroy-on-close="true">
            <el-form :model="form" ref="form">
                <el-form-item label="登录姓名：" label-width="100px" >
                    <el-input v-model="form.userName" :label-width="formLabelWidth" placeholder="姓名"
                              style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="登录账号：" label-width="100px" >
                    <el-input v-model="form.userId" :label-width="formLabelWidth" :disabled="true" placeholder="学号或工号"
                              style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="登录密码：" label-width="100px">
                    <el-input type="password" v-model="form.password" :label-width="formLabelWidth"
                              placeholder="密码"
                              style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="班级：" label-width="100px">
                  <el-select v-model="form.classId"
                             :label-width="formLabelWidth"
                             style="width: 200px">

                    <el-option  v-for="item in classData"
                                :key="item.classId"
                                :value="item.classId"
                                :label="item.className"
                    ></el-option>

                  </el-select>
                </el-form-item>
<!--                <el-form-item label="角色：" label-width="100px">
                    <el-select v-model="form.typeId" placeholder="请选择角色"
                               :label-width="formLabelWidth"
                               style="width: 200px">
                        <el-option label="学生" :value='0'></el-option>
                    </el-select>
                </el-form-item>-->
              <el-form-item label="是否删除：" label-width="100px">
                <el-select v-model="form.isDelete" placeholder="是否删除" :label-width="formLabelWidth"
                           style="width: 200px">
                  <el-option label="否" :value= 0></el-option>
                  <el-option label="是" :value= 1></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm('form')">取 消</el-button>
                <el-button type="primary" @click="updateForm(form)">修 改</el-button>
            </div>
        </el-dialog>
    </div>


</template>

<script>
    import axios from 'axios'

    export default {
      inject: ['reload'],
        data() {
            return {
              addUserView:false,
              file: {},
              fileList: [],
                formLabelWidth: '100px',
                dialogFormVisible: false,
                search: '',
                tableData: [],
                classData:[],
                currentNum: 1,
                pageSize: 10,
                startDate: '',
                total: 0,
                endDate: '',
                tableDataShow: false,
                form: {
                    userName: '',
                    userId: '',
                    password: '',
                    isDelete: '',
                    typeId: '',
                    classId:'',
                },


            }
        },
        methods: {

          handleRemove(file, fileList) {
            console.log(file, fileList);
          },
          handlePreview(file) {
            console.log(file);
          },
          frontDownload() {
            let a = document.createElement("a"); //创建一个<a></a>标签
            a.href = "./user.xlsx"; // 给a标签的href属性值加上地址，
            a.download = "用户模板.xlsx"; //设置下载文件文件名，这里加上.xlsx指定文件类型，pdf文件就指定.pdf即可
            a.style.display = "none"; // 障眼法藏起来a标签
            document.body.appendChild(a); // 将a标签追加到文档对象中
            a.click(); // 模拟点击了a标签，会触发a标签的href的读取，浏览器就会自动下载了
            a.remove(); // 一次性的，用完就删除a标签
          },

          beforeUpload(file) {
            console.log(file, "文件");
            const extension = file.name.split(".")[1] === "xls";
            const extension2 = file.name.split(".")[1] === "xlsx";
            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!extension && !extension2) {
              this.$message.warning("上传模板只能是 xls、xlsx格式!");
              return false;
            }
            if (!isLt5M) {
              this.$message.warning("上传模板大小不能超过 5MB!");
              return false;
            }
            this.file = file;
          },

          submitUpload() {
            this.$refs.upload.submit();
          },
          GoUpload(content){
            let fdata  = new FormData();
            fdata.append('file',content.file)
            let config = {
              headers: {
                'Content-Type': 'multipart/form-data'
              },
              transformRequest: [function (data) {
                return data
              }]
            }
            axios.post(content.action,fdata,config).then(
                response => {
                  if (response.data.code == "0000") {
                    this.$message({message: "导入成功", type: 'success'});
                    this.reload();
                  } else {
                    this.$message({message: "导入失败", type: 'error'});
                  }
                });
          },


            updateForm(form) {
                console.log(form)
                let params = {
                    userId: form.userId,
                    password: form.password,
                    classId: form.classId,
                    typeId: form.typeId,
                    userName: form.userName,
                    isDelete: form.isDelete,
                }
                axios.post('/zj/login/updateUserInfo.htm', params)
                    .then(response => {
                        if (response.data.code == "0000") {

                          this.$message({message: "修改成功", type: 'success'});
                          this.dialogFormVisible = false;
                          this.reload();
                        } else {
                            this.$message({message: "修改出错", type: 'error'});
                          this.reload();
                        }
                    });
            },
            handleClick(row) {
                console.log(row);
                this.form = row;
                this.dialogFormVisible = true;
            },
            //清除当前表单里面数据
            resetForm() {
                this.dialogFormVisible = false;
            },


            setBeginTime(date) {
                //设置时间
                this.stratDate = date;
            },
            setEndTime(date) {
                //设置时间
                this.endDate = date;
            },
            changePage(page) {
                //设置页码
                this.currentNum = page;
                this.queryUserInfoByBaseQuery();
            },
            changePageSize(pageSize) {
                //设置每页展示数量
                this.pageSize = pageSize;
                this.queryUserInfoByBaseQuery();
            },

            queryUserInfoByBaseQuery() {
                let params = {
                    currentNum: this.currentNum,
                    pageSize: this.pageSize,
                    keyWords: this.search,
                };
                this.axios
                    .post('/zj/login/queryUserInfo.htm', params)
                    .then(
                        function (response) {
                            this.tableData = response.data.result.list;
                            this.total = response.data.result.count;
                            this.tableDataShow = true;
                        }.bind(this)
                    )
                    .catch(function (error) {
                        console.log(error);
                    });

            },
            queryClassList(){
                  this.axios
                      .post('/zj/class/queryList.htm')
                      .then(
                          function (response){
                            this.classData = response.data.result;
                          }.bind(this)
                      )
                       .catch(function (error){
                         console.log(error);
                    });
            },


        },
        created() {
            this.queryUserInfoByBaseQuery();
            this.queryClassList();
        }
    }
</script>

<style scoped>
    .row_line {
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 20px;
    }

    .is-finish {
        padding: 0 !important;
    }

    .is-process {
        padding: 0 !important;
    }

    .is-wait {
        padding: 0 !important;
    }

    .ivu-modal-body {
        padding: 0;
    }

    .glocal_button {
        margin-left: 10px;
    }

    .item {
        margin-top: 10px;
        margin-right: 40px;
    }

    .cell_options {
        width: 15%;
        float: left;
    }

    .cell_options_label {
        width: 30%;
    }
</style>
