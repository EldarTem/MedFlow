<template>
  <el-dialog
    v-model="visible"
    :width="dialogWidth"
    class="employee-dialog"
    :close-on-click-modal="false"
    center
    @close="closeDialog"
  >
    <div class="modal-body">
      <el-row :gutter="20">
        <el-col :span="props.showRightColumn === false ? 24 : 12">
          <el-form :model="form" label-position="top" label-width="80px">
            <el-form-item label="Фамилия">
              <el-input v-model="form.lastName" :disabled="!isEditing" />
            </el-form-item>
            <el-form-item label="Имя">
              <el-input v-model="form.name" :disabled="!isEditing" />
            </el-form-item>
            <el-form-item label="Отчество">
              <el-input v-model="form.middleName" :disabled="!isEditing" />
            </el-form-item>
            <el-form-item label="Город">
              <el-select
                v-model="form.city"
                placeholder="Выберите город"
                :disabled="!isEditing"
              >
                <el-option
                  v-for="city in cities"
                  :key="city"
                  :label="city"
                  :value="city"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Дата рождения">
              <el-date-picker
                v-model="form.birthDate"
                type="date"
                placeholder="ДД/ММ/ГГГГ"
                format="dd/MM/yyyy"
                value-format="yyyy-MM-dd"
                style="width: 100%"
                :disabled="!isEditing"
              />
            </el-form-item>
            <el-form-item label="Телефон">
              <el-input v-model="form.phone" :disabled="!isEditing" />
            </el-form-item>
            <el-form-item label="Электронная почта">
              <el-input v-model="form.email" :disabled="!isEditing" />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col v-if="props.showRightColumn !== false" :span="12">
          <el-form :model="form" label-position="top" label-width="120px">
            <el-form-item label="Специализация">
              <el-input v-model="form.specialization" :disabled="!isEditing" />
            </el-form-item>
            <el-form-item label="Отдел">
              <el-input v-model="form.department" :disabled="!isEditing" />
            </el-form-item>
            <el-form-item label="Опыт работы">
              <el-input v-model="form.experience" :disabled="!isEditing" />
            </el-form-item>
            <el-form-item label="Биография">
              <el-input
                type="textarea"
                v-model="form.biography"
                :rows="4"
                :disabled="!isEditing"
              />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>

    <template #footer>
      <template v-if="!isEditing">
        <el-button class="btn-delete" @click="onDelete">Удалить</el-button>
        <el-button type="primary" @click="onEdit">Редактировать</el-button>
      </template>

      <template v-else>
        <el-button type="warning" @click="onCancelEdit">Отмена</el-button>
        <el-button type="primary" @click="onSave">Сохранить</el-button>
      </template>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { defineProps, defineEmits } from "vue";
import { Employee } from "@/types";

const props = defineProps<{
  modelValue: boolean;
  employee: Partial<Employee>;
  cities: string[];
  showRightColumn?: boolean;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", v: boolean): void;
  (e: "delete"): void;
  (e: "edit", payload: Employee): void;
  (e: "save", payload: Employee): void;
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const isEditing = ref(false);

const original = reactive<Employee>({
  lastName: props.employee.lastName || "",
  name: props.employee.name || "",
  middleName: props.employee.middleName || "",
  city: props.employee.city || "",
  birthDate: props.employee.birthDate || "",
  phone: props.employee.phone || "",
  email: props.employee.email || "",
  specialization: props.employee.specialization || "",
  department: props.employee.department || "",
  experience: props.employee.experience || "",
  biography: props.employee.biography || "",
  certificates: props.employee.certificates?.slice() || [],
});
const form = reactive({ ...original });

watch(
  () => props.modelValue,
  (open) => open && Object.assign(form, original)
);
watch(
  () => props.employee,
  (emp) =>
    Object.assign(original, {
      lastName: emp.lastName || "Иванов",
      name: emp.name || "",
      middleName: emp.middleName || "Иванович",
      city: emp.city || "Симферопоь",
      birthDate: emp.birthDate || "",
      phone: emp.phone || "",
      email: emp.email || "",
      specialization: emp.specialization || "Иммунолог",
      department: emp.department || "Медицина",
      experience: emp.experience || "5 лет",
      biography: emp.biography || "Лучший спелиалист",
      certificates: emp.certificates?.slice() || [],
    }),
  { immediate: true }
);

const dialogWidth = computed(() => {
  return props.showRightColumn === false ? "55vw" : "90vw";
});

function onDelete() {
  emit("delete");
}
function onEdit() {
  isEditing.value = true;
}
function onSave() {
  emit("save", { ...form } as Employee);
  isEditing.value = false;
}
function onCancelEdit() {
  Object.assign(form, original);
  isEditing.value = false;
}
function closeDialog() {
  emit("update:modelValue", false);
  isEditing.value = false;
}
</script>

<style scoped>
.employee-dialog {
  padding-bottom: 0;
}
.modal-body {
  max-height: 80vh;
  overflow-y: auto;
}
.certificates {
  display: flex;
  gap: 8px;
}
.certificate-thumb {
  width: 60px;
  height: 40px;
  object-fit: cover;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}
.btn-delete {
  border: 1px solid #ff4d4f;
  color: #ff4d4f;
  background: transparent;
  margin-right: 8px;
}
.employee-dialog .el-dialog {
  overflow: hidden !important;
}

.employee-dialog .el-dialog {
  max-width: 900px;
}
.employee-dialog .modal-body {
  max-height: none !important;
  overflow: visible !important;
}
</style>
