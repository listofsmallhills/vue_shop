<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 输入框 -->
            <el-form ref="loginRef" :model='loginForm' :rules=" loginrules" label-width="0" class="login_text">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input v-model='loginForm.username' prefix-icon="iconfont icon-wode"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input v-model='loginForm.password' prefix-icon="iconfont icon-mima" type='password'></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click='login'>登录</el-button>
                    <el-button type="info" @click='loginReset'>重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                // 表单输入内容
                loginForm: {
                    username: 'admin',
                    password: '123456',
                },
                loginrules: {
                    // 用户名规则验证
                    username: [
                        { required: true, message: '请输入名字', trigger: 'blur' },
                        { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
                    ],
                    // 密码规则验证
                    password: [
                        { required: true, message: '请输入mima', trigger: 'blur' },
                        { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
                    ]
                }
            }

        },
        methods: {
            // 重置
            loginReset() {
                this.$refs.loginRef.resetFields()
            },
            // 登陆验证
            login() {
                this.$refs.loginRef.validate(async valid => {
                    console.log(valid)
                    if (!valid) return;
                    const { data: rep } = await this.$http.post('login', this.loginForm);
                    console.log(rep)
                    if (rep.meta.status !== 200) return this.$message.error('错了哦，这是一条错误消息');
                    this.$message.success('登录成功');
                    window.sessionStorage.setItem('token', rep.data.token);
                    this.$router.push('/home')
                })
            }
        },
    }


</script>

<style lang="less" scoped>
    .login_container {
        position: relative;
        height: 100%;
        background-color: #2b4b6b;

    }

    .login_box {
        position: absolute;
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }

    .avatar_box {
        position: absolute;
        width: 130px;
        height: 130px;
        background-color: #fff;
        border: 1px solid #eee;
        border-radius: 50%;
        box-shadow: 0 0 9px #ddd;
        padding: 10px;
        left: 50%;
        transform: translate(-50%, -50%);

        img {
            width: 100%;
            height: 100%;
            background-color: #eee;
            border-radius: 50%;

        }
    }

    .btns {
        display: flex;
        justify-content: flex-end;
    }

    .login_text {
        box-sizing: border-box;
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
    }
</style>