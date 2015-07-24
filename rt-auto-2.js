// adiRVO must be set to false
rtAuto.load = (function(){
	$(window).load(function() {
		// Data from the customer
		if ( rtAuto.num !== null && rtAuto.ele !== null && rtAuto.co !== null ) {
			var countryC = true;
			var $gMaps = new RegExp("gmaps","g");
			var $clearOut = new RegExp("[^\\d]", "g"); // everything but numbers
			// Check which countries regex to use
			switch (rtAuto.co) {
				case 'es': // spain (In progress)
					var $country = new RegExp("([0-9]{2}( |-|\\.)?[0-9]{3}( |-|\\.)?[0-9]{2}( |-|\\.)?[0-9]{2})\\b|([0-9]{2,}( |-|\\.)?[0-9]{3,}( |-|\\.)?[0-9]{2,})\\b","g");
					break;
				case 'uk': // uk (complete)
					var $country = new RegExp("((\\+44|0([1-9]{1})[0-9]{1,})( \\(0\\)|\\(0\\)| |-|\\.)?[0-9]{2,}( |-|\\.)?[0-9]{2,}( |-|\\.)?[0-9]{2,})\\b|((\\(0|0)([1-9]{1})[0-9]{1,}(\\) | |-|\\.)?[0-9]{3,}( |-|\\.)?[0-9]{3,})\\b","g");
					break;
				case 'be': // belgium (In progress)
					var $country = new RegExp("\\b0([1-9]{1})[0-9]{0,}( |)?[0-9]{2,3}( |)?[0-9]{2}( |)?[0-9]{2}\\b|\\b0([7-9]{1})[0-9]{1,}( |)?[0-9]{2,3}( |)?[0-9]{2,3}\\b","g");
					break;
				default:
					countryC = false;
					break;
			}
			if (countryC) { // if a regex has been found continue
				var $rL = rtAuto.num; // grab all numbers and placeholder numbers
				var $searchList = rtAuto.ele; // Where to search from, this can be a class, id or element e.g. body

				var $AA=[]; // Active array for numbers found
		    	var $cache = $("*").text(); // Grab everything across the entire page
				var $remover = new RegExp("'num[^]*}", "g");
				$cache = $cache.replace($remover, "");  // remove any numbers inject by the script using regex
		    	var $allElements = $cache.match($country); // grab all numbers available in the document
				if($allElements) { // checking elements have been found
					$.each($allElements, function( key, value ) {
						var $content = $allElements[key].replace($clearOut, '');
						Object.keys($rL).forEach(function(key) { // get dest and rt num
							var $num = key.replace($clearOut, ''), $rlK = $rL[key]; var $check = true;
						    if($content == $num) {
								if(jQuery.isEmptyObject($AA)) {
									$AA.push({$tNum:$num, $rt:$rlK});
								} else {
									Object.keys($AA).forEach(function(key) {
										if($AA[key].$tNum == $content) {
											$check = false;
										}
									});
								if($check === true) {
									$AA.push({$tNum:$num, $rt:$rlK});
								}
								}
							}
						});
					});
				}

				// create and hide the placeholders of all required numbers
				$(document.body).append('<span id="rt"></span>'); var $hold = $("#rt"), $checkExist = [];
				Object.keys($AA).forEach(function(key) { // get dest and rt num
					var check = false;
        			var checKey = key;
					if($checkExist!==null) {
            			$.each($checkExist, function( key, value ) {
            				if($checkExist[key] == $AA[checKey].$rt) {
                				check = true;
            				}
            			});
            			if(check === false) {
							$hold.append('<span class="'+$AA[key].$rt+'" style="display:none;"></span>');
							$checkExist.push($AA[key].$rt);
						}
        			}
				});

				// Get all required numbers from the server
				rTapNotifyDOMChange(document.getElementById("rt"));

				// Gather up all the numbers returned
				var $xRT = 0, $run = $checkExist.length*2, $ran = false;
				$("#rt").bind("DOMSubtreeModified", function() {
					$xRT++;
					if($xRT>=$run && $ran === false) {
						Object.keys($AA).forEach(function(key) {
            				var $catcher = $('.'+$AA[key].$rt+'').text();
            				if($catcher != "t" && $catcher !== "" && $catcher != " ") {
								$AA[key].$new = $catcher;
            				}
						});
            			// need to do a check for not null
            			var $runCatch = true;
            			Object.keys($AA).forEach(function(key) {
            				if($AA[key].$new === undefined) {
            					$runCatch=false;
            				}
            			});
            			if($runCatch === true) {
            				$finishAndReplace();
            				$ran = true;
            			}
					}
				});

				// Replace all numbers on the page
				var $finishAndReplace = function() {
					$.each($searchList, function( key, value ){
						var $search = $searchList[key];
						$($search).each(function() {
							var $cache = $(this);
							var $allElements = $cache.text().match($country);
							var $catchGMaps = $cache.html().match($gMaps); // check for Google Maps
							if($allElements && $catchGMaps === null) { // checking elements have been found and Google Maps is not within Scope
								$.each($allElements, function( key, value ) {
									var $replace = $allElements[key];
									var $found = $allElements[key].replace($clearOut, '');
									Object.keys($AA).forEach(function(key) {
										if($found == $AA[key].$tNum) {
											var $re = new RegExp($replace,"g");
					            			var replaced = $cache.html().replace($re, $AA[key].$new);
					            			$cache.html(replaced);
										}
									});
								});
							}
						});
					});
					if (typeof rtAutoCallback == 'function') { rtAutoCallback($AA); }
				};
			} else { window.console && console.log("Error: Country N/A");  }
		} else { window.console && console.log("Error: Var Err"); }
	});
})();
