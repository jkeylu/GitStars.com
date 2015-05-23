"use strict";angular.module("gitStarsApp",["ngCookies","ngResource","ngSanitize","btford.socket-io","ui.router","ui.bootstrap","ui.select"]).config(["$stateProvider","$urlRouterProvider","$locationProvider","$httpProvider","uiSelectConfig",function(a,b,c,d,e){b.otherwise("/"),c.html5Mode(!0),d.interceptors.push("authInterceptor"),e.theme="bootstrap"}]).factory("authInterceptor",["$rootScope","$q","$cookieStore","$location",function(a,b,c,d){return{request:function(a){return a.headers=a.headers||{},c.get("token")&&(a.headers.Authorization="Bearer "+c.get("token")),a},responseError:function(a){return 401===a.status?(d.path("/login"),c.remove("token"),b.reject(a)):b.reject(a)}}}]).directive("tooltip",function(){return{restrict:"EA",link:function(a,b,c){c.tooltipPlacement=c.tooltipPlacement||"top",c.tooltipAnimation=c.tooltipAnimation||!0,c.tooltipPopupDelay=c.tooltipPopupDelay||0,c.tooltipTrigger=c.tooltipTrigger||"mouseenter",c.tooltipAppendToBody=c.tooltipAppendToBody||!1}}}).run(["$rootScope","$location","Auth",function(a,b,c){a.$on("$stateChangeStart",function(a,d){c.isLoggedInAsync(function(a){d.authenticate&&!a&&b.path("/login")})})}]),angular.module("gitStarsApp").config(["$stateProvider",function(a){a.state("login",{url:"/login",templateUrl:"app/account/login/login.html",controller:"LoginCtrl"})}]),angular.module("gitStarsApp").controller("LoginCtrl",["$scope","Auth","$location","$window",function(a,b,c,d){a.loginOauth=function(a){d.location.href="/login/"+a}}]),angular.module("gitStarsApp").controller("AdminCtrl",["$scope","$http","Auth","User",function(a,b,c,d){a.users=d.query(),a["delete"]=function(b){d.remove({id:b._id}),angular.forEach(a.users,function(c,d){c===b&&a.users.splice(d,1)})}}]),angular.module("gitStarsApp").config(["$stateProvider",function(a){a.state("admin",{url:"/admin",templateUrl:"app/admin/admin.html",controller:"AdminCtrl"})}]),angular.module("gitStarsApp").controller("MainCtrl",["$scope","$http","socket",function(a,b,c){}]),angular.module("gitStarsApp").config(["$stateProvider",function(a){a.state("main",{url:"/",templateUrl:"app/main/main.html",controller:"MainCtrl"})}]),angular.module("gitStarsApp").controller("StarsDetailCtrl",["$scope","Star",function(a,b){a.starringOrUnstarring=!1,a.starOrUnstar=function(){var c=a.activedRepo;if(c){a.starringOrUnstarring=!0;var d;if(c.gs_unstarred_at)d={full_name:c.full_name},b.star(d,function(){c.gs_unstarred_at=null,a.starringOrUnstarring=!1},function(){a.starringOrUnstarring=!1});else{var e=c.full_name.split("/");d={owner:e[0],repo:e[1]},b.unstar(null,d,function(){a.activedRepo=null,a.starringOrUnstarring=!1},function(){a.starringOrUnstarring=!1})}}},a.tagTransform=function(a){return{name:a}},a.tagOnSelect=function(c,d){var e=a.activedRepo;if(e){e.tags.push(c.name);var f={id:e.id},g=_.map(e.objTags,function(a){return a.name});b.updateTags(f,g),_.findIndex(a.tags,function(a){return a.name==c.name})<0&&a.tags.push(c)}},a.tagOnRemove=function(b,c){var d=a.activedRepo;d&&(_.pull(d.tags,b.name),d.$removeTag({tag:b.name}))}}]),angular.module("gitStarsApp").controller("StarsRepoCtrl",["$scope","$http","$location","$window",function(a,b,c,d){a.filterTag=function(b){a.filters.tags=[b]}}]),angular.module("gitStarsApp").controller("StarsSidebarCtrl",["$scope","$http","$location","$window",function(a,b,c,d){a.languages=[],a.refreshLanguages=function(b){a.languages=[];for(var c=0,d=a.availableLanguages.length;d>c;c++)a.availableLanguages[c].indexOf(b)>0&&a.languages.push(a.availableLanguages[c])},a.availableLanguages=["ActionScript","C","C#","C++","Clojure","CoffeeScript","CSS","Go","Haskell","HTML","Java","JavaScript","Lua","Matlab","Objective-C","Perl","PHP","Python","R","Ruby","Scala","Shell","Swift","TeX","VimL","ABAP","Ada","Agda","AGS Script","Alloy","AMPL","Ant Build System","ANTLR","ApacheConf","Apex","APL","AppleScript","Arc","Arduino","AsciiDoc","ASP","AspectJ","Assembly","ATS","Augeas","AutoHotkey","AutoIt","Awk","Batchfile","Befunge","Bison","BitBake","BlitzBasic","BlitzMax","Bluespec","Boo","Brainfuck","Brightscript","Bro","C-ObjDump","C2hs Haskell","Cap'n Proto","CartoCSS","Ceylon","Chapel","ChucK","Cirru","Clean","CLIPS","CMake","COBOL","ColdFusion","ColdFusion CFC","Common Lisp","Component Pascal","Cool","Coq","Cpp-ObjDump","Creole","Crystal","Cucumber","Cuda","Cycript","Cython","D","D-ObjDump","Darcs Patch","Dart","desktop","Diff","DM","Dockerfile","Dogescript","DTrace","Dylan","E","Eagle","eC","Ecere Projects","ECL","edn","Eiffel","Elixir","Elm","Emacs Lisp","EmberScript","Erlang","F#","Factor","Fancy","Fantom","Filterscript","fish","FLUX","Formatted","Forth","FORTRAN","Frege","G-code","Game Maker Language","GAMS","GAP","GAS","GDScript","Genshi","Gentoo Ebuild","Gentoo Eclass","Gettext Catalog","GLSL","Glyph","Gnuplot","Golo","Gosu","Grace","Gradle","Grammatical Framework","Graph Modeling Language","Graphviz (DOT)","Groff","Groovy","Groovy Server Pages","Hack","Haml","Handlebars","Harbour","Haxe","HTML+Django","HTML+ERB","HTML+PHP","HTTP","Hy","IDL","Idris","IGOR Pro","Inform 7","INI","Inno Setup","Io","Ioke","IRC log","Isabelle","J","Jade","Jasmin","Java Server Pages","JSON","JSON5","JSONiq","JSONLD","Julia","Kit","Kotlin","KRL","LabVIEW","Lasso","Latte","Lean","Less","LFE","LilyPond","Liquid","Literate Agda","Literate CoffeeScript","Literate Haskell","LiveScript","LLVM","Logos","Logtalk","LOLCODE","LookML","LoomScript","LSL","M","Makefile","Mako","Markdown","Mask","Mathematica","Maven POM","Max","MediaWiki","Mercury","MiniD","Mirah","Modelica","Monkey","Moocode","MoonScript","MTML","MUF","mupad","Myghty","Nemerle","nesC","NetLinx","NetLinx+ERB","NetLogo","NewLisp","Nginx","Nimrod","Ninja","Nit","Nix","NL","NSIS","Nu","NumPy","ObjDump","Objective-C++","Objective-J","OCaml","Omgrofl","ooc","Opa","Opal","OpenCL","OpenEdge ABL","OpenSCAD","Org","Ox","Oxygene","Oz","Pan","Papyrus","Parrot","Parrot Assembly","Parrot Internal Representation","Pascal","PAWN","Perl6","PigLatin","Pike","PLpgSQL","PLSQL","Pod","PogoScript","PostScript","PowerShell","Processing","Prolog","Propeller Spin","Protocol Buffer","Public Key","Puppet","Pure Data","PureBasic","PureScript","Python traceback","QMake","QML","Racket","Ragel in Ruby Host","RAML","Raw token data","RDoc","REALbasic","Rebol","Red","Redcode","RenderScript","reStructuredText","RHTML","RMarkdown","RobotFramework","Rouge","Rust","Sage","SaltStack","SAS","Sass","Scaml","Scheme","Scilab","SCSS","Self","ShellSession","Shen","Slash","Slim","Smalltalk","Smarty","SourcePawn","SPARQL","SQF","SQL","SQLPL","Squirrel","Standard ML","Stata","STON","Stylus","SuperCollider","SVG","SystemVerilog","Tcl","Tcsh","Tea","Text","Textile","Thrift","TOML","Turing","Turtle","Twig","TXL","TypeScript","Unified Parallel C","UnrealScript","Vala","VCL","Verilog","VHDL","Visual Basic","Volt","Web Ontology Language","WebIDL","wisp","xBase","XC","XML","Xojo","XProc","XQuery","XS","XSLT","Xtend","YAML","Zephir","Zimpl"]}]),angular.module("gitStarsApp").controller("StarsCtrl",["$scope","Tag","Star","socket","$http","$timeout","$interval","$location","Auth",function(a,b,c,d,e,f,g,h,i){function j(b,d){var e=done=function(){d&&d()},f=function(c){if(c.length>0){100==c.length?j(++b,d):done();for(var e=0;e<c.length;e++)a.repos.push(c[e])}else done()};c.query({page:b},f,e)}function k(){a.pullState="Pulling";var b=new Date;return function(){var c=new Date,d=1500-(c-b);0>d&&(d=0),f(function(){a.pullState="Pull Stars"},d)}}a.repos=[];var l="Click to pull stars from Github";a.pullState="Pull Stars",a.pullTooltip=l,a.pullBtnDisabled=!1,a.pullStars=function(){if(!a.pullBtnDisabled){a.pullBtnDisabled=!0;var b=k(),d=function(c){if(c&&c.waitting){var d=c.waitting;g(function(){0==--d?(a.pullBtnDisabled=!1,a.pullTooltip=l):a.pullTooltip="Left "+d+"s"},1e3,c.waitting)}else a.pullBtnDisabled=!1,a.pullTooltip=l;b()},e=function(){b()};c.sync(d,e)}},a.tags=[],i.isLoggedInAsync(function(c){return c?(j(1,function(){d.syncUpdates("star",a.repos),a.$on("$destroy",function(){d.unsyncUpdates("star")}),a.pullStars()}),void(a.tags=b.query())):void h.path("/login")});var m={search:"",taggedState:"All",starredState:"All",sortField:"created_at",languages:[],tags:[],sortReverse:!0,tagsFilterLogic:"AND"};a.filters=m,a.filterBySearch=function(a){if(!m.search)return!0;var b=m.search.toLowerCase(),c=a.full_name.toLowerCase(),d=a.description;return c.indexOf(b)>=0?!0:d&&d.toLowerCase().indexOf(b)>=0?!0:!1},a.filterByShow=function(a){var b=!1;switch(m.taggedState){case"All":b=!0;break;case"Tagged":b=a.tags&&a.tags.length>0;break;case"Untagged":b=!a.tags||0==a.tags.length}if(!b)return b;switch(m.starredState){case"All":b=!0;break;case"Starred":b=!a.gs_unstarred_at;break;case"Unstarred":b=!!a.gs_unstarred_at}return b},a.filterByLanguages=function(a){return 0==m.languages.length||m.languages.indexOf(a.language)>=0},a.filterByTags=function(a){return 0==m.tags.length?!0:"AND"==m.tagsFilterLogic?0==_.difference(m.tags,a.tags).length:_.intersection(m.tags,a.tags).length>0},a.activedRepo=null,a.activeRepo=function(b){a.activedRepo=b,a.activedRepo.objTags=_.map(b.tags,function(a){return{name:a}}),b.readme||e.get("/api/repos/"+b.full_name+"/readme").success(function(a){b.readme=a})}}]),angular.module("gitStarsApp").config(["$stateProvider",function(a){a.state("stars",{url:"/stars",templateUrl:"app/stars/stars.html",controller:"StarsCtrl"})}]),angular.module("gitStarsApp").factory("Auth",["$location","$rootScope","$http","User","$cookieStore","$q",function(a,b,c,d,e,f){var g={};return e.get("token")&&(g=d.get()),{login:function(a,b){var h=b||angular.noop,i=f.defer();return c.post("/auth/local",{email:a.email,password:a.password}).success(function(a){return e.put("token",a.token),g=d.get(),i.resolve(a),h()}).error(function(a){return this.logout(),i.reject(a),h(a)}.bind(this)),i.promise},logout:function(){e.remove("token"),g={}},createUser:function(a,b){var c=b||angular.noop;return d.save(a,function(b){return e.put("token",b.token),g=d.get(),c(a)},function(a){return this.logout(),c(a)}.bind(this)).$promise},changePassword:function(a,b,c){var e=c||angular.noop;return d.changePassword({id:g._id},{oldPassword:a,newPassword:b},function(a){return e(a)},function(a){return e(a)}).$promise},getCurrentUser:function(){return g},isLoggedIn:function(){return g.hasOwnProperty("role")},isLoggedInAsync:function(a){g.hasOwnProperty("$promise")?g.$promise.then(function(){a(!0)})["catch"](function(){a(!1)}):a(g.hasOwnProperty("role")?!0:!1)},isAdmin:function(){return"admin"===g.role},getToken:function(){return e.get("token")}}}]),angular.module("gitStarsApp").factory("User",["$resource",function(a){return a("/api/users/:id/:controller",{id:"@_id"},{changePassword:{method:"PUT",params:{controller:"password"}},get:{method:"GET",params:{id:"me"}}})}]),angular.module("gitStarsApp").factory("Modal",["$rootScope","$modal",function(a,b){function c(c,d){var e=a.$new();return c=c||{},d=d||"modal-default",angular.extend(e,c),b.open({templateUrl:"components/modal/modal.html",windowClass:d,scope:e})}return{confirm:{"delete":function(a){return a=a||angular.noop,function(){var b,d=Array.prototype.slice.call(arguments),e=d.shift();b=c({modal:{dismissable:!0,title:"Confirm Delete",html:"<p>Are you sure you want to delete <strong>"+e+"</strong> ?</p>",buttons:[{classes:"btn-danger",text:"Delete",click:function(a){b.close(a)}},{classes:"btn-default",text:"Cancel",click:function(a){b.dismiss(a)}}]}},"modal-danger"),b.result.then(function(b){a.apply(b,d)})}}}}}]),angular.module("gitStarsApp").directive("mongooseError",function(){return{restrict:"A",require:"ngModel",link:function(a,b,c,d){b.on("keydown",function(){return d.$setValidity("mongoose",!0)})}}}),angular.module("gitStarsApp").controller("NavbarCtrl",["$scope","$location","$window","Auth",function(a,b,c,d){a.menu=[{title:"Stars",link:"/stars"}],a.isCollapsed=!0,a.isLoggedIn=d.isLoggedIn,a.isAdmin=d.isAdmin,a.getCurrentUser=d.getCurrentUser,a.logout=function(){d.logout(),b.path("/")},a.isActive=function(a){return a===b.path()},a.loginOauth=function(a){c.location.href="/login/"+a}}]),angular.module("gitStarsApp").factory("socket",["socketFactory","Auth",function(a,b){var c=io("",{query:"token="+b.getToken(),path:"/socket.io-client"}),d=a({ioSocket:c});return{socket:d,syncUpdates:function(a,b,c){c=c||angular.noop,d.on(a+":save",function(a){var d=_.find(b,{_id:a._id}),e=b.indexOf(d),f="created";d?(b.splice(e,1,a),f="updated"):b.push(a),c(f,a,b)}),d.on(a+":remove",function(a){var d="deleted";_.remove(b,{_id:a._id}),c(d,a,b)})},unsyncUpdates:function(a){d.removeAllListeners(a+":save"),d.removeAllListeners(a+":remove")}}}]),angular.module("gitStarsApp").factory("Star",["$resource",function(a){return a("/api/stars/:id/:controller/:tag",null,{sync:{method:"PUT",interceptor:{response:function(a){return 200!=a.status?{waitting:180}:a.resource}}},star:{method:"POST"},unstar:{method:"DELETE",params:{id:"@owner",controller:"@repo"}},updateTags:{method:"PUT",params:{id:"@id",controller:"tags"}},removeTag:{method:"DELETE",params:{id:"@id",controller:"tags",tag:"@tag"}}})}]),angular.module("gitStarsApp").factory("Tag",["$resource",function(a){return a("/api/tags")}]),angular.module("gitStarsApp").run(["$templateCache",function(a){a.put("app/account/login/login.html",'<div ng-include=&quot;components/navbar/navbar.html&quot;></div><div class=container><div class="form login"><a href="" ng-click=loginOauth(&quot;github&quot;) class="btn btn-github"><i class="fa fa-github"></i> Login</a></div></div>'),a.put("app/admin/admin.html",'<div ng-include=&quot;components/navbar/navbar.html&quot;></div><div class=container><p>The delete user and user index api routes are restricted to users with the \'admin\' role.</p><ul class=list-group><li ng-repeat="user in users" class=list-group-item><strong>{{user.name}}</strong><br><span class=text-muted>{{user.email}}</span><a ng-click=delete(user) class=trash><span class="glyphicon glyphicon-trash pull-right"></span></a></li></ul></div>'),a.put("app/main/main.html",'<div ng-include=&quot;components/navbar/navbar.html&quot;></div><header id=banner class=hero-unit><div class=container><h1>\'Allo, \'Allo!</h1><p class=lead>Manage your github stars</p><img src=assets/images/e38d6da7.gitstars-white.png alt="Git Stars"></div></header><!--.container--><footer class=footer><div class=container><p><a href=https://github.com/jkeylu/GitStars.com>GitStars</a> v0.0.1 | <a href=https://github.com/jkeylu>@jkeylu</a> | <a href=https://github.com/jkeylu/GitStars.com/issues>Issues</a> | <a href="https://www.digitalocean.com/?refcode=167e788a5865" target=_blank>DigitalOcean</a></p></div></footer>'),a.put("app/stars/detail/detail.html",'<div ng-controller=StarsDetailCtrl class=detail><div ng-hide=!!activedRepo class=nothing>No Repo Selected</div><div ng-if=!!activedRepo class="panel panel-default"><div ng-if=!!activedRepo class="panel-heading manage"><button type=button ng-click=starOrUnstar() ng-disabled=starringOrUnstarring class="btn btn-default"><span ng-show=!!activedRepo.gs_unstarred_at><i class="fa fa-star-o"></i>Star</span><span ng-hide=!!activedRepo.gs_unstarred_at><i class="fa fa-star"></i>Unstar</span></button><div class=clone><label>Clone</label><input ng-value="&quot;https://github.com/&quot; + activedRepo.full_name + &quot;.git&quot;" readonly class="form-control"></div><div class=tags><ui-select multiple ng-model=activedRepo.objTags tagging=tagTransform tagging-tokens=,|SPACE|ENTER on-remove="tagOnRemove($item, $model)" on-select="tagOnSelect($item, $model)"><ui-select-match placeholder="Add a tag">{{$item.name}}</ui-select-match><ui-select-choices repeat="tag in tags | filter:$select.search">{{tag.name}}</ui-select-choices></ui-select></div></div><div ng-if=!!activedRepo ng-bind-html=activedRepo.readme class="panel-body readme"></div></div></div>'),a.put("app/stars/repo/repo.html",'<div ng-controller=StarsRepoCtrl class=repo><div class=list-group><div ng-repeat="repo in repos | filter:filterBySearch | filter:filterByShow | filter:filterByLanguages | filter:filterByTags | orderBy:filters.sortField:filters.sortReverse" ng-click=activeRepo(repo) ng-class="{ active: activedRepo.id == repo.id }" class=list-group-item><h4 class=list-group-item-heading>{{repo.full_name}}</h4><p class=list-group-item-text>{{repo.description}}</p><ul class=tags><li ng-repeat="tag in repo.tags" ng-click="filterTag(tag); $event.stopPropagation()" class=tag>{{tag}}</li></ul><div class=stats><div class="stat stars"><i class="fa fa-star"></i>{{repo.stargazers_count}}</div><div class="stat watches"><i class="fa fa-eye"></i>{{repo.watchers_count}}</div><div class="stat forks"><i class="fa fa-code-fork"></i>{{repo.forks_count}}</div><div class="stat link"><span ng-if=!!repo.homepage class=homepage><i class="fa fa-home"></i><a ng-href={{repo.homepage}} tooltip={{repo.homepage}} target=_blank>Homepage</a></span><span class=github><i class="fa fa-github"></i><a ng-href=https://github.com/{{repo.full_name}} target=_blank>Github</a></span></div></div></div></div></div>'),a.put("app/stars/sidebar/sidebar.html",'<div ng-controller=StarsSidebarCtrl class=sidebar><div class="panel panel-default"><div class=panel-heading>Filter by<span class=refresh><i class="fa fa-refresh"></i><a href="" ng-click=pullStars() ng-bind=pullState ng-class="{disabled: pullBtnDisabled}" tooltip={{pullTooltip}} tooltip-placement=bottom></a></span></div><div class=panel-body><div class=filter><input ng-model=filters.search placeholder="Enter something" class="form-control"></div></div></div><div class="panel panel-default"><div class=panel-heading>Show</div><div class=panel-body><div class=btn-group><label ng-model=filters.taggedState btn-radio=&quot;All&quot; class="btn btn-default">All</label><label ng-model=filters.taggedState btn-radio=&quot;Tagged&quot; class="btn btn-default">Tagged</label><label ng-model=filters.taggedState btn-radio=&quot;Untagged&quot; class="btn btn-default">Untagged</label></div><div class=btn-group><label ng-model=filters.starredState btn-radio=&quot;All&quot; class="btn btn-default">All</label><label ng-model=filters.starredState btn-radio=&quot;Starred&quot; class="btn btn-default">Starred</label><label ng-model=filters.starredState btn-radio=&quot;Unstarred&quot; class="btn btn-default">Unstarred</label></div></div></div><div class="panel panel-default"><div class=panel-heading>Order By<span class=order><a href="" ng-click="filters.sortReverse = !filters.sortReverse" ng-bind="filters.sortReverse ? &quot;DESC&quot; : &quot;ASC&quot;"></a></span></div><div class=panel-body><div class=btn-group><label ng-model=filters.sortField btn-radio=&quot;created_at&quot; class="btn btn-default">Created</label><label ng-model=filters.sortField btn-radio=&quot;updated_at&quot; class="btn btn-default">Updated</label><label ng-model=filters.sortField btn-radio=&quot;pushed_at&quot; class="btn btn-default">Pushed</label></div><div class=btn-group><label ng-model=filters.sortField btn-radio=&quot;stargazers_count&quot; class="btn btn-default">Stars</label><label ng-model=filters.sortField btn-radio=&quot;watchers_count&quot; class="btn btn-default">Watchers</label><label ng-model=filters.sortField btn-radio=&quot;forks_count&quot; class="btn btn-default">Forks</label></div></div></div><div class="panel panel-default"><div class=panel-heading>Language</div><div class=panel-body><ui-select multiple ng-model=filters.languages><ui-select-match placeholder="Enter a language">{{$item}}</ui-select-match><ui-select-choices repeat="language in availableLanguages | filter:$select.search track by $index"><div ng-bind-html="language | highlight:$select.search"></div></ui-select-choices></ui-select></div></div><div class="panel panel-default"><div class=panel-heading>Tag<span class=logic><a href="" ng-click="filters.tagsFilterLogic = filters.tagsFilterLogic == &quot;AND&quot; ? &quot;OR&quot; : &quot;AND&quot;" ng-bind=filters.tagsFilterLogic></a></span></div><div class=panel-body><ui-select multiple ng-model=filters.tags><ui-select-match placeholder="Enter a tag">{{$item.name}}</ui-select-match><ui-select-choices repeat="tag.name as tag in tags | filter:$select.search"><div ng-bind-html="tag.name | highlight:$select.search"></div></ui-select-choices></ui-select></div></div></div>'),a.put("app/stars/stars.html",'<div ng-include=&quot;components/navbar/navbar.html&quot;></div><div class="stars dashboard"><div ng-include=&quot;app/stars/sidebar/sidebar.html&quot;></div><div ng-include=&quot;app/stars/repo/repo.html&quot;></div><div ng-include=&quot;app/stars/detail/detail.html&quot;></div></div>'),a.put("components/modal/modal.html",'<div class=modal-header><button ng-if=modal.dismissable type=button ng-click=$dismiss() class=close>&times;</button><h4 ng-if=modal.title ng-bind=modal.title class=modal-title></h4></div><div class=modal-body><p ng-if=modal.text ng-bind=modal.text></p><div ng-if=modal.html ng-bind-html=modal.html></div></div><div class=modal-footer><button ng-repeat="button in modal.buttons" ng-class=button.classes ng-click=button.click($event) ng-bind=button.text class=btn></button></div>'),a.put("components/navbar/navbar.html",'<div ng-controller=NavbarCtrl class="navbar navbar-default navbar-static-top"><div class=navbar-header><a href="/" class=navbar-brand>GitStars</a></div><div id=navbar-main><!--form.navbar-form.navbar-left(role=\'search\')--><!--  div.form-group--><!--    input.form-control(type=\'text\', placeholder=\'Search\')--><ul class="nav navbar-nav"><li ng-repeat="item in menu" ng-class="{active: isActive(item.link)}"><a ng-href={{item.link}}>{{item.title}}</a></li></ul><ul class="nav navbar-nav navbar-right"><li ng-hide=isLoggedIn() ng-class="{active: isActive(&quot;/login&quot;)}"><a href="" ng-click=loginOauth(&quot;github&quot;)>Login</a></li><li ng-show=isAdmin() ng-class="{active: isActive(&quot;/admin&quot;)}"><a href=/admin>Admin</a></li><li ng-show=isLoggedIn()><p class=navbar-text>Hello {{ getCurrentUser().name }}</p></li><li ng-show=isLoggedIn() ng-class="{active: isActive(&quot;/logout&quot;)}"><a href="" ng-click=logout()>Logout</a></li></ul></div></div>')}]);