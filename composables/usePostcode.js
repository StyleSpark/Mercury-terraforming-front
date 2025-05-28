import { ref, onMounted } from 'vue'

export function usePostcode() {
  const address = ref('')
  const zonecode = ref('')
  const latitude = ref(null)
  const longitude = ref(null)
  const geocoderReady = ref(false)

  // SDK 로딩 유틸
  const loadScript = (src) =>
    new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = src
      script.onload = resolve
      document.head.appendChild(script)
    })

  // 실제 좌표 변환 함수 (Geocoder는 SDK 로드 이후 생성해야 함)
  const geocode = (query) => {
    if (!geocoderReady.value) {
      console.warn('Geocoder 준비되지 않음')
      return
    }

    const geocoder = new window.kakao.maps.services.Geocoder()

    geocoder.addressSearch(query, function (result, status) {
      if (status === window.kakao.maps.services.Status.OK) {
        const { x, y } = result[0]
        latitude.value = parseFloat(y)
        longitude.value = parseFloat(x)
      } else {
        console.warn('Geocoding 실패:', status)
        latitude.value = null
        longitude.value = null
      }
    })
  }

  const openPostcode = () => {
    if (!geocoderReady.value) {
      alert('지도 API 로딩 중입니다. 잠시 후 다시 시도해주세요.')
      return
    }

    new window.daum.Postcode({
      oncomplete(data) {
        address.value = data.address
        zonecode.value = data.zonecode
        geocode(data.address)
      },
    }).open()
  }

  onMounted(async () => {
    const config = useRuntimeConfig()

    // 1. Daum 우편번호 + Kakao Map SDK 로드
    await loadScript('//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js')
    await loadScript(`//dapi.kakao.com/v2/maps/sdk.js?appkey=${config.public.kakaoMapKey}&autoload=false&libraries=services`)

    // 2. kakao.maps.load로 실제 초기화
    window.kakao.maps.load(() => {
      geocoderReady.value = true
    })
  })

  return {
    address,
    zonecode,
    latitude,
    longitude,
    openPostcode,
  }
}
