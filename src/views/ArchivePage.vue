<template>
  <div class="page archive-page">
    <div v-if="sessionStore.isLoading" class="loading">Загрузка...</div>
    <div v-else>
      <div class="title">Запишитесь снова!</div>
      <div v-if="paginatedRecords.length">
        <div class="subtitle">Ваши прошедшие записи:</div>
        <RecordCard
          v-for="rec in paginatedRecords"
          :key="rec.id"
          :record="rec"
          @rebook="handleRebook"
        />
        <div class="pagination-controls">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[5, 10, 20]"
            :total="filteredRecords.length"
            layout="total, sizes, prev, pager, next"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
      <div class="subtitle" v-else>Архив пуст.</div>
    </div>
    <WizardDialog
      :visible="showModal"
      @update:visible="showModal = $event"
      @submit="handleSubmit"
      :subtitles="subtitles"
      :stepComponents="stepComponents"
      :initialData="wizardData"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useSessionStore } from "@/store/useSessionStore";
import RecordCard from "@/components/Cards/RecordCard.vue";
import WizardDialog from "@/components/Wizard/WizardDialog.vue";
import Step1Form from "@/components/Wizard/Step1Form.vue";
import Step2Form from "@/components/Wizard/Step2Form.vue";
import Step3Form from "@/components/Wizard/Step3Form.vue";
import Step4Form from "@/components/Wizard/Step4Form.vue";

interface Doctor {
  id: number;
  name: string;
}

interface Session {
  id: number;
  user_id: number;
  district_id: number;
  direction_id: number;
  working_hour_id: number;
  status:
    | "booked"
    | "canceled"
    | "completed"
    | "in_progress"
    | "pending_confirmation";
  comments?: string;
  created_at: string;
  updated_at: string;
  address?: string;
  direction_name?: string;
  doctor?: Doctor;
  name?: string;
  specific_date?: string;
  start_time?: string;
  end_time?: string;
  day_of_week?: string;
}

interface WizardData {
  id?: number;
  title?: string;
  with?: string;
  address?: string;
  time?: string;
  status?: string;
  day_of_week?: string;
  departmentId?: number;
  categoryId?: number;
  serviceId?: number;
  employeeId?: number;
  date?: string;
}

const sessionStore = useSessionStore();
const currentPage = ref(1);
const pageSize = ref(10);
const showModal = ref(false);
const wizardData = ref<WizardData>({});

const ARCHIVE_STATUSES = ["completed", "cancelled"];
const filteredRecords = computed(() => {
  const arr = Array.isArray(sessionStore.sessions) ? sessionStore.sessions : [];
  return arr
    .filter((s: Session) => ARCHIVE_STATUSES.includes(s.status))
    .map((s: Session) => ({
      id: s.id,
      title: s.direction_name || "Без направления",
      with: s.doctor?.name || s.name || "Сотрудник",
      address: s.address || "Не указано",
      time:
        s.specific_date && s.start_time
          ? `${s.specific_date.split("T")[0]}T${s.start_time}`
          : s.specific_date || "",
      status: mapStatusRu(s.status),
      day_of_week: s.day_of_week || "",
    }));
});

const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredRecords.value.slice(start, start + pageSize.value);
});

const subtitles = [
  "Выберите отдел",
  "Выберите категорию и услугу",
  "Выберите сотрудника",
  "Выберите дату и время",
];
const stepComponents = [Step1Form, Step2Form, Step3Form, Step4Form];

function mapStatusRu(status: string) {
  switch (status) {
    case "completed":
      return "завершена";
    case "cancelled":
      return "пропущена";
    default:
      return status;
  }
}

function handleSizeChange(val: number) {
  pageSize.value = val;
  currentPage.value = 1;
}

function handleCurrentChange(val: number) {
  currentPage.value = val;
}

function handleRebook(record: WizardData) {
  wizardData.value = {
    ...record,
    departmentId: undefined,
    categoryId: undefined,
    serviceId: undefined,
    employeeId: undefined,
    date: undefined,
    time: undefined,
  };
  showModal.value = true;
}

function handleSubmit(sessionId: number) {
  console.log("ArchivePage: Form submitted with sessionId:", sessionId);
  showModal.value = false;
  wizardData.value = {};
}

onMounted(async () => {
  await sessionStore.fetchSessions();
});
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
.loading {
  text-align: center;
  font-size: 18px;
}
.pagination-controls {
  margin-top: 20px;
  text-align: center;
}
.pagination-controls :deep(.el-pagination) {
  font-size: 16px;
}
.pagination-controls :deep(.el-pager li) {
  border-radius: 6px;
  margin: 0 4px;
  color: #4a4a4a;
  font-weight: 500;
}
.pagination-controls :deep(.el-pager li.is-active) {
  background-color: #ff5227;
  color: #fff;
}
.pagination-controls :deep(.el-pagination button) {
  border-radius: 6px;
  color: #4a4a4a;
}
.pagination-controls :deep(.el-pagination button:hover) {
  background-color: rgba(255, 82, 39, 0.1);
}
.pagination-controls :deep(.el-select .el-input__inner) {
  border-radius: 6px;
  border-color: #bb5b5b;
}
.pagination-controls :deep(.el-select .el-input__inner:focus) {
  border-color: #ff5227;
}
</style>
