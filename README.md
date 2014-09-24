ng-property-filters
===================

A set of filters for angular.js that allow filtering by all/some properties of an object. Filtering on strings, rather than objects, is also supported.

Includes a match filter (your typical string.indexOf() match) and a fuzzy filter.

Some clarification is needed on the term "fuzzy" filter. This is not an implementation of one of the "best match" algorithms. Instead this filter checks to see if the characters in your search term appear (in order) in the data, regardless of how many characters are _between_ them. For instance "nok" will match both "Nokia" (nok..) and "New York" (n...o.k) but not "Acknowledge" (...no......) because, while all three letters appear, they're not in the correct order. If you're familiar with Sublime Text's command palette, it works in the same way.

_All_ searches are case-insensitive.

Usage
=====
Just include the ng-property-filters.js file and include 'propFilters' as a dependency to your app module. Then use the filter in your directives.

Syntax
======
```html
<input type="text" ng-model="searchText"/>
<ul>
  <li ng-repeat="friend in friends | matchProp:{needle:searchText, allProperties:true}">{{friend.name}}</li>
</ul>
```

The object passed to either the matchProp or fuzzyProp filters takes the following properties:
```javascript
{
  needle: [string] the string to search,
  allProperties: [boolean, default: false] whether to search in all string properties of the objects,
  properties: [array, default: []] string names of the properties to search in the objects
}
```

The only required property is 'needle', but if you're filtering on objects, you'll need to specify at least one of the other two. 

Examples
========
```javascript
function Ctrl($scope) {
  $scope.searchText = "";
}
```

```html
<input type="text" ng-model="searchText"/>
```

```html
<li ng-repeat="friend in friends | matchProp:{needle:searchText, allProperties:true}">{{friend.name}}</li>
```

```html
<li ng-repeat="friend in friends | matchProp:{needle:searchText, properties:['name', 'address']}">{{friend.name}}</li>
```

```html
<li ng-repeat="friend in friends | fuzzyProp:{needle:searchText, allProperties:true}">{{friend.name}}</li>
```

```html
<li ng-repeat="friend in friends | fuzzyProp:{needle:searchText, properties:['name', 'address']}">{{friend.name}}</li>
```

Full examples at jsFiddle: http://jsfiddle.net/jdforsythe/1d4tgsj9/

Example with ui-bootstrap typeahead
===================================
I wanted a fuzzy search that would work with ui-bootstrap's typeahead example of the state search - but I wanted it to fuzzy search on state name _and_ state abbreviation. So here's how I implemented that with this fuzzy filter.

Include ui-bootstrap and ng-property-filters in your HTML and as dependencies in your app module.

