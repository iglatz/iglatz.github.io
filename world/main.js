let startLayer = L.tileLayer.provider("OpenTopoMap");

let map = L.map("map", {
    center: [30, 0],
    zoom: 2,
    layers: [
        startLayer
    ]
});

let circleGroup = L.featureGroup().addTo(map);

L.control.layers({
    "OpenTopoMap": startLayer,
    "OpenStreetMap.Mapnik": L.tileLayer.provider("OpenStreetMap.Mapnik"),
    "OpenStreetMap.BZH": L.tileLayer.provider("OpenStreetMap.BZH"),
    "Thunderforest.Transport": L.tileLayer.provider("Thunderforest.Transport"),
    "NASAGIBS.ViirsEarthAtNight2012": L.tileLayer.provider("NASAGIBS.ViirsEarthAtNight2012"),
}, {
    "Thematische Darstellung": circleGroup
}).addTo(map);

let drawCircles = function () {
    let data = CONFIRMED;
    let header = CONFIRMED[0];
    let index = header.length - 1;
    let topic = "bestätigte Fälle";
    let options = document.querySelector("#pulldown").options;
    let value = options[options.selectedIndex].value;
    let label = options[options.selectedIndex].label;

if (value == "confirmed") {
        data = CONFIRMED;
} else if (value == "deaths") {
        data = DEATHS;
}else {
            data = RECOVERED;
    }

    // Datum & Thema anzeigen
    document.querySelector("#datum").innerHTML = `am ${header[index]} - ${label}`;

    circleGroup.clearLayers();

    // console.log(CONFIRMED);
    for (let i = 1; i < data.length; i++) {
        let row = data[i];
        //console.log(row[2],row[3]);
        let reg = `${row[0]} ${row[1]}`;
        let lat = row[2];
        let lng = row[3];
        let val = row[index];
        let mrk = L.marker([lat, lng]).addTo(map);
        mrk.bindPopup(`${row[0]} ${row[1]}: ${val}`);

        // A = r²*PI
        // r² = A/PI
        // r = WURZEL(A/PI)
        let s = 0.5;
        let r = Math.sqrt(val * s / Math.PI);
        let circle = L.circleMarker([lat, lng], {
            radius: r
        }).addTo(circleGroup);
        circle.bindPopup(`${reg}: ${val}`);
    }
};

document.querySelector("#pulldown").onchange = function () {
    drawCircles();

};

drawCircles();