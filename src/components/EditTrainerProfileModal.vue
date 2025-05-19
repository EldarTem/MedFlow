<!-- src/components/EditTrainerProfileModal.vue -->
<template>
  <el-dialog v-model="visible" title="Редактировать данные тренера">
    <el-form :model="editForm">
      <el-form-item label="Специализация">
        <el-input v-model="editForm.specialization" />
      </el-form-item>
      <el-form-item label="Опыт (лет)">
        <el-input type="number" v-model="editForm.experience_years" />
      </el-form-item>
      <el-form-item label="Биография">
        <el-input v-model="editForm.bio" type="textarea" />
      </el-form-item>
      <el-form-item label="Сертификаты">
        <el-input v-model="editForm.certifications" />
      </el-form-item>
      <el-form-item label="Фото URL">
        <el-input v-model="editForm.photo_url" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="$emit('close')">Отмена</el-button>
      <el-button type="primary" @click="submit">Сохранить</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Trainer } from "@/types";

export default defineComponent({
  name: "EditTrainerProfileModal",
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    trainerDetails: {
      type: Object as PropType<Partial<Trainer>>,
      default: () => ({}),
    },
  },
  data() {
    return {
      editForm: {
        specialization: "",
        experience_years: 0,
        bio: "",
        certifications: "",
        photo_url: "",
      },
    };
  },
  watch: {
    trainerDetails: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.editForm.specialization = newVal.specialization || "";
          this.editForm.experience_years = newVal.experience_years || 0;
          this.editForm.bio = newVal.bio || "";
          this.editForm.certifications = newVal.certifications || "";
          this.editForm.photo_url = newVal.photo_url || "";
        }
      },
    },
  },
  methods: {
    submit() {
      this.$emit("submit", { ...this.editForm });
    },
  },
});
</script>