```javascript
app = angular.module('myApp', ['ui.bootstrap','propFilters']);

(function() {
  function MyController($scope) {
    $scope.statesWithFlags = [	{ name:'Alabama',			abbreviation: 'AL',	flag: '5/5c/Flag_of_Alabama.svg/45px-Flag_of_Alabama.svg.png' },
								{ name:'Alaska',			abbreviation: 'AK',	flag: 'e/e6/Flag_of_Alaska.svg/43px-Flag_of_Alaska.svg.png' },
								{ name:'Arizona',			abbreviation: 'AZ',	flag: '9/9d/Flag_of_Arizona.svg/45px-Flag_of_Arizona.svg.png' },
								{ name:'Arkansas',			abbreviation: 'AR',	flag: '9/9d/Flag_of_Arkansas.svg/45px-Flag_of_Arkansas.svg.png' },
								{ name:'California',		abbreviation: 'CA',	flag: '0/01/Flag_of_California.svg/45px-Flag_of_California.svg.png' },
								{ name:'Colorado',			abbreviation: 'CO',	flag: '4/46/Flag_of_Colorado.svg/45px-Flag_of_Colorado.svg.png' },
								{ name:'Connecticut',		abbreviation: 'CT',	flag: '9/96/Flag_of_Connecticut.svg/39px-Flag_of_Connecticut.svg.png' },
								{ name:'Delaware',			abbreviation: 'DE',	flag: 'c/c6/Flag_of_Delaware.svg/45px-Flag_of_Delaware.svg.png' },
								{ name:'Florida',			abbreviation: 'FL',	flag: 'f/f7/Flag_of_Florida.svg/45px-Flag_of_Florida.svg.png' },
								{ name:'Georgia',			abbreviation: 'GA',	flag: '5/54/Flag_of_Georgia_%28U.S._state%29.svg/46px-Flag_of_Georgia_%28U.S._state%29.svg.png' },
								{ name:'Hawaii',			abbreviation: 'HI',	flag: 'e/ef/Flag_of_Hawaii.svg/46px-Flag_of_Hawaii.svg.png' },
								{ name:'Idaho',				abbreviation: 'ID',	flag: 'a/a4/Flag_of_Idaho.svg/38px-Flag_of_Idaho.svg.png' },
								{ name:'Illinois',			abbreviation: 'IL',	flag: '0/01/Flag_of_Illinois.svg/46px-Flag_of_Illinois.svg.png' },
								{ name:'Indiana',			abbreviation: 'IN',	flag: 'a/ac/Flag_of_Indiana.svg/45px-Flag_of_Indiana.svg.png' },
								{ name:'Iowa',				abbreviation: 'IA',	flag: 'a/aa/Flag_of_Iowa.svg/44px-Flag_of_Iowa.svg.png' },
								{ name:'Kansas',			abbreviation: 'KS',	flag: 'd/da/Flag_of_Kansas.svg/46px-Flag_of_Kansas.svg.png' },
								{ name:'Kentucky',			abbreviation: 'KY',	flag: '8/8d/Flag_of_Kentucky.svg/46px-Flag_of_Kentucky.svg.png' },
								{ name:'Louisiana',			abbreviation: 'LA',	flag: 'e/e0/Flag_of_Louisiana.svg/46px-Flag_of_Louisiana.svg.png' },
								{ name:'Maine',				abbreviation: 'ME',	flag: '3/35/Flag_of_Maine.svg/45px-Flag_of_Maine.svg.png' },
								{ name:'Maryland',			abbreviation: 'MD',	flag: 'a/a0/Flag_of_Maryland.svg/45px-Flag_of_Maryland.svg.png' },
								{ name:'Massachusetts',		abbreviation: 'MA',	flag: 'f/f2/Flag_of_Massachusetts.svg/46px-Flag_of_Massachusetts.svg.png' },
								{ name:'Michigan',			abbreviation: 'MI',	flag: 'b/b5/Flag_of_Michigan.svg/45px-Flag_of_Michigan.svg.png' },
								{ name:'Minnesota',			abbreviation: 'MN',	flag: 'b/b9/Flag_of_Minnesota.svg/46px-Flag_of_Minnesota.svg.png' },
								{ name:'Mississippi',		abbreviation: 'MS',	flag: '4/42/Flag_of_Mississippi.svg/45px-Flag_of_Mississippi.svg.png' },
								{ name:'Missouri',			abbreviation: 'MO',	flag: '5/5a/Flag_of_Missouri.svg/46px-Flag_of_Missouri.svg.png' },
								{ name:'Montana',			abbreviation: 'MT',	flag: 'c/cb/Flag_of_Montana.svg/45px-Flag_of_Montana.svg.png' },
								{ name:'Nebraska',			abbreviation: 'NE',	flag: '4/4d/Flag_of_Nebraska.svg/46px-Flag_of_Nebraska.svg.png' },
								{ name:'Nevada',			abbreviation: 'NV',	flag: 'f/f1/Flag_of_Nevada.svg/45px-Flag_of_Nevada.svg.png' },
								{ name:'New Hampshire',		abbreviation: 'NH',	flag: '2/28/Flag_of_New_Hampshire.svg/45px-Flag_of_New_Hampshire.svg.png' },
								{ name:'New Jersey',		abbreviation: 'NJ',	flag: '9/92/Flag_of_New_Jersey.svg/45px-Flag_of_New_Jersey.svg.png' },
								{ name:'New Mexico',		abbreviation: 'NM',	flag: 'c/c3/Flag_of_New_Mexico.svg/45px-Flag_of_New_Mexico.svg.png' },
								{ name:'New York',			abbreviation: 'NY',	flag: '1/1a/Flag_of_New_York.svg/46px-Flag_of_New_York.svg.png' },
								{ name:'North Carolina',	abbreviation: 'NC',	flag: 'b/bb/Flag_of_North_Carolina.svg/45px-Flag_of_North_Carolina.svg.png' },
								{ name:'North Dakota',		abbreviation: 'ND',	flag: 'e/ee/Flag_of_North_Dakota.svg/38px-Flag_of_North_Dakota.svg.png' },
								{ name:'Ohio',				abbreviation: 'OH',	flag: '4/4c/Flag_of_Ohio.svg/46px-Flag_of_Ohio.svg.png' },
								{ name:'Oklahoma',			abbreviation: 'OK',	flag: '6/6e/Flag_of_Oklahoma.svg/45px-Flag_of_Oklahoma.svg.png' },
								{ name:'Oregon',			abbreviation: 'OR',	flag: 'b/b9/Flag_of_Oregon.svg/46px-Flag_of_Oregon.svg.png' },
								{ name:'Pennsylvania',		abbreviation: 'PA',	flag: 'f/f7/Flag_of_Pennsylvania.svg/45px-Flag_of_Pennsylvania.svg.png' },
								{ name:'Rhode Island',		abbreviation: 'RI',	flag: 'f/f3/Flag_of_Rhode_Island.svg/32px-Flag_of_Rhode_Island.svg.png' },
								{ name:'South Carolina',	abbreviation: 'SC',	flag: '6/69/Flag_of_South_Carolina.svg/45px-Flag_of_South_Carolina.svg.png' },
								{ name:'South Dakota',		abbreviation: 'SD',	flag: '1/1a/Flag_of_South_Dakota.svg/46px-Flag_of_South_Dakota.svg.png' },
								{ name:'Tennessee',			abbreviation: 'TN',	flag: '9/9e/Flag_of_Tennessee.svg/46px-Flag_of_Tennessee.svg.png' },
								{ name:'Texas',				abbreviation: 'TX',	flag: 'f/f7/Flag_of_Texas.svg/45px-Flag_of_Texas.svg.png' },
								{ name:'Utah',				abbreviation: 'UT',	flag: 'f/f6/Flag_of_Utah.svg/45px-Flag_of_Utah.svg.png' },
								{ name:'Vermont',			abbreviation: 'VT',	flag: '4/49/Flag_of_Vermont.svg/46px-Flag_of_Vermont.svg.png' },
								{ name:'Virginia',			abbreviation: 'VA',	flag: '4/47/Flag_of_Virginia.svg/44px-Flag_of_Virginia.svg.png' },
								{ name:'Washington',		abbreviation: 'WA',	flag: '5/54/Flag_of_Washington.svg/46px-Flag_of_Washington.svg.png' },
								{ name:'West Virginia',		abbreviation: 'WV',	flag: '2/22/Flag_of_West_Virginia.svg/46px-Flag_of_West_Virginia.svg.png' },
								{ name:'Wisconsin',			abbreviation: 'WI',	flag: '2/22/Flag_of_Wisconsin.svg/45px-Flag_of_Wisconsin.svg.png' },
								{ name:'Wyoming',			abbreviation: 'WY',	flag: 'b/bc/Flag_of_Wyoming.svg/43px-Flag_of_Wyoming.svg.png '}];
								
  }
  
  app.controller('MyController', MyController);
})();
```

```html
<body ng-app="myApp">
  <form>
    <label for="state">State:</label>
    <input type="text" class="form-control" id="state" name="state" placeholder="NY or New York" ng-required="true" ng-model="newFamily.state" typeahead="state as state.name for state in statesWithFlags | fuzzyProp:{needle: $viewValue, allProperties:false, properties:['name', 'abbreviation']}" typeahead-template-url="templates/states.html" typeahead-loading="loadingStates" />
    <i ng-show="loadingStates" class="glyphicon glyphicon-refresh"></i>
  </form>
</body>
<script type="text/ng-template" id="templates/states.html">
<a>
	<!-- load flag thumbnail images from wikimedia -->
  <img ng-src="http://upload.wikimedia.org/wikipedia/commons/thumb/{{match.model.flag}}" width="16">
  <span bind-html-unsafe="match.model.abbreviation | typeaheadHighlight:query"></span>
  <span bind-html-unsafe="match.label | typeaheadHighlight:query"></span>
</a>
</script>
```

Other
=====
Contributions, comments, etc. welcome.
