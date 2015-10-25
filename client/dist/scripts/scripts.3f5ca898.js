"use strict";angular.module("rawrApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","btford.socket-io","ngDialog"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"main"}).when("/login",{templateUrl:"views/login.html",controller:"LoginCtrl",controllerAs:"loginCtrl"}).when("/enrol",{templateUrl:"views/enrol.html",controller:"EnrolCtrl",controllerAs:"enrolCtrl"}).when("/prof/dashboard",{templateUrl:"views/prof/dashboard.html",controller:"DashboardCtrl",controllerAs:"dashboardCtrl"}).when("/student/interact",{templateUrl:"views/student/interact.html",controller:"InteractCtrl",controllerAs:"interactCtrl"}).otherwise({redirectTo:"/"})}]).factory("socket",["socketFactory",function(a){return a()}]).run(["$rootScope","$location",function(a,b){a.getCurrentLocation=function(){return b.path()}}]),angular.module("rawrApp").controller("MainCtrl",["socket",function(a){this.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("rawrApp").controller("AboutCtrl",function(){this.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}),angular.module("rawrApp").controller("LoginCtrl",["$http","$location","auth",function(a,b,c){var d=this;d.formData={},d.login=function(e){e.preventDefault(),a.post("/api/login",d.formData).then(function(a){console.log(a),a.data.authenticated?("student"===a.data.role?b.path("/student/interact"):"prof"===a.data.role?b.path("/prof/dashboard"):console.log("weird role"),c.user={},c.user.authenticated=!0,c.user.username=a.data.user,c.user.userRole=a.data.role,c.user["class"]=a.data["class"]):console.log("Login failed")},function(a){console.log(a)})}}]),angular.module("rawrApp").controller("DashboardCtrl",["socket","auth",function(a,b){var c=this;c.classCode=b.user.accessCode,c.className=b.user["class"],a.on("vote",function(a){console.log(a)})}]),angular.module("rawrApp").controller("EnrolCtrl",["$http","$location","auth",function(a,b,c){var d=this;d.formData={},d.signUp=function(e){e.preventDefault(),a.post("/api/users",d.formData).then(function(a){console.log(a),"prof"===d.formData.userRole?b.path("/prof/dashboard"):"student"===d.formData.userRole?b.path("/student/interact"):console.log("weird role"),c.user={},c.user.authenticated=!0,c.user.username=a.data.data.username,c.user.userRole=a.data.data.userRole,c.user["class"]=a.data.data["class"]},function(a){console.log(a)})}}]),angular.module("rawrApp").controller("InteractCtrl",["socket","auth","ngDialog",function(a,b,c){function d(){c.open({template:"views/student/yesNoModal.html",controller:"YesNoCtrl"})}var e=this;e.question="",console.log(b),a.emit("init-message",{"class":b.user["class"]}),a.on("question",function(a){console.log(a),d()}),e.broadcastQuestion=function(c){c.preventDefault(),a.emit("question",{"class":b.user["class"],username:b.user.username,question:e.question})}}]),angular.module("rawrApp").controller("YesNoCtrl",["socket","auth",function(a,b){var c=this;c.voteYes=function(){a.emit("vote",{"class":b.user["class"],username:b.user.username,question:c.question,agree:!0})},c.voteNo=function(){a.emit("vote",{"class":b.user["class"],username:b.user.username,question:c.question,agree:!1})}}]),angular.module("rawrApp").service("auth",function(){var a=this;a.user={}}),angular.module("rawrApp").run(["$templateCache",function(a){a.put("views/about.html","<p>This is the about view.</p>"),a.put("views/enrol.html",'<div class="row"> <div class="col-md-12"> <div class="login-panel panel panel-default"> <div class="panel-heading"> <h3 class="panel-title">Sign Up</h3> </div> <div class="panel-body"> <form role="form" ng-submit="login()"> <fieldset> <div class="form-group text-center"> <label for="identity">Your Identity</label><br> <select ng-init="enrolCtrl.formData.userRole=\'student\'" ng-model="enrolCtrl.formData.userRole" id="identity"> <option value="prof">Professor</option> <option value="student" selected>Student</option> </select> </div> <div ng-if="enrolCtrl.formData.userRole === \'student\'"> <div class="form-group text-center"> <label for="accesscode">Enter Your Access Code</label> <input type="text" class="form-control" id="accesscode" ng-model="enrolCtrl.formData.accessCode" placeholder="ex. Enter 6 Digit Access Code" autofocus required> </div> </div> <div ng-if="enrolCtrl.formData.userRole === \'prof\'"> <div class="form-group text-center"> <label for="class">Your Class Name</label> <input type="text" class="form-control" id="class" ng-model="enrolCtrl.formData.class" placeholder="Your class" autofocus required> </div> </div> <div class="form-group text-center"> <label for="username">Create a Username</label> <input type="username" class="form-control" id="username" ng-model="enrolCtrl.formData.username" placeholder="ex. jhylee95" autofocus required> </div> <div class="form-group text-center"> <label for="pwd">Create a Password</label> <input type="password" class="form-control" id="pwd" ng-model="enrolCtrl.formData.password" placeholder="Your Password" required> </div> <!-- Change this to a button or input when using this as a form --> <center><button type="submit" class="btn btn-blue" ng-click="enrolCtrl.signUp($event)">Submit</button></center> <!-- <a href="index.html" class="btn btn-lg btn-success btn-block">Login</a> --> </fieldset> </form> </div> </div> </div> </div>'),a.put("views/login.html",'<div class="row"> <div class="col-md-12"> <div class="login-panel panel panel-default"> <div class="panel-heading"> <h3 class="panel-title">Please Login Below</h3> </div> <div class="panel-body"> <form role="form" ng-submit="login()"> <fieldset> <div class="form-group"> <input type="username" class="form-control" id="username" ng-model="loginCtrl.formData.username" placeholder="ex. jhylee95" autofocus required> </div> <div class="form-group"> <input type="password" class="form-control" id="pwd" ng-model="loginCtrl.formData.password" placeholder="Your Password" required> </div> <div class="form-group"> <label>Don\'t have an account? <a href="#/enrol">Sign Up</a> Today!</label> </div> <!-- Change this to a button or input when using this as a form --> <center><button type="submit" class="btn btn-blue" ng-click="loginCtrl.login($event)">Submit</button></center> <!-- <a href="index.html" class="btn btn-lg btn-success btn-block">Login</a> --> </fieldset> </form> </div> </div> </div> </div>'),a.put("views/main.html",'<div class="jumbotron"> <h1>Hello Everyone</h1> <p class="lead"> Placeholder. </p> <p><a class="btn btn-lg btn-success" ng-href="#/">Aye!<span class="glyphicon glyphicon-ok"></span></a></p> </div> <div class="row marketing"> <h4>Education</h4> <p> Lorem Ipsum </p> <h4>Education</h4> <p>Lorem Ipsum </p> </div>'),a.put("views/prof/dashboard.html",'<div class="row"> <div class="col-lg-12"> <h1 class="text-center">CLASS UI</h1> <hr> </div> <div class="col-lg-12"> <div class="table-responsive"> <table class="table table-condensed"> <thead> <tr> <td class="text-center"> <strong>Question</strong> </td> </tr> </thead> <tbody> <tr ng-repeat="table in question.name"> <td class="text-center">{{question.name}}</td> </tr> </tbody> </table> </div> </div> <div class="col-lg-12"> <h1 class="text-center">Current Question</h1> <hr> <h2>{{question.name}}</h2> <!-- Place Chart Here\n			<label for = "yes"></label>\n			<div id = "yes"></div>\n			<label for = "no"></label>\n			<div id = "no"></div>\n		  --> </div> </div> '),a.put("views/student/interact.html",'<div class="row"> <div class="col-lg-12"> <h1 class="page-header text-center">Ask a Question</h1> </div> <!-- /.col-lg-12 --> </div> <!-- /.row --> <div class="row"> <div class="col-lg-12"> <div class="panel panel-default"> <div class="panel-heading"> </div> <!-- /.panel-heading --> <form ng-submit="addQuestion()"> <div class="content"> <div class="form" role="form" ng-submit="addQuestion()"> <div class="row"> <div class="col-lg-12 form-group"> <div class="large-padded-row"> <style>.form-control {\n                      outline: 0;\n                      border-color: #000;\n                      border-style: solid;\n                      border-width: 2px;\n                      width: 95%;\n                      background-color: #ffffff;\n                      padding: 6px;\n                      border-radius: 2px;\n                      margin-bottom: 5px;\n                      font-size: 14px;\n                    }\n\n                    .form-control-small {\n                      -webkit-transition: width .5s ease-in-out;\n                      -moz-transition: width .5s ease-in-out;\n                      -o-transition: width .5s ease-in-out;\n                      -ms-transition: width .5s ease-in-out;\n                      transition: width .5s ease-in-out;\n                      width: 72%;\n                    }\n\n                    .form-control:-webkit-autofill {\n                      background-color: #fff !important;\n                    }\n\n                    .form-control-fill {\n                      width: 96%;\n                    }\n\n                    #types_dropdown {\n                      overflow-y: hidden;\n                      max-height: 150px;\n                      border: 2px;\n                    }\n\n                    input:-webkit-autofill {\n                      -webkit-box-shadow: 0 0 0px 1000px white inset;\n                    }\n\n                    textarea {\n                      min-height: 200px;\n                    }</style> </div> <div class="col-lg-12 form-group"> <div class="large-padded-row"> <br> <textarea ng-model="interactCtrl.question" type="unitPrice" class="form-control" id="question" placeholder="Ask a question here..."></textarea> </div> </div> <div class="col-md-12 form-group"> <br> <center><button type="submit" class="btn btn-blue" ng-click="interactCtrl.broadcastQuestion($event)">Submit</button></center> </div>  </div> </div></div></div></form> </div> </div> </div>   '),a.put("views/student/yesNoModal.html",'<div class="ngdialog-content"> <div class="ngdialog-message"> <h2>Native Angular.js solution</h2> <div>With ngDialog you don\'t need jQuery or Bootstrap to create dialogs for <code>ng-app:</code></div> <ul class="mt"> <li>Use it in controllers, factories or directives</li> <li>Create your own directives</li> <li>Style all UI and templates</li> <li>Configure themes</li> <li>Add animations and effects</li> </ul> <div class="mt">Module is shipped with both <code>ngDialog</code> service and default directive.</div> </div> <div class="ngdialog-buttons mt"> <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="next()">►</button> </div> </div>')}]);