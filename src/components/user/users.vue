<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card>
            <!-- 搜索 -->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type='primary' @click="dialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 表格数据 -->
            <el-table :data="userList">
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="role_name" label="角色"></el-table-column>
                <el-table-column label="状态">
                    <template v-slot="scope">
                        <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="280">
                    <template v-slot="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(scope.row.id)">
                        </el-button>
                        <el-button type="danger" icon="el-icon-delete" @click="configMessageBox(scope.row.id)">
                        </el-button>
                        <el-tooltip class="item" effect="dark" content="设置编辑" placement="top">
                            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="block">
                <span class="demonstration"></span>
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 4, 8]" :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </el-card>
        <!-- 添加用户 -->
        <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="addDialogClose">
            <el-form :model="addRuleForm" :rules="addRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addRuleForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addRuleForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addRuleForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addRuleForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改用户 -->
        <el-dialog title="提示" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
            <el-form :model="editForm" :rules="editRules" ref="editRef" label-width="100px">
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserSub">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            var checkEmail = (rule, value, callback) => {
                const regEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
                if (regEmail.test(value)) {
                    return callback()
                };
                callback(new Error('请输入正确的邮箱'));
            };
            var checkPhone = (rule, value, callback) => {
                const regPhone = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
                if (regPhone.test(value)) {
                    return callback()
                };
                callback(new Error('请输入正确的手机'));
            }
            return {
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 2,
                },
                userList: [],
                total: 0,
                dialogVisible: false,
                addRuleForm: {
                    username: '',
                    password: '',
                    email: '',
                    mobile: ''
                },
                addRules: {
                    username: [
                        { required: true, message: '请输入名字', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: '请输入邮箱', trigger: 'blur' },
                        { validator: checkEmail, trigger: 'blur' }

                    ],
                    mobile: [
                        { required: true, message: '请输入手机名称', trigger: 'blur' },
                        { validator: checkPhone, trigger: 'blur' }
                    ],
                },
                editDialogVisible: false,
                editForm: {},
                editRules: {
                    email: [
                        { required: true, message: '请输入邮箱', trigger: 'blur' },
                        { validator: checkEmail, trigger: 'blur' }

                    ],
                    mobile: [
                        { required: true, message: '请输入手机名称', trigger: 'blur' },
                        { validator: checkPhone, trigger: 'blur' }
                    ],
                }
            }
        },
        created() {
            this.getUserList()
        },
        methods: {
            // 用户列表请求
            async getUserList() {
                const { data: res } = await this.$http.get("users", { params: this.queryInfo });
                if (res.meta.status !== 200) return this.$message.error('失败');
                this.userList = res.data.users;
                this.total = res.data.total
            },
            // 监听每页行数
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize
                this.getUserList()
            },
            // 监听目前页码
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage
                this.getUserList()
            },
            // 监听操作按钮
            async userStateChange(info) {
                console.log(info.mg_state)
                const { data: res } = await this.$http.put(`users/${info.id}/state/${info.mg_state}`);
                console.log(res)
                if (res.meta.status !== 200) {
                    info.mg_state = !info.mg_state
                    return this.$message.error('更新错误')
                };
                this.$message.success('更新成功')
            },
            // 添加用户关闭重置
            addDialogClose() {
                this.$refs.addFormRef.resetFields()
            },
            // 点击添加按钮，添加用户
            addUser() {
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) return;
                    const { data: res } = await this.$http.post('users', this.addRuleForm)
                    if (res.meta.status !== 201) {
                        return this.$message.error('添加用户失败')
                    };
                    this.$message.success('添加用户成功');
                    this.dialogVisible = false
                    this.getUserList()
                })
            },
            // 修改用户信息
            async editUser(id) {
                console.log(id)
                const { data: res } = await this.$http.get('users/' + id)
                // console.log(res)
                if (res.meta.status !== 200) {
                    return this.$message.error('修改失败')
                }
                this.editForm = res.data
                this.editDialogVisible = true

            },
            editDialogClose() {
                this.$refs.editRef.resetFields()
            },
            editUserSub() {
                this.$refs.editRef.validate(async valid => {
                    if (!valid) return
                    const { data: res } = await this.$http.put('users/' + this.editForm.id, { email: this.editForm.email, mobile: this.editForm.mobile })
                    if (res.meta.status !== 200) {
                        return this.$message.error('修改提交失败')
                    }
                    this.editDialogVisible = false
                    this.getUserList()
                    this.$message.success('修改提交成功')
                })
            },
            // 删除弹窗
            configMessageBox(id) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const { data: res } = await this.$http.delete('users/' + id)
                    if (res.meta.status !== 200) {
                        return this.$message.error('删除失败')
                    }
                    this.$message.success('确认删除成功')
                    this.getUserList()
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            }
        },

    }
</script>

<style lang="less" scoped>

</style>