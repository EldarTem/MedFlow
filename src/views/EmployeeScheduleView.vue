<template>
  <div class="page">
    <div class="title">Ваш график</div>
    <div class="subtitle">Создайте рабочие часы.</div>

    <el-empty v-if="!groupedWorkingHours.length" description="График пуст">
    </el-empty>

    <div v-for="(workingHour, index) in groupedWorkingHours" :key="index">
      <DayTimeBlock
        :day="workingHour.day"
        :date="workingHour.date"
        :slots="workingHour.slots"
        @edit="editDay(workingHour.day)"
      />
    </div>

    <el-button type="primary" icon="el-icon-plus" @click="openForm">
      Добавить рабочее время
    </el-button>

    <WorkingHourModal
      :visible="showForm"
      :working-hour="currentHour"
      :days-of-week="daysOfWeek"
      @save="saveHour"
      @update:visible="showForm = $event"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, onMounted } from "vue";
import { useTrainerScheduleStore } from "@/store/useTrainerScheduleStore";
import { useAuthStore } from "@/store/useAuthStore";
import WorkingHourModal from "@/components/Modals/WorkingHourModal.vue";
import DayTimeBlock from "@/components/DayTimeBlock.vue";

export default defineComponent({
  name: "EmployeeScheduleView",
  components: { WorkingHourModal, DayTimeBlock },
  setup() {
    const scheduleStore = useTrainerScheduleStore();
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

    const reverseDayMapping: Record<string, string> = {
      ПН: "Monday",
      ВТ: "Tuesday",
      СР: "Wednesday",
      ЧТ: "Thursday",
      ПТ: "Friday",
      СБ: "Saturday",
      ВС: "Sunday",
    };

    const rawWorkingHours = computed(() => scheduleStore.workingHours);

    const workingHours = computed(() => {
      return rawWorkingHours.value.map((hour) => ({
        ...hour,
        day_of_week: dayMapping[hour.day_of_week] || hour.day_of_week,
      }));
    });

    const groupedWorkingHours = computed(() => {
      const grouped: Record<string, any> = {};

      workingHours.value.forEach((hour) => {
        if (!grouped[hour.day_of_week]) {
          grouped[hour.day_of_week] = {
            day: hour.day_of_week,
            date: "", 
            slots: [],
          };
        }

        const slot = {
          start_time: hour.start_time,
        };
        grouped[hour.day_of_week].slots.push(slot);
      });

      return Object.values(grouped);
    });

    const showForm = ref(false);
    const currentHour = reactive({
      trainer_id: authStore.user?.id || 0,
      day_of_week: "",
      start_time: "",
      end_time: "",
    });
    const daysOfWeek = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];

    const fetchWorkingHours = async () => {
      await scheduleStore.fetchWorkingHours();
    };

    const openForm = () => {
      currentHour.day_of_week = "";
      currentHour.start_time = "";
      currentHour.end_time = "";
      showForm.value = true;
    };

    const editHour = (hour: any) => {
      Object.assign(currentHour, {
        ...hour,
        day_of_week: dayMapping[hour.day_of_week] || hour.day_of_week,
      });
      showForm.value = true;
    };

    const editDay = (day: string) => {
      const hourToEdit = workingHours.value.find((h) => h.day_of_week === day);
      if (hourToEdit) {
        editHour(hourToEdit);
      }
    };

    const saveHour = async (updatedHour: any) => {
      const payload = {
        ...updatedHour,
        day_of_week:
          reverseDayMapping[updatedHour.day_of_week] || updatedHour.day_of_week,
      };

      if (updatedHour.id) {
        await scheduleStore.updateWorkingHour(payload);
      } else {
        await scheduleStore.addWorkingHour(payload);
      }
      showForm.value = false;
      await fetchWorkingHours();
    };

    onMounted(() => {
      fetchWorkingHours();
    });

    return {
      rawWorkingHours,
      workingHours,
      groupedWorkingHours,
      showForm,
      currentHour,
      daysOfWeek,
      openForm,
      editHour,
      editDay,
      saveHour,
    };
  },
});
</script>
