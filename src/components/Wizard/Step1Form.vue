<template>
  <div class="step">
    <ul class="options-list">
      <!-- Проверка, что данные есть и они корректно отображаются -->
      <li
        v-for="dept in districtStore.districts"
        :key="dept.id"
        :class="['option-item', { selected: form.departmentId === dept.id }]"
        @click="select(dept.id)"
      >
        <i class="el-icon-location"></i>
        {{ dept.name }}
      </li>
      <!-- Если данных нет, показываем сообщение -->
      <li v-if="districtStore.districts.length === 0">Загрузка отделов...</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, onMounted } from "vue";
import { useDistrictStore } from "@/store/useDistrictStore"; // Импорт store для отделов

// Типизация объекта данных
interface WizardForm {
  departmentId: number | null; // Сделаем обязательным свойство departmentId с типом number | null
  categoryId?: number;
  serviceId?: number;
  employeeId?: number;
  date?: string;
  time?: string;
}

// Пропсы, которые передаются в компонент
const props = defineProps<{ modelValue: WizardForm }>();
const emit = defineEmits<{
  (e: "update:modelValue", value: WizardForm): void;
}>();

// Используем store для получения всех отделов
const districtStore = useDistrictStore();

// Инициализация формы
const form = ref<WizardForm>({ departmentId: null });

// Слежение за изменениями в modelValue (получаемые пропсы)
watch(
  () => props.modelValue,
  (newValue) => {
    form.value = { ...newValue };
  },
  { immediate: true }
);

// Запрашиваем все отделы при монтировании компонента
onMounted(() => {
  districtStore.getAllDistricts(); // Получаем все отделы через store
});

// Функция для выбора отдела
function select(id: number) {
  form.value.departmentId = id;
  emit("update:modelValue", { ...form.value }); // Обновляем модель на каждом шаге
}
</script>

<style scoped>
.options-list {
  list-style: none;
  padding: 0;
}
.option-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}
.option-item i {
  margin-right: 8px;
  color: #ff552e;
}
.option-item.selected {
  border-color: #ff552e;
  background: rgba(255, 85, 46, 0.1);
}
</style>
