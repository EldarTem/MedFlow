<!-- src/App.vue -->
<template>
  <router-view />
  <Loader :loading="uiStore.isLoading" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useUiStore } from "@/store/useUiStore";
import Loader from "@/components/Loader.vue";

export default defineComponent({
  name: "App",
  components: { Loader },
  setup() {
    const uiStore = useUiStore();
    return { uiStore };
  },
});
</script>

<style>
body,
html,
#app {
  font-family: "Montserrat", sans-serif;
  height: 100%;
  margin: 0;
  background-color: #efefef;
  display: flex;
  flex-direction: column;
  height: 100vh;
  color: #4d4e4f;
}

.el-container {
  min-height: 100vh;
}

.el-main {
  padding: 30px !important;
  flex: 1 1 auto;
  overflow-y: auto;
}
.page {
  padding: 50px !important;
  background-color: #fff;
  border-radius: 10px;
}
.page .title {
  font-size: 58px;
  font-weight: 700;
}
.page .title span {
  color: #ff5227;
}
.page .subtitle {
  font-size: 24px;
  font-weight: 500;
  margin: 30px 0;
}
.el-header {
  height: 84px !important;
  background: #fff;
  padding: 22px 30px;
  flex: 0 0 auto;
}

.archive-page .el-dialog {
  padding: 0 !important;
  border-radius: 10px !important;
}
.step {
  padding: 5px 34px 38px;
}
.archive-page .el-dialog__footer {
  padding: 0px 38px 34px 0px;
}
.archive-page .el-dialog__header {
  padding-bottom: 0 !important;
}
</style>
