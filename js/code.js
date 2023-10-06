
const fetchData = async () => {
    const url = "https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326"
    const res = await fetch(url)
    const data = await res.json()

    initMap(data)
};

const initMap = (data) => {

    console.log("test1");

    let map = L.map('map', {
        minZoom: -3
    })

    console.log("test2");

    let geoJson = L.geoJSON(data, {
        onEachFeature: getFeature,
        style: getStyle
    }).addTo(map)

    let osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap"
    }).addTo(map);

    let baseMaps = {
        "OpenStreetMap": osm
    }

    let overlayMaps = {
        "Municipalities": geoJson
    }

    let layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);


    map.fitBounds(geoJson.getBounds())

}

const getFeature = (feature, layer) => {
    if (!feature.properties) return;
    const id = feature.properties.name
    console.log(id)

    layer.bindTooltip(feature.properties.name);
}

const getStyle = (feature) => {
    return {
        fillOpacity: 0.5
    }
}


fetchData();
