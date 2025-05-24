// composables/useTossPayments.js
export function useTossPayments(plan) {
  let widgets = null

  // setup 함수
  const setup = async () => {
    if (typeof window === 'undefined') return

    if (!window.TossPayments) {
      await new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = 'https://js.tosspayments.com/v1'
        script.onload = resolve
        document.head.appendChild(script)
      })
    }

    const tossPayments = window.TossPayments('test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm')
    widgets = tossPayments.widgets({ customerKey: 'user_1234' })
    
    await widgets.setAmount({ currency: 'KRW', value: plan.price })

    await Promise.all([
      widgets.renderPaymentMethods({ selector: '#payment-method' }),
      widgets.renderAgreement({ selector: '#agreement' }),
    ])
  }

  // 결제 요청 함수
  const requestPayment = async (orderId,type) => {
    if (!widgets) throw new Error('TossPayments not initialized. Call setup() first.')
      await widgets.requestPayment({
        orderId,
        orderName: plan.name,
        successUrl: `${window.location.origin}/payment/success?type=${type}`,
        failUrl: `${window.location.origin}/payment/fail?type=${type}`,
      })
  }

  return { setup, requestPayment }
}
