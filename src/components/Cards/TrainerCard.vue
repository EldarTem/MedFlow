<!-- src/components/TrainerCard.vue -->
<template>
  <el-card
    class="employee-card"
    @mouseover="hovered = true"
    @mouseleave="hovered = false"
    shadow="hover"
  >
    <div class="employee-photo-container">
      <template v-if="employee.photo_url">
        <img
          :src="employee.photo_url"
          alt="Фото тренера"
          class="employee-photo"
          @error="employee.photo_url = ''"
        />
      </template>
      <template v-else>
        <el-avatar icon="UserFilled" class="employee-avatar"></el-avatar>
      </template>
    </div>
    <h3>{{ employee.name }}</h3>
    <p><strong>Email:</strong> {{ employee.email }}</p>
    <p><strong>Специализация:</strong> {{ employee.specialization }}</p>
    <p><strong>Опыт (лет):</strong> {{ employee.experience_years }}</p>
    <p><strong>Биография:</strong> {{ employee.bio }}</p>
    <p><strong>Сертификаты:</strong> {{ employee.certifications }}</p>

    <div class="overlay" v-if="hovered">
      <el-button @click="$emit('edit-employee', employee)"
        >Редактировать</el-button
      >

      <el-button @click="$emit('view-schedule', employee.user_id)"
        >График</el-button
      >
      <el-button
        type="danger"
        @click="$emit('delete-employee', employee.user_id)"
        >Удалить</el-button
      >
    </div>
  </el-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Trainer } from "@/types";
import { UserFilled } from "@element-plus/icons-vue";

export default defineComponent({
  name: "TrainerCard",
  components: { UserFilled },
  props: {
    employee: {
      type: Object as PropType<Trainer>,
      required: true,
    },
  },
  data() {
    return {
      hovered: false,
    };
  },
});
</script>

<style scoped>
.employee-card {
  position: relative;
  margin-bottom: 20px;
  transition: box-shadow 0.3s;
  cursor: pointer;
}

.employee-card:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.employee-photo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.employee-photo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.employee-avatar {
  width: 100px;
  height: 100px;
  font-size: 50px;
  background-color: #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay {
  display: flex;
  flex-direction: column;
  gap: 5px;
  position: absolute;
  top: 10px;
  right: 10px;
  background: #fff;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.overlay button {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}
</style>
