<template>
  <div class="page">
    <div class="title">Список отделений</div>
    <div class="subtitle">Полный список отделений:</div>

    <BilletCard
      v-for="district in districts"
      :key="district.id"
      :name="district.name"
    />

    <Loader :loading="uiStore.isLoading" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useDistrictStore } from "@/store/useDistrictStore";
import { useUiStore } from "@/store/useUiStore";
import BilletCard from "@/components/Cards/BilletCard.vue";

const districtStore = useDistrictStore();
const uiStore = useUiStore();

onMounted(() => {
  districtStore.fetchDistricts();
});

const districts = computed(() => districtStore.districts);
</script>
