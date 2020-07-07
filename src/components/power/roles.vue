<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <!-- 按钮 -->
            <el-button type="primary">添加角色</el-button>
            <!-- 表格 -->
            <el-table :data="rolesList" border stripe>
                <el-table-column type="expand">
                    <template v-slot='scope'>
                        <!-- 一级 -->
                        <el-row :gutter="20" v-for='(item1,it1) in scope.row.children' :key='item1.id'>
                            <el-col :span="5">
                                <el-tag closable @close="removeTag(scope.row,item1.id)">{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 二级 -->
                            <el-col :span="19">
                                <el-row :gutter="20" v-for='(item2,it2) in item1.children' :key='item2.id'>
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeTag(scope.row,item2.id)">
                                            {{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for='(item3,it3) in item2.children' :key='item3.id'
                                            closable @close="removeTag(scope.row,item3.id)">
                                            {{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
                <el-table-column prop="level" label="操作">
                    <template v-slot='scope'>
                        <el-button type="primary" icon="el-icon-edit" size="small">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="small">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" size="small"
                            @click="showRoleDialog(scope.row)">分配角色
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 分配角色弹窗 -->
        <el-dialog title="提示" :visible.sync="setRoleDialogVisible" width="50%" @close="clearRightsList">
            <!-- 树 -->
            <el-tree :data="allRoleList" :props="treeProps" show-checkbox node-key="id" default-expand-all
                :default-checked-keys="defaultId" ref="treeRef"></el-tree>
            <span slot="footer">
                <el-button @click="setRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="configEditRight">确 定</el-button>
            </span>
        </el-dialog>


    </div>
</template>

<script>
    export default {
        data() {
            return {
                rolesList: [],
                setRoleDialogVisible: false,
                allRoleList: [],
                // 数
                treeProps: {
                    children: 'children',
                    label: 'authName'
                },
                // 默认勾选id
                defaultId: [],
                roleId: ''
            }
        },
        created() {
            this.getRolesList()
        },
        methods: {
            async getRolesList() {
                const { data: res } = await this.$http.get('roles')
                if (res.meta.status !== 200) return
                this.rolesList = res.data
            },
            async removeTag(role, rightId) {
                const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
                console.log(res)
                if (res.meta.status !== 200) return
                role.children = res.data
            },
            // 设置弹出框
            async showRoleDialog(role) {
                this.roleId = role.id
                const { data: res } = await this.$http.get('rights/tree')
                if (res.meta.status !== 200) return
                this.allRoleList = res.data
                this.getChildList(role, this.defaultId)
                this.setRoleDialogVisible = true
            },
            // 三级节点id
            getChildList(node, arr) {
                if (!node.children) {
                    return arr.push(node.id)
                }
                node.children.forEach(item => {
                    this.getChildList(item, arr)
                })
            },
            // 弹框关闭清空
            clearRightsList() {
                this.defaultId = []
            },
            // 权限提交后台
            async configEditRight() {
                const allKey = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
                const substr = allKey.join(',')
                const { data:res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: substr })
                if(res.meta.status !== 200){
                    return this.$message.error('提交权限失败')
                };
                this.$message.success('提交权限成功')
                this.getRolesList() 
                this.setRoleDialogVisible = false
            }
        }

    }
</script>

<style lang="less" scoped>
    .el-tag {
        margin: 5px;
    }
</style>