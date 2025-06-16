<template>
  <div class="step">
    <el-form label-position="top">
      <el-form-item label="Категория">
        <el-select
          v-model="form.categoryId"
          placeholder="Выберите категорию"
          :loading="categoryStore.isLoading"
          @change="handleCategoryChange"
          :disabled="!form.districtId"
        >
          <el-option
            v-for="cat in filteredCategories"
            :key="cat.id"
            :label="cat.name"
            :value="cat.id"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <ul v-if="form.categoryId" class="options-list">
      <li
        v-for="dir in filteredDirections"
        :key="dir.id"
        :class="['option-item', { selected: form.directionId === dir.id }]"
        @click="selectDirection(dir.id)"
      >
        <i class="el-icon-location"></i>
        {{ dir.name }}
      </li>
      <li v-if="directionStore.isLoading">Загрузка направлений...</li>
      <li v-else-if="!filteredDirections.length">Направления не найдены</li>
    </ul>
    <div v-else-if="!form.districtId">Выберите отдел на предыдущем шаге</div>
    <div v-else>Выберите категорию выше</div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from "vue";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useDirectionStore } from "@/store/useDirectionStore";

interface WizardForm {
  districtId: number | null;
  categoryId: number | null;
  directionId: number | null;
}

const props = defineProps<{ modelValue: WizardForm }>();
const emit = defineEmits<{
  (e: "update:modelValue", value: WizardForm): void;
}>();

const categoryStore = useCategoryStore();
const directionStore = useDirectionStore();

const form = ref<WizardForm>({
  districtId: null,
  categoryId: null,
  directionId: null,
});

// Синхронизируем с props
watch(
  () => props.modelValue,
  (newValue) => {
    form.value = { ...newValue };
  },
  { immediate: true, deep: true }
);

const filteredCategories = computed(() =>
  categoryStore.categories.filter(
    (cat) => cat.districtId === form.value.districtId
  )
);
const filteredDirections = computed(() =>
  directionStore.directions.filter(
    (dir) => dir.categoryId === form.value.categoryId
  )
);

// Подгружаем справочники при первом запуске (можно делать и глобально)
onMounted(() => {
  categoryStore.fetchCategories();
  directionStore.fetchDirections();
});

// Сброс categoryId и directionId при смене отдела
watch(
  () => form.value.districtId,
  (districtId, prev) => {
    if (districtId !== prev) {
      form.value.categoryId = null;
      form.value.directionId = null;
      emit("update:modelValue", { ...form.value });
    }
  }
);

// Сброс directionId при смене категории
watch(
  () => form.value.categoryId,
  (categoryId, prev) => {
    if (categoryId !== prev) {
      form.value.directionId = null;
      emit("update:modelValue", { ...form.value });
    }
  }
);

function handleCategoryChange(categoryId: number) {
  form.value.categoryId = categoryId;
  // directionId сбросится автоматически по watch выше
  emit("update:modelValue", { ...form.value });
}

function selectDirection(id: number) {
  form.value.directionId = id;
  emit("update:modelValue", { ...form.value });
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
