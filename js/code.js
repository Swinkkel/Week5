
const positive_migration_url = "https://statfin.stat.fi/PxWeb/sq/4bb2c735-1dc3-4c5e-bde7-2165df85e65f";
const negative_migration_url = "https://statfin.stat.fi/PxWeb/sq/944493ca-ea4d-4fd9-a75c-4975192f7b6e";

let negJson;
let posJson;

const fetchData = async () => {
    const url = "https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326"
    const res = await fetch(url)
    const data = await res.json()

    const res_pos = await fetch(positive_migration_url);
    posJson = await res_pos.json();

    const res_neg = await fetch(negative_migration_url);
    negJson = await res_neg.json();

    initMap(data)
};

const initMap = (data) => {
    let map = L.map('map', {
        minZoom: -3
    })

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

    const pos_index = posJson.dataset.dimension.Tuloalue.category.index["KU" + feature.properties.kunta];
    const neg_index = negJson.dataset.dimension.Lähtöalue.category.index["KU" + feature.properties.kunta];

    var popupContent = "Municipality: " + feature.properties.name + "<br>" +
    "Positive Migration: " + posJson.dataset.value[pos_index] + "<br>" +
    "Negative Migration: " + negJson.dataset.value[neg_index];

    layer.bindPopup(popupContent);

    layer.bindTooltip(feature.properties.name);
}

const getStyle = (feature) => {
    return {
        weight: 2,
        fillOpacity: 0.5
    }
}


fetchData();
