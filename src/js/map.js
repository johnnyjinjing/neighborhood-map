var map;
var infoWindow;
var vm;

function initMap() {
	var myLatLng = {lat: 40.109393, lng: -88.226796};
	map = new google.maps.Map(document.getElementById('map'), {
		center: myLatLng,
		zoom: 12
	});
	// Info window
	infoWindow = new google.maps.InfoWindow({
		content: ''
	});
	vm = new ViewModel();
	ko.applyBindings(vm);
}

function googleError() {
	alert("Undable to load Google Map!");
	vm = new ViewModel();
	ko.applyBindings(vm);
}