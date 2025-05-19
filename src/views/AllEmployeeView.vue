<template>
  <div class="page">
    <div class="title">Список сотрудников</div>
    <div class="subtitle">Полный список сотрудников:</div>

    <BilletCard
      v-for="trainer in trainers"
      :key="trainer.id"
      :name="trainer.name"
      :icon="adminIcon"
      @click="openModal(trainer)"
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
const trainers = computed(() => authStore.clients);

onMounted(() => {
  // Заменили роль 'local_admin' на 'employee'
  authStore.fetchAllUsers(1, 10, "employee");
});

async function openModal(trainer: { id: number }) {
  currentId.value = trainer.id;
  try {
    const data = await authStore.fetchUserById(trainer.id);
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
