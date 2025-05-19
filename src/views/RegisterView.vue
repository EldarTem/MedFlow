<!-- src/views/RegisterView.vue -->
<template>
  <div class="auth-container">
    <div class="auth-bg">
      <el-card class="auth-card" shadow="hover">
        <div class="auth-header">
          <img src="../assets/Logo_myTurn.png" alt="Logo" class="auth-logo" />
          <h2>Регистрация</h2>
        </div>

        <el-form
          :model="registerForm"
          :rules="rules"
          ref="registerFormRef"
          @submit.prevent="handleRegister"
          class="auth-form"
        >
          <!-- Фамилия, Имя, Отчество -->
          <el-form-item label="Фамилия" prop="surname">
            <el-input
              v-model="registerForm.surname"
              placeholder="Иванов"
              clearable
            />
          </el-form-item>
          <el-form-item label="Имя" prop="name">
            <el-input
              v-model="registerForm.name"
              placeholder="Иван"
              clearable
            />
          </el-form-item>
          <el-form-item label="Отчество" prop="patronymic">
            <el-input
              v-model="registerForm.patronymic"
              placeholder="Иванович"
              clearable
            />
          </el-form-item>

          <!-- Дата рождения и город -->
          <el-form-item label="Дата рождения" prop="dateOfBirth">
            <el-date-picker
              v-model="registerForm.dateOfBirth"
              type="date"
              placeholder="Выберите дату"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="Город" prop="city">
            <el-input
              v-model="registerForm.city"
              placeholder="Москва"
              clearable
            />
          </el-form-item>

          <!-- Телефон и почта -->
          <el-form-item label="Телефон" prop="phone">
            <el-input
              v-model="registerForm.phone"
              placeholder="+7 (___) ___-__-__"
              prefix-icon="Phone"
              clearable
              @input="onPhoneInput"
            />
          </el-form-item>
          <el-form-item label="Email" prop="email">
            <el-input
              v-model="registerForm.email"
              placeholder="ivanov@example.com"
              prefix-icon="UserFilled"
              clearable
            />
          </el-form-item>

          <!-- Пароль -->
          <el-form-item label="Пароль" prop="password">
            <el-input
              :type="passwordVisible ? 'text' : 'password'"
              v-model="registerForm.password"
              placeholder="Придумайте пароль"
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

          <!-- Вид документа -->
          <el-form-item label="Вид документа" prop="documentType">
            <el-select
              v-model="registerForm.documentType"
              placeholder="Выберите тип"
            >
              <el-option label="Паспорт РФ" value="passport_ru" />
              <el-option label="Загранпаспорт" value="passport_int" />
              <el-option
                label="Водительское удостоверение"
                value="driver_license"
              />
            </el-select>
          </el-form-item>

          <!-- Серия и номер паспорта в одной строке -->
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="Серия" prop="passportSeries">
                <el-input
                  v-model="registerForm.passportSeries"
                  placeholder="____"
                  maxlength="4"
                  clearable
                  @input="onSeriesInput"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Номер" prop="passportNumber">
                <el-input
                  ref="passportNumber"
                  v-model="registerForm.passportNumber"
                  placeholder="______"
                  maxlength="6"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- Согласие на обработку персональных данных -->
          <el-form-item prop="consent">
            <el-checkbox v-model="registerForm.consent">
              Я даю согласие на обработку персональных данных
            </el-checkbox>
          </el-form-item>

          <!-- Кнопка отправки -->
          <el-form-item>
            <el-button
              type="primary"
              native-type="submit"
              size="large"
              class="auth-button"
              :loading="loading"
            >
              Зарегистрироваться
            </el-button>
          </el-form-item>
        </el-form>

        <p class="auth-footer">
          Уже есть аккаунт?
          <router-link to="/login" class="auth-footer-link">Войти</router-link>
        </p>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, nextTick } from "vue";
import { useAuthStore } from "@/store/useAuthStore";
import { UserFilled, Lock, View, Hide, Phone } from "@element-plus/icons-vue";
import { ElRow, ElCol, ElLoading, FormInstance, FormRules } from "element-plus";

export default defineComponent({
  name: "RegisterView",
  components: {
    UserFilled,
    Lock,
    Phone,
    ElRow,
    ElCol,
  },
  setup() {
    const authStore = useAuthStore();
    const registerFormRef = ref<FormInstance>();
    const registerForm = reactive({
      surname: "",
      name: "",
      patronymic: "",
      dateOfBirth: "",
      city: "",
      phone: "",
      email: "",
      password: "",
      documentType: "",
      passportSeries: "",
      passportNumber: "",
      consent: false,
    });
    const passwordVisible = ref(false);
    const loading = ref(false);

    const rules: FormRules = {
      surname: [
        { required: true, message: "Введите фамилию", trigger: "blur" },
      ],
      name: [{ required: true, message: "Введите имя", trigger: "blur" }],
      patronymic: [
        { required: true, message: "Введите отчество", trigger: "blur" },
      ],
      dateOfBirth: [
        {
          required: true,
          message: "Выберите дату рождения",
          trigger: "change",
        },
      ],
      city: [{ required: true, message: "Укажите город", trigger: "blur" }],
      phone: [{ required: true, message: "Введите телефон", trigger: "blur" }],
      email: [
        { required: true, message: "Введите email", trigger: "blur" },
        {
          type: "email",
          message: "Неверный формат email",
          trigger: ["blur", "change"],
        },
      ],
      password: [
        { required: true, message: "Введите пароль", trigger: "blur" },
      ],
      documentType: [
        {
          required: true,
          message: "Выберите тип документа",
          trigger: "change",
        },
      ],
      passportSeries: [
        {
          required: true,
          message: "Введите серию паспорта",
          trigger: "blur",
        },
        {
          pattern: /^\d{4}$/,
          message: "Серия должна быть из 4 цифр",
          trigger: "blur",
        },
      ],
      passportNumber: [
        {
          required: true,
          message: "Введите номер паспорта",
          trigger: "blur",
        },
        {
          pattern: /^\d{6}$/,
          message: "Номер должен быть из 6 цифр",
          trigger: "blur",
        },
      ],
      consent: [
        {
          validator: (_: any, value: boolean, cb: any) => {
            value ? cb() : cb(new Error("Необходимо согласие"));
          },
          trigger: "change",
        },
      ],
    };

    const togglePassword = () => {
      passwordVisible.value = !passwordVisible.value;
    };

    const onPhoneInput = () => {
      registerForm.phone = formatPhone(registerForm.phone);
    };

    const formatPhone = (value: string): string => {
      let digits = value.replace(/\D/g, "");
      if (!digits.startsWith("7")) digits = "7" + digits;
      let fmt = "+7";
      if (digits.length > 1) fmt += " (" + digits.slice(1, 4);
      if (digits.length >= 5) fmt += ") " + digits.slice(4, 7);
      if (digits.length >= 8) fmt += "-" + digits.slice(7, 9);
      if (digits.length >= 10) fmt += "-" + digits.slice(9, 11);
      return fmt;
    };

    const onSeriesInput = async () => {
      if (registerForm.passportSeries.replace(/\D/g, "").length === 4) {
        await nextTick();
        (registerFormRef.value?.$refs.passportNumber as HTMLElement)?.focus();
      }
    };

    const handleRegister = () => {
      registerFormRef.value?.validate(async (valid) => {
        if (!valid) return;
        loading.value = true;
        const loader = ElLoading.service({
          text: "Загрузка...",
          background: "rgba(0,0,0,0.3)",
        });
        // вызываем store.register в соответствии с объявленной сигнатурой
        await authStore.register(
          registerForm.name,
          registerForm.email,
          registerForm.password,
          registerForm.phone
        );
        loading.value = false;
        loader.close();
      });
    };

    // Чтобы TS увидел иконки в шаблоне
    return {
      registerForm,
      registerFormRef,
      rules,
      handleRegister,
      passwordVisible,
      togglePassword,
      onPhoneInput,
      onSeriesInput,
      formatPhone,
      loading,
      Hide,
      View,
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
  width: 420px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.auth-header {
  margin-bottom: 20px;
}

.auth-logo {
  width: 220px;
  height: 70px;
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
  color: rgb(121, 187, 255);
}
</style>
