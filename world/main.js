let startLayer = L.tileLayer.provider("OpenTopoMap");

let map = L.map("map", {
    center: [0,0],
    zoom: 2,
    layers: [
        startLayer
    ]
});

L.control.layer({
    "OpenTopoMap" : startLayer,
    "OpenStreetMap.Mapnik" : L.tileLayer.provider("OpenStreetMap.Mapnik"),
    //"OpenStreetMap.BZH" : L.tileLayer.provider("OpenStreetMap.BZH"),
    //"Thunderforest.Transport" : L.tileLayer.provider("Thunderforest.Transport"),
    //"NASAGIBS.ViirsEarthAtNight2012" : L.tileLayer.provider("NASAGIBS.ViirsEarthAtNight2012"),
}).addTo(map);