<!-- src/components/UserProfileInfo.vue -->
<template>
  <el-card class="profile-card">
    <h2>Личная информация</h2>
    <el-row :gutter="20">
      <el-col :span="8"><strong>Имя:</strong></el-col>
      <el-col :span="16">{{ user?.name }}</el-col>

      <el-col :span="8"><strong>Email:</strong></el-col>
      <el-col :span="16">{{ user?.email }}</el-col>

      <el-col :span="8"><strong>Телефон:</strong></el-col>
      <el-col :span="16">{{ user?.phone }}</el-col>

      <el-col :span="8"><strong>Роль:</strong></el-col>
      <el-col :span="16">{{ user?.role }}</el-col>
    </el-row>

    <el-button
      type="primary"
      @click="$emit('edit-profile')"
      class="edit-button"
    >
      Редактировать профиль
    </el-button>
    <el-button type="danger" @click="$emit('logout')" class="logout-button"
      >Выйти</el-button
    >
  </el-card>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useAuthStore } from "@/store/useAuthStore";

export default defineComponent({
  name: "UserProfileInfo",
  setup() {
    const authStore = useAuthStore();
    const user = computed(() => authStore.user);

    return {
      user,
    };
  },
});
</script>

<style scoped>
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
