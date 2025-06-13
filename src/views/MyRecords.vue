<template>
  <div class="page">
    <div v-if="sessionStore.isLoading" class="loading">Загрузка...</div>
    <div v-else>
      <div class="title">
        Добро пожаловать, <span>{{ userName }}</span
        >!
      </div>
      <div v-if="records.length">
        <div class="subtitle">Вот Ваши ближайшие записи:</div>
        <RecordCard v-for="rec in records" :key="rec.id" :record="rec" />
      </div>
      <div class="subtitle" v-else>У вас нет текущих записей.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useSessionStore } from "@/store/useSessionStore";
import RecordCard from "@/components/Cards/RecordCard.vue";

const userName = ref("Пользователь");

const sessionStore = useSessionStore();

const ACTIVE_STATUSES = ["booked", "completed", "canceled", "in_progress"];

const records = computed(() => {
  const arr = Array.isArray(sessionStore.sessions) ? sessionStore.sessions : [];
  console.log("Sessions in records:", arr);
  return arr
    .filter((s) => {
      const included = ACTIVE_STATUSES.includes(s.status);
      console.log(`Session ${s.id} status: ${s.status}, included: ${included}`);
      return included;
    })
    .map((s) => {
      let time = "";
      if (s.specific_date && s.start_time) {
        const datePart = s.specific_date.split("T")[0];
        time = `${datePart}T${s.start_time}`;
      } else {
        time = s.specific_date || "";
      }
      return {
        id: s.id,
        title: s.direction_name || "Без направления",
        with: "Сотрудник",
        address: "Не указано",
        time,
        status: mapStatusRu(s.status),
      };
    });
});

function mapStatusRu(status: string) {
  switch (status) {
    case "booked":
      return "скоро";
    case "completed":
      return "подтверждена";
    case "canceled":
      return "отменена";
    case "in_progress":
      return "в процессе";
    default:
      return status;
  }
}

onMounted(async () => {
  await sessionStore.fetchSessions();
  console.log("Sessions after fetch:", sessionStore.sessions);
  console.log("Records:", records.value);
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
