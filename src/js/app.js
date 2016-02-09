// Get information from Yelp
function getYelpParameter(location) {
	// Create random nonce
	function nonce_generate() {
		return (Math.floor(Math.random() * 1e12).toString());
	}

	var nAttempted = 0;
	var yelp_url = 'https://api.yelp.com/v2/search';
	var parameters = {
		oauth_consumer_key: 'PMT9AFZk9YDq9dsPpL4Vnw',
		oauth_token: 'I7Lh4hv-SZYc7AcVRmY3kgNNpxLbqt7L',
		oauth_nonce: nonce_generate(),
		oauth_timestamp: Math.floor(Date.now()/1000),
		oauth_signature_method: 'HMAC-SHA1',
		oauth_version: '1.0',
		callback: 'cb',  // This is crucial to include for jsonp implementation in AJAX or else the oauth-signature will be wrong.
		term: location.name(),
		location: "Champaign, IL",
		limit: 1
	};
	// Encode signature based on keys and request URL
	var encodedSignature = oauthSignature.generate('GET', yelp_url, parameters, '8WBwOsexLcGpDhuzUMn2sjp5iWo', 'gULPObwXqxMo1SO6KY2SpBQn2as');
	parameters.oauth_signature = encodedSignature;

	var settings = {
		url: yelp_url,
		data: parameters,
		cache: true,  // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
		jsonpCallback: 'cb',
		dataType: 'jsonp'
	};
	return settings;
}

// Get Yelp information
function yelp(locationArray) {
	// Get Yelp information sequentially to avoid out of order responce
	if (locationArray.length === 0) {
		return;
	}
	function getYelp(index) {
		$.ajax(getYelpParameter(locationArray[index]))
			.done(function(results) {
				if (results.businesses[0]) {
					locationArray[index].isYelped(true);
					locationArray[index].rating(results.businesses[0].rating);
				}
			})
			.fail(function() {
				// Alert when AJAX call failed
				alert("Retrieving data about " + locationArray[index].name() + " from Yelp failed!");
			})
			.always(function() {
				if (++index < nLocations) {
					getYelp(index);
				}
			});
	}
	var nLocations = locationArray.length;
	var index = 0;
	getYelp(0);
}

// MapLocation class
var MapLocation = function(mapLocation) {
	var self = this;
	self.name = ko.observable(mapLocation.name);
	self.lat = ko.observable(mapLocation.lat);
	self.lng = ko.observable(mapLocation.lng);
	self.rating = ko.observable("");
	self.isVisible = ko.observable(false);
	self.isSelected = ko.observable(false);
	self.isYelped = ko.observable(false);

	// Only exexute of Google is sucuessfully loaded
	if (typeof google === 'object' && typeof google.maps === 'object') {
		// Create marker
		self.marker = ko.observable(new google.maps.Marker({
			position: new google.maps.LatLng(self.lat(), self.lng()),
			title: self.name(),
			icon: "image/red-dot.png",
			map: null
		}));

		// Toggle if a marker is visible on the map
		self.isVisible.subscribe(function(isVisible) {
			if (isVisible) {
				this.marker().setMap(map);
			}
			else {
				this.marker().setMap(null);
			}
		}.bind(this));

		// Toggle if a marker is selected on the map
		self.isSelected.subscribe(function(isSelected) {
			if (isSelected) {
				this.marker().setIcon("image/green-dot.png");
				if (this.isYelped()) {
					html = '<div id="content">' +
					'<h4>' + this.name() + '</h4>'+
					'<h5>'+ '<b>Yelp rating:</b> ' + this.rating() + '</h5>'+
					'<div>';
				}
				else {
					html = '<div id="content">' +
					'<h4>' + this.name() + '</h4>'+
					'<h5>Yelp information is currently unavailable.</h5>'+
					'<div>';
				}
				infoWindow.setContent(html);
				infoWindow.open(map, this.marker());
			}
			else {
				this.marker().setIcon("image/red-dot.png");
			}
		}.bind(this));

		// Event listener when a marker is clicked
		(function (self) {
			google.maps.event.addListener(self.marker(), 'click', function() {
				vm.resetMarkerIcons();
				self.isSelected(true);
			});
		})(self);
	}
};

// ViewModel
var ViewModel = function() {
	var self = this;

	self.mapLocationList = ko.observableArray();
	self.filterString = ko.observable("");

	// Initialize map data
	allMapLocations.forEach(function(location) {
		var newLocation = new MapLocation(location);
		self.mapLocationList.push(newLocation);
	});

	// Get yelp information
	yelp(self.mapLocationList());

	// Filter
	self.filteredMapLocationList = ko.computed(function() {
		var filter = self.filterString().toLowerCase();
		return ko.utils.arrayFilter(self.mapLocationList(), function(location){
			var isVisible = location.name().toLowerCase().indexOf(filter) !== -1;
			location.isVisible(isVisible);
			return isVisible;
		});
	});

	// Called when an item in list is clicked
	self.select = function(location) {
		self.resetMarkerIcons();
		location.isSelected(true);
	};

	// Reset all Icons to unselected
	self.resetMarkerIcons = function() {
		self.mapLocationList().forEach(function(location){
			location.isSelected(false);
		});
	};
};

function cb() {
}