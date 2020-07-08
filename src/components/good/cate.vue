<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-button type="primary" @click="showAddCateDialogVisible">添加分类</el-button>
            <!-- 数据表格渲染 -->
            <tree-table class="treeTable" :data="cateList" :columns="columns" show-index index-text="#" stripe
                :selection-type="false" :expand-type="false" border>
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: aqua;"></i>
                    <i class="el-icon-error" v-else style="color: brown;"></i>
                </template>
                <template slot="order" slot-scope="scope">
                    <el-tag v-if="scope.row.cat_level==0">一级</el-tag>
                    <el-tag type="success" v-else-if="scope.row.cat_level==1">二级</el-tag>
                    <el-tag type="warning" v-else>三级</el-tag>
                </template>
                <template slot="edit" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                </template>
            </tree-table>
            <!-- 分页 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加分类弹框 -->
        <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="resetAddCateDialog">
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <el-cascader v-model="selectKey" :options="parentsCateList" :props="parentsCateProp"
                        @change="handleChange" clearable></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="configCate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                queryInfo: {
                    type: 3,
                    pagenum: 1,
                    pagesize: 5,
                },
                // 分类列表数据
                cateList: [],
                total: 0,
                columns: [{
                    label: '分类名称',
                    prop: 'cat_name',
                },
                {
                    label: '是否有效',
                    type: 'template',
                    template: 'isok',
                },
                {
                    label: '排序',
                    type: 'template',
                    template: 'order',
                },
                {
                    label: '操作',
                    type: 'template',
                    template: 'edit',
                }
                ],
                addCateDialogVisible: false,
                addCateForm: {
                    cat_pid: 0,
                    cat_name: '',
                    cat_level: 1,
                },
                addCateFormRules: {
                    cat_name: [
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                },
                parentsCateList: [],
                parentsCateProp: {
                    value: 'cat_id',
                    label: 'cat_name',
                    expandTrigger: 'hover'
                },
                selectKey: []

            }
        },
        created() {
            this.getCateList()
        },
        methods: {
            // 获取商品分类列表
            async getCateList() {
                const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
                if (res.meta.status !== 200) {
                    return this.$message.error('获取列表失败')
                }
                // this.$message.success('获取列表成功')
                this.cateList = res.data.result
                this.total = res.data.total
            },
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize
                this.getCateList()
            },
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage
                this.getCateList()
            },
            showAddCateDialogVisible() {
                this.getParentsCateList()
                this.addCateDialogVisible = true
            },
            async getParentsCateList() {
                const { data: res } = await this.$http.get('categories', { type: 2 })
                if (res.meta.status !== 200) {
                    return this.$message.error('获取父级列表失败')
                }
                this.parentsCateList = res.data
            },
            handleChange() {
                if (this.selectKey.length > 0) {
                    this.addCateForm.cat_pid = this.selectKey[this.selectKey.length - 1]
                    this.addCateForm.cat_level = this.selectKey.length
                    return
                } else {
                    this.addCateForm.cat_pid = 0
                    this.addCateForm.cat_level = 0
                }
            },
            configCate() {
                // console.log(this.addCateForm)
                this.$refs.addCateFormRef.validate(async valid =>{
                    if(!valid) return
                    const {data:res} = await this.$http.post('categories',this.addCateForm)
                    console.log(res)
                    if(res.meta.status !== 201) {
                        return this.$message.error('添加提交错误')
                    }
                    this.$message.success('添加提交成功')
                    this.getCateList()
                    this.addCateDialogVisible = false
                })
            },
            resetAddCateDialog() {
                this.$refs.addCateFormRef.resetFields()
                this.selectKey = []
                this.addCateForm.cat_pid = 0
                this.addCateForm.cat_level = 0
            }
        }

    }
</script>


<style lang="less" scoped>
    .treeTable {
        margin-top: 10px;
    }

    .el-cascader {
        width: 100%;
    }
</style>