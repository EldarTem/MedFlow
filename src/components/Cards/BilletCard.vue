<!-- BilletCard.vue -->
<template>
  <div class="billet-card" shadow="hover">
    <div class="billet-header">
      <img v-if="icon" :src="icon" alt="Icon" class="billet-icon" />
      <h3 class="billet-title">{{ name }}</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, toRefs } from "vue";

const props = defineProps<{
  name: string | undefined;
  icon?: string;
}>();
const { name, icon } = toRefs(props);
</script>

<style scoped>
.billet-card {
  margin-bottom: 24px;
  border-radius: 10px;
  padding: 12px 37px;
  max-width: 850px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid transparent;
  transition: border 0.3s, box-shadow 0.3s;
}

.billet-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.billet-icon {
  width: 21px;
  height: 24px;
}

.billet-title {
  font-size: 20px;
  font-weight: 500;
  margin: 0;
}
.billet-card:hover {
  cursor: pointer;
  border: 1px solid rgba(255, 82, 39, 0.32);
  box-shadow: 0px 4px 20px rgba(255, 82, 39, 0.29);
}
</style>
