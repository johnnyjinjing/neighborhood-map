function getYelpParameter(a){function b(){return Math.floor(1e12*Math.random()).toString()}var c="https://api.yelp.com/v2/search",d={oauth_consumer_key:"PMT9AFZk9YDq9dsPpL4Vnw",oauth_token:"I7Lh4hv-SZYc7AcVRmY3kgNNpxLbqt7L",oauth_nonce:b(),oauth_timestamp:Math.floor(Date.now()/1e3),oauth_signature_method:"HMAC-SHA1",oauth_version:"1.0",callback:"cb",term:a.name(),location:"Champaign, IL",limit:1},e=oauthSignature.generate("GET",c,d,"8WBwOsexLcGpDhuzUMn2sjp5iWo","gULPObwXqxMo1SO6KY2SpBQn2as");d.oauth_signature=e;var f={url:c,data:d,cache:!0,jsonpCallback:"cb",dataType:"jsonp"};return f}function yelp(a){function b(d){$.ajax(getYelpParameter(a[d])).done(function(b){b.businesses[0]&&(a[d].isYelped(!0),a[d].rating(b.businesses[0].rating))}).fail(function(){alert("Retrieving data about "+a[d].name()+" from Yelp failed!")}).always(function(){++d<c&&b(d)})}if(0!==a.length){var c=a.length;b(0)}}function cb(){}var MapLocation=function(a){var b=this;b.name=ko.observable(a.name),b.lat=ko.observable(a.lat),b.lng=ko.observable(a.lng),b.rating=ko.observable(""),b.isVisible=ko.observable(!1),b.isSelected=ko.observable(!1),b.isYelped=ko.observable(!1),b.marker=ko.observable(new google.maps.Marker({position:new google.maps.LatLng(b.lat(),b.lng()),title:b.name(),icon:"image/red-dot.png",map:null})),b.isVisible.subscribe(function(a){a?this.marker().setMap(map):this.marker().setMap(null)}.bind(this)),b.isSelected.subscribe(function(a){a?(this.marker().setIcon("image/green-dot.png"),this.isYelped()?html='<div id="content"><h4>'+this.name()+"</h4><h5><b>Yelp rating:</b> "+this.rating()+"</h5><div>":html='<div id="content"><h4>'+this.name()+"</h4><h5>Yelp information is currently unavailable.</h5><div>",infoWindow.setContent(html),infoWindow.open(map,this.marker())):this.marker().setIcon("image/red-dot.png")}.bind(this)),function(a){google.maps.event.addListener(a.marker(),"click",function(){vm.resetMarkerIcons(),a.isSelected(!0)})}(b)},ViewModel=function(){var a=this;a.mapLocationList=ko.observableArray(),a.filterString=ko.observable(""),allMapLocations.forEach(function(b){var c=new MapLocation(b);a.mapLocationList.push(c)}),yelp(a.mapLocationList()),a.filteredMapLocationList=ko.computed(function(){var b=a.filterString().toLowerCase();return ko.utils.arrayFilter(a.mapLocationList(),function(a){var c=-1!==a.name().toLowerCase().indexOf(b);return a.isVisible(c),c})}),a.filter=function(){},a.select=function(b){a.resetMarkerIcons(),b.isSelected(!0)},a.resetMarkerIcons=function(){a.mapLocationList().forEach(function(a){a.isSelected(!1)})}};