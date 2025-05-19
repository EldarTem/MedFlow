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
          size="small"
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
import { defineComponent, PropType } from "vue";

interface TimeSlot {
  id: number;
  employee_id: number;
  day_of_week: string;
  specific_date: string | null;
  start_time: string;
  end_time: string;
}

export default defineComponent({
  name: "DayTimeBlock",
  props: {
    day: {
      type: String as PropType<string>,
      required: true,
      validator: (value: string) =>
        [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
          "понедельник",
          "вторник",
          "среда",
          "четверг",
          "пятница",
          "суббота",
          "воскресенье",
          "пн",
          "вт",
          "ср",
          "чт",
          "пт",
          "сб",
          "вс",
        ].some((day) => value.toLowerCase().includes(day.toLowerCase())),
    },
    slots: {
      type: Array as PropType<TimeSlot[]>,
      default: () => [],
    },
  },
  methods: {
    normalizeDayName(day: string): string | null {
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
      for (const [key, value] of Object.entries(dayMap)) {
        if (lowerDay.includes(key)) return value;
      }
      return null;
    },
    getNextDayOfWeek(fromDate: Date, dayOfWeek: string): Date {
      const dayIndexMap: Record<string, number> = {
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
      const targetDay = dayIndexMap[dayOfWeek];

      let diff = targetDay - currentDay;
      if (diff <= 0) diff += 7;

      resultDate.setDate(fromDate.getDate() + diff);
      return resultDate;
    },
    getShortDayName(day: string): string {
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
    },
    // Метод для форматирования времени (убираем секунды)
    formatTime(time: string): string {
      if (!time) return ""; // Если времени нет, возвращаем пустую строку
      const [hours, minutes] = time.split(":");
      return `${hours}:${minutes}`;
    },
  },
  computed: {
    formattedDate(): string {
      const normalizedDay = this.normalizeDayName(this.day);
      if (!normalizedDay) return "Неверный день недели";

      const today = new Date();
      const nextDate = this.getNextDayOfWeek(today, normalizedDay);

      try {
        const dateStr = nextDate.toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "long",
        });

        const shortDayName = this.getShortDayName(normalizedDay);
        return `${dateStr} (${shortDayName})`;
      } catch (e) {
        console.error("Ошибка форматирования даты:", e);
        return "Некорректная дата";
      }
    },
    formattedSlots(): TimeSlot[] {
      return this.slots.filter((slot: TimeSlot) => slot.start_time);
    },
    hasTimeSlots(): boolean {
      return this.formattedSlots.length > 0;
    },
  },
});
</script>

<style scoped>
.day-time-block {
  margin-bottom: 20px;
}

.time-slot {
  margin-right: 10px;
}
</style>
