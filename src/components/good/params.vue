<template>
    <div>
        <h2>参数分类</h2>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-alert title="注意:只允许为第三级分类设置" type="warning" :closable="false" show-icon></el-alert>
            <el-row class="cateRow">
                <el-col>
                    <span>选择商品分类:</span>
                    <el-cascader v-model="selectKey"" :options=" catelist" :props="cateProps" @change="selCateChange">
                    </el-cascader>
                </el-col>
            </el-row>
            <!-- tab切换 -->
            <el-tabs v-model="tabActiveName" @tab-click="tabParamsClick">
                <el-tab-pane label="动态属性" name="many">
                    <el-button type="primary" :disabled="isDisabled" @click="showAddParamsDialogVisible">添加参数
                    </el-button>
                    <el-table :data="activeParams">
                        <el-table-column type="expand">
                            <!-- 下拉标签 -->
                            <template slot-scope="scope">
                                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable>{{item}}</el-tag>
                                </el-tag>
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    New Tag
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit"
                                    @click="showEditParamsDialogVisible(scope.row.attr_id)">编辑
                                </el-button>
                                <el-button type="danger" icon="el-icon-delete" @click="deleteConfig(scope.row.attr_id)">
                                    删除</el-button>
                            </template>

                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" :disabled="isDisabled" @click="showAddParamsDialogVisible">添加参数
                    </el-button>
                    <el-table :data="unactiveParams">
                        <el-table-column type="expand"></el-table-column>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit"
                                    @click="showEditParamsDialogVisible(scope.row.attr_id)">编辑
                                </el-button>
                                <el-button type="danger" icon="el-icon-delete" @click="deleteConfig(scope.row.attr_id)">
                                    删除</el-button>
                            </template>

                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!-- 添加参数对话框 -->
        <el-dialog :title="paramsName + '参数'" :visible.sync="addParamsDialogVisible" width="50%"
            @close="addParamsDialogClose">
            <el-form :model="addParamsForm" :rules="addParamsFormRules" ref="addParamsFormRef">
                <el-form-item :label="paramsName" prop="attr_name">
                    <el-input v-model="addParamsForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addParamsDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="configAddParams">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑参数对话框 -->
        <el-dialog :title="paramsName + '参数'" :visible.sync="editParamsDialogVisible" width="50%"
            @close="editParamsDialogClose">
            <el-form :model="editParamsForm" :rules="editParamsFormRules" ref="editParamsFormRef">
                <el-form-item :label="paramsName" prop="attr_name">
                    <el-input v-model="editParamsForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editParamsDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="configEditParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                catelist: [],
                // 选择器配置
                cateProps: {
                    expandTrigger: 'hover',
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                },
                // 选中id
                selectKey: [],
                // 选中的tab栏
                tabActiveName: 'many',
                // 动态参数
                activeParams: [],
                // 静态参数
                unactiveParams: [],
                // 控制添加分类参数对话框
                addParamsDialogVisible: false,
                // 添加参数表单
                addParamsForm: {
                    attr_name: '',
                    attr_sel: '',
                    attr_vals: ''
                },
                // 表单验证
                addParamsFormRules: {
                    attr_name: [
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                },
                // 编辑弹框
                editParamsDialogVisible: false,
                editParamsForm: {
                    attr_name: '',
                },
                editParamsFormRules: {
                    attr_name: [
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                },
                // 下拉标签

            }
        },
        created() {
            this.getCatelist()
        },
        methods: {
            // 获取分类列表
            async getCatelist() {
                const { data: res } = await this.$http.get('categories')
                if (res.meta.status !== 200) {
                    return this.$message.error('获取列表失败')
                }
                this.$message.success('获取列表成功')
                this.catelist = res.data
            },
            // 选择器改变事件
            selCateChange() {
                console.log(this.selectKey)
                this.getCateParams()
            },
            // tab切换改变事件
            tabParamsClick() {
                console.log(this.tabActiveName)
                this.getCateParams()
            },
            // 调用tab分类参数
            async getCateParams() {
                // if (this.selectKey.length !== 3) return
                const { data: res } = await this.$http.get(`categories/${this.selectKey[2]}/attributes`, { params: { sel: this.tabActiveName } })
                if (res.meta.status !== 200) {
                    return this.$message.error('获取分类参数失败')
                }
                this.$message.success('获取分类参数成功')
                // 字符串转成数组
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
                    item.inputVisible = false,
                        item.inputValue = ''
                })
                if (this.tabActiveName == 'many') {
                    return this.activeParams = res.data
                } else {
                    return this.unactiveParams = res.data
                }
            },
            // 点击按钮显示添加分类对话框
            showAddParamsDialogVisible() {
                this.addParamsDialogVisible = true
            },
            // 弹窗关闭重置
            addParamsDialogClose() {
                this.$refs.addParamsFormRef.resetFields()
            },
            // 提交确认请求接口
            configAddParams() {
                this.$refs.addParamsFormRef.validate(async valid => {
                    if (!valid) return
                    const { data: res } = await this.$http.post(`categories/${this.selectKey[2]}/attributes`, {
                        attr_name: this.addParamsForm.attr_name,
                        attr_sel: this.tabActiveName,
                    })
                    if (res.meta.status !== 201) {
                        return this.$message.error('添加参数失败')
                    }
                    this.$message.success('添加参数成功')
                    this.addParamsDialogVisible = false
                    this.getCateParams()
                })
            },
            // 编辑弹框显示
            async showEditParamsDialogVisible(attr_id) {
                const { data: res } = await this.$http.get(`categories/${this.selectKey[2]}/attributes/${attr_id}`, {
                    params: {
                        attr_sel: this.tabActiveName
                    }
                })
                if (res.meta.status !== 200) {
                    return this.$message.error('编辑参数失败')
                }
                this.$message.success('编辑参数成功')
                this.editParamsForm = res.data
                this.editParamsDialogVisible = true
            },
            editParamsDialogClose() {
                this.$refs.editParamsFormRef.resetFields()
            },
            configEditParams() {
                this.$refs.editParamsFormRef.validate(async valid => {
                    if (!valid) return
                    const { data: res } = await this.$http.put(`categories/${this.selectKey[2]}/attributes/${this.editParamsForm.attr_id}`, {
                        attr_name: this.editParamsForm.attr_name,
                        attr_sel: this.tabActiveName
                    })
                    if (res.meta.status !== 200) {
                        return this.$message.error('queren参数失败')
                    }
                    this.$message.success('queren参数成功')
                    this.editParamsDialogVisible = false
                    this.getCateParams()
                })
            },
            async deleteConfig(attr_id) {
                const confirmResult = await this.$confirm(
                    '此操作将永久删除该参数, 是否继续?',
                    '提示',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).catch(err => err)
                // 用户取消了删除的操作
                if (confirmResult !== 'confirm') {
                    return this.$message.info('已取消删除！')
                }
                // 删除的业务逻辑
                const { data: res } = await this.$http.delete(
                    `categories/${this.selectKey[2]}/attributes/${attr_id}`
                )
                if (res.meta.status !== 200) {
                    return this.$message.error('删除参数失败！')
                }
                this.$message.success('删除参数成功！')
                this.getCateParams()
            },
            // 下拉标签
            handleInputConfirm(row) {
                let inputValue = row.inputValue;
                if (inputValue) {
                    row.attr_vals.push(inputValue);
                }
                row.inputVisible = false;
                row.inputValue = '';
            },
            showInput(row) {
                row.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
        },
        computed: {
            // 按钮禁用
            isDisabled() {
                if (this.selectKey.length == 3) {
                    return false
                }
                return true
            },
            // 添加参数
            paramsName() {
                if (this.tabActiveName == 'many') {
                    return '添加动态'
                } else {
                    return '添加静态'
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .cateRow {
        margin-top: 15px;
    }

    .el-cascader {
        margin-left: 10px;
    }

    .el-tag {
        margin: 10px;
    }

    .input-new-tag {
        width: auto;
    }
</style>