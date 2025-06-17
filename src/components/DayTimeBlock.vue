<template>
  <div class="day-time-block">
    <h3>{{ formattedDate }}</h3>
    <div class="time-slots">
      <template v-if="hasTimeSlots">
        <el-button
          v-for="(slot, index) in formattedSlots"
          :key="index"
          class="time-slot"
          type="primary"
          size="large"
          @click="$emit('edit', { slot })"
        >
          {{ formatTime(slot.start_time) }}
        </el-button>
      </template>
      <div v-else class="no-slots">
        <span class="dash">Время не указано</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from "vue";

interface TimeSlot {
  id: number;
  start_time: string;
  end_time: string;
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
      console.log("DayTimeBlock props:", {
        day: props.day,
        date: props.date,
        slots: props.slots,
      });
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

    return {
      normalizeDayName,
      getNextDayOfWeek,
      getShortDayName,
      formatTime,
      getWeekDay,
      formattedDate,
      formattedSlots,
      hasTimeSlots,
    };
  },
  emits: ["edit", "delete"],
});
</script>

<style scoped>
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
  background-color: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  border-color: #fff;
}
</style>
