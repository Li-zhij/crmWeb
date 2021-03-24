<template>
  <div class="user-box">
    <el-row>
      <el-col :span="24">
        <div class="tool-box">
          <el-button type="primary" icon="el-icon-circle-plus-outline" size="small" @click="handleAdd">新增</el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" @click="mulDelete">批量删除</el-button>
        </div>
      </el-col>
    </el-row>
    <el-table
      :data="users"
      @selection-change="selectChange"
      style="width: 100%">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        sortable
        prop="id"
        label="ID"
        width="280">
      </el-table-column>
      <el-table-column
        prop="loginAct"
        label="账号"
        width="80">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="80">
      </el-table-column>
      <el-table-column
        prop="loginPwd"
        label="密码"
        width="80">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="expireTime"
        label="到期时间"
        width="200">
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="scope">
          {{ scope.row.lockStatus == "1" ? '启用' : '禁用' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            plain
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :page-sizes="[10, 20, 30, 50]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400">
    </el-pagination>
    <el-dialog :title="dialogTitle" width="600px" :visible.sync="userFormVisible" @close="resetForm('userForm')">
      <el-form :model="user" :rules="rules" ref="userForm">
        <el-form-item label="账号" prop="loginAct" label-width="50px">
          <el-input v-model="user.loginAct" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name" label-width="50px">
          <el-input v-model="user.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="50px">
          <el-input v-model="user.loginPwd" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="50px">
          <el-input v-model="user.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="到期时间" label-width="78px">
          <el-date-picker
            v-model="user.expireTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" label-width="50px">
          <el-switch v-model="user.lockStatus" active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="'1'"
            :inactive-value="'0'"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUser('userForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { 
  getUsers,
  addUser,
  updateUser,
  deleteUser
} from '@/api/user'
export default {
  data () {
    return {
      users: [],
      user: {
        id: '',
        loginAct: '',
        name: '',
        loginPwd: '',
        email: '',
        expireTime: '',
        lockStatus: '',
        deptno: '',
        allowIps: '',
        createTime: '',
        createBy: '',
        editTime: '',
        editBy: ''
      },
      userBackup: Object.assign({}, this.user),
      multipleSelection: [],
      userFormVisible: false,
      dialogTitle: '',
      rowIndex: 9999,
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.getUsers()
  },
  methods: {
    getUsers () {
      this.loading = true
      // this.$http('/api/users').then((res) => {
      getUsers().then((res) => {
        if (res.data.success) {
          this.users = res.data.data
        } else {
          this.$message({
            type: 'error',
            message: res.data.message
          })
        }
      }).catch((err) => {
        console.error(err)
      })
    },
    handleEdit (index, row) {
      this.dialogTitle = '编辑'
      this.user = Object.assign({}, row)
      this.userFormVisible = true
      this.rowIndex = index
    },
    submitUser (formName) {
      // 表单验证
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let id = this.user.id
          if (id) {
            // id非空-修改
            updateUser(this.user).then(res => {
              if (res.data.success) {
                this.getUsers()
                this.$message({
                  type: 'success',
                  message: '修改成功！'
                })
              }
            }).catch(err => {
              console.error(err)
            })
            this.users.splice(this.rowIndex, 1, this.user)
          } else {
            // id为空-新增
            addUser(this.user).then(res => {
              if (res.data.success) {
                this.getUsers()
                this.$message({
                  type: 'success',
                  message: '新增成功！'
                })
              }
            }).catch(err => {
              console.error(err)
            })
            // this.user.id = this.users.length + 1
            // this.users.unshift(this.user)
          }
          this.userFormVisible = false
        }
      })
    },
    handleDelete (index, row) {
      this.$confirm(`确定删除用户 【${row.name}】 吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.users.splice(index, 1)
        deleteUser(row.id).then(res => {
          if (res.data.success) {
            this.getUsers()
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
          }
        }).catch(err => {
          console.error(err)
        })
      }).catch(() => {
        console.log('取消删除')
      })
    },
    resetForm (formName) {
      this.$refs[formName].clearValidate()
    },
    mulDelete () {
      let len = this.multipleSelection.length
      if (len === 0) {
        this.$message({
          type: 'warning',
          message: '请至少选择一项！'
        })
      } else {
        this.$confirm(`确定删除选中的 ${len} 个用户吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: `成功删除了${len}条数据！`
          })
        }).catch(() => {
          console.log('取消删除')
        })
      }
    },
    selectChange (val) {
      this.multipleSelection = val
    },
    handleAdd () {
      this.dialogTitle = '新增'
      this.user = Object.assign({}, this.userBackup)
      this.userFormVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
  .user-box {
    width: 100%;
    .tool-box {
      padding: 10px 10px;
      border-bottom: 1px solid #eee;
    }
    .el-pagination {
      margin-top: 20px;
    }
  }
</style>
