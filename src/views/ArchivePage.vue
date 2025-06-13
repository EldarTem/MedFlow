<template>
  <div class="page archive-page">
    <h2>Архив записей</h2>

    <div v-if="archiveRecords.length" class="records-list">
      <RecordCard
        v-for="rec in archiveRecords"
        :key="rec.id"
        :record="rec"
        @cancel="onCancel"
        @rebook="onRebook"
      />
    </div>
    <p v-else class="empty">Архив пуст.</p>

    <el-dialog
      v-model="wizardVisible"
      class="wizard-dialog"
      width="600px"
      :before-close="() => (wizardVisible = false)"
    >
      <template #header>
        <div class="wizard-header">
          <div class="wizard-title">Шаг {{ currentStep }} из 4</div>
          <div class="wizard-subtitle">
            {{ subtitles[currentStep - 1] }}
          </div>
        </div>
      </template>
      <div class="progress-container">
        <div
          class="progress-bar"
          :style="{ width: `${(completedSteps / 4) * 100}%` }"
        ></div>
      </div>
      <component :is="stepComponent" v-model="wizardData" />

      <template #footer>
        <el-button v-if="currentStep > 1" @click="prevStep">Назад</el-button>
        <el-button v-if="currentStep < 4" type="primary" @click="nextStep"
          >Далее</el-button
        >
        <el-button v-else type="primary" @click="submitRebook"
          >Записаться снова</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import RecordCard from "@/components/Cards/RecordCard.vue";
import Step1Form from "@/components/Wizard/Step1Form.vue";
import Step2Form from "@/components/Wizard/Step2Form.vue";
import Step3Form from "@/components/Wizard/Step3Form.vue";
import Step4Form from "@/components/Wizard/Step4Form.vue";

interface Record {
  id: number;
  title: string;
  with: string;
  address: string;
  time: string;
  status: string;
  service: string;
}

const records = ref<Record[]>([
  {
    id: 1,
    title: "Запись на йогу",
    with: "Ирина",
    address: "ул. Ленина, 10",
    time: "2025-04-15T18:00:00",
    status: "завершена",
    service: "Утренняя йога",
  },
  {
    id: 2,
    title: "Консультация тренера",
    with: "Алексей",
    address: "пр. Мира, 5",
    time: "2025-04-18T12:30:00",
    status: "пропущена",
    service: "План тренировок",
  },
  {
    id: 3,
    title: "Массаж спины",
    with: "Мария",
    address: "ул. Карла Маркса, 20",
    time: "2025-04-22T15:00:00",
    status: "завершена",
    service: "Расслабляющий массаж",
  },
]);

const archiveRecords = computed(() =>
  records.value.filter((r) =>
    ["завершена", "пропущена"].includes(r.status.toLowerCase())
  )
);

const wizardVisible = ref(false);
const currentStep = ref(1);
const completedSteps = ref(0);
const wizardData = ref<
  Partial<
    Record & {
      departmentId?: number;
      categoryId?: number;
      serviceId?: number;
      employeeId?: number;
      date?: string;
      time?: string;
    }
  >
>({});

const stepComponent = computed(() => {
  if (currentStep.value === 1) return Step1Form;
  if (currentStep.value === 2) return Step2Form;
  if (currentStep.value === 3) return Step3Form;
  return Step4Form;
});
const subtitles = [
  "Выберите отдел",
  "Выберите категорию и услугу",
  "Выберите сотрудника",
  "Выберите дату и время",
];

watch(
  () => wizardData.value.departmentId,
  (v) => {
    if (v != null && completedSteps.value < 1) completedSteps.value = 1;
  }
);
watch(
  () => wizardData.value.categoryId,
  (v) => {
    if (v != null && completedSteps.value < 2) completedSteps.value = 2;
  }
);
watch(
  () => wizardData.value.employeeId,
  (v) => {
    if (v != null && completedSteps.value < 3) completedSteps.value = 3;
  }
);
watch(
  () => wizardData.value.time,
  (v) => {
    if (v != null && completedSteps.value < 4) completedSteps.value = 4;
  }
);

function onCancel(id: number) {
  console.log("Cancel record", id);
}

function onRebook(rec: Record) {
  currentStep.value = 1;
  completedSteps.value = 0;
  wizardData.value = {
    ...rec,
    departmentId: undefined,
    categoryId: undefined,
    serviceId: undefined,
    employeeId: undefined,
    date: undefined,
    time: undefined,
  };
  wizardVisible.value = true;
}

function nextStep() {
  if (currentStep.value < 4) currentStep.value++;
}

function prevStep() {
  if (currentStep.value > 1) {
    completedSteps.value = Math.min(
      completedSteps.value,
      currentStep.value - 1
    );
    currentStep.value--;
  }
}

async function submitRebook() {
  if (completedSteps.value < 4) completedSteps.value = 4;
  console.log("Rebook payload:", wizardData.value);
  wizardVisible.value = false;
}
</script>

<style scoped>
.page.archive-page {
  padding: 24px;
  background: #fff;
  border-radius: 10px;
}
h2 {
  margin-bottom: 24px;
}
.records-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.empty {
  color: #666;
}

.wizard-header {
  display: flex;
  flex-direction: column;
  padding: 28px 38px 15px;
}
.wizard-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
}

.progress-container {
  width: 100%;
  height: 4px;
  background: #eee;
  overflow: hidden;
}
.progress-bar {
  height: 100%;
  background: #ff5227;
  width: 0;
  transition: width 0.3s ease;
}

.wizard-dialog .el-dialog__header {
  padding: 0;
  border-bottom: none;
}
</style>
