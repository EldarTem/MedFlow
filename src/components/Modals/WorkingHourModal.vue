<template>
  <el-dialog
    :model-value="visible"
    width="400px"
    @close="handleClose"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <el-form :model="form" label-position="top">
      <el-form-item label="День недели">
        <el-select v-model="form.day_of_week" placeholder="Выберите день">
          <el-option
            v-for="(day, index) in daysOfWeek"
            :key="index"
            :label="day"
            :value="day"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Время начала">
        <el-time-picker
          v-model="form.start_time"
          format="HH:mm"
          value-format="HH:mm"
          placeholder="Выберите время"
        />
      </el-form-item>
      <el-form-item label="Время окончания">
        <el-time-picker
          v-model="form.end_time"
          format="HH:mm"
          value-format="HH:mm"
          placeholder="Выберите время"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">Отменить</el-button>
      <el-button type="primary" @click="saveHour">Сохранить</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
export default {
  props: {
    visible: Boolean,
    workingHour: Object,
    daysOfWeek: Array,
  },
  emits: ["update:model-value", "save"],
  data() {
    return {
      form: {
        day_of_week: "",
        start_time: "",
        end_time: "",
      },
    };
  },
  methods: {
    saveHour() {
      const payload = {
        ...this.form,
        day_of_week: this.mapDayOfWeek(this.form.day_of_week),
        start_time: this.formatTime(this.form.start_time),
        end_time: this.formatTime(this.form.end_time),
      };

      console.log("Saving hour...", payload);
      this.$emit("save", payload);
    },

    mapDayOfWeek(day: string): string {
      const mapping: Record<string, string> = {
        ПН: "Monday",
        ВТ: "Tuesday",
        СР: "Wednesday",
        ЧТ: "Thursday",
        ПТ: "Friday",
        СБ: "Saturday",
        ВС: "Sunday",
      };
      return mapping[day] || day;
    },

    formatTime(time: Date | string): string {
      if (!time) return "";
      let date: Date;

      if (time instanceof Date) {
        date = time;
      } else if (typeof time === "string" && time.includes("T")) {
        date = new Date(time);
      } else {
        return time; 
      }

      return `${String(date.getHours()).padStart(2, "0")}:${String(
        date.getMinutes()
      ).padStart(2, "0")}`;
    },

    handleClose() {
      this.$emit("update:model-value", false); 
    },
  },
};
</script>

<style scoped>
.el-button {
  margin-right: 10px;
}
</style>
