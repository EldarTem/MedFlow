<!-- src/views/AllAdminView.vue -->
<template>
  <div class="page">
    <div class="title">Список администраторов</div>
    <div class="subtitle">Полный список администраторов:</div>

    <BilletCard
      v-for="admin in admins"
      :key="admin.id"
      :name="admin.name"
      :icon="adminIcon"
      @click="openModal(admin)"
    />

    <EmployeeModal
      v-model="showModal"
      :employee="selected"
      :cities="cities"
      :show-right-column="true"
      @save="handleSave"
    />

    <Loader :loading="uiStore.isLoading" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/store/useAuthStore";
import { useUiStore } from "@/store/useUiStore";
import EmployeeModal from "@/components/Modals/EmployeeModal.vue";
import BilletCard from "@/components/Cards/BilletCard.vue";
import Loader from "@/components/Loader.vue";
import adminIcon from "@/assets/icons/people_icon.svg";
import { Employee } from "@/types";

const authStore = useAuthStore();
const uiStore = useUiStore();

const showModal = ref(false);
const currentId = ref<number | null>(null);
const selected = ref<Partial<Employee>>({});

const cities = ["Симферополь", "Москва", "Севастополь"];
const admins = computed(() => authStore.clients);

onMounted(() => {
  authStore.fetchAllUsers(1, 10, "local_admin");
});

async function openModal(admin: { id: number }) {
  currentId.value = admin.id;
  try {
    const data = await authStore.fetchUserById(admin.id);
    selected.value = {
      name: data.name,
      email: data.email,
      phone: data.phone,
    };
    showModal.value = true;
  } catch {}
}

async function handleSave(updated: Partial<Employee>) {
  if (currentId.value == null) return;
  try {
    await authStore.updateUserById(currentId.value, updated);
    showModal.value = false;
  } catch {}
}
</script>
