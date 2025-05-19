<!-- src/components/EditUserProfileModal.vue -->
<template>
  <el-dialog v-model="visible" title="Редактировать профиль пользователя">
    <el-form :model="editForm">
      <el-form-item label="Имя">
        <el-input v-model="editForm.name" />
      </el-form-item>
      <el-form-item label="Email">
        <el-input v-model="editForm.email" />
      </el-form-item>
      <el-form-item label="Телефон">
        <el-input
          v-model="editForm.phone"
          @input="editForm.phone = formatPhone(editForm.phone || '')"
        />
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
import { User } from "@/types";
import { ElNotification } from "element-plus";

function formatPhone(value: string): string {
  let digits = value.replace(/\D/g, "");
  if (!digits.startsWith("7")) {
    digits = "7" + digits;
  }
  let formatted = "+7";
  if (digits.length > 1) {
    formatted += " (" + digits.substring(1, 4);
  }
  if (digits.length >= 5) {
    formatted += ") " + digits.substring(4, 7);
  }
  if (digits.length >= 8) {
    formatted += "-" + digits.substring(7, 9);
  }
  if (digits.length >= 10) {
    formatted += "-" + digits.substring(9, 11);
  }
  return formatted;
}

export default defineComponent({
  name: "EditUserProfileModal",
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    user: {
      type: Object as PropType<Partial<User>>,
      default: () => ({}),
    },
  },
  data() {
    return {
      editForm: {
        name: "",
        email: "",
        phone: "",
      },
    };
  },
  watch: {
    user: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.editForm.name = newVal.name || "";
          this.editForm.email = newVal.email || "";
          this.editForm.phone = newVal.phone || "";
        }
      },
    },
  },
  methods: {
    formatPhone,
    submit() {
      if (!this.isValidEmail(this.editForm.email)) {
        ElNotification.error("Некорректный email");
        return;
      }
      this.$emit("submit", { ...this.editForm });
    },
    isValidEmail(email: string): boolean {
      const re = /\S+@\S+\.\S+/;
      return re.test(email);
    },
  },
});
</script>
