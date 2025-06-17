<template>
  <div class="page">
    <div class="profile-header">
      <div>
        <div class="title">Ваш график</div>
        <div class="subtitle">Создайте рабочие часы.</div>
      </div>
      <div class="profile-actions">
        <el-button
          type="primary"
          size="large"
          class="btn-save"
          @click="openForm"
        >
          Создать
        </el-button>
      </div>
    </div>
    <div v-if="workingHoursStore.isLoading">Загрузка...</div>
    <el-empty
      v-else-if="!groupedWorkingHours.length"
      description="График пуст"
    />
    <div v-for="(workingHour, index) in groupedWorkingHours" :key="index">
      <DayTimeBlock
        :day="workingHour.day"
        :date="workingHour.date"
        :slots="workingHour.slots"
        @edit="editDay(workingHour)"
        @delete="deleteSlot"
      />
    </div>
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
import { useWorkingHoursStore } from "@/store/useWorkingHoursStore";
import { useAuthStore } from "@/store/useAuthStore";
import { notifySuccess } from "@/utils/notify";
import WorkingHourModal from "@/components/Modals/WorkingHourModal.vue";
import DayTimeBlock from "@/components/DayTimeBlock.vue";

interface TimeSlot {
  id: number;
  start_time: string;
  end_time: string;
}

interface GroupedWorkingHour {
  day: string;
  date: string;
  slots: TimeSlot[];
}

export default defineComponent({
  name: "EmployeeScheduleView",
  components: { WorkingHourModal, DayTimeBlock },
  setup() {
    const workingHoursStore = useWorkingHoursStore();
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

    const workingHours = computed(() => {
      console.log("Raw workingHours:", workingHoursStore.workingHours);
      console.log("Current user ID:", authStore.user?.id);
      const hours = workingHoursStore.workingHours || [];
      return hours
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
    });

    const groupedWorkingHours = computed((): GroupedWorkingHour[] => {
      console.log("workingHours.value:", workingHours.value);
      const grouped: Record<string, GroupedWorkingHour> = {};

      workingHours.value.forEach((hour) => {
        const key = hour.specific_date || hour.day_of_week || "unknown";
        console.log("Grouping by key:", key, "Hour:", hour);
        if (!grouped[key]) {
          grouped[key] = {
            day: hour.day_of_week || "",
            date: hour.specific_date || "",
            slots: [],
          };
        }
        const slot: TimeSlot = {
          id: hour.id,
          start_time: hour.start_time.slice(0, 5),
          end_time: hour.end_time.slice(0, 5),
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

    const showForm = ref(false);
    const currentHour = reactive({
      id: 0,
      employee_id: authStore.user?.id || 0,
      day_of_week: "",
      specific_date: "",
      start_time: "",
      end_time: "",
    });
    const daysOfWeek = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];

    const fetchWorkingHours = async () => {
      console.log("Fetching working hours for employee:", authStore.user?.id);
      await workingHoursStore.fetchWorkingHours();
      console.log("Fetched workingHours:", workingHoursStore.workingHours);
    };

    const openForm = () => {
      currentHour.id = 0;
      currentHour.day_of_week = "";
      currentHour.specific_date = "";
      currentHour.start_time = "";
      currentHour.end_time = "";
      showForm.value = true;
    };

    const editDay = (workingHour: GroupedWorkingHour) => {
      const hourToEdit = workingHours.value.find(
        (h) =>
          h.specific_date === workingHour.date &&
          h.start_time === workingHour.slots[0]?.start_time
      );
      if (hourToEdit) {
        Object.assign(currentHour, {
          id: hourToEdit.id,
          employee_id: hourToEdit.employee_id,
          day_of_week: hourToEdit.day_of_week || "",
          specific_date: hourToEdit.specific_date || "",
          start_time: hourToEdit.start_time.slice(0, 5),
          end_time: hourToEdit.end_time.slice(0, 5),
        });
        showForm.value = true;
      }
    };

    const deleteSlot = async (slotId: number) => {
      await workingHoursStore.removeWorkingHour(slotId);
      await fetchWorkingHours();
    };

    const saveHour = async (updatedHour: any) => {
      const payload: any = {
        id: updatedHour.id,
        employee_id: authStore.user?.id || updatedHour.employee_id,
        specific_date: updatedHour.date || null,
        start_time: updatedHour.start_time,
        end_time: updatedHour.end_time,
      };

      if (
        updatedHour.day_of_week &&
        typeof updatedHour.day_of_week === "string"
      ) {
        payload.day_of_week =
          reverseDayMapping[updatedHour.day_of_week] || updatedHour.day_of_week;
      }

      console.log("Saving payload:", payload);
      await workingHoursStore.createWorkingHour(payload);
      showForm.value = false;
      await fetchWorkingHours();
      notifySuccess("Рабочее время успешно сохранено");
    };

    onMounted(() => {
      fetchWorkingHours();
    });

    return {
      workingHours,
      groupedWorkingHours,
      showForm,
      currentHour,
      daysOfWeek,
      openForm,
      editDay,
      deleteSlot,
      saveHour,
      workingHoursStore,
    };
  },
});
</script>

<style scoped>
.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}
.profile-actions {
  display: flex;
  gap: 12px;
}
.btn-save {
  background: #ff5227;
  color: #fff;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  padding: 10px 26px;
  font-size: 16px;
}
</style>
