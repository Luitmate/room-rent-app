mapboxgl.accessToken = mapToken;
  const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: room.geometry.coordinates, // starting position [lng, lat]
  zoom: 9 // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(room.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<h3>${room.title}</h3>`
        )
    )
    .addTo(map)