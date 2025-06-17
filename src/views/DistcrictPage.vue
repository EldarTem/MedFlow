<template>
  <div class="page">
    <div class="title">Мой отдел</div>
    <div class="subtitle">Информация по данному отделу:</div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="Имя">
          <el-input />
        </el-form-item>
      </el-col>
    </el-row>
    <BilletCard
      v-for="employee in employees"
      :key="employee.id"
      :name="employee.name"
      :icon="adminIcon"
      @click="openModal(employee)"
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
import { useAdminStore } from "@/store/useAdminStore";
import { useUiStore } from "@/store/useUiStore";
import EmployeeModal from "@/components/Modals/EmployeeModal.vue";
import BilletCard from "@/components/Cards/BilletCard.vue";
import Loader from "@/components/Loader.vue";
import adminIcon from "@/assets/icons/people_icon.svg";
import type { User } from "@/types";

const adminStore = useAdminStore();
const uiStore = useUiStore();

const showModal = ref(false);
const currentId = ref<number | null>(null);
const selected = ref<Partial<User>>({});

const cities = ["Симферополь", "Москва", "Севастополь"];
const employees = computed(() => adminStore.users);

onMounted(() => {
  adminStore.fetchUsers({ role: "user", page: 1, limit: 10 });
});

async function openModal(employee: { id: number }) {
  currentId.value = employee.id;
  try {
    const data = await adminStore.getUserById(employee.id);
    if (data) {
      selected.value = {
        name: data.name,
        email: data.email,
        phone: data.phone,
      };
      showModal.value = true;
    }
  } catch {}
}

async function handleSave(updated: Partial<User>) {
  if (currentId.value == null) return;
  try {
    await adminStore.updateUser(currentId.value, updated);
    showModal.value = false;
  } catch {}
}
</script>
