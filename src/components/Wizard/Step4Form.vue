```vue
<template>
  <div class="step">
    <el-form label-position="top">
      <el-form-item label="Комментарий (необязательно)">
        <el-input
          v-model="form.comments"
          type="textarea"
          placeholder="Введите комментарий к записи"
          @input="updateForm"
        />
      </el-form-item>
    </el-form>
    <div v-if="workingHoursStore.isLoading">Загрузка доступных слотов...</div>
    <div v-else-if="workingHoursStore.availableSlots.length === 0">
      Нет доступных слотов
    </div>
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
          @click="selectSlot(slot.workingHourId, slot.date, slot.startTime)"
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
import { useWorkingHoursStore } from "@/store/useWorkingHoursStore";
import { notifyError } from "@/utils/notify";
import type { WizardForm } from "@/types";

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

const workingHoursStore = useWorkingHoursStore();
const form = ref<WizardForm>({
  districtId: null,
  categoryId: null,
  directionId: null,
  employeeId: null,
  date: null,
  time: null,
  workingHourId: null,
  comments: "",
});

// Синхронизация с props.modelValue
watch(
  () => props.modelValue,
  (newValue, oldValue) => {
    console.log("Step4Form: Updated modelValue:", newValue);
    // Сохраняем текущие значения слота, чтобы избежать перезаписи
    if (
      newValue.districtId !== oldValue?.districtId ||
      newValue.employeeId !== oldValue?.employeeId
    ) {
      form.value = {
        ...newValue,
        workingHourId: null,
        date: null,
        time: null,
        comments: newValue.comments || form.value.comments,
      };
      emit("update:modelValue", { ...form.value });
    } else {
      form.value = { ...newValue };
    }
  },
  { immediate: true, deep: true }
);

// Загрузка слотов при монтировании
onMounted(() => {
  console.log("Step4Form mounted:", props.modelValue);
  if (props.modelValue.employeeId && props.modelValue.districtId) {
    workingHoursStore.fetchAvailableSlots({
      employeeId: props.modelValue.employeeId,
      districtId: props.modelValue.districtId,
    });
  } else {
    notifyError("Выберите отдел и сотрудника на предыдущих шагах");
  }
});

// Ограниченный watch для employeeId и districtId
watch(
  () => [props.modelValue.employeeId, props.modelValue.districtId],
  ([newEmployeeId, newDistrictId], [oldEmployeeId, oldDistrictId]) => {
    console.log("Step4Form: Watch employeeId/districtId:", {
      newEmployeeId,
      newDistrictId,
    });
    if (newEmployeeId !== oldEmployeeId || newDistrictId !== oldDistrictId) {
      workingHoursStore.clearAvailableSlots();
      form.value.workingHourId = null;
      form.value.date = null;
      form.value.time = null;
      emit("update:modelValue", { ...form.value });
      if (newEmployeeId && newDistrictId) {
        workingHoursStore.fetchAvailableSlots({
          employeeId: newEmployeeId,
          districtId: newDistrictId,
        });
      }
    }
  },
  { immediate: false }
);

const uniqueDates = computed(() => {
  const dates = [
    ...new Set(workingHoursStore.availableSlots.map((slot) => slot.date)),
  ].sort();
  console.log("Step4Form: Unique dates:", dates);
  return dates;
});

const slotsByDate = computed(() => {
  const slots = workingHoursStore.availableSlots.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, WorkingHourSlot[]>);
  console.log("Step4Form: Slots by date:", slots);
  return slots;
});

function selectSlot(workingHourId: number, date: string, time: string) {
  console.log("Step4Form: Slot selected:", { workingHourId, date, time });
  form.value.workingHourId = workingHourId;
  form.value.date = date;
  form.value.time = time;
  emit("update:modelValue", { ...form.value });
}

function updateForm() {
  console.log("Step4Form: Form updated:", form.value);
  emit("update:modelValue", { ...form.value });
}

function formatDate(date: string): string {
  try {
    return format(new Date(date), "d MMMM yyyy", { locale: ru });
  } catch {
    console.warn("Invalid date format:", date);
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
.el-button + .el-button {
  margin-left: 0px !important;
}
</style>
```
