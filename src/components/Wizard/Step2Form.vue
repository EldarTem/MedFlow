<template>
  <div class="step">
    <ul class="options-list">
      <!-- Отображаем все направления из store -->
      <li
        v-for="dir in directionStore.directions"
        :key="dir.id"
        :class="['option-item', { selected: form.departmentId === dir.id }]"
        @click="selectDirection(dir.id)"
      >
        <i class="el-icon-location"></i>
        {{ dir.name }}
      </li>
      <!-- Если нет направлений, показываем сообщение -->
      <li v-if="directionStore.directions.length === 0">
        Загрузка направлений...
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, onMounted } from "vue";
import { useDirectionStore } from "@/store/useDirectionStore"; // Импорт store для направлений

// Типизация объекта данных
interface WizardForm {
  departmentId?: number;
  categoryId?: number;
  serviceId?: number;
  employeeId?: number;
  date?: string;
  time?: string;
}

// Пропсы и события
const props = defineProps<{ modelValue: WizardForm }>();
const emit = defineEmits<{
  (e: "update:modelValue", value: WizardForm): void;
}>();

// Используем store для получения направлений
const directionStore = useDirectionStore();

// Инициализация формы
const form = ref<WizardForm>({ ...props.modelValue });

// Слежение за изменениями в modelValue (получаемые пропсы)
watch(
  () => props.modelValue.categoryId,
  (v) => {
    form.value.categoryId = v;
  }
);

// Запрашиваем все направления при монтировании компонента
onMounted(() => {
  directionStore.getAllDirections(); // Получаем все направления через store
});

// Функция для выбора направления
function selectDirection(id: number) {
  form.value.departmentId = id;
  emit("update:modelValue", { ...form.value }); // Обновляем модель на каждом шаге
}
</script>

<style scoped>
.options-list {
  list-style: none;
  padding: 0;
  margin-top: 16px;
}
.option-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
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
