// ==UserScript==
// @name WatchSeries Enhancements
// @description Makes WatchSeries easier to deal with
// @include *watchseries.*
// @versions 0.0.2
// ==/UserScript==

var CONSTANTS = {
	badHosts: ['watchseries.lt'],
	goodHost: 'www.watchseries.to',
	attemptedHijackMessage: 'Do you want to leave this page? A third-party video host could be attempting to redirect this window. To prevent this, choose to stay on this page.'
};

var Links = [],
	$modalTarget,
	$target;


function RedirectOnInvalidHost() {
	//Some hosts have an old version of jQuery, and/or are missing the bootstrap modal files that this script has an implicit dependency on
	if (CONSTANTS.badHosts.indexOf(window.location.hostname) > -1) {
		window.location.href = location.protocol + '//' + CONSTANTS.goodHost + window.location.pathname;
	}
}

function cacheTargets() {
	$modalTarget = $('#addLinkModal');
	$target = $('#myTable tr[class*="download_link_"]')
				.not(':hidden, [class*=download_link_sponsored]')
				.find('a.buttonlink');
}

function collectData() {
	$target.each(function(i) {
		var $this = $(this);
		Links[i] = {
			relativeLink: $this.attr('href'),
			host: $this.attr('title')
		};
		$this.data('linkprops', Links[i]);
	});
}

function bindEvents() {
	$target.on('click', function(e) {
		e.preventDefault();

		var data = $(this).data('linkprops'),
			title = 'You are watching on: ' + data.host + ' - ' +
					$('title').text().replace(/Watch Online | - Watch Series/gi, '');

		buildModal($modalTarget, title, data.relativeLink);
	});
}

function buildModal($modal, title, uri) {
	$modal
		.find('.modal-title')
		.text(title)
		.end()
		.find('.modal-body')
		.html('<iframe class="gmscript" style="width:100%; height: 500px;"></iframe>');

	bindIframeEvents.call($modal.find('iframe').attr('src', uri));

	$modal.find('.modal-dialog').css({
		'width': '90%',
		'height': '700px',
		'padding-top': ''
	});
	$modal.modal({
		backdrop: 'static',
		keyboard: false
	});
}

function bindIframeEvents() {
	this.on('load.GMEnhancement', function() {
		var $this = $(this);
		$this.off('load.GMEnhancement'); //Prevent Cross-Origin security error in console
		$this.on('load.GMEnhancement', function() {
			runPlugins(this.src);
		});

		var movieURI = $this.contents().find('.myButton').attr('href');
		if (movieURI) $this.attr('src', movieURI);



		window.onbeforeunload = function(e) {
			return CONSTANTS.attemptedHijackMessage;
		};
	});
}

function extraUITweaks() {
	//Ads
	$('tr.download_link_sponsored').hide();

	//zebra-striping, taking into account hidden ad-rows
	$('[class*="download_link_"]')
		.filter(':not(":hidden"):odd')
		.css('background-color', '#DDDDDD');

	//bs.modal is the namespace for jQuery events set by bootstrap.
    //We hook into this rather than binding a separate click event on the close button
	$modalTarget.on('hidden.bs.modal', function() {
		$(this).find('iframe').remove();
	});
}

/*
TODO:
	1) Allow creating Plugins that match a specific pattern of uri's to be executed on
	2) Plugin executes on dom ready
	3) Plugins should "kill the countdown" for frequently-used hosts

*/

/*------------------------------
			Plugins
------------------------------*/
function runPlugins(uri) {
	Object.keys(PluginStore).forEach(function (name) {
		var current = PluginStore[name];
		if (current.uriPattern.test(uri)) {
			current.fn(uri);
		}
	});
}

var PluginStore = {};

function PagePlugin(config) {
	this.uriPattern = config.uriPattern;
	this.fn = config.fn;
}

PluginStore.gorillaVid = new PagePlugin({
	uriPattern: /gorillavid/i,
	fn: function(uri) {
		console.log('liiiveeee');
	}
});

$(function() {
	RedirectOnInvalidHost();
	cacheTargets();
	collectData();
	bindEvents();
	extraUITweaks();
});
