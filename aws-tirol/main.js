let startLayer = L.tileLayer.provider("BasemapAT.grau");

let map = L.map("map", {
    layers: [
        startLayer
    ]
});

let overlay = {
    stations: L.featureGroup(),
    temperature: L.featureGroup()
}

L.control.layers({
    "BasemapAT.grau": startLayer,
    "BasemapAT": L.tileLayer.provider("BasemapAT"),
    "BasemapAT.highdpi": L.tileLayer.provider("BasemapAT.highdpi"),
    "BasemapAT.terrain": L.tileLayer.provider("BasemapAT.terrain"),
    "BasemapAT.surface": L.tileLayer.provider("BasemapAT.surface"),
    "BasemapAT.orthofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
    "BasemapAT.overlay": L.tileLayer.provider("BasemapAT.overlay"),
    "BasemapAT.orthofoto+overlay": L.layerGroup([
        L.tileLayer.provider("BasemapAT.orthofoto"),
        L.tileLayer.provider("BasemapAT.overlay")
    ])
}, {
    "Wetterstationen Tirol": overlay.stations,
    "Temperatur (°C)": overlay.temperature
}).addTo(map);

let awsUrl = "https://aws.openweb.cc/stations";

let aws = L.geoJson.ajax(awsUrl, {
    filter: function (feature) {
        //console.log("Feature in filter: ", feature);
        //return feature.geometry.coordinates[2] > 3000;
        return feature.properties.LT;
    },

    // filter: function(feature) {
    //     if (feature.properties.LT < 5) {
    //        return true; 
    //     } else{
    //         return false;
    //     }

    //     // funktionier gleich aber kürzer geschrieben
    //     // return feature.properties.LT < 5;
    // },
    pointToLayer: function (point, latlng) {
        console.log("point Wetterkarte: ", point);
        let schneeHoehe;
        let rFeuchte;
        let wind;
        let temp;
        // Lufttemperatur einbinden
        if (point.properties.LT <= 0 || point.properties.LT == null) {
            temp = "Keine Angabe";
        } else {
            temp = point.properties.LT + "°C";
        }
        // Windgeschwindigkeit einbinden
        if (point.properties.WG <= 0 || point.properties.WG == null) {
            wind = "Keine Angabe";
        } else {
            wind = point.properties.WG + "m/s";
        }
        // Relative Feuche einbinden
        if (point.properties.RH <= 0 || point.properties.RH == null) {
            rFeuchte = "Keine Angabe";
        } else {
            rFeuchte = point.properties.RH + "%";
        }
        //Schneehöhe einbinden
        if (point.properties.HS <= 0 || point.properties.HS == null) {
            schneeHoehe = "Keine Angabe";
        } else {
            schneeHoehe = point.properties.HS + "cm";
        }


        let marker = L.marker(latlng).bindPopup(`<h3>${point.properties.name}</h3>
        <ul>
        <li><p class=bold>Seehöhe:</p> <br> ${point.geometry.coordinates[2]} hm</li>
        <li><p class=bold>Position:</p><br> Lat: ${point.geometry.coordinates[1]} <br> Lng: ${point.geometry.coordinates[0]}</li>
        <li><p class=bold>Datum:</p> <br> ${point.properties.date.substring(0, 10)}</li>
        <li><p class=bold>Lufttemperatur:</p> <br> ${temp} </li>
        <li><p class=bold>Windgeschwindigkeit:</p> <br> ${wind} </li>
        <li><p class=bold>Relative Feuchte:</p> <br>${rFeuchte} </li>
        <li><p class=bold>Schneehöhe:</p> <br>${schneeHoehe} </li>
        </ul>
        <a target="link" href= "https://lawine.tirol.gv.at/data/grafiken/1100/standard/tag/${point.properties.plot}.png"> Hier gehts zur Grafik der Wetterstation </a>
        `);

        return marker;
    }
}).addTo(overlay.stations);

let drawTempreature = function(jsonData) {
    console.log("aus der Funktion", jsonData);
    L.geoJson(jsonData, {
        filter: function(feature){
            return feature.properties.LT
        },
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                title: `${feature.properties.name} (${feature.geometry.coordinates[2]}m)`,
                icon: L.divIcon({
                    html: `<div class="label-temperature">${feature.properties.LT.toFixed(1)}</div>`,
                    className: "ignore-me" // dirty hack
                })
            })
        }
    }).addTo(overlay.temperature);
}

// neues overlay definieren, zu L.control.layers hinzufügen und default anzeigen
// Funktion drawWind als 1:1 Kopie von drawTemperature mit Anpassungen (in km/h)
// einen neune Stil .label-wind im CSS von main.css
// funktion in draw wind in data:loaded aufrufen

let drawWind = function(jsonData){

};
aws.on("data:loaded", function(){
    //console.log(aws.toGeoJSON());
    drawTempreature(aws.toGeoJSON);
    map.fitBounds(overlay.stations.getBounds());

    overlay.temperature.addTo(map);
});