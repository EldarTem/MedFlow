<!-- src/components/Loader.vue -->
<template>
  <transition name="fade">
    <div v-if="loading" class="loader-overlay">
      <div class="loader-container">
        <el-icon class="loader-icon"><Loading /></el-icon>
        <p>Загрузка...</p>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Loading } from "@element-plus/icons-vue";

export default defineComponent({
  name: "Loader",
  components: { Loading },
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
  },
});
</script>

<style scoped>
.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loader-container {
  background: #fff;
  padding: 30px 40px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loader-icon {
  font-size: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
