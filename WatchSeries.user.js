// ==UserScript==
// @name WatchSeries Enhancements
// @description Makes WatchSeries easier to deal with
// @include *watchseries.*
// @versions 0.0.1
// ==/UserScript==

var CONSTANTS = {
	badHosts: ['watchseries.lt'],
	goodHost: 'www.watchseries.to'
},
Links = [],
$modalTarget,
$target;


//Some hosts have an old version of jQuery, and/or are missing the bootstrap modal files that this script has an implicit dependency on
function RedirectOnInvalidHost() {
	if(CONSTANTS.badHosts.indexOf(window.location.hostname) > -1) {
			window.location.href = location.protocol + '//' + CONSTANTS.goodHost + window.location.pathname;
	}
}

function cacheTargets() {
	$modalTarget = $('#addLinkModal');
	$target = $('#myTable tr[class*="download_link_"]:not(":hidden, [class*=download_link_sponsored]") a.buttonlink');
}

function collectData() {
	$target.each(function(i) {
		var $this = $(this);
		Links[i] = {
			$linkTarget: $this,
			relativeLink: $this.attr('href'),
			host: $this.attr('title')
		};
		$this.data('linkprops', Links[i]);
	});
}

function bindEvents() {
	$target.on('click', function(e) {
		var $this = $(this);
		e.preventDefault();
		var data = $this.data('linkprops'),
			title = 'You are watching on: ' + data.host + ' - ' + $('.channel-title .list-top').text();
		buildModal($modalTarget, title, data.relativeLink);
	});
}

function buildModal($modal, title, uri) {
	$modal.find('.modal-title').text(title);
	$modal.find('.modal-body').html('<iframe class="gmscript" style="width:100%; height: 500px;"></iframe>');
	$modal.find('iframe').attr('src', uri);
	$modal.find('.modal-dialog').css({
		'width': '90%',
		'height': '500px',
		'padding-top': ''
	});
	$modal.modal({ backdrop: 'static', keyboard: false });
}

function removeSponsoredLinks() {
	$('tr.download_link_sponsored').hide();
}


$(function () {
	RedirectOnInvalidHost();
	cacheTargets();
	collectData();
	bindEvents();
	removeSponsoredLinks();
});
