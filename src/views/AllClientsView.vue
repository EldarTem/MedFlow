<!-- src/views/AllClientsView.vue -->
<template>
  <div class="page">
    <div class="title">Список клиентов</div>
    <div class="subtitle">Полный список клиентов:</div>

    <BilletCard
      v-for="user in clients"
      :key="user.id"
      :name="user.name"
      :icon="peopleIcon"
      @click="openModal(user)"
    />

    <EmployeeModal
      v-model="showModal"
      :employee="selected"
      :cities="cities"
      :show-right-column="false"
      @save="handleSave"
    />

    <Loader :loading="uiStore.isLoading" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/store/useAuthStore";
import { useUiStore } from "@/store/useUiStore";
import BilletCard from "@/components/Cards/BilletCard.vue";
import Loader from "@/components/Loader.vue";
import EmployeeModal from "@/components/Modals/EmployeeModal.vue";
import peopleIcon from "@/assets/icons/people_icon.svg";
import { Employee } from "@/types";

const authStore = useAuthStore();
const uiStore = useUiStore();

const showModal = ref(false);
const currentId = ref<number | null>(null);
const selected = ref<Partial<Employee>>({});

const cities = ["Симферополь", "Москва", "Севастополь"];
const clients = computed(() => authStore.clients);

onMounted(() => {
  authStore.fetchAllUsers(1, 10, "user");
});

async function openModal(u: { id: number }) {
  currentId.value = u.id;
  try {
    const data = await authStore.fetchUserById(u.id);
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
