// 📁 파일: composables/useSupercluster.js
import Supercluster from "supercluster";

let index = null;

export function useSupercluster(points) {
  index = new Supercluster({
    radius: 60,
    maxZoom: 18,
    minZoom: 0,
  });

  index.load(
    points.map((item) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [item.longitude, item.latitude],
      },
      properties: Object.assign({ id: item.id }, item),
    }))
  );
}

export function getClusters(bounds, zoom) {
  if (!index) return [];
  return index.getClusters(bounds, zoom);
}