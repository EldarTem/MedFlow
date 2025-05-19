<template>
  <div class="page">
    <div class="title">
      Добро пожаловать, <span>{{ userName }}</span
      >!
    </div>
    <div v-if="currentRecords.length">
      <div class="subtitle">Вот Ваши ближайшие записи:</div>
      <record-card v-for="rec in currentRecords" :key="rec.id" :record="rec" />
    </div>
    <div class="subtitle" v-else>У вас нет текущих записей.</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useSessionStore } from "@/store/useSessionStore"; // Импортируем store для сессий
import RecordCard from "@/components/Cards/RecordCard.vue";

// Типизация записи
interface Record {
  id: number;
  title: string;
  with: string;
  address: string;
  time: string;
  status: string;
  service: string;
}

// Данные пользователя и сессий
const userName = ref<string>("");

const records = ref<Record[]>([
  {
    id: 1,
    title: "Запись на йогу",
    with: "Ирина",
    address: "ул. Ленина, 10",
    time: "2025-05-01T08:00:00",
    status: "подтверждена",
    service: "Утренняя йога",
  },
  {
    id: 2,
    title: "Консультация тренера",
    with: "Алексей",
    address: "пр. Мира, 5",
    time: "2025-05-02T14:30:00",
    status: "скоро",
    service: "План тренировок",
  },
  {
    id: 3,
    title: "Тренировка по пилатесу",
    with: "Ольга",
    address: "ул. Первомайская, 7",
    time: "2025-05-03T18:00:00",
    status: "отменена",
    service: "Пилатес для начинающих",
  },
]);

const stored = localStorage.getItem("userData");
if (stored) {
  try {
    const userData = JSON.parse(stored);
    userName.value = userData.name || "Пользователь";
  } catch {
    userName.value = "Пользователь";
  }
} else {
  userName.value = "Пользователь";
}

// Создаем вычисляемое свойство для объединения тестовых записей и сессий
const sessionStore = useSessionStore();
const currentRecords = computed(() => {
  const currentSessions = sessionStore.sessions.map((session) => ({
    id: session.id,
    title: session.direction_name,
    with: "Тренер", // Это можно заменить на имя тренера, если есть в данных
    address: "Не указано", // Можно добавить адрес, если есть
    time: `${session.specific_date} ${session.start_time}`,
    status: session.status,
    service: "Не указано", // Это можно заменить на конкретную услугу
  }));

  // Возвращаем объединенный список записей и сессий
  return [...records.value, ...currentSessions].filter((rec) =>
    ["подтверждена", "скоро", "отменена"].includes(rec.status.toLowerCase())
  );
});

// Загружаем сессии при монтировании компонента
onMounted(() => {
  sessionStore.getUserSessions(); // Получаем сессии текущего пользователя
});
</script>

<style scoped>
/* Стили для страницы */
</style>
