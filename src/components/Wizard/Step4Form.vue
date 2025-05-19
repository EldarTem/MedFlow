<!-- src/components/Wizard/Step4Form.vue -->
<template>
  <div class="step">
    <div v-for="date in dates" :key="date" class="date-block">
      <h4 class="date-title">{{ date }}</h4>
      <div class="times-list">
        <el-button
          v-for="time in times"
          :key="time"
          :class="['time-button', { selected: form.time === time }]"
          @click="selectTime(time)"
          plain
        >
          {{ time }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";

interface WizardForm {
  departmentId?: number;
  categoryId?: number;
  serviceId?: number;
  employeeId?: number;
  date?: string;
  time?: string;
}

const props = defineProps<{ modelValue: WizardForm }>();
const emit = defineEmits<{
  (e: "update:modelValue", value: WizardForm): void;
}>();

const form = reactive<WizardForm>({ ...props.modelValue });
const dates = ["2025-05-01", "2025-05-02"];
const times = ["10:00", "14:00", "18:00"];

watch(
  () => props.modelValue.time,
  (v) => {
    form.time = v;
  }
);

function selectTime(t: string) {
  form.date = undefined;
  form.time = t;
  emit("update:modelValue", { ...form });
}
</script>

<style scoped>
.date-block {
  margin-bottom: 16px;
}
.date-title {
  margin-bottom: 8px;
  font-weight: 600;
}
.times-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.time-button {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 6px 16px;
}
.time-button.selected {
  background: #ff552e;
  color: #fff;
  border-color: #ff552e;
}
</style>
