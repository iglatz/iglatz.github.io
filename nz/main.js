// alert ("Hallo Welt!");

//connection to map -> index.html
let map = document.querySelector("#map") 

let title=map.dataset.title;

var mymap = L.map("map").setView([-44.828004, 169.634525], 13);

L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>tributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https:/ntopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
}).addTo(mymap);

//var marker = L.marker([-44.828004, 169.634525]).addTo(mymap);
var circle = L.circle([-44.828004, 169.634525], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(mymap);

circle.bindPopup("<b>Royal Albatros Center</b><br>one of the biggest Albatros colonies").openPopup();

