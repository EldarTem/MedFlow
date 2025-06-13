<template>
  <div class="step">
    <el-form label-position="top">
      <el-form-item label="Категория">
        <el-select
          v-model="form.categoryId"
          placeholder="Выберите категорию"
          :loading="categoryStore.isLoading"
          @change="handleCategoryChange"
          style="width: 100%"
        >
          <el-option
            v-for="cat in categoryStore.categories"
            :key="cat.id"
            :label="cat.name"
            :value="cat.id"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <ul v-if="form.categoryId" class="options-list">
      <li
        v-for="dir in directionStore.directions"
        :key="dir.id"
        :class="['option-item', { selected: form.directionId === dir.id }]"
        @click="selectDirection(dir.id)"
      >
        <i class="el-icon-location"></i>
        {{ dir.name }}
      </li>
      <li v-if="directionStore.isLoading">Загрузка направлений...</li>
      <li
        v-else-if="
          !directionStore.directions || directionStore.directions.length === 0
        "
      >
        Направления не найдены
      </li>
    </ul>
    <div v-else-if="!props.modelValue.districtId">
      Выберите отдел на предыдущем шаге
    </div>
    <div v-else>Выберите категорию выше</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, onMounted } from "vue";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useDirectionStore } from "@/store/useDirectionStore";

interface WizardForm {
  districtId?: number | null;
  categoryId: number | null;
  directionId: number | null;
  employeeId?: number | null;
  date?: string | null;
  time?: string | null;
  workingHourId?: number | null;
}

const props = defineProps<{ modelValue: WizardForm }>();
const emit = defineEmits<{
  (e: "update:modelValue", value: WizardForm): void;
}>();

const categoryStore = useCategoryStore();
const directionStore = useDirectionStore();

const form = ref<WizardForm>({ categoryId: null, directionId: null });

watch(
  () => props.modelValue,
  (newValue) => {
    form.value = { ...newValue };
    // Очищаем categoryId и directionId, если districtId изменился
    if (newValue.districtId !== form.value.districtId) {
      form.value.categoryId = null;
      form.value.directionId = null;
      directionStore.directions = [];
      emit("update:modelValue", { ...form.value });
    }
  },
  { immediate: true, deep: true }
);

onMounted(() => {
  console.log("Step2Form mounted, districtId:", props.modelValue.districtId);
  if (props.modelValue.districtId) {
    categoryStore.fetchCategories(props.modelValue.districtId);
  }
});

watch(
  () => props.modelValue.districtId,
  (newDistrictId) => {
    if (newDistrictId) {
      categoryStore.fetchCategories(newDistrictId);
    } else {
      categoryStore.categories = [];
      directionStore.directions = [];
      form.value.categoryId = null;
      form.value.directionId = null;
      emit("update:modelValue", { ...form.value });
    }
  }
);

function handleCategoryChange(categoryId: number) {
  form.value.categoryId = categoryId;
  form.value.directionId = null; // Очищаем направление
  directionStore.directions = []; // Очищаем направления
  emit("update:modelValue", { ...form.value });
  // Проверяем, что districtId не null/undefined
  if (props.modelValue.districtId) {
    directionStore.fetchDirections({
      districtId: props.modelValue.districtId,
      categoryId,
    });
  }
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
