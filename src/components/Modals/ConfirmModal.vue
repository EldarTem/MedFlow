<template>
  <el-dialog
    :model-value="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    width="400px"
    :before-close="onClose"
    center
  >
    <div style="text-align: center">
      <slot name="message">
        <p class="message-p">{{ message }}</p>
      </slot>
    </div>
    <template #footer>
      <el-button @click="onClose" :disabled="loading">Отмена</el-button>
      <el-button type="danger" @click="onConfirm" :loading="loading"
        >Да</el-button
      >
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const { modelValue, message, loading } = defineProps<{
  modelValue: boolean;
  message?: string;
  loading?: boolean;
}>();

const emit = defineEmits(["update:modelValue", "confirm"]);

function onClose() {
  emit("update:modelValue", false);
}
function onConfirm() {
  emit("confirm");
}
</script>
<style scoped>
.message-p {
  color: #4d4e4f;
  font-size: 16px;
  font-weight: 500;
}
</style>
