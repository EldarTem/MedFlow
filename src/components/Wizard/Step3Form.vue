<template>
  <div class="step">
    <el-form label-position="top">
      <el-form-item label="Пользователь">
        <el-select
          v-model="form.selectedUserId"
          placeholder="Выберите пользователя"
        >
          <el-option
            v-for="user in users"
            :key="user.id"
            :label="user.name"
            :value="user.id"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <ul class="options-list" v-if="users.length">
      <li
        v-for="user in users"
        :key="user.id"
        :class="['option-item', { selected: form.selectedUserId === user.id }]"
        @click="selectUser(user.id)"
      >
        <i class="el-icon-user"></i>
        {{ user.name }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import { useAdminStore } from "@/store/useAdminStore";

interface WizardForm {
  selectedUserId?: number;
}

const props = defineProps<{ modelValue: WizardForm }>();
const emit = defineEmits<{
  (e: "update:modelValue", value: WizardForm): void;
}>();

const form = ref<WizardForm>({ ...props.modelValue });
const adminStore = useAdminStore();

// Получаем всех пользователей при монтировании компонента
onMounted(() => {
  adminStore.fetchAllUsers();
});

// Подписка на изменения модели
watch(
  () => props.modelValue.selectedUserId,
  (v) => {
    form.value.selectedUserId = v;
  }
);

// Выбор пользователя
function selectUser(userId: number) {
  form.value.selectedUserId = userId;
  emit("update:modelValue", { ...form.value }); // Обновление модели на каждом шаге
}

// Список пользователей из store
const users = computed(() => adminStore.users);
</script>

<style scoped>
.options-list {
  list-style: none;
  padding: 0;
}
.option-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}
.option-item i {
  margin-right: 8px;
  color: #409eff;
}
.option-item.selected {
  border-color: #409eff;
  background: rgba(64, 158, 255, 0.1);
}
</style>
