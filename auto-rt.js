// adiRVO must be set to false
rtAuto.load = (function(){
	$(window).load(function() {
		// Data from the customer
		if ( rtAuto.num != null && rtAuto.ele != null && rtAuto.co != null ) {
			var countryC = true;
			switch (rtAuto.co) {
				case 'es':
					var $country = new RegExp("([0-9]{2} ?[0-9]{3} ?[0-9]{2} ?[0-9]{2})|([0-9]{2,} ?[0-9]{3,} ?[0-9]{2,})","g");
					break;
				default:
					countryC = false;
					break;
			}
			if (countryC) {
				var $rL = rtAuto.num;
				var $searchList = rtAuto.ele; // Where to search from, this can be a class, id or element e.g. body

				var $AA=[]; // Active array for numbers found
				// find out which placeholders we need to build based on what is found on the page
				$.each($searchList, function( key, value ){
					if($searchList[key]!='body'){
						var $search = $searchList[key];
					    $($search).each(function() {
					        $cache = $(this);
					        var $allElements = $cache.text().match($country);
							if($allElements) { // checking elements have been found
								$.each($allElements, function( key, value ) {
									var $content = $allElements[key].split(' ').join('');
									Object.keys($rL).forEach(function(key) { // get dest and rt num
										var $num = key.split(' ').join(''), $rlK = $rL[key]; var $check = true;
									    if($content == $num) {
											if(jQuery.isEmptyObject($AA)) {
												$AA.push({$tNum:$num, $rt:$rlK});
											} else {
												Object.keys($AA).forEach(function(key) {
													if($AA[key]["$tNum"] == $content) { $check = false; }
												}); if($check == true) { $AA.push({$tNum:$num, $rt:$rlK});}
											}
										}
									});
								});
							}
						});
					}
				});

				// create and hide the placeholders of all required numbers
	            $(document.body).append('<span id="rt"></span>'); $hold = $("#rt"), $checkExist = [];
	            Object.keys($AA).forEach(function(key) { // get dest and rt num
	                var check = false;
	                var $keyHolder = key;
	                if ($checkExist.length > 0) {
	                    $.each($checkExist, function( key, value ){
	                        if($checkExist[key] == $AA[$keyHolder]["$rt"]) {
	                            check = true;
	                        }
	                    });
	                };
	                if(check == false) {
	                    $hold.append('<span class="'+$AA[key]["$rt"]+'" style="display:none;"></span>');
	                    $checkExist.push($AA[key]["$rt"]);
	                }
	            });

				// Get all required numbers from the server
				rTapNotifyDOMChange(document.getElementById("rt"));

				// Gather up all the numbers returned
				$xRT = 0, $run = $checkExist.length*2;
				$("#rt").bind("DOMSubtreeModified", function() {
					$xRT++;
					if($xRT==$run) {
						Object.keys($AA).forEach(function(key) {
							$AA[key]["$new"] =  $('.'+$AA[key]["$rt"]+'').text();
						});
						$finishAndReplace();
					}
				});

				// Replace all numbers on the page
				var $finishAndReplace = function() {
					$.each($searchList, function( key, value ){
						if($searchList[key] != 'body') {
							var $search = $searchList[key];
							$($search).each(function() {
								$cache = $(this);
								var $allElements = $cache.text().match($country);
								if($allElements) { // checking elements have been found
									$.each($allElements, function( key, value ) {
										var $replace = $allElements[key];
										var $found = $allElements[key].split(' ').join('');
										Object.keys($AA).forEach(function(key) {
											if($found == $AA[key]["$tNum"]) {
												var $re = new RegExp($replace,"g");
						                        var replaced = $cache.html().replace($re, $AA[key]["$new"]);
						                        $cache.html(replaced);
											}
										});
									});
								}
							});
						}
					});
					document.cookie="rtAuto=1; expires=0; path=/";
				};
			} else { window.console && console.log("Error: This country has not been provisioned yet");  }
		} else { window.console && console.log("Error: Missing elements, country or numbers"); }
	});
})();
