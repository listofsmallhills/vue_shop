<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-alert title="消息提示的文案" type="info" center show-icon></el-alert>
            <el-steps :active="activeName - 1" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>

            <el-form :model="addGoodForm" :rules="addGoodFormRules" ref="addGoodFormRef" label-width="100px"
                label-position="top">
                <el-tabs v-model="activeName" tab-position="left" :before-leave="tabToggle">
                    <el-tab-pane label="基本信息" name="1">
                        <el-form-item label="商品名称" prop="goods_gname">
                            <el-input v-model="addGoodForm.goods_gname"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addGoodForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addGoodForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addGoodForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader v-model="addGoodForm.goods_cat" :options="cateOptions" :props="cateProps"
                                @change="handleChange"></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="2">配置管理</el-tab-pane>
                    <el-tab-pane label="商品属性" name="3">角色管理</el-tab-pane>
                    <el-tab-pane label="商品图片" name="4">角色管理</el-tab-pane>
                    <el-tab-pane label="商品内容" name="5">角色管理</el-tab-pane>
                </el-tabs>
            </el-form>

        </el-card>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                activeName: '1',
                addGoodForm: {
                    goods_name: '',
                    goods_price: 0,
                    goods_number: 0,
                    goods_weight: 0,
                    goods_cat: ''
                },
                addGoodFormRules: {
                    goods_gname: [
                        { required: true, message: '请输入商品名称', trigger: 'blur' },
                    ],
                    goods_price: [
                        { required: true, message: '请输入价格', trigger: 'blur' },
                    ],
                    goods_number: [
                        { required: true, message: '请输入商品数量', trigger: 'blur' },
                    ],
                    goods_weight: [
                        { required: true, message: '请输入重量', trigger: 'blur' },
                    ],
                    goods_cat: [
                        { required: true, message: '请输入重量', trigger: 'blur' },
                    ]
                },
                cateOptions: [],
                cateProps: {
                    expandTrigger: 'hover',
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                },
            }
        },
        created() {
            this.getCateOptions()
        },
        methods: {
            async getCateOptions() {
                const { data: res } = await this.$http.get('categories')
                console.log(res)
                this.cateOptions = res.data
            },
            handleChange() {
                if (this.addGoodForm.goods_cat.length !== 3) {
                    this.addGoodForm.goods_cat = []
                }
            },
            tabToggle(activeName, oldActiveName) {
                console.log(activeName)
                if (oldActiveName === '1' & this.addGoodForm.goods_cat.length !== 3) {
                    this.$message.error('请先选择商品分类')
                    return false
                }

            }
        },
    }
</script>

<style lang="less" scoped>
    .el-steps {
        margin-top: 20px;
    }

    .el-tabs {
        margin-top: 20px;
    }
</style>