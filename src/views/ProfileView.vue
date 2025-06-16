<template>
  <div class="page profile-page">
    <div class="profile-panel">
      <div class="profile-header">
        <div class="title">Информация о Вас:</div>
        <div class="profile-actions">
          <el-button
            v-if="!editMode"
            class="btn-logout"
            plain
            type="danger"
            @click="handleLogout"
          >
            Выйти
          </el-button>
          <el-button
            v-if="!editMode"
            class="btn-edit"
            type="default"
            @click="enableEdit"
          >
            Редактировать
          </el-button>
          <el-button
            v-if="editMode"
            class="btn-cancel"
            plain
            @click="cancelEdit"
          >
            Отменить
          </el-button>
          <el-button
            v-if="editMode"
            class="btn-save"
            type="primary"
            :loading="auth.isLoading"
            @click="saveProfile"
          >
            Сохранить
          </el-button>
        </div>
      </div>
      <el-form
        ref="profileForm"
        :model="form"
        label-position="top"
        class="profile-form"
        :disabled="!editMode"
        @submit.prevent
      >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Имя">
              <el-input v-model="form.name" autocomplete="off" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Телефон">
              <el-input v-model="form.phone" autocomplete="off" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Электронная почта">
              <el-input v-model="form.email" autocomplete="off" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import { useAuthStore } from "@/store/useAuthStore";
import { ElMessageBox, ElMessage } from "element-plus";
import type { User } from "@/types";
import { useRouter } from "vue-router";

interface ProfileForm {
  name: string;
  phone: string;
  email: string;
}
const keys = ["name", "phone", "email"] as const;

const auth = useAuthStore();
const editMode = ref(false);
const router = useRouter();
const form = reactive<ProfileForm>({
  name: "",
  phone: "",
  email: "",
});
const initialForm = ref<ProfileForm>({ ...form });

onMounted(async () => {
  await auth.getUserProfile();
  fillFormFromUser();
  initialForm.value = { ...form };
});

watch(
  () => auth.user,
  () => {
    fillFormFromUser();
    initialForm.value = { ...form };
  }
);

function fillFormFromUser() {
  const user = auth.user as User | null;
  form.name = user?.name || "";
  form.phone = user?.phone || "";
  form.email = user?.email || "";
}
function enableEdit() {
  editMode.value = true;
}
function cancelEdit() {
  for (const key of keys) {
    form[key] = initialForm.value[key];
  }
  editMode.value = false;
}

async function saveProfile() {
  const payload: Partial<ProfileForm> = {};
  for (const key of keys) {
    if (form[key] !== initialForm.value[key]) {
      payload[key] = form[key];
    }
  }
  if (!form.name || !form.email) {
    ElMessage.error("Имя и почта обязательны");
    return;
  }
  try {
    const ok = await auth.updateUserProfile(payload);
    if (ok) {
      ElMessage.success("Профиль успешно обновлён");
      editMode.value = false;
      initialForm.value = { ...form };
    }
  } catch (e: any) {
    // Универсальная обработка ошибок
    const msg =
      e?.response?.data?.message || e?.message || "Не удалось обновить профиль";
    ElMessage.error(msg);
  }
}

function handleLogout() {
  ElMessageBox.confirm("Вы действительно хотите выйти?", "Выход", {
    confirmButtonText: "Да",
    cancelButtonText: "Отмена",
    type: "warning",
  })
    .then(() => {
      auth.logout();
      ElMessage.success("Вы вышли из аккаунта");
      router.push("/login");
    })
    .catch(() => {});
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #f2f2f2;
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.profile-panel {
  width: 98vw;
  max-width: 1200px;
  background: #fff;
  border-radius: 12px;
  padding: 32px 32px 24px 32px;
  margin: 0 auto;
  box-shadow: 0 6px 24px 0 rgba(0, 0, 0, 0.07);
}
.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}
.profile-header h1 {
  font-size: 38px;
  font-weight: 900;
  margin-bottom: 24px;
}
.profile-actions {
  display: flex;
  gap: 12px;
}
.btn-logout {
  color: #bb5b5b;
  border-color: #bb5b5b;
  background: #fff;
  font-weight: 500;
  border-radius: 8px;
}
.btn-edit {
  background: #a1a1a1;
  color: #ffff;
  font-weight: 500;
  border: none;
  border-radius: 8px;
}
.btn-cancel {
  color: #ff5227;
  border-color: #ff5227;
  background: #fff;
  font-weight: 500;
  border-radius: 8px;
}
.btn-save {
  background: #ff5227;
  color: #fff;
  font-weight: 500;
  border: none;
  border-radius: 8px;
}
.profile-form {
  margin-top: 0;
}
</style>
