<template>
  <div class="step">
    <ul class="options-list">
      <li
        v-for="dept in districtStore.districts"
        :key="dept.id"
        :class="['option-item', { selected: form.districtId === dept.id }]"
        @click="select(dept.id)"
      >
        <i class="el-icon-location"></i>
        {{ dept.name }}
      </li>
      <li v-if="districtStore.isLoading">Загрузка отделов...</li>
      <li
        v-else-if="
          !districtStore.districts || districtStore.districts.length === 0
        "
      >
        Отделы не найдены
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, onMounted } from "vue";
import { useDistrictStore } from "@/store/useDistrictStore";

interface WizardForm {
  districtId: number | null;
  directionId?: number | null;
  employeeId?: number | null;
  date?: string | null;
  time?: string | null;
  workingHourId?: number | null;
}

const props = defineProps<{ modelValue: WizardForm }>();
const emit = defineEmits<{
  (e: "update:modelValue", value: WizardForm): void;
}>();

const districtStore = useDistrictStore();

const form = ref<WizardForm>({ districtId: null });

watch(
  () => props.modelValue,
  (newValue) => {
    form.value = { ...newValue };
  },
  { immediate: true, deep: true }
);

onMounted(() => {
  districtStore.fetchDistricts();
});

function select(id: number) {
  form.value.districtId = id;
  emit("update:modelValue", { ...form.value });
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
