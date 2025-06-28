export default defineNuxtRouteMiddleware((to) => {
  const { paymentKey, orderId, amount, type } = to.query;

  // 쿼리 파라미터 누락 시 접근 차단
  if (!paymentKey || !orderId || !amount || !type) {
    return navigateTo('/');
  }

  const storageKey = `payment_processed_${orderId}`;

  // 이미 처리된 결제거나 새로고침 상황이면 통과
  if (process.client && sessionStorage.getItem(storageKey)) {
    return;
  }

  // 결제 후 내부적으로 navigateTo 한 게 아니라면 차단
  const from = useRoute();
  if (from.fullPath === to.fullPath) {
    // 직접 URL 입력한 것으로 간주
    return navigateTo('/');
  }
});
