<template>
  <el-dialog
    :model-value="visible"
    width="600px"
    :show-close="false"
    @close="handleClose"
    @update:model-value="$emit('update:model-value', $event)"
    style="
      background: #fff;
      border-radius: 18px;
      box-shadow: 0 2px 20px 0 rgba(39, 45, 51, 0.15);
    "
  >
    <div class="custom-dialog">
      <div class="dialog-header">Создание свободного окна</div>
      <el-form :model="form" label-position="top" class="custom-form">
        <el-form-item label="Дата" class="custom-label">
          <el-date-picker
            v-model="form.date"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD"
            placeholder="ДД/ММ/ГГГГ"
            class="custom-input"
            prefix-icon="el-icon-date"
            style="width: 100%"
          />
        </el-form-item>
        <div class="row">
          <el-form-item label="Начало" class="custom-label time-item">
            <el-time-picker
              v-model="form.start_time"
              format="HH:mm"
              value-format="HH:mm"
              placeholder="00:00"
              class="custom-input"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="Конец" class="custom-label time-item">
            <el-time-picker
              v-model="form.end_time"
              format="HH:mm"
              value-format="HH:mm"
              placeholder="00:00"
              class="custom-input"
              style="width: 100%"
            />
          </el-form-item>
        </div>
      </el-form>

      <div class="footer-row">
        <el-button class="cancel-btn" @click="handleClose">Отменить</el-button>
        <el-button class="create-btn" type="primary" @click="saveHour"
          >Создать</el-button
        >
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { notifyError } from "@/utils/notify";

export default {
  props: {
    visible: Boolean,
  },
  emits: ["update:model-value", "save"],
  data() {
    return {
      form: {
        date: "",
        start_time: "",
        end_time: "",
      },
    };
  },
  methods: {
    saveHour() {
      if (!this.form.date || !this.form.start_time || !this.form.end_time) {
        notifyError("Заполните все обязательные поля");
        return;
      }
      const payload = {
        date: this.form.date,
        start_time: this.form.start_time.slice(0, 5),
        end_time: this.form.end_time.slice(0, 5),
      };
      console.log("Saving payload from modal:", payload); // Для отладки
      this.$emit("save", payload);
      this.handleClose(); // Закрываем модалку после успешной отправки
    },
    handleClose() {
      console.log("Closing modal"); // Для отладки
      this.$emit("update:model-value", false);
      this.form = { date: "", start_time: "", end_time: "" }; // Сбрасываем форму
    },
  },
};
</script>

<style scoped>
.custom-dialog {
  padding: 12px 22px;
}
.dialog-header {
  font-size: 28px;
  font-weight: 700;
  text-align: left;
  margin-bottom: 16px;
  margin-top: -12px;
  padding-left: 8px;
  letter-spacing: -0.5px;
}
.custom-form {
  margin-top: 12px;
  margin-bottom: 10px;
}
.custom-label .el-form-item__label {
  font-weight: 500;
  font-size: 15px;
  color: #272d33;
  margin-bottom: 4px;
}
.custom-input,
.custom-input .el-input__inner {
  border-radius: 8px !important;
  border: 1px solid #e2e4ea !important;
  background: #fff;
  font-size: 16px;
  color: #4d4e4f;
  padding: 13px 18px;
  height: 44px;
}
.row {
  display: flex;
  gap: 20px;
}
.time-item {
  flex: 1;
}
.footer-row {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}
.cancel-btn {
  border: 1.5px solid #f14119 !important;
  color: #f14119 !important;
  background: #fff !important;
  font-size: 14px;
  border-radius: 8px !important;
  width: 250px;
  height: 40px;
  font-weight: 500;
  transition: background 0.2s;
}
.cancel-btn:hover {
  background: #fff2ef !important;
}
.create-btn {
  background: #f14119 !important;
  color: #fff !important;
  border-radius: 8px !important;
  font-size: 14px;
  width: 250px;
  height: 40px;
  font-weight: 500;
  border: none;
  transition: background 0.2s;
}
.create-btn:hover {
  background: #ff6238 !important;
}
</style>
