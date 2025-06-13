<template>
  <el-dialog
    :model-value="visible"
    class="wizard-dialog"
    width="600px"
    :before-close="closeDialog"
  >
    <template #header>
      <div class="wizard-header">
        <div class="wizard-title">
          Шаг {{ currentStep }} из {{ stepsCount }}
        </div>
        <div class="wizard-subtitle">{{ subtitles[currentStep - 1] }}</div>
      </div>
    </template>

    <div class="progress-container">
      <div
        class="progress-bar"
        :style="{ width: `${(completedSteps / stepsCount) * 100}%` }"
      ></div>
    </div>

    <component
      :is="stepComponents[currentStep - 1]"
      :modelValue="wizardData"
      @update:modelValue="updateWizardData"
    />

    <template #footer>
      <el-button v-if="currentStep > 1" @click="prevStep">Назад</el-button>

      <el-button
        v-if="currentStep < stepsCount"
        type="primary"
        @click="nextStep"
      >
        Далее
      </el-button>

      <el-button v-else type="primary" @click="submit">
        {{ finishText }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from "vue";
import type { Component } from "vue";

const props = defineProps<{
  visible: boolean;
  subtitles: string[];
  stepComponents: Component[];
  finishText?: string;
}>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "submit"): void;
}>();

const visible = computed({
  get: () => props.visible,
  set: (val: boolean) => emit("update:visible", val),
});

const currentStep = ref(1);
const completedSteps = ref(0);
const stepsCount = props.subtitles.length;

const wizardData = ref({
  departmentId: null,
  categoryId: null,
  serviceId: null,
  employeeId: null,
  date: null,
  time: null,
});

const updateWizardData = (data: any) => {
  wizardData.value = { ...data };
};

function nextStep() {
  if (currentStep.value < stepsCount) {
    currentStep.value++;
    completedSteps.value++;
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--;
    completedSteps.value--;
  }
}

function submit() {
  emit("submit");
  emit("update:visible", false);
}

function closeDialog() {
  emit("update:visible", false);
}

const finishText = props.finishText || "Готово";
</script>

<style scoped>
/* Стили для прогресса и заголовка */
</style>

<style scoped>
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
