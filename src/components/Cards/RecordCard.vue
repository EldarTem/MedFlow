<template>
  <el-card class="record-card" shadow="hover">
    <div class="record-header">
      <h3 class="record-title">{{ record.title }}</h3>
      <el-tag :class="['status-tag', record.status.toLowerCase()]">
        {{ record.status }}
      </el-tag>
    </div>
    <div class="record-details">
      <div class="detail-row">
        <span class="label">Сотрудник:</span>
        <span class="value">{{ record.with }}</span>
      </div>
      <div class="detail-row">
        <span class="label">Адрес:</span>
        <span class="value">{{ record.address }}</span>
      </div>
      <div class="detail-row">
        <span class="label">Время и дата:</span>
        <span class="value">{{ formatDate(record.time) }}</span>
      </div>
    </div>
    <div class="record-footer">
      <el-button
        v-if="canCancel"
        class="cancel-button"
        type="danger"
        plain
        @click="$emit('cancel', record.id)"
      >
        Отменить
      </el-button>
      <el-button
        v-else
        class="rebook-button"
        type="primary"
        @click="$emit('rebook', record)"
      >
        Записаться снова
      </el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";
import { format } from "date-fns";

interface Record {
  id: number;
  title: string;
  with: string;
  address: string;
  time: string | Date;
  status: string;
}

const props = defineProps<{ record: Record }>();

const canCancel = computed(() => {
  const st = props.record.status.toLowerCase();
  return st === "скоро" || st === "подтверждена";
});

function formatDate(date: string | Date): string {
  return format(new Date(date), "HH:mm d MMMM yyyy", { locale: undefined });
}
</script>

<style scoped>
.record-card {
  margin-bottom: 16px;
  border-radius: 10px;
  padding: 24px 34px;
  max-width: 850px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}

.record-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.status-tag {
  padding: 10px 30px;
  height: 28px;
  line-height: 28px;
  border-radius: 14px;
  font-weight: 500;
  color: #fff;
}
.status-tag.скоро {
  background-color: #f9aa8b;
}
.status-tag.подтверждена {
  background-color: #96ba86;
}
.status-tag.отменена,
.status-tag.пропущена {
  background-color: #919191;
}
.status-tag.завершена {
  background-color: #8ba2f9;
}

.record-details {
  margin-bottom: 24px;
}
.detail-row {
  display: flex;
  margin-bottom: 8px;
}
.label {
  flex: 0 0 120px;
  font-weight: 600;
  font-size: 16px;
  margin-right: 10px;
}
.value {
  flex: 1;
  color: #4a4a4a;
  font-size: 16px;
}

.record-footer {
  text-align: right;
}
.cancel_button {
  border-radius: 6px;
  padding: 6px 20px;
  font-weight: 500;
  color: #bb5b5b;
  border-color: #bb5b5b;
  background-color: #fff;
}
.cancel-button:hover {
  background-color: rgba(166, 63, 63, 0.1);
}

.rebook-button {
  padding: 10px 26px;
  border-radius: 10px;
  background-color: #ff5227;
  border: none;
}
</style>
