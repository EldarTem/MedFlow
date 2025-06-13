<template>
  <div class="page">
    <div class="profile-container" v-if="user">
      <h2>Личная информация</h2>
      <el-row :gutter="20">
        <el-col :span="8"><strong>Имя:</strong></el-col>
        <el-col :span="16">{{ user.name }}</el-col>

        <el-col :span="8"><strong>Email:</strong></el-col>
        <el-col :span="16">{{ user.email }}</el-col>

        <el-col :span="8"><strong>Телефон:</strong></el-col>
        <el-col :span="16">{{ user.phone }}</el-col>

        <el-col :span="8"><strong>Роль:</strong></el-col>
        <el-col :span="16">{{ user.role }}</el-col>
      </el-row>

      <el-button
        type="primary"
        @click="openProfileEditModal"
        class="edit-button"
      >
        Редактировать профиль
      </el-button>
      <el-button type="danger" @click="logout" class="logout-button">
        Выйти
      </el-button>

      <el-dialog
        v-model="profileEditDialogVisible"
        title="Редактировать профиль"
      >
        <EditProfileForm v-model="profileEditForm" />
        <template #footer>
          <el-button @click="closeModal">Отмена</el-button>
          <el-button type="primary" @click="submitProfileEdit">
            Сохранить
          </el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/store/useAuthStore";
import EditProfileForm from "@/components/EditProfileForm.vue";
import { isValidEmail } from "@/utils/validation";
import { ElNotification } from "element-plus";
import type { User } from "@/types";

type ProfileEditForm = Partial<User>;

export default defineComponent({
  name: "ProfileView",
  components: { EditProfileForm },
  setup() {
    const authStore = useAuthStore();
    const user = computed(() => authStore.user!);

    const profileEditDialogVisible = ref(false);
    const profileEditForm = ref<ProfileEditForm>({});

    // при загрузке страницы сразу подгружаем профиль
    onMounted(() => {
      authStore.getUserProfile();
    });

    function openProfileEditModal() {
      profileEditForm.value = {
        name: user.value.name,
        email: user.value.email,
        phone: user.value.phone,
      };
      profileEditDialogVisible.value = true;
    }

    function closeModal() {
      profileEditDialogVisible.value = false;
    }

    async function submitProfileEdit() {
      const email = profileEditForm.value.email || "";
      if (!isValidEmail(email)) {
        ElNotification.error("Некорректный email");
        return;
      }
      try {
        await authStore.updateUserProfile(profileEditForm.value);
        ElNotification.success("Профиль успешно обновлен");
        closeModal();
      } catch (e: any) {
        ElNotification.error(
          e?.response?.data?.message || "Не удалось обновить профиль"
        );
      }
    }

    async function logout() {
      await authStore.logout();
    }

    return {
      user,
      profileEditDialogVisible,
      profileEditForm,
      openProfileEditModal,
      closeModal,
      submitProfileEdit,
      logout,
    };
  },
});
</script>

<style scoped>
.profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.profile-card {
  width: 800px;
  margin-bottom: 20px;
}
.edit-button {
  margin-top: 20px;
}
.logout-button {
  margin-top: 20px;
  background-color: #ff4d4f;
  color: white;
}
</style>
