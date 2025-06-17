```vue
<template>
  <div class="page">
    <div
      v-if="workingHoursStore.isLoading || sessionStore.isLoading"
      class="loading"
    >
      Загрузка...
    </div>
    <div v-else>
      <div class="title">
        Добро пожаловать, <span>{{ userName }}</span
        >!
      </div>
      <div class="schedule-section">
        <h2>Ваш график</h2>
        <el-empty
          v-if="!groupedWorkingHours.length"
          description="График пуст"
        />
        <div
          v-else
          v-for="(workingHour, index) in groupedWorkingHours"
          :key="index"
        >
          <DayTimeBlock
            :day="workingHour.day"
            :date="workingHour.date"
            :slots="workingHour.slots"
            @edit="editDay(workingHour)"
            @delete="deleteSlot(workingHour.slots[0]?.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { useWorkingHoursStore } from "@/store/useWorkingHoursStore";
import { useSessionStore } from "@/store/useSessionStore";
import { useAuthStore } from "@/store/useAuthStore";
import { notifySuccess } from "@/utils/notify";
import DayTimeBlock from "@/components/DayTimeBlockEmp.vue";

interface TimeSlot {
  id: number;
  start_time: string;
  end_time: string;
  status?: "booked" | "canceled" | "completed";
  direction_name?: string;
}

interface GroupedWorkingHour {
  day: string;
  date: string;
  slots: TimeSlot[];
}

export default defineComponent({
  name: "EmployeeScheduleView",
  components: { DayTimeBlock },
  setup() {
    const workingHoursStore = useWorkingHoursStore();
    const sessionStore = useSessionStore();
    const authStore = useAuthStore();

    const dayMapping: Record<string, string> = {
      Monday: "ПН",
      Tuesday: "ВТ",
      Wednesday: "СР",
      Thursday: "ЧТ",
      Friday: "ПТ",
      Saturday: "СБ",
      Sunday: "ВС",
    };

    // Load user name and data
    const userName = ref("Пользователь");
    onMounted(async () => {
      const stored = localStorage.getItem("userData");
      if (stored) {
        try {
          const userData = JSON.parse(stored);
          userName.value = userData.name || "Пользователь";
        } catch {
          userName.value = "Пользователь";
        }
      }

      // Load working hours and sessions
      await fetchWorkingHours();
      await sessionStore.fetchSessions(); // Получаем полный список сессий
    });

    // Fetch working hours
    const fetchWorkingHours = async () => {
      console.log("Fetching working hours for employee:", authStore.user?.id);
      await workingHoursStore.fetchWorkingHours();
      console.log("Fetched workingHours:", workingHoursStore.workingHours);
    };

    // Computed property to combine working hours with session status
    const groupedWorkingHours = computed((): GroupedWorkingHour[] => {
      const hours = workingHoursStore.workingHours
        .filter((hour) => hour.employee_id === authStore.user?.id)
        .map((hour) => ({
          ...hour,
          day_of_week: hour.day_of_week
            ? dayMapping[hour.day_of_week] || hour.day_of_week
            : "",
          specific_date: hour.specific_date
            ? new Date(hour.specific_date).toISOString().split("T")[0]
            : "",
        }));

      // Фильтруем сессии по doctor.id на фронте
      const sessions = (sessionStore.sessions || []).filter(
        (session) => session.doctor.id === authStore.user?.id
      );

      const grouped: Record<string, GroupedWorkingHour> = {};

      hours.forEach((hour) => {
        const key = hour.specific_date || hour.day_of_week || "unknown";
        if (!grouped[key]) {
          grouped[key] = {
            day: hour.day_of_week || "",
            date: hour.specific_date || "",
            slots: [],
          };
        }

        // Find matching session by date, start_time, and end_time
        const matchingSession = sessions.find(
          (session) =>
            session.specific_date.split("T")[0] === hour.specific_date &&
            session.start_time === hour.start_time &&
            session.end_time === hour.end_time
        );

        const slot: TimeSlot = {
          id: hour.id,
          start_time: hour.start_time.slice(0, 5),
          end_time: hour.end_time.slice(0, 5),
          status: matchingSession ? matchingSession.status : undefined,
          direction_name: matchingSession
            ? matchingSession.direction_name
            : undefined,
        };
        grouped[key].slots.push(slot);
      });

      const result = Object.values(grouped).sort((a, b) => {
        const dateA = a.date || a.day;
        const dateB = b.date || b.day;
        return dateA.localeCompare(dateB);
      });

      console.log("Grouped working hours:", result);
      return result;
    });

    const editDay = (workingHour: GroupedWorkingHour) => {
      console.log("Редактирование рабочего часа:", workingHour);
      // Добавить логику для редактирования, если потребуется
    };

    const deleteSlot = async (slotId: number) => {
      if (slotId) {
        await workingHoursStore.removeWorkingHour(slotId);
        await fetchWorkingHours();
        notifySuccess("Слот удален");
      }
    };

    return {
      workingHoursStore,
      sessionStore,
      userName,
      groupedWorkingHours,
      editDay,
      deleteSlot,
    };
  },
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

.schedule-section {
  margin-top: 20px;
}

.schedule-section h2 {
  font-size: 24px;
  margin-bottom: 16px;
}
</style>
```
