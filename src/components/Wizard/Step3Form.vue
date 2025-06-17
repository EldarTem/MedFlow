<template>
  <div class="step">
    <el-form label-position="top">
      <el-form-item label="Сотрудник">
        <el-select
          v-model="form.employeeId"
          placeholder="Выберите сотрудника"
          :loading="adminStore.isLoading"
        >
          <el-option
            v-for="employee in employees"
            :key="employee.user_id"
            :label="employee.name"
            :value="employee.user_id"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <ul class="options-list" v-if="employees.length">
      <li
        v-for="employee in employees"
        :key="employee.user_id"
        :class="[
          'option-item',
          { selected: form.employeeId === employee.user_id },
        ]"
        @click="selectEmployee(employee.user_id)"
      >
        <span><img src="/src/assets/icons/people_icon.svg" alt="" /></span>
        {{ employee.name }}

        <span v-if="employee.message" class="no-details">{{
          employee.message
        }}</span>
      </li>
    </ul>
    <div v-else-if="adminStore.isLoading">Загрузка сотрудников...</div>
    <div v-else-if="!form.districtId">Выберите отдел на предыдущем шаге</div>
    <div v-else>Сотрудники не найдены</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useAdminStore } from "@/store/useAdminStore";

// Тип WizardForm из предыдущих шагов
interface WizardForm {
  districtId?: number | null;
  directionId?: number | null;
  employeeId?: number | null;
  date?: string | null;
  time?: string | null;
}

// Тип EmployeeDetails из useAdminStore
interface EmployeeDetails {
  user_id: number;
  name: string;
  email: string;
  specialization?: string;
  experience_years?: number;
  bio?: string;
  certifications?: string;
  message?: string;
}

const props = defineProps<{ modelValue: WizardForm }>();
const emit = defineEmits<{
  (e: "update:modelValue", value: WizardForm): void;
}>();

const form = ref<WizardForm>({ employeeId: null });
const adminStore = useAdminStore();

// Храним сотрудников локально, чтобы не зависеть от adminStore.users
const employees = ref<EmployeeDetails[]>([]);

onMounted(() => {
  if (props.modelValue.districtId) {
    loadEmployees(props.modelValue.districtId);
  }
});

watch(
  () => props.modelValue,
  (newValue) => {
    form.value = { ...newValue };
    // Если districtId изменился, загружаем сотрудников
    if (newValue.districtId !== form.value.districtId) {
      form.value.employeeId = null; // Сбрасываем выбор сотрудника
      employees.value = []; // Очищаем список сотрудников
      emit("update:modelValue", { ...form.value });
      if (newValue.districtId) {
        loadEmployees(newValue.districtId);
      }
    }
  },
  { immediate: true, deep: true }
);

async function loadEmployees(districtId: number) {
  const data = await adminStore.getEmployeesByDistrict(districtId);
  employees.value = data;
}

function selectEmployee(employeeId: number) {
  form.value.employeeId = employeeId;
  emit("update:modelValue", { ...form.value });
}
</script>

<style scoped>
.options-list {
  list-style: none;
  padding: 0;
}
.option-item {
  font-size: 20px;
  gap: 15px;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 24px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  color: #4d4e4f;
  background-color: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  border-color: #fff;
}
.option-item i {
  margin-right: 8px;
  color: #409eff;
}
.option-item.selected {
  border-color: #ff552e;
  background: rgba(255, 85, 46, 0.1);
}
.no-details {
  font-size: 0.9em;
  color: #909399;
  margin-left: 8px;
}
</style>
