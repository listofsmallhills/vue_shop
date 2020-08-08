<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 行 -->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="5">
                    <el-input v-model="queryInfo.query" placeholder="请输入内容" clearable @clear="resetSearch">
                        <el-button slot="append" icon="el-icon-search" @click="searchGood"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="3">
                    <el-button type="primary" @click="addGood">添加商品</el-button>
                </el-col>
            </el-row>
            <!-- 商品数据 -->
            <el-table :data="goodsList" stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="goods_name" label="商品名称" width="700"></el-table-column>
                <el-table-column prop="goods_price" label="商品价格(元)"></el-table-column>
                <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
                <el-table-column prop="add_time" label="创建时间">
                    <template slot-scope="scope">{{scope.row.add_time|dateFormat}}</template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" @click='editGoods(scope.row.goods_id)'>
                        </el-button>
                        <el-button type="danger" icon="el-icon-delete" @click='deleteGood(scope.row.goods_id)'>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[8, 16, 30]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>


        </el-card>
        <el-dialog title="编辑商品" :visible.sync="editGoodsDialogVisible" @close="closeDialog">
            <el-form :model="goodForm" :rules="goodFormRules" ref="goodFormRef">
                <el-form-item label="商品名称" prop="goods_name">
                    <el-input v-model="goodForm.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="goods_price">
                    <el-input v-model="goodForm.goods_price" type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品数量" prop="goods_number">
                    <el-input v-model="goodForm.goods_number" type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品重量" prop="goods_weight">
                    <el-input v-model="goodForm.goods_weight" type="number"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editGoodsDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editGoodsDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 8,
                },
                goodsList: [],
                total: 10,
                editGoodsDialogVisible: false,
                goodForm: {
                    goods_name: '',
                    goods_price: 0,
                    goods_number: 0,
                    goods_weight: 0
                },
                goodFormRules: {
                    goods_name: [
                        { required: true, message: '请输入sahngpin名称', trigger: 'blur' },
                    ],
                    goods_price: [
                        { required: true, message: '请输入sahngpin名称', trigger: 'blur' },
                    ],
                    goods_number: [
                        { required: true, message: '请输入sahngpin名称', trigger: 'blur' },
                    ],
                    goods_weight: [
                        { required: true, message: '请输入sahngpin名称', trigger: 'blur' },
                    ],
                }

            }
        },
        created() {
            this.getGoodsList()
        },

        methods: {
            async getGoodsList() {
                const { data: res } = await this.$http.get('/goods', { params: this.queryInfo })
                if (res.meta.status !== 200) {
                    return this.$message.error('商品列表更新失败')
                };
                this.$message.success('商品列表更新成功');
                this.goodsList = res.data.goods
                this.total = res.data.total
            },
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize;
                this.getGoodsList()
            },
            handleCurrentChange(newNum) {
                this.queryInfo.pagenum = newNum;
                this.getGoodsList()
            },
            async editGoods(id) {
                const { data: res } = await this.$http.get('goods/' + id)
                this.goodForm.goods_name = res.data.goods_name
                this.goodForm.goods_price = res.data.goods_price
                this.goodForm.goods_number = res.data.goods_number
                this.goodForm.goods_weight = res.data.goods_weight
                this.editGoodsDialogVisible = true
            },
            closeDialog() {
                console.log(this.goodForm.goods_name)
                this.$refs.goodFormRef.resetFields()
                console.log(this.goodForm.goods_name)
            },
            async deleteGood(id) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const { data: res } = await this.$http.delete('goods/' + id)
                    if (res.meta.status !== 200) {
                        return this.$message.error('删除失败')
                    }
                    this.$message.success('确认删除成功')
                    this.getGoodsList()
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            addGood() {
                this.$router.push('goods/add')
            },
            searchGood() {
                this.getGoodsList()
            },
            resetSearch() {
                this.getGoodsList()
            }

        }
    }
</script>
<style lang="less" scoped>

</style>