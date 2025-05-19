<!-- src/views/LoginView.vue -->
<template>
  <div class="auth-container">
    <div class="auth-bg">
      <el-card class="auth-card" shadow="hover">
        <div class="auth-header">
          <img src="../assets/vue.svg" alt="Logo" class="auth-logo" />
          <h2>Вход в систему</h2>
        </div>
        <el-form
          :model="loginForm"
          @submit.prevent="handleLogin"
          class="auth-form"
        >
          <el-form-item>
            <el-input
              v-model="loginForm.email"
              autocomplete="off"
              prefix-icon="UserFilled"
              placeholder="Введите ваш email"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-input
              :type="passwordVisible ? 'text' : 'password'"
              v-model="loginForm.password"
              placeholder="Введите ваш пароль"
              prefix-icon="Lock"
              clearable
            >
              <template #suffix>
                <el-icon style="cursor: pointer" @click="togglePassword">
                  <component :is="passwordVisible ? Hide : View" />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              native-type="submit"
              size="large"
              class="auth-button"
              >Войти</el-button
            >
          </el-form-item>
        </el-form>
        <p class="auth-footer">
          Нет аккаунта?
          <router-link to="/register" class="auth-footer-link"
            >Зарегистрироваться</router-link
          >
        </p>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { useAuthStore } from "@/store/useAuthStore";
import { UserFilled, Lock, View, Hide } from "@element-plus/icons-vue";

export default defineComponent({
  name: "LoginView",
  components: {
    UserFilled,
    Lock,
    View,
    Hide,
  },
  setup() {
    const authStore = useAuthStore();
    const loginForm = reactive({
      email: "",
      password: "",
    });
    const passwordVisible = ref(false);

    const togglePassword = () => {
      passwordVisible.value = !passwordVisible.value;
    };

    const handleLogin = async () => {
      await authStore.login(loginForm.email, loginForm.password);
    };

    return {
      loginForm,
      handleLogin,
      passwordVisible,
      togglePassword,
      View,
      Hide,
    };
  },
});
</script>

<style scoped>
.auth-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-bg {
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom right, #f0f4f7, #d9e2ec);
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-card {
  width: 400px;
  text-align: center;
  padding: 20px;
  border-radius: 10px;
}

.auth-header {
  margin-bottom: 20px;
}

.auth-logo {
  width: 80px;
  height: 80px;
  margin-bottom: 10px;
}

.auth-header h2 {
  margin-bottom: 0;
}

.auth-form {
  text-align: left;
}

.auth-button {
  width: 100%;
}

.auth-footer {
  margin-top: 10px;
  font-size: 14px;
}
.auth-footer-link {
  text-decoration: none;
  color: #409eff;
}
.auth-footer-link:hover {
  text-decoration: none;
  color: rgb(121.3, 187.1, 255);
}
</style>
