import { ref, onMounted } from 'vue'

export function usePostcode() {
  const address = ref('')
  const zonecode = ref('')
  const sido = ref('') // 시/도 정보 추출 예시
  const sigungu = ref('') // 시군구 정보 추출 예시

  const openPostcode = () => {
    if (!window.daum || !window.daum.Postcode) {
      console.warn('Daum Postcode script is not loaded yet.')
      return
    }

    new window.daum.Postcode({
      oncomplete(data) {
        address.value = data.address
        zonecode.value = data.zonecode
        sido.value = data.sido || ''
        sigungu.value = data.sigungu || ''
      },
    }).open()
  }

  onMounted(() => {
    if (!window.daum || !window.daum.Postcode) {
      const script = document.createElement('script')
      script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
      script.async = true
      document.body.appendChild(script)
    }
  })

  return {
    address,
    zonecode,
    sido,
    sigungu,
    openPostcode,
  }
}
