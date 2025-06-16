<template>
  <div class="page">
    <div v-if="sessionStore.isLoading" class="loading">Загрузка...</div>
    <div v-else>
      <div class="title">
        Добро пожаловать, <span>{{ userName }}</span
        >!
      </div>
      <div v-if="paginatedRecords.length">
        <div class="subtitle">Вот Ваши ближайшие записи:</div>
        <RecordCard
          v-for="rec in paginatedRecords"
          :key="rec.id"
          :record="rec"
          @cancel="handleCancel"
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
      <div class="subtitle" v-else>У вас нет текущих записей.</div>
    </div>
  </div>
  <ConfirmModal
    v-model="showCancelDialog"
    :message="'Вы уверены, что хотите отменить запись?'"
    :loading="cancelLoading"
    @confirm="confirmCancel"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useSessionStore } from "@/store/useSessionStore";
import RecordCard from "@/components/Cards/RecordCard.vue";
import ConfirmModal from "@/components/Modals/ConfirmModal.vue";
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

const userName = ref("Пользователь");
const sessionStore = useSessionStore();

const currentPage = ref(1);
const pageSize = ref(10);

const ACTIVE_STATUSES = [
  "pending_confirmation",
  "in_progress",
  "booked",
  "completed",
];
const showCancelDialog = ref(false);
const cancelLoading = ref(false);
const cancelId = ref<number | null>(null);
const filteredRecords = computed(() => {
  const arr = Array.isArray(sessionStore.sessions) ? sessionStore.sessions : [];
  return arr
    .filter((s: Session) => ACTIVE_STATUSES.includes(s.status))
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

function mapStatusRu(status: string) {
  switch (status) {
    case "pending_confirmation":
      return "ожидает подтверждения";
    case "in_progress":
      return "в процессе";
    case "booked":
      return "скоро";
    case "completed":
      return "подтверждена";
    case "cancelled":
      return "отменена";
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

function handleCancel(id: number) {
  cancelId.value = id;
  showCancelDialog.value = true;
}

function handleRebook(record: any) {
  console.log(`Повторная запись:`, record);
}
async function confirmCancel() {
  if (!cancelId.value) return;
  cancelLoading.value = true;
  try {
    await sessionStore.cancelSession(cancelId.value);
    await sessionStore.fetchSessions();
  } finally {
    cancelLoading.value = false;
    showCancelDialog.value = false;
    cancelId.value = null;
  }
}
onMounted(async () => {
  await sessionStore.fetchSessions();
  const stored = localStorage.getItem("userData");
  if (stored) {
    try {
      const userData = JSON.parse(stored);
      userName.value = userData.name || "Пользователь";
    } catch {
      userName.value = "Пользователь";
    }
  }
});
</script>

<style scoped>
.page {
  padding: 20px;
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
