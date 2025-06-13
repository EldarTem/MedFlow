<template>
  <div class="step">
    <div v-if="isLoading">Загрузка доступных слотов...</div>
    <div v-else-if="availableSlots.length === 0">Нет доступных слотов</div>
    <div v-else v-for="date in uniqueDates" :key="date" class="date-block">
      <h4 class="date-title">{{ formatDate(date) }}</h4>
      <div class="times-list">
        <el-button
          v-for="slot in slotsByDate[date]"
          :key="slot.workingHourId"
          :class="[
            'time-button',
            { selected: form.workingHourId === slot.workingHourId },
          ]"
          @click="selectSlot(slot.workingHourId, date, slot.startTime)"
          plain
        >
          {{ slot.startTime }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import axios from "axios";

interface WizardForm {
  districtId?: number | null;
  directionId?: number | null;
  employeeId?: number | null;
  date?: string | null;
  time?: string | null;
  workingHourId?: number | null;
}

interface WorkingHourSlot {
  workingHourId: number;
  date: string;
  startTime: string;
  endTime: string;
}

const props = defineProps<{ modelValue: WizardForm }>();
const emit = defineEmits<{
  (e: "update:modelValue", value: WizardForm): void;
}>();

const form = ref<WizardForm>({ workingHourId: null, date: null, time: null });
const availableSlots = ref<WorkingHourSlot[]>([]);
const isLoading = ref(false);

onMounted(() => {
  if (props.modelValue.employeeId && props.modelValue.districtId) {
    fetchAvailableSlots();
  }
});

watch(
  () => [props.modelValue.employeeId, props.modelValue.districtId],
  ([newEmployeeId, newDistrictId]) => {
    if (newEmployeeId && newDistrictId) {
      fetchAvailableSlots();
    }
  }
);

async function fetchAvailableSlots() {
  isLoading.value = true;
  try {
    const { data } = await axios.get<WorkingHourSlot[]>(
      "/working-hours/available",
      {
        params: {
          employeeId: props.modelValue.employeeId,
          districtId: props.modelValue.districtId,
        },
      }
    );
    availableSlots.value = data;
  } catch (e: any) {
    console.error("Error fetching available slots:", e);
    availableSlots.value = [];
  } finally {
    isLoading.value = false;
  }
}

const uniqueDates = computed(() => {
  return [...new Set(availableSlots.value.map((slot) => slot.date))].sort();
});

const slotsByDate = computed(() => {
  return availableSlots.value.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, WorkingHourSlot[]>);
});

function selectSlot(workingHourId: number, date: string, time: string) {
  form.value.workingHourId = workingHourId;
  form.value.date = date;
  form.value.time = time;
  emit("update:modelValue", { ...form.value });
}

function formatDate(date: string): string {
  try {
    return format(new Date(date), "d MMMM yyyy", { locale: ru });
  } catch {
    return date;
  }
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
