// ==UserScript==
// @name WatchSeries Enhancements
// @description Makes WatchSeries easier to deal with
// @include *watchseries.to*
// @versions 0.0.1
// ==/UserScript==

var Links = [];
var $modalTarget = $('#addLinkModal');
var $target = $('#myTable tr[class*="download_link_"]:not(":hidden, [class*=download_link_sponsored]") a.buttonlink')

$target.each(function (i) {
	var $this = $(this);
	Links[i] = {
		$linkTarget : $this,
		relativeLink : $this.attr('href'),
		host : $this.attr('title')
	};
	$this.data('linkprops', Links[i]);
});

$target.on('click', function(e) {
	var $this = $(this);
	e.preventDefault();
	var data = $this.data('linkprops');
	buildModal($modalTarget, data.host, data.relativeLink);
});

function buildModal($modal, title, uri) {
	$modal.find('.modal-title').text(title);
	$modal.find('.modal-body').html('<iframe class="gmscript" style="width:100%; height: 500px;"></iframe>');
	$modal.find('iframe').load(function() {
		//$(this).find('#popup2-middle a.myButton').attr('target', '_blank');
	});
	$modal.find('iframe').attr('src', uri);
	$modal.find('.modal-dialog').css({'width' : '90%', 'height' : '500px'});
	$modal.modal();
}
