angular.module("clotho.youtube",[]),angular.module("clotho.quiz",["clotho.core"]),angular.module("clotho.trails",["clotho.foundation","clotho.interface","clotho.quiz","clotho.youtube"]),angular.module("clotho.youtube").directive("youtube",["Youtube","$compile","$timeout","$http",function(a,b,c,d){return{restrict:"EA",replace:!0,scope:{videoId:"@youtube",params:"=?",autoplay:"@?",startMini:"@?",onComplete:"&?",onPlay:"&?",onPause:"&?"},link:function(c,e){function f(){a.apiPromise.then(function(a){c.player=new a.Player(e[0],c.params),angular.element(c.player.a).addClass("youtubePlayer")})}var g={width:700,height:525,border:0,autoplay:!1,mini:!1,videoId:c.videoId,playerVars:{autoplay:c.autoplay||c.startMini?1:0,autohide:1,rel:0},events:{}};c.params=angular.extend(g,c.params),c.params.videoId&&(c.autoplay=angular.isDefined(c.autoplay)?c.autoplay:c.params.autoplay,c.startMini=angular.isDefined(c.startMini)?c.startMini:c.params.mini,c.params.events.onStateChange=function(a){0==a.data?c.$apply(c.onComplete()):1==a.data?c.$apply(c.onPlay()):2==a.data&&c.$apply(c.onPause())},c.convertToPlayer=function(){f()},c.startMini&&"false"!=c.startMini?(c.miniThumb=a.videoThumbnail(c.videoId,"mqdefault"),a.videoInfo(c.videoId).then(function(a){c.miniInfo=a}),d.get("views/_trails/youtubeThumbnail.html",{cache:!0}).success(function(a){e.html(b(a)(c))}).error(function(){})):(e.html('<div class="loading" width="'+c.params.width+'" height="'+c.params.height+'"></div>'),f()),c.$watch("videoId",function(a,b){a!=b&&(c.params.videoId=a,f())}))}}}]),angular.module("clotho.youtube").service("Youtube",["$http","$rootScope","$q","$timeout","$window",function(a,b,c,d,e){var f="AIzaSyDcv-f_kDYSvRMpsfKn9gaWo3Njzr9QmDU",g="https://www.googleapis.com/youtube/v3",h=c.defer();e.onYouTubeIframeAPIReady=function(){h.resolve(YT)},$clotho.extensions.script("//www.youtube.com/iframe_api");var i=function(a){var b=/^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;return a.match(b)||a.match(/((\w|-){11})/)?RegExp.$1:!1},j=function(a,b){return b=b||"default","https://img.youtube.com/vi/"+a+"/"+b+".jpg"},k=function(b){return a.get(g+"/search",{params:{key:f,type:"video",maxResults:"15",part:"id, snippet",fields:"items/id,items/snippet/title,items/snippet/description,items/snippet/thumbnails/default,items/snippet/channelTitle",q:b}}).then(function(a){return a})},l=function(b){return a.get("https://gdata.youtube.com/feeds/api/videos/"+b+"?&alt=json").then(function(a){return a.data.entry})},m=function(b){return a.get("https://www.googleapis.com/youtube/v3/playlists",{params:{key:f,part:"id, snippet, status, contentDetails",id:b},cache:!0}).then(function(a){return a.data.items[0]})},n=function(b){return a.get(g+"/playlistItems",{params:{key:f,maxResults:"50",part:"id, snippet, status, contentDetails",playlistId:b},cache:!0}).then(function(a){return a.data.items})},o=function(a){return c.all({playlistItems:n(a),playlistInfo:m(a)}).then(function(b){var c=b.playlistInfo,d=b.playlistItems,e={name:c.snippet.title,schema:"org.clothocad.model.Trail",id:"org.clothocad.trails.youtube."+c.snippet.title.replace(/\s+/g,""),about:{help:c.snippet.title+" was retrieved from Youtube from the channel "+c.snippet.channelTitle+", and was created on "+new Date(c.snippet.publishedAt).toLocaleDateString()+".",contents:[{type:"text",params:c.snippet.description}]},created:new Date(c.snippet.publishedAt).valueOf(),youtubePlaylistId:a,icon:c.snippet.thumbnails.standard?c.snippet.thumbnails.standard.url:c.snippet.thumbnails.high.url,contents:[{chapter:"Youtube Playlist",description:"This section was imported from youtube",pages:[]}]};return _.each(d,function(a){var b={title:a.snippet.title,icon:"video",contents:[]};a.snippet.description&&a.snippet.description.length&&b.contents.push({type:"text",params:a.snippet.description}),b.contents.push({type:"video",params:{id:a.contentDetails.videoId}}),e.contents[0].pages.push(b)}),e})};return{apiPromise:h.promise,extract:i,videoSearch:k,videoThumbnail:j,videoInfo:l,playlistInfo:m,playlistItems:n,playlistToTrail:o}}]),angular.module("clotho.quiz").service("QuizQuestion",["Clotho","$q","$interpolate","$rootScope",function(a,b,c){function d(a,b){var d=angular.isArray(a)?[]:{};return angular.forEach(a,function(a,e){d[e]=angular.isString(a)?c(a)(b):a}),d}this.interpolateArguments=d,this.grade=function(c,d,e,f){var g;if(console.log(c.grade.answer),e=_.isArray(e)?e:[],c.grade.answer){var h=c.grade.answer.value;if("number"==c.grade.answer.type){if(f)return b.when(h);var i=c.grade.answer.tolerance;g=d>h-i&&h+i>d}else if("boolean"==c.grade.answer.type){if(f)return b.when(h);g=d==!!h}else if("string"==c.grade.answer.type){if(f)return b.when(h);g=d.toLowerCase()==h.toLowerCase()}else if("array"==c.grade.answer.type){if(f)return b.when(h[0]);var j=_.find(h,function(a){return a.toLowerCase()==d.toLowerCase()});g=j>=0}else if("function"==c.grade.answer.type){if(f)return a.run(h,e);g=a.run(h,e,{mute:!0}).then(function(a){return _.isString(a)?d.toLowerCase()==a.toLowerCase():d==a})}else a.say("answer was provided in wrong format (cannot grade)")}else if(c.grade.function){if(f)return a.run(c.grade.function,[d,e],{mute:!0});g=a.run(c.grade.function,[d,e],{mute:!0})}else a.say("no answer was defined..."),g=null;return b.when(g)},this.feedback=function(a,c){if(!a.feedback)return b.when(null);if(_.isUndefined(c))return b.when(a.feedback.default||null);var d=a.feedback.static||{};return b.when(d[c]||a.feedback.default)},this.interpolateDictionary=function(c){if(angular.isEmpty(c))return b.when({});var e={};angular.isDefined(c.static)&&angular.extend(e,c.static);var f=b.when(e);return angular.isDefined(c.dynamic)&&angular.forEach(c.dynamic,function(b){_.mapValues(b,function(b,c){f=f.then(function(e){var f=d(b.args,e);return a.run(b.id,f).then(function(a){return e[c]=a,e})})})}),f}}]),angular.module("clotho.quiz").directive("quizQuestion",["QuizQuestion","$interpolate","$q",function(a,b,c){return{restrict:"EA",require:"ngModel",templateUrl:"views/_trails/quiz/_container.html",scope:{quiz:"=ngModel",gradeCallback:"&?"},link:function(d,e,f){function g(){return a.interpolateDictionary(d.quiz.dictionary).then(function(a){angular.extend(d,a)})}var h={showAnswer:!1,allowMultiple:!1,allowRetry:!0,randomization:!0},i=function(b){return a.interpolateArguments(b,d)};d.inputEmpty=function(){return angular.isUndefined(d.$meta)||angular.isEmpty(d.$meta.input)},d.grade=function(){var e=angular.isString(d.$meta.input)?b(d.$meta.input)(d):d.$meta.input,g=i(d.quiz.grade.args);c.all({result:a.grade(d.quiz,e,g),feedback:a.feedback(d.quiz,e)}).then(function(a){angular.extend(d.$meta,{submitted:!0,response:!!a.result,currentFeedback:a.feedback}),angular.isDefined(f.gradeCallback)&&d.gradeCallback({$input:e,$feedback:a.feedback,$result:a.result})})},d.reset=function(){d.$meta={input:"",submitted:!1,response:null,currentFeedback:null,loading:!1}},d.retry=function(){g().then(function(){d.reset()})},d.showAnswer=function(){var b=i(d.quiz.grade.args);a.grade(d.quiz,null,b,!0).then(function(a){d.$meta.input=a})},d.$watch("quiz",function(a){angular.isEmpty(a)?(d.reset(),d.$meta.loading=!0):(d.quizOptions=angular.extend({},h,a.options||{}),d.retry())})}}}]).directive("qqValue",["$compile",function(a){return{link:function(b,c,d){b.$watch(d.qqValue,function(d){var e=angular.element("<span>"+d+"</span>");c.html(a(e)(b))})}}}]).directive("qqQuestion",["$compile",function(a){return{restrict:"E",link:function(b,c){b.$watch("quiz.question.question",function(d){var e=angular.element("<div>"+(d||"")+"</div>");c.html(a(e)(b))})}}}]).directive("qqTemplate",["$http","$compile",function(a,b){return{restrict:"E",link:function(c,d){c.$watch("quiz.question.type",function(e){e&&a.get("views/_trails/quiz/"+c.quiz.question.type+".html",{cache:!0}).success(function(a){d.html(b(a)(c))}).error(function(){d.html("<p>template not found</p>")})})}}}]).directive("qqHint",function(){return{restrict:"E",replace:!0,template:'<div popover="{{quiz.question.hint}}"popover-trigger="mouseenter"popover-placement="left"><span class="glyphicon glyphicon-info-sign"></span></div>'}}).directive("qqActions",function(){return{restrict:"E",replace:!0,templateUrl:"views/_trails/quiz/_actions.html"}}),angular.module("clotho.trails").service("Trails",["Clotho","$q","$location",function(a,b,c){var d=function(c){var d=c.dependencies||null,e=b.defer();if(!d&&!c.mixin)return e.resolve(c),e.promise;var f=[],g=[];return d&&angular.forEach(d,function(b){g.push(a.get(b))}),j(c.dependencies).then(function(){return b.all(g)}).then(function(a){d={},angular.forEach(a,function(a){d[a.id]=a}),angular.forEach(c.contents,function(a){if(angular.isUndefined(a.transclude))f.push(a);else{var b=a.transclude.id,c=a.transclude.chapters;if("all"==c||"undefined"==typeof c)for(var e=0;e<d[b].contents.length;e++)f.push(d[b].contents[e]);else{var g=c.split("-");if(1==g.length)f.push(d[b].contents[g[0]]);else{if(g[0]>g[1])return"wrong format - start must be smaller than end";for(var e=g[0];e<=g[1];e++)f.push(d[b].contents[e])}}}}),c.contents=f,e.resolve(c)}),e.promise},e=function(a,b){if(angular.isUndefined(b))return!1;var c=angular.isString(b)?b.split("-"):[0,0],d=a.contents[c[0]];if(angular.isUndefined(d))return!1;var e=d.pages[c[1]];return angular.isDefined(e)},f=function(a,b){var c=angular.isString(b)?b.split("-"):[0,0];return e(a,b)?a.contents[c[0]].pages[c[1]]:null},g=function(a,b){b=angular.isString(b)?b.split("-"):[0,-1];var c;if("undefined"!=typeof a.contents[b[0]].pages[+b[1]+1])c=b[0]+"-"+(+b[1]+1);else{if("undefined"==typeof a.contents[+b[0]+1].pages)return;c=+b[0]+1+"-0"}return c},h=function(a,b){if("0-0"!=b){b=angular.isString(b)?b.split("-"):[0,1];var c;return c="undefined"!=typeof a.contents[b[0]].pages[+b[1]-1]?b[0]+"-"+(+b[1]-1):+b[0]-1+"-"+(a.contents[+b[0]-1].pages.length-1)}},i=function(a){return angular.isEmpty(a)?void c.search("position",null):((""+a).indexOf("-")<0&&(a+="-0"),void c.search("position",a))},j=$clotho.extensions.downloadDependencies,k={book:"glyphicon glyphicon-book",exercise:"glyphicon glyphicon-edit",eye:"glyphicon glyphicon-eye-open",info:"glyphicon glyphicon-info-sign",list:"glyphicon glyphicon-list-alt",picture:"glyphicon glyphicon-picture",quiz:"glyphicon glyphicon-pencil",schedule:"glyphicon glyphicon-calendar",slides:"glyphicon glyphicon-th-large",syllabus:"glyphicon glyphicon-list-alt",video:"glyphicon glyphicon-film",undefined:"glyphicon glyphicon-file"},l=function(a){return a=a||"undefined",k[a]||k.undefined},m=function(a){console.log("favorite trail with id: "+a)};return{compile:d,extractPage:f,calcNextPage:g,calcPrevPage:h,activate:i,mapIcon:l,share:a.share,favorite:m,downloadDependencies:j}}]),angular.module("clotho.quiz").directive("trailQuiz",["$http","$templateCache","$compile","Clotho","$interpolate","$q","$sce",function(a,b,c,d,e,f,g){var h=function(a,b,c){return d.run("gradeQuiz",[a,b,c])};return{restrict:"EA",require:"ngModel",scope:{quiz:"=ngModel",gradeCallback:"&?",advance:"&?"},compile:function(){return{pre:function(d,f){angular.extend(d,d.quiz),d.interpolatedQuestion=e(d.quiz.question)(d),d.parsedQuestion=function(){return g.trustAsHtml("<h5>"+d.quiz.question+"</h5>")},a.get("views/_trails/quiz/deprecated/"+d.quiz.type+"-partial.html",{cache:b}).success(function(a){f.html(c('<div class="quiz">'+a+"</div>")(d))}).error(function(){f.html("<p>Template could not be found...</p>"+JSON.stringify(d.quiz))})},post:function(a,b,c){a.createEmptyAnswer=function(b,c){c="undefined"!=typeof c?c:!1,a.quiz.answer=new Array(b.options.length);for(var d=0;d<a.quiz.answer.length;d++)a.quiz.answer[d]=c},a.answerUndefined=function(a){return"undefined"==typeof a.answer||""===a.answer},a.submitQuestion=function(b){h(b.questionValue,b.answer,b.answerGenerator).then(function(b){console.log("gradeQuiz result: "+b),a.quiz.submitted=!0,a.quiz.response={},a.quiz.response.result=b,angular.isDefined(c.gradeCallback)&&a.gradeCallback({$result:b})})},a.$watch("quiz.questionValue",function(){a.interpolatedQuestion=e(a.quiz.question)(a)}),a.resetQuiz=function(){a.quiz.submitted=!1,a.quiz.response=null,a.quiz.answer=null},a.retryQuiz=function(){if(a.quiz.retry){var b={},c=f.defer();return angular.forEach(a.quiz.retry,function(a,c){b[c]=d.submit(a).then(function(a){return a})}),f.all(b).then(function(b){angular.extend(a.quiz,b),angular.extend(a,a.quiz),a.resetQuiz(),console.log(a),c.resolve()}),c.promise}}}}}}}]),angular.module("clotho.trails").directive("trailPage",["$timeout","$q","$controller","hotkeys","Trails","$clothoModal",function(a,b,c,d,e,f){return{restrict:"A",templateUrl:"views/_trails/trailPage.html",scope:{page:"=trailPage"},link:function(b){function c(){b.helpModalOpen=!b.helpModalOpen,b.helpModalOpen&&!angular.isEmpty(b.page.help)?f.create({title:"Trail Help",content:"page.help","on-close":"closeHelpModal()"},b):f.destroy()}b.helpModalOpen=!1,b.closeHelpModal=function(){b.helpModalOpen=!1},b.$watch("page",function(a){angular.isEmpty(a)||b.createPage()}),b.createPage=function(){angular.isDefined(b.page.dictionary)&&angular.extend(b,b.page.dictionary),e.downloadDependencies(b.page.dependencies).then(function(e){b.pageComponents=b.page.contents,b.page.help&&d.add("h","Toggle Page Help",c,!1),a(function(){e()})})}}}}]),angular.module("clotho.trails").directive("trailPageComponent",["$compile","$q","$timeout","$http","$templateCache","Youtube",function(a,b,c,d,e,f){return{restrict:"EA",scope:!1,compile:function(){return{pre:function(c,d){var e={};e.hint=function(a){if(!a||!angular.isObject(a))return b.when();var c='<div class="pull-right" hint-button="'+a+'"></div>';return b.when(c)},e.text=function(a){return a?b.when("<div>"+a+"</div>"):b.when()},e.markdown=function(a){return a?b.when("<ui-markdown>"+a+"</ui-markdown>"):b.when()},e.wiki=function(a){return a?b.when("<wiki>"+a+"</wiki>"):b.when()},e.video=function(a){if(!a)return b.when();var d=f.extract(angular.isString(a)?a:a.id);c.videoParams=a.params?a.params:{},c.videoParams.autoplay=angular.isDefined(a.autoplay)?a.autoplay:!1,c.videoParams.mini=angular.isDefined(a.mini)?a.mini:!1;var e='<div><div youtube="'+d+'" params="videoParams"></div></div>';return b.when(e)},e.template=function(a){return a&&angular.isString(a)?b.when("<div ng-include=\"'"+a+"'\"></div>"):b.when()},e.quizQuestion=function(a){if(!a||!angular.isObject(a))return b.when();c.quiz=angular.copy(a),c.gradeCallback=function(a,b,c){console.log("quiz callback: ",a,b,c)};var d='<div quiz-question ng-model="quiz" grade-callback="gradeCallback($result, $input, $feedback)"></div>';return b.when(d)},e.tool=function(a){var c='<div clotho-tool="'+a.name+'"></div>';return b.when(c)},e.error=function(a){return b.when("<div>"+a+"</div>")};var g=function(a,b){return b&&angular.isString(b)?e[b]?e[b](a):e.error():void console.log("no type passed")};c.createPageComponent=function(){g(c.componentParams,c.componentType).then(function(b){d.html(a(b)(c))})}},post:function(a,b,c){a.$watch(c.trailPageComponent,function(b,c){c&&(a.component=c,a.componentType=a.component.type,a.componentParams=a.component.params,a.createPageComponent())})}}}}}]),angular.module("clotho.trails").directive("trailContents",["Trails",function(a){return{restrict:"A",replace:!0,templateUrl:"views/_trails/trailContents.html",scope:{trail:"=trailContents",current:"=",activatePass:"&?activate"},link:function(b,c,d){b.activate=function(c){angular.isDefined(d.activate)&&angular.isFunction(b.activatePass)?b.activatePass({$position:c}):a.activate.apply(null,arguments)},b.mapIcon=a.mapIcon}}}]),angular.module("clotho.trails").directive("trailInstructor",["Clotho",function(a){var b="images/assets/user-default.png";return{restrict:"A",replace:!0,templateUrl:"views/_trails/trailInstructor.html",scope:{instructorId:"=trailInstructor"},link:function(c){c.instructorIcon=b,c.$watch("instructorId",function(d){a.get(d,{mute:!0}).then(function(a){c.instructor=a,c.instructorIcon=a.icon||b})})}}}]),angular.module("clotho.trails").directive("trailMaterial",["Trails",function(a){return{restrict:"A",replace:!0,templateUrl:"views/_trails/trailMaterial.html",scope:{material:"=trailMaterial"},link:function(b){b.mapIcon=a.mapIcon}}}]),angular.module("clotho.trails").directive("trailHeader",["$sce",function(a){var b="images/trails/trails_logo.png";return{restrict:"A",replace:!0,templateUrl:"views/_trails/trailHeader.html",scope:{trail:"=trailHeader",onClick:"&trailHeaderOnClick"},link:function(c){c.$watch("trail.icon",function(d){c.trailIconTrusted=d?a.trustAsResourceUrl(d):b})}}}]),angular.module("clotho.trails").directive("trailOverview",["$sce",function(){return{restrict:"A",replace:!0,templateUrl:"views/_trails/trailOverview.html",scope:{trail:"=trailOverview"}}}]);