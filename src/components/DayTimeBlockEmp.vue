<template>
  <div class="day-time-block">
    <h3>{{ formattedDate }}</h3>
    <div class="time-slots">
      <template v-if="hasTimeSlots">
        <el-button
          v-for="(slot, index) in formattedSlots"
          :key="index"
          class="time-slot"
          :class="getButtonClass(slot.status)"
          size="large"
          @click="openModal(slot)"
        >
          {{ formatTime(slot.start_time) }}
        </el-button>
      </template>
      <div v-else class="no-slots">
        <span class="dash">Время не указано</span>
      </div>
    </div>

    <!-- Modal -->
    <el-dialog
      v-model="showModal"
      width="800px"
      :before-close="handleClose"
      style="
        background: #fff;
        border-radius: 18px;
        box-shadow: 0 2px 20px 0 rgba(39, 45, 51, 0.15);
      "
    >
      <div class="custom-dialog" style="padding: 16px">
        <div class="billet-card" shadow="hover">
          <div class="billet-header">
            <img
              alt="Icon"
              class="billet-icon"
              src="/src/assets/icons/people_icon.svg"
            />
            <h3 class="billet-title">Андрей Антонов</h3>
          </div>
        </div>
        <div class="record-header">
          <h3 class="billet-title">Общий терапевтический осмотр</h3>
          <h3 class="billet-title">18 июня 2025 19:00</h3>
        </div>

        <div class="record-details">
          <div class="detail-row">
            <span class="label">Клиент:</span>
            <span class="value">Андрей Антонов</span>
          </div>
          <div class="detail-row">
            <span class="label">Адрес:</span>
            <span class="value">г. Москва, ул. Ворошилова, д.25</span>
          </div>
          <div class="detail-row">
            <span class="label">Дата рождения:</span>
            <span class="value">24 апреля 2001</span>
          </div>
          <div class="detail-row">
            <span class="label">Номер телефона:</span>
            <span class="value">+7 (978) 897 50-92</span>
          </div>
          <div class="detail-row">
            <span class="label">Электронная почта:</span>
            <span class="value">patient1@example.com</span>
          </div>
        </div>
        <div class="record-footer">
          <el-button class="cancel-button" type="danger" plain>
            Отменить
          </el-button>
          <el-button class="rebook-button" type="primary"> Назад </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref } from "vue";

interface TimeSlot {
  id: number;
  start_time: string;
  end_time: string;
  status?: "booked" | "canceled" | "completed";
  direction_name?: string;
}

export default defineComponent({
  name: "DayTimeBlock",
  props: {
    day: {
      type: String as PropType<string>,
      default: "",
    },
    date: {
      type: String as PropType<string>,
      default: "",
    },
    slots: {
      type: Array as PropType<TimeSlot[]>,
      default: () => [],
    },
  },
  setup(props) {
    const showModal = ref(false);
    const selectedSlot = ref<TimeSlot | null>(null);

    const openModal = (slot: TimeSlot) => {
      selectedSlot.value = slot;
      showModal.value = true;
    };

    const handleClose = () => {
      showModal.value = false;
      selectedSlot.value = null;
    };

    // Existing logic...
    const normalizeDayName = (day: string): string | null => {
      const dayMap: Record<string, string> = {
        monday: "Monday",
        tuesday: "Tuesday",
        wednesday: "Wednesday",
        thursday: "Thursday",
        friday: "Friday",
        saturday: "Saturday",
        sunday: "Sunday",
        понедельник: "Monday",
        вторник: "Tuesday",
        среда: "Wednesday",
        четверг: "Thursday",
        пятница: "Friday",
        суббота: "Saturday",
        воскресенье: "Sunday",
        пн: "Monday",
        вт: "Tuesday",
        ср: "Wednesday",
        чт: "Thursday",
        пт: "Friday",
        сб: "Saturday",
        вс: "Sunday",
      };
      const lowerDay = day.toLowerCase();
      return dayMap[lowerDay] || null;
    };

    const getNextDayOfWeek = (fromDate: Date, dayOfWeek: string): Date => {
      const dayNumbers: Record<string, number> = {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
      };
      const resultDate = new Date(fromDate);
      const currentDay = fromDate.getDay();
      const targetDay = dayNumbers[dayOfWeek] ?? 0;
      let diff = targetDay - currentDay;
      if (diff <= 0) diff += 7;
      resultDate.setDate(fromDate.getDate() + diff);
      return resultDate;
    };

    const getShortDayName = (day: string): string => {
      const shortNames: Record<string, string> = {
        Monday: "пн",
        Tuesday: "вт",
        Wednesday: "ср",
        Thursday: "чт",
        Friday: "пт",
        Saturday: "сб",
        Sunday: "вс",
      };
      return shortNames[day] || day;
    };

    const formatTime = (time: string): string => {
      if (!time) return "";
      const [hours, minutes] = time.split(":");
      return `${hours}:${minutes}`;
    };

    const getWeekDay = (date: Date): string => {
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      return days[date.getDay()];
    };

    const formattedDate = computed((): string => {
      if (props.date) {
        try {
          const date = new Date(props.date);
          const dateStr = date.toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
          });
          const dayName = getShortDayName(props.day || getWeekDay(date));
          return `${dateStr} (${dayName})`;
        } catch (e) {
          console.error("Ошибка форматирования даты:", e);
          return "Некорректная дата";
        }
      }
      const normalizedDay = normalizeDayName(props.day);
      if (!normalizedDay) return props.day || "Unknown";
      const today = new Date();
      const nextDate = getNextDayOfWeek(today, normalizedDay);
      try {
        const dateStr = nextDate.toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "long",
        });
        const shortDayName = getShortDayName(normalizedDay);
        return `${dateStr} (${shortDayName})`;
      } catch (e) {
        console.error("Ошибка форматирования даты:", e);
        return "Некорректная дата";
      }
    });

    const formattedSlots = computed((): TimeSlot[] => {
      return props.slots
        .filter((slot: TimeSlot) => slot.start_time && slot.end_time)
        .sort((a, b) => a.start_time.localeCompare(b.start_time));
    });

    const hasTimeSlots = computed((): boolean => {
      return formattedSlots.value.length > 0;
    });

    const getButtonClass = (status?: string): string => {
      if (status === "canceled") return "status-canceled";
      if (status === "booked") return "status-booked";
      if (status === "completed") return "status-completed";
      return "";
    };

    const formatSlotLabel = (slot: TimeSlot): string => {
      if (slot.status === "booked" && slot.direction_name) {
        return slot.direction_name;
      } else if (slot.status === "canceled" && slot.direction_name) {
        return `${slot.direction_name} (Отменено)`;
      }
      return "Свободно";
    };

    return {
      normalizeDayName,
      getNextDayOfWeek,
      getShortDayName,
      formatTime,
      getWeekDay,
      formattedDate,
      formattedSlots,
      hasTimeSlots,
      getButtonClass,
      formatSlotLabel,
      showModal,
      selectedSlot,
      openModal,
      handleClose,
    };
  },
  emits: ["edit", "delete"],
});
</script>

<style scoped>
.billet-card {
  margin-bottom: 24px;
  border-radius: 10px;
  padding: 12px 37px;
  max-width: 850px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid transparent;
  transition: border 0.3s, box-shadow 0.3s;
}

.billet-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.billet-icon {
  width: 21px;
  height: 24px;
}

.billet-title {
  font-size: 20px;
  font-weight: 500;
  margin: 0;
}
.billet-card:hover {
  cursor: pointer;
  border: 1px solid rgba(255, 82, 39, 0.32);
  box-shadow: 0px 4px 20px rgba(255, 82, 39, 0.29);
}
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
  border: none;
}
.status-tag.скоро {
  background-color: #f9aa8b;
}
.status-tag.ожидает-подтверждения {
  background-color: #f9d86b;
}
.status-tag.в-процессе {
  background-color: #6bb7f9;
}
.status-tag.подтверждена {
  background-color: #96ba86;
}
.status-tag.завершена {
  background-color: #8ba2f9;
}
.status-tag.отменена {
  background-color: #919191;
}
.status-tag.пропущена {
  background-color: #919191;
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
.cancel-button {
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
.day-time-block {
  margin-bottom: 20px;
}

.time-slots {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.time-slot {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 20px;
  padding: 18px 34px;
  color: #4d4e4f;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
}

.status-booked {
  background-color: #e3f9de !important;
  border-color: #e3f9de !important;
}

.status-canceled {
  background-color: #fee2e2 !important;
  border-color: #fee2e2 !important;
}
</style>
