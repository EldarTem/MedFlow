<template>
  <el-form :model="form" label-width="120px">
    <el-form-item label="Имя" required>
      <el-input v-model="form.name" @input="update" />
    </el-form-item>
    <el-form-item label="Email" required>
      <el-input v-model="form.email" @input="update" />
    </el-form-item>
    <el-form-item label="Телефон">
      <el-input v-model="form.phone" @input="onPhoneInput" />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";
import { formatPhone } from "@/utils/validation";
import type { User } from "@/types";

// объявляем пропсы и эмит
const props = defineProps<{ modelValue: Partial<User> }>();
const emit = defineEmits<{
  (e: "update:modelValue", payload: Partial<User>): void;
}>();

// локальный реактивный объект формы
const form = reactive<Partial<User>>({ ...props.modelValue });

// синхронизация, если внешний modelValue изменился
watch(
  () => props.modelValue,
  (nv) => Object.assign(form, nv)
);

// Emit при любом input в полях name/email
function update() {
  // отправляем копию, чтобы не сломать реактивность родителя
  emit("update:modelValue", { ...form });
}

// Специально для телефона: форматируем и затем эмитим
function onPhoneInput(val: string) {
  form.phone = formatPhone(val);
  update();
}
</script>
