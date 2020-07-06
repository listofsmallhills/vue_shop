<template>

    <el-container class="home-container">
        <!-- 头部 -->
        <el-header>
            <div>
                <img src="../assets/home.jpg" alt="">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click='quit'>退出</el-button>
        </el-header>
        <!-- 页面主体 -->
        <el-container>
            <!-- 侧边栏-->
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <!-- 折叠按钮 -->
                <div class="toggle-button" @click='toggleCollapse'>|||</div>
                <el-menu background-color="#333744" text-color="#fff" active-text-color="#ffd04b" unique-opened
                    :collapse="isCollapse" :collapse-transition='false' router :default-active='$route.path'>
                    <!-- 一级菜单 -->
                    <el-submenu :index="item.id + ''" :key='item.id' v-for='item in meunList'>
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span>{{item.authName}}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index="'/' + subitem.path" :key='subitem.id' v-for='subitem in item.children'>
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{subitem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>


                </el-menu>
            </el-aside>
            <!-- 右边主体 -->
            <el-main><router-view></router-view></el-main>
        </el-container>
    </el-container>



</template>

<script>
    export default {
        data() {
            return {
                meunList: [],
                isCollapse: false
            }
        },
        created() {
            this.getMeunList()
        },
        methods: {
            quit() {
                window.sessionStorage.clear();
                this.$router.push('/login')
            },
            async getMeunList() {
                const { data: res } = await this.$http.get('/menus');
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
                this.meunList = res.data
            },
            toggleCollapse() {
                this.isCollapse = !this.isCollapse
            }
        }
    }

</script>

<style lang="less" scoped>
    .home-container {
        height: 100%;
    }

    .el-header {
        display: flex;
        justify-content: space-between;
        background-color: #373d41;
        padding-left: 0;
        align-items: center;
        color: #d9ebf5;
        font-size: 20px;

        div {
            display: flex;
            align-items: center;

            img {
                width: 100px;
                height: 100%;
            }

            span {
                margin-left: 15px;
            }
        }
    }

    .el-aside {
        background-color: #333744;

        .el-menu {
            border-right: 0;
        }
    }

    .el-main {
        background-color: #eaedf1;
    }

    .toggle-button {
        display: flex;
        background-color: beige;
        font-size: 20px;
        justify-content: center;
        cursor: pointer;

    }
</style>