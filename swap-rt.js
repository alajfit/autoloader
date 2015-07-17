(function() {
	var $searchList = rtAuto.ele;
	$.each($searchList, function( key, value ){
		var $search = $searchList[key];
		$($search).each(function() {
			var $cache = $(this);
			var $allElements = $cache.text().match(/\b([0-9]{2}\/[0-9]{2})\b(?![0-9]|[a-z]|[ ])/g);
			if($allElements) { // checking elements have been found
				$.each($allElements, function( key, value ) {
					var $swapOut = $allElements[key];
					var $swapIn = $swapOut.substring(0, $swapOut.length - 3);
					var replaced = $cache.html().replace($swapOut, $swapIn);
					$cache.html(replaced);
				});
			}
		});
	});
})();
