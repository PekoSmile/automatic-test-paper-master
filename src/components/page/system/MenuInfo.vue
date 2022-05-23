<template>
    <div>
        <div class="el-row">
            <el-row :gutter="20">

                <el-col :span="6">
                        <el-input v-model="menuName" style="margin-right: 20px;"
                                  placeholder="请输入菜单名称">
                        </el-input>
                </el-col>
                <el-col :span="2">
                    <div class="grid-content bg-purple">
                        <el-button type="primary" class="glocal_button"
                                   @click="queryPage">查询
                        </el-button>
                    </div>
                </el-col>
                <el-col :span="2">
                    <div class="grid-content bg-purple">
                        <el-button type="primary" class="glocal_button"
                                   @click="addMenuShow=true">新增
                        </el-button>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div>
            <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column
                        prop="menuId"
                        label="菜单ID"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="menuName"
                        label="菜单名称"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="menuIcon"
                        label="菜单图标"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="menuIndex"
                        label="菜单链接">
                </el-table-column>
                <el-table-column
                        prop="menuDegree"
                        label="菜单层级">
                </el-table-column>
                <el-table-column
                        prop="parentId"
                        label="父菜单ID">
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        label="创建时间">
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

        <!--菜单新增-->
        <el-dialog
                title="菜单新增"
                :visible.sync="addMenuShow"
                width="30%"
                :before-close="handleClose">
            <span>
                <el-form ref="form" :model="form">
                    <el-form-item label="菜单名称" label-width="100px">
                        <el-input v-model="form.menuName" style="width: 180px"></el-input>
                    </el-form-item>
                   <el-form-item label="菜单图标" label-width="100px">
                        <el-input v-model="form.menuIcon" style="width: 180px"></el-input>
                   </el-form-item>
                    <el-form-item label="菜单链接" label-width="100px">
                        <el-input v-model="form.menuIndex" style="width: 180px"></el-input>
                    </el-form-item>
                    <el-form-item label="菜单层级" label-width="100px">
                        <el-input v-model="form.menuDegree" style="width: 180px"></el-input>
                    </el-form-item>
                    <el-form-item label="父菜单ID" label-width="100px">
                        <el-input v-model="form.parentId" style="width: 180px"></el-input>
                    </el-form-item>
                </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addMenuShow = false">取 消</el-button>
                <el-button type="primary" @click="insertMenuInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "MenuInfo",
        data() {
            return {
                addMenuShow:false,
                tableData: [],
                currentNum: 1,
                pageSize: 10,
                startDate: '',
                total: 0,
                endDate: '',
                tableDataShow: false,
                menuName:'',
                form:{
                    menuName:'',
                    menuIcon:'',
                    menuIndex:'',
                    menuDegree:'',
                    parentId:'',
                }
            }
        },
        methods:{
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {
                    });
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
                this.queryPage();
            },
            changePageSize(pageSize) {
                //设置每页展示数量
                this.pageSize = pageSize;
                this.queryPage();
            },
            queryPage(){
                let params = {
                    currentNum: this.currentNum,
                    pageSize: this.pageSize,
                    menuName: this.menuName,
                };
                this.axios
                    .post('/qte/menu/queryPage.htm', params)
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
            insertMenuInfo(){
                let params = {
                    menuName: this.form.menuName,
                    menuIcon: this.form.menuIcon,
                    menuIndex:this.form.menuIndex,
                    menuDegree:this.form.menuDegree,
                    parentId: this.form.parentId,
                };
                this.axios
                    .post('/qte/menu/insertMenuInfo.htm', params)
                    .then(
                        function (response) {
                            if (response.data.code == "0000"){
                                this.$message.success("新增成功");
                                this.addMenuShow = false;
                            }else {
                                this.$message.error("新增失败");
                            }
                        }.bind(this)
                    )
                    .catch(function (error) {
                        console.log(error);
                    });

            },



        },
        created(){
            this.queryPage()
        }
    }
</script>

<style scoped>


    .grid-content {
        border-radius: 10px;
        min-height: 50px;
    }

</style>
