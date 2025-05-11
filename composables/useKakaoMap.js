let kakaoMapInitialized = false

export const useKakaoMap = async (el, lat = 37.5665, lng = 126.978, level = 3) => {
  const config = useRuntimeConfig()

  if (process.client) {
    if (!kakaoMapInitialized) {
      if (!window.kakao || !window.kakao.maps) {
        await new Promise((resolve) => {
          const script = document.createElement('script')
          script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${config.public.kakaoMapKey}&autoload=false&libraries=services,clusterer`
          script.onload = resolve
          document.head.appendChild(script)
        })
      }
      await new Promise((resolve) => {
        window.kakao.maps.load(resolve)
      })
      kakaoMapInitialized = true
    }

    const map = new window.kakao.maps.Map(el, {
      center: new window.kakao.maps.LatLng(lat, lng),
      level,
    })

    return map
  }
}