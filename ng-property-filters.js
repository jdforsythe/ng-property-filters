(function() {

	var getAllStringProperties = function(obj) {
		var strings = [];
		for (var prop in obj) {
		  if (obj.hasOwnProperty(prop) && typeof obj[prop] === 'string') {
		    strings.push(obj[prop]);
		  }
		}
		return strings;
	}

	var getProperties = function(obj, properties) {
		var strings = [];
		for (var i=0, len=properties.length; i<len; i++) {
			strings.push(obj[properties[i]]);
		}
		return strings;
	}

	function MatchFilter() {
		return function(haystack, options) {
			var needle = options.needle;
			var allProperties = options.allProperties || false;
			var properties = options.properties || false;

			var results = [];

			for (var i=0, len=haystack.length; i<len; i++) {
				var testObj = haystack[i];
				var searchStrings = [];

				if (properties) {
					searchStrings = getProperties(testObj, properties);
				}

				else if (allProperties) {
					searchStrings = getAllStringProperties(testObj);
				}

				else {
					searchStrings = [testObj];
				}

				for (var j=0, slen=searchStrings.length; j<slen; j++) {
					if(searchStrings[j].toLowerCase().indexOf(needle.toLowerCase()) !== -1) {
						results.push(testObj);
						break;
					}
				}
			}
			return results;
		}
	}

	function FuzzyFilter() {
		// use underscore's memoize, if available - otherwise, uses the same implementation of _.memoize and _.has as in underscore 1.7.0 (http://underscorejs.org/)
		// to help make fuzzy regex generator faster on large data sets
		var memoize = (typeof _ !== 'undefined') ? _.memoize : function(func, hasher) {

			var memoize = function(key) {
				var cache = memoize.cache;
				var address = hasher ? hasher.apply(this, arguments) : key;
				//if (!has(cache, address)) cache[address] = func.apply(this, arguments);
				if (cache === null || !hasOwnProperty.call(cache, address)) cache[address] = func.apply(this, arguments);
				return cache[address];
			}

			memoize.cache = {};
			return memoize;
		};

		// cache the regex pattern creator function
		var searchCache = memoize(function(pattern){
		  return new RegExp(pattern.split('').reduce(function(a,b){
		    return a+'[^'+b+']*'+b;
		  }), 'i');
		});

		// the actual filter function - haystack comes from angular, options specified as an object literal in directive
		return function(haystack, options) {
			var needle = options.needle;

			if (typeof needle === 'undefined' || needle == '') return haystack;

			var allProperties = options.allProperties || false;
			var properties = options.properties || false;

			var results = [];

			for (var i=0, len=haystack.length; i<len; i++) {
				var testObj = haystack[i];
				var searchStrings = [];

				if (properties) {
					searchStrings = getProperties(testObj, properties);
				}

				else if (allProperties) {
					searchStrings = getAllStringProperties(testObj);
				}

				else {
					searchStrings = [testObj];
				}

				for (var j=0, slen=searchStrings.length; j<slen; j++) {
					if(searchCache(needle).test(searchStrings[j])) {
						results.push(testObj);
						break;
					}
				}
			}

			return results;

		}

	}

	angular.module('propFilters', [])
		   .filter('matchProp', MatchFilter)
		   .filter('fuzzyProp', FuzzyFilter);
})();
