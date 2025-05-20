<template>
  <div class="employee-bookings-page">
    <h2>Мои забронированные тренировки</h2>
    <el-row :gutter="20">
      <el-col
        v-for="c in bookedCards"
        :key="c.day_of_week + c.start_time + c.user_id"
        :span="8"
      >
        <el-card class="session-card" @mouseenter="hoveredCard = c.id">
          <h4>{{ c.day_of_week }}</h4>
          <p><strong>Время:</strong> {{ c.start_time }} - {{ c.end_time }}</p>
          <p><strong>Клиент:</strong> {{ c.user_id }}</p>

          <!-- Блок действий появляется только при наведении -->
          <div v-if="hoveredCard === c.id" class="actions">
            <el-button
              type="success"
              size="small"
              @click="openCompleteModal(c)"
            >
              Завершить
            </el-button>
            <el-button type="danger" size="small" @click="cancelSession(c)">
              Отменить
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Модальное окно для завершения сессии -->
    <el-dialog
      v-model="showCompleteModal"
      title="Завершить тренировку"
      width="500px"
    >
      <el-form :model="completeForm">
        <el-form-item label="Тип тренировки">
          <el-input v-model="completeForm.training_type" />
        </el-form-item>
        <el-form-item label="Комментарий">
          <el-input v-model="completeForm.comments" type="textarea" rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCompleteModal = false">Отмена</el-button>
        <el-button type="success" @click="completeSession">Завершить</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, ref } from "vue";
import { useTrainerWorkingHoursStore } from "@/store/useTrainerWorkingHoursStore";
import { useAuthStore } from "@/store/useAuthStore";
import { ElNotification } from "element-plus";
import api from "@/services/api";

export default defineComponent({
  name: "TrainerBookingsView",
  setup() {
    const authStore = useAuthStore();
    const workingHoursStore = useTrainerWorkingHoursStore();

    const user = authStore.user;

    const showCompleteModal = ref(false);
    const hoveredCard = ref<number | null>(null); // Для отслеживания наведённой карточки
    const completeForm = ref({
      training_type: "",
      comments: "",
      session_id: null,
    });

    onMounted(async () => {
      if (user?.role === "employee") {
        await workingHoursStore.getTrainerWorkingHours(user.id);
      }
    });

    const bookedCards = computed(() => {
      const cards: any[] = [];
      for (const wh of workingHoursStore.workingHours) {
        if (wh.sessions && Array.isArray(wh.sessions)) {
          const booked = wh.sessions.filter((s: any) => s.status === "booked");
          for (const s of booked) {
            cards.push({
              id: s.id, // ID сессии
              day_of_week: wh.day_of_week,
              start_time: wh.start_time,
              end_time: wh.end_time,
              user_id: s.user_id,
            });
          }
        }
      }
      return cards;
    });

    const openCompleteModal = (session: any) => {
      completeForm.value.session_id = session.id;
      showCompleteModal.value = true;
    };

    const completeSession = async () => {
      try {
        await api.put(
          `/training-sessions/${completeForm.value.session_id}/complete`,
          {
            training_type: completeForm.value.training_type,
            comments: completeForm.value.comments,
          }
        );
        ElNotification.success("Тренировка успешно завершена");
        showCompleteModal.value = false;
      } catch (error) {
        ElNotification.error("Ошибка при завершении тренировки");
      }
    };

    const cancelSession = async (session: any) => {
      try {
        await api.put(`/training-sessions/${session.id}/cancel`);
        ElNotification.success("Тренировка отменена");
      } catch (error) {
        ElNotification.error("Ошибка при отмене тренировки");
      }
    };

    return {
      bookedCards,
      hoveredCard,
      showCompleteModal,
      completeForm,
      openCompleteModal,
      completeSession,
      cancelSession,
    };
  },
});
</script>

<style scoped>
.employee-bookings-page {
  padding: 20px;
}

.session-card {
  text-align: left;
}

.session-card h4 {
  margin-bottom: 10px;
}

.employee-bookings-page {
  padding: 20px;
}

.session-card {
  text-align: left;
  position: relative;
  transition: box-shadow 0.3s;
}

.session-card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.actions {
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
  gap: 10px;
}
</style>
