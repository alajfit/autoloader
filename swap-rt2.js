(function() {
	var $searchList = rtAuto.ele;
	$.each($searchList, function( key, value ){
		var $search = $searchList[key];
		$($search).each(function() {
			var $cache = $(this);
			var $allElements = $cache.text().match(/\b([0-9]{2}\/[0-9]{2})\b(?![0-9]|[a-z]|[ ])/g);
			if($allElements) { // checking elements have been found
				var replaced = $cache.html().replace(/\/([0-9]{2})\b(?![0-9]|[a-z]|[ ])/g, "");
				$cache.html(replaced);
			}
		});
		console.log("finished");
	});
})();
