<template>
  <div class="page">
    <div class="title">Список отделов</div>
    <div class="subtitle">Полный список отделов:</div>

    <BilletCard v-for="gym in gyms" :key="gym.id" :name="gym.name" />

    <Loader :loading="uiStore.isLoading" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useGymStore } from "@/store/useGymStore";
import { useUiStore } from "@/store/useUiStore";
import BilletCard from "@/components/Cards/BilletCard.vue";

const gymStore = useGymStore();
const uiStore = useUiStore();

onMounted(() => {
  gymStore.fetchGyms();
});

const gyms = computed(() => gymStore.gyms);
</script>
