<template>
  <el-container>
    <el-header
      height="60px"
      style="border-bottom: 1px solid var(--el-menu-border-color)"
    >
      <Header />
    </el-header>
    <el-main>
      <!-- ВАЖНО! -->
      <router-view :key="$route.fullPath" />
    </el-main>
    <el-footer height="60px" class="footer" style="display: none">
      <Footer />
    </el-footer>
  </el-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

export default defineComponent({
  name: "MainLayout",
  components: {
    Header,
    Footer,
  },
});
</script>

<style scoped>
.footer {
  text-align: center;
  color: #909399;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  border-top: 1px solid #ebeef5;
}
</style>
