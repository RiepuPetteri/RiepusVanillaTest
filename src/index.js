var streetViewService = new google.maps.StreetViewService();
var panorama;

function initialize(startPoint) {
  var startingLocation;
  if (startPoint === "keha1") {
    startingLocation = new google.maps.LatLng(60.2188, 24.8168);
  } else if (startPoint === "bayvillage") {
    startingLocation = new google.maps.LatLng(38.466713, -122.747914);
  } else if (startPoint === "torikatu") {
    startingLocation = new google.maps.LatLng(62.603026, 29.765251);
  } else if (startPoint === "highway101") {
    startingLocation = new google.maps.LatLng(38.439378, -122.719605);
  } else if (startPoint === "akadeemia") {
    startingLocation = new google.maps.LatLng(58.387277, 24.495995);
  } else if (startPoint === "manawa") {
    startingLocation = new google.maps.LatLng(44.452077, -88.92713);
  } else if (startPoint === "ahtri") {
    startingLocation = new google.maps.LatLng(59.4402917, 24.7582926);
  } else if (startPoint === "tarragona") {
    startingLocation = new google.maps.LatLng(42.8692197, -2.6898488);
  } else {
    startingLocation = new google.maps.LatLng(60.2188, 24.8168);
  }

  var mapDiv = document.getElementById("map-canvas");
  var mapOptions = {
    zoom: 20,
    center: startingLocation,
    heading: 5,
    mapTypeId: google.maps.MapTypeId.SATELLITE
  };
  var map = new google.maps.Map(mapDiv, mapOptions);

  panorama = map.getStreetView();
  var panoramaOptions = {
    position: startingLocation,
    visible: true,
    heading: 5,
    pitch: 0
  };
  panorama.setOptions(panoramaOptions);

  var newLink;
  var previousPanorama = {};
  var panoramaBefore = {};
  var panoramaBefore2 = {};
  var panoramaBefore3 = {};

  google.maps.event.addListener(panorama, "links_changed", function() {
    var adjacentLinks = panorama.getLinks();
    if (adjacentLinks.length > 2 && Math.random() < 0.5) {
      adjacentLinks.reverse();
    }
    newLink = adjacentLinks.pop();
    if (adjacentLinks.length > 2 && Math.random() < 0.5) {
      newLink = adjacentLinks.pop();
    }
    if (
      adjacentLinks.length > 0 &&
      (newLink.pano === panoramaBefore ||
        newLink.pano === panoramaBefore2 ||
        newLink.pano === panoramaBefore3)
    ) {
      newLink = adjacentLinks.pop();
    }
    panoramaBefore3 = panoramaBefore2;
    panoramaBefore2 = panoramaBefore;
    panoramaBefore = previousPanorama;
    previousPanorama = newLink.pano;
    // console.log(adjacentLinks.length);
    // console.log(newLink.valueOf());
    streetViewService.getPanoramaById(
      newLink.pano,
      callbackProcessStreetViewData
    );
  });

  google.maps.event.addDomListener(window, "load", initialize);
}

function callbackProcessStreetViewData(data, status) {
  console.log(data);
  panorama.setPano(data.location.pano);
  panorama.setPov({
    heading: panorama.getPhotographerPov().heading,
    pitch: 0
  });
  panorama.setVisible(true);
}
