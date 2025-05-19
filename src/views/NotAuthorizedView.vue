<template>
  <div class="not-authorized-page">
    <h2>Нет доступа</h2>
    <p>У вас недостаточно прав для просмотра этой страницы.</p>
    <div class="authorized-button">
      <el-button type="primary" @click="goBack">Вернуться назад</el-button>
      <el-button @click="goHome">На главную</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "NotAuthorizedView",
  setup() {
    const router = useRouter();

    const goBack = () => {
      router.back();
    };

    const goHome = () => {
      router.push("");
    };

    return {
      goBack,
      goHome,
    };
  },
});
</script>

<style scoped>
.not-authorized-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}
.authorized-button {
  display: flex;
}
</style>
