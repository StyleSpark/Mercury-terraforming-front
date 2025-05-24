<!-- components/BaseToast.vue -->
<script setup>
import { ref, watch } from 'vue'

const show = defineModel()

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 1500
  }
})

const progress = ref(100)

watch(show, (val) => {
  if (val) {
    progress.value = 100
    const stepTime = 50
    const step = (100 * stepTime) / props.duration
    const timer = setInterval(() => {
      progress.value -= step
      if (progress.value <= 0) {
        clearInterval(timer)
        show.value = false
      }
    }, stepTime)
  }
})
</script>

<template>
  <teleport to="body">
    <div class="toast-container">
      <v-alert
        v-if="show"
        type="success"
        variant="elevated"
        class="toast-alert"
        @click="show = false"
      >
        <!-- 👇 정상 작동 프로그레스 바 -->
        <v-progress-linear
          :model-value="progress"
          height="3"
          color="white"
          absolute
          top
          rounded
        />
        <div style="padding-top: 4px">{{ message }}</div>
      </v-alert>
    </div>
  </teleport>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
}
.toast-alert {
  position: relative; /* 반드시 있어야 v-progress-linear가 절대 위치로 렌더링 가능 */
  min-width: 300px;
  overflow: hidden;
}
</style>
