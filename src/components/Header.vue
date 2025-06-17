```vue
<template>
  <div class="header__inner">
    <router-link to="/records" class="header__logo">
      <img src="@/assets/Logo_myTurn.png" alt="Логотип" />
    </router-link>
    <div class="header__right">
      <button class="header__burger" @click="open = !open" aria-label="Menu">
        <span :class="{ 'is-open': open }"></span>
        <span :class="{ 'is-open': open }"></span>
        <span :class="{ 'is-open': open }"></span>
      </button>
      <nav :class="['header__nav', { 'is-open': open }]" ref="nav">
        <ul class="nav__list" ref="list">
          <li
            v-for="item in menu"
            :key="item.path"
            class="nav__item"
            :class="{ active: $route.path === item.path }"
          >
            <router-link
              :to="item.path"
              class="nav__link"
              @click="moveSlider"
              >{{ item.label }}</router-link
            >
          </li>
        </ul>
        <div class="slider" ref="slider"></div>
      </nav>
      <button class="header__book-btn" @click="openBookingModal">
        Записаться
      </button>
    </div>
  </div>
  <WizardDialog
    :visible="showModal"
    @update:visible="showModal = $event"
    @submit="handleSubmit"
    :subtitles="subtitles"
    :stepComponents="stepComponents"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/store/useAuthStore";
import WizardDialog from "@/components/Wizard/WizardDialog.vue";
import Step1Form from "@/components/Wizard/Step1Form.vue";
import Step2Form from "@/components/Wizard/Step2Form.vue";
import Step3Form from "@/components/Wizard/Step3Form.vue";
import Step4Form from "@/components/Wizard/Step4Form.vue";

const open = ref(false);
const showModal = ref(false);
const list = ref<HTMLElement | null>(null);
const slider = ref<HTMLElement | null>(null);

const auth = useAuthStore();
const user = computed(() => auth.user);
const isProfileLoading = computed(() => auth.isProfileLoading);

const route = useRoute();

const menu = computed(() => {
  if (isProfileLoading.value) return [];
  if (!user.value) {
    return [
      { path: "/login", label: "Войти" },
      { path: "/register", label: "Регистрация" },
    ];
  }
  switch (user.value.role) {
    case "user":
      return [
        { path: "/records", label: "Мои записи" },
        { path: "/archive", label: "Архив" },
        { path: "/profile", label: "Аккаунт" },
      ];
    case "employee":
      return [
        { path: "/employee-records", label: "Мои записи" },
        { path: "/archive-employee", label: "Архив записей" },
        { path: "/employee-schedule", label: "Мой график" },
        { path: "/profile", label: "Аккаунт" },
      ];
    case "local_admin":
      return [
        { path: "/clients", label: "Клиенты" },
        { path: "/employee", label: "Сотрудники" },
        { path: "/archive", label: "Архив" },
        { path: "/distcrict", label: "Мой отдел" },
        { path: "/profile", label: "Аккаунт" },
      ];
    case "super_admin":
      return [
        { path: "/clients", label: "Клиенты" },
        { path: "/employee", label: "Сотрудники" },
        { path: "/admins", label: "Администраторы" },
        { path: "/departments", label: "Отделы" },
        { path: "/profile", label: "Аккаунт" },
      ];
  }
  return [];
});

const updateSlider = () => {
  nextTick(() => {
    const activeLi = list.value?.querySelector(
      ".nav__item.active"
    ) as HTMLElement;
    if (!activeLi || !slider.value) return;

    const offset = activeLi.offsetLeft;
    const width = activeLi.clientWidth;
    slider.value.style.transform = `translateX(${offset}px)`;
    slider.value.style.width = `${width}px`;
    slider.value.classList.add("visible");
  });
};

const moveSlider = () => {
  setTimeout(updateSlider, 50);
};

watch(
  () => route.fullPath,
  () => {
    updateSlider();
  }
);

onMounted(() => {
  updateSlider();
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
      requestAnimationFrame(updateSlider);
    });
  }
});

const subtitles = [
  "Выберите отдел",
  "Выберите категорию и услугу",
  "Выберите сотрудника",
  "Выберите дату и время",
];
const stepComponents = [Step1Form, Step2Form, Step3Form, Step4Form];

const openBookingModal = () => {
  showModal.value = true;
};

const handleSubmit = (sessionId: number) => {
  console.log("Header: Form submitted with sessionId:", sessionId);
  showModal.value = false;
};
</script>

<style scoped>
.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
}

.header__logo img {
  height: 40px;
}

.header__right {
  display: flex;
  align-items: center;
}

.header__burger {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 18px;
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 20px;
}
.header__burger span {
  display: block;
  height: 2px;
  background: #333;
  transition: transform 0.3s, opacity 0.3s;
}
.header__burger span.is-open:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}
.header__burger span.is-open:nth-child(2) {
  opacity: 0;
}
.header__burger span.is-open:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

.header__nav {
  position: relative;
}
.nav__list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}
.nav__item {
  margin: 0 16px;
}
.nav__link {
  display: block;
  padding: 32px 0;
  text-decoration: none;
  color: #333;
  font-weight: 500;
}
.nav__item.active .nav__link {
  color: #ff552e;
}

.slider {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: #ff552e;
  width: 0;
  transform: translateX(0);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, width;
  opacity: 0;
}
.slider.visible {
  opacity: 1;
}

.header__actions .btn {
  margin-left: 16px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  transition: background 0.2s;
}
.btn--outline {
  border: 1px solid #ff552e;
  color: #ff552e;
  background: transparent;
}
.btn--outline:hover {
  background: rgba(255, 85, 46, 0.1);
}
.btn--text {
  color: #333;
  background: none;
}
.btn--text:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .header__burger {
    display: flex;
  }
  .header__nav {
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    background: #fff;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }
  .header__nav.is-open {
    max-height: 300px;
  }
  .nav__list {
    flex-direction: column;
  }
  .nav__item {
    margin: 12px 0;
    text-align: center;
  }
}
.header__book-btn {
  padding: 10px 20px;
  background-color: #ff552e;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
}

.header__book-btn:hover {
  background-color: #e14b26;
}
</style>
```
