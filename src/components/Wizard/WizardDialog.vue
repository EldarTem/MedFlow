```vue
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

  <!-- Модалка для выбора действия с сохранённой формой -->
  <el-dialog
    v-model="showFormChoiceModal"
    title="Продолжить или начать заново?"
    width="400px"
  >
    <p>
      Обнаружены сохранённые данные формы. Хотите продолжить заполнение или
      начать новую форму?
    </p>
    <template #footer>
      <el-button @click="startNewForm">Начать новую</el-button>
      <el-button type="primary" @click="continueForm"
        >Продолжить старую</el-button
      >
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits, watch, onMounted } from "vue";
import type { Component } from "vue";
import { useSessionStore } from "@/store/useSessionStore";
import { notifyError, notifySuccess } from "@/utils/notify";
import type { WizardForm, CreateSessionPayload } from "@/types";

const props = defineProps<{
  visible: boolean;
  subtitles: string[];
  stepComponents: Component[];
  finishText?: string;
}>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "submit", sessionId: number): void;
}>();

const sessionStore = useSessionStore();

const visible = computed({
  get: () => props.visible,
  set: (val: boolean) => emit("update:visible", val),
});

const currentStep = ref(1);
const completedSteps = ref(0);
const stepsCount = props.subtitles.length;
const showFormChoiceModal = ref(false);

const wizardData = ref<WizardForm>({
  districtId: null,
  categoryId: null,
  directionId: null,
  employeeId: null,
  date: null,
  time: null,
  workingHourId: null,
  comments: "",
});

// Загрузка данных из localStorage
function loadFormData(): WizardForm | null {
  const savedData = localStorage.getItem("wizardFormData");
  if (savedData) {
    try {
      return JSON.parse(savedData) as WizardForm;
    } catch (e) {
      console.error("Ошибка парсинга сохранённых данных формы:", e);
      return null;
    }
  }
  return null;
}

// Сохранение данных в localStorage
function saveFormData() {
  try {
    localStorage.setItem("wizardFormData", JSON.stringify(wizardData.value));
    console.log(
      "WizardDialog: Form data saved to localStorage:",
      wizardData.value
    );
  } catch (e) {
    console.error("Ошибка сохранения формы:", e);
    notifyError("Не удалось сохранить прогресс");
  }
}

// Очистка данных из localStorage
function clearFormData() {
  localStorage.removeItem("wizardFormData");
  console.log("WizardDialog: Form data cleared from localStorage");
}

// Инициализация формы
onMounted(() => {
  if (props.visible) {
    const savedData = loadFormData();
    if (savedData) {
      showFormChoiceModal.value = true;
    }
  }
});

// Сохранение формы при изменении wizardData
watch(
  wizardData,
  () => {
    if (props.visible) {
      saveFormData();
    }
  },
  { deep: true }
);

// Обработка выбора "Начать новую"
function startNewForm() {
  wizardData.value = {
    districtId: null,
    categoryId: null,
    directionId: null,
    employeeId: null,
    date: null,
    time: null,
    workingHourId: null,
    comments: "",
  };
  clearFormData();
  showFormChoiceModal.value = false;
}

// Обработка выбора "Продолжить старую"
function continueForm() {
  const savedData = loadFormData();
  if (savedData) {
    wizardData.value = { ...savedData };
    notifySuccess("Восстановлены сохранённые данные формы");
  }
  showFormChoiceModal.value = false;
}

// Получение данных пользователя из localStorage
interface UserData {
  id: number;
  email: string;
  name: string;
  phone?: string;
  role: "user" | "employee" | "local_admin" | "super_admin";
}

function getUserData(): UserData | null {
  const userDataString = localStorage.getItem("userData");
  if (!userDataString) {
    notifyError("Пользователь не авторизован");
    return null;
  }
  try {
    return JSON.parse(userDataString) as UserData;
  } catch (e) {
    console.error("Ошибка парсинга userData:", e);
    notifyError("Ошибка получения данных пользователя");
    return null;
  }
}

const updateWizardData = (data: WizardForm) => {
  console.log("WizardDialog: Updating wizardData:", data);
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

async function submit() {
  console.log("WizardDialog: Submitting wizardData:", wizardData.value);

  const missingFields: string[] = [];
  if (!wizardData.value.districtId) missingFields.push("отдел");
  if (!wizardData.value.directionId) missingFields.push("направление");
  if (!wizardData.value.employeeId) missingFields.push("сотрудник");
  if (!wizardData.value.workingHourId) missingFields.push("время");

  if (missingFields.length > 0) {
    notifyError(`Заполните следующие поля: ${missingFields.join(", ")}`);
    return;
  }

  const userData = getUserData();
  if (!userData?.id) {
    notifyError("Необходимо войти в систему");
    return;
  }

  try {
    const payload: CreateSessionPayload = {
      user_id: userData.id,
      working_hour_id: wizardData.value.workingHourId!,
      district_id: wizardData.value.districtId!,
      direction_id: wizardData.value.directionId!,
      status: "booked",
      comments: wizardData.value.comments || "",
    };
    console.log("WizardDialog: Sending payload:", payload);
    await sessionStore.createSession(payload);
    const newSessionId =
      sessionStore.sessions[sessionStore.sessions.length - 1].id;
    notifySuccess("Запись успешно создана");
    clearFormData();
    emit("submit", newSessionId);
    emit("update:visible", false);
  } catch (e: any) {
    console.error("Ошибка при создании записи:", e);
    notifyError(e.response?.data?.message || "Не удалось создать запись");
  }
}

function closeDialog() {
  saveFormData();
  emit("update:visible", false);
}

const finishText = props.finishText || "Записаться";
</script>

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
```
