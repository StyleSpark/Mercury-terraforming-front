// composables/useKakaoMap.js
export const useKakaoMap = async (elId, lat = 37.5665, lng = 126.9780, level = 3) => {
  const config = useRuntimeConfig()

  if (process.client) {
    if (!window.kakao) {
      await new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${config.public.kakaoMapKey}&autoload=false`
        script.onload = resolve
        document.head.appendChild(script)
      })
    }

    window.kakao.maps.load(() => {
      const container = document.getElementById(elId)
      const options = {
        center: new window.kakao.maps.LatLng(lat, lng),
        level,
      }
      new window.kakao.maps.Map(container, options)
    })
  }
}
