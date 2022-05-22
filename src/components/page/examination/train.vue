<template>
  <div>
    <el-form>
      <el-card class="card-box" v-for="item of titleData" :key="item.id" v-show="examShow">
        <!-- 单选 1    填空2    判断3 -->
        <div>
          <div class="item-title">
            <div class="title">
              {{ item.titleName }}——{{ item.titleFraction }}分</div>
            <div class="item-box" v-if="item.titleStatus  === 0">
                <el-checkbox  :label="item.choice1"></el-checkbox>
                <el-checkbox  :label="item.choice2"></el-checkbox>
                <el-checkbox  :label="item.choice3"></el-checkbox>
                <el-checkbox  :label="item.choice4"></el-checkbox>
              <el-collapse v-model="activeNames" @change="handleChange" >
              <el-collapse-item title="答案：" >
                <el-tabs >
                  <el-tab-pane :label="item.titleAnswer" ></el-tab-pane>
                </el-tabs>
              </el-collapse-item>
              </el-collapse>
            </div>
            <div class="content-box1" v-if="item.titleStatus === 2">
              <el-input type="textarea" :rows="6" placeholder="请输入内容"></el-input>
              <el-collapse v-model="activeNames" @change="handleChange" >
                <el-collapse-item title="答案：" >
                  <el-tabs >
                    <el-tab-pane :label="item.titleAnswer" ></el-tab-pane>
                  </el-tabs>
                </el-collapse-item>
              </el-collapse>
            </div>

            <div class="item-box" v-if="item.titleStatus  === 1">
              <el-checkbox-group v-model="item.titleAnswer">
                <el-input type="textarea" :rows="6" placeholder="请输入内容"></el-input>
                <el-collapse v-model="activeNames" @change="handleChange" >
                  <el-collapse-item title="答案：" >
                    <el-tabs >
                      <el-tab-pane :label="item.titleAnswer" ></el-tab-pane>
                    </el-tabs>
                  </el-collapse-item>
                </el-collapse>
              </el-checkbox-group>
            </div>
          </div>
        </div>
      </el-card>
      <Page :total="total"
            show-total
            show-sizer
            :page-size-opts="[10, 20, 30, 40, 10000]"
            v-show="tableDataShow"
            @on-change="changePage"
            @on-page-size-change="changePageSize"
            style="text-align: center;"
      />
    </el-form>

  </div>

</template>

<script>
export default {

  inject: ['reload'],
  data() {
   return{
     activeNames: ['1'],
     examShow:true,
     titleName:'',
     subjectName:'',
     titleType:'',
     titleFraction:'',
     keywords:'',
     title:{},
     titleId:'',
     titleData: [],
     total: 0,
     tableDataShow: true,
     currentNum: 1,
     pageSize: 10,

   }
  },


  methods:{
    handleChange(val) {
      console.log(val);
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
    queryPage() {
      let params = {
        titleName:this.titleName,
        subjectName:this.subjectName,
        titleType:this.titleType,
        titleFraction:this.titleFraction,
        currentNum: this.currentNum,
        pageSize: this.pageSize,
      };
      this.axios
          .post('/zj/title/queryTitlePage.htm', params)
          .then(
              function (response) {
                this.titleData = response.data.result.list;
                this.total = response.data.result.count;
                this.tableDataShow = true;
              }.bind(this)

          )
          .catch(function (error) {
            console.log(error);
          });
    },
  },
  created()
  {
    this.queryPage()
  },
}
</script>

<style scoped="scss">
.card-box {
 margin: 10px;
}
.title {
  margin: 10px 0;
}

.content-box1 {
  margin-bottom: 30px;
}
</style>