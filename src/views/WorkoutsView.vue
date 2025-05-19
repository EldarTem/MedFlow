<template>
  <div class="workouts-view">
    <h2>Мои записи</h2>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="Предстоящие" name="upcoming">
        <el-table :data="upcomingSessions" style="width: 100%">
          <el-table-column prop="day_of_week" label="День недели" />
          <el-table-column prop="start_time" label="Начало" />
          <el-table-column prop="end_time" label="Конец" />
          <el-table-column prop="trainer_name" label="Тренер" />
        </el-table>
        <el-button
          type="success"
          size="large"
          class="enroll-button"
          @click="openEnrollModal"
        >
          Записаться на тренировку
        </el-button>
      </el-tab-pane>
      <el-tab-pane label="Прошедшие" name="completed">
        <el-table :data="completedSessions" style="width: 100%">
          <el-table-column prop="day_of_week" label="День недели" />
          <el-table-column prop="start_time" label="Начало" />
          <el-table-column prop="end_time" label="Конец" />
          <el-table-column prop="trainer_name" label="Тренер" />
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <div class="enroll-section">
      <el-dialog
        title="Записаться на тренировку"
        v-model="showEnrollModal"
        width="800px"
      >
        <div class="trainers-list" v-if="trainers.length">
          <h3>Выберите тренера</h3>
          <el-row :gutter="20">
            <el-col v-for="t in trainers" :key="t.user_id" :span="8">
              <el-card class="employee-card" @click="selectTrainer(t)">
                <div class="employee-photo-container">
                  <img
                    v-if="t.photo_url"
                    :src="t.photo_url"
                    alt="Фото тренера"
                    class="employee-photo"
                    @error="handleImageError(t)"
                  />
                  <template v-else>
                    <el-avatar
                      icon="UserFilled"
                      class="employee-avatar"
                    ></el-avatar>
                  </template>
                </div>
                <h4>{{ t.name }}</h4>
                <p>{{ t.specialization }}</p>
              </el-card>
            </el-col>
          </el-row>
        </div>

        <div v-if="enrollForm.trainer_id && availableSlots.length">
          <h3>Доступные тренировки</h3>
          <el-table :data="availableSlots" style="width: 100%">
            <el-table-column prop="day_of_week" label="День недели" />
            <el-table-column prop="start_time" label="Начало" />
            <el-table-column prop="end_time" label="Конец" />
            <el-table-column label="Действия">
              <template #default="scope">
                <el-button
                  type="success"
                  size="small"
                  @click="enroll(scope.row.id)"
                >
                  Записаться
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-else-if="enrollForm.trainer_id && !availableSlots.length">
          <p>У выбранного тренера нет доступных слотов.</p>
        </div>

        <template #footer>
          <el-button @click="showEnrollModal = false">Закрыть</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from "vue";
import { useTrainingSessionsStore } from "@/store/useTrainingSessionsStore";
import { useTrainerDetailsStore } from "@/store/useTrainerDetailsStore";
import { useTrainerWorkingHoursStore } from "@/store/useTrainerWorkingHoursStore";
import type { WorkingHour, TrainingSession, Trainer } from "@/types";
import { ElNotification } from "element-plus";
import { UserFilled } from "@element-plus/icons-vue";

interface EnrollForm {
  trainer_id: number | null;
}

export default defineComponent({
  name: "WorkoutsView",
  components: { UserFilled },
  setup() {
    const trainingSessionsStore = useTrainingSessionsStore();
    const trainerDetailsStore = useTrainerDetailsStore();
    const trainerWorkingHoursStore = useTrainerWorkingHoursStore();

    const activeTab = ref<"upcoming" | "completed">("upcoming");
    const showEnrollModal = ref(false);

    const enrollForm = ref<EnrollForm>({
      trainer_id: null,
    });

    const availableSlots = ref<WorkingHour[]>([]);

    const upcomingSessions = computed<TrainingSession[]>(
      () => trainingSessionsStore.upcomingSessions
    );
    const completedSessions = computed<TrainingSession[]>(
      () => trainingSessionsStore.completedSessions
    );
    const trainers = computed<Trainer[]>(() => trainerDetailsStore.trainers);

    onMounted(async () => {
      await trainingSessionsStore.fetchUserSessions();
      await trainerDetailsStore.fetchAllTrainers();
    });

    const openEnrollModal = () => {
      enrollForm.value.trainer_id = null;
      availableSlots.value = [];
      showEnrollModal.value = true;
    };

    const selectTrainer = async (employee: Trainer) => {
      enrollForm.value.trainer_id = employee.user_id;
      await fetchAvailableTimes();
    };

    const fetchAvailableTimes = async () => {
      if (typeof enrollForm.value.trainer_id === "number") {
        await trainerWorkingHoursStore.getTrainerWorkingHours(
          enrollForm.value.trainer_id
        );

        availableSlots.value = trainerWorkingHoursStore.workingHours.filter(
          (h) => h.status === "available"
        );
      } else {
        availableSlots.value = [];
      }
    };

    const enroll = async (working_hour_id: number) => {
      if (!working_hour_id) {
        ElNotification.error("Выберите время для тренировки");
        return;
      }
      await trainingSessionsStore.bookSession(working_hour_id);
      await trainingSessionsStore.fetchUserSessions();
      showEnrollModal.value = false;
    };

    const handleImageError = (employee: Trainer) => {
      employee.photo_url = "";
    };

    return {
      activeTab,
      upcomingSessions,
      completedSessions,
      showEnrollModal,
      enrollForm,
      trainers,
      availableSlots,
      enroll,
      handleImageError,
      openEnrollModal,
      selectTrainer,
    };
  },
});
</script>

<style scoped>
.workouts-view {
  padding: 20px;
}

.enroll-section {
  margin-top: 20px;
  text-align: center;
}

.enroll-button {
  font-size: 18px;
  padding: 10px 20px;
}

.trainers-list {
  margin-bottom: 20px;
}

.employee-card {
  cursor: pointer;
  text-align: center;
  padding: 10px;
}

.employee-photo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.employee-photo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.employee-avatar {
  width: 100px;
  height: 100px;
  font-size: 50px;
  background-color: #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
