require.config({
	baseUrl: "/picsureui",
	urlArgs: "",
	paths: {
		jquery: 'webjars/jquery/3.5.1/jquery.min',
		autocomplete: 'webjars/devbridge-autocomplete/1.4.7/dist/jquery.autocomplete',
		underscore: 'webjars/underscorejs/1.8.3/underscore-min',
		bootstrap: 'webjars/bootstrap/3.4.1/js/bootstrap.min',
		bootstrapStyles: 'webjars/bootstrap/3.4.1/css/bootstrap.min.css',
		backbone: 'webjars/backbonejs/1.3.3/backbone-min',
		text: 'webjars/requirejs-text/2.0.15/text',
		handlebars: 'webjars/handlebars/4.7.6/handlebars.min',
		treeview: 'webjars/bootstrap-treeview/1.2.0/bootstrap-treeview.min',
		treeviewStyles: 'webjars/bootstrap-treeview/1.2.0/bootstrap-treeview.min.css',
		Noty: 'webjars/noty/3.1.4/lib/noty',
		NotyStyles: 'webjars/noty/3.1.4/lib/noty.css',
		"jstree":"webjars/jstree/3.3.7/jstree",
		auth0Lock: "webjars/auth0-lock/11.2.3/build/lock",
		"auth0-js": "webjars/auth0.js/9.2.3/build/auth0",
		"datatables.net": "webjars/datatables/1.10.25/js/jquery.dataTables",
		datatablesStyles: "webjars/datatables/1.10.25/css/jquery.dataTables.min.css",
		accessRule: "psamaui/accessRule/",
		application: "psamaui/application/",
		connection: "psamaui/connection/",
		login: "psamaui/login/",
		privilege: "psamaui/privilege/",
		picSure: "picSure/",
		plotly: "webjars/plotly.js-dist-min/2.12.1/plotly.min",
		role: "psamaui/role/",
		termsOfService: "psamaui/termsOfService/",
        user: "psamaui/user/",
        util: "psamaui/util/",
	},
	shim: {
		"bootstrap": {
			deps: ["jquery"]
		},
		"treeview": {
			deps:["bootstrap"]
		},
		"common/router":{
			deps:["overrides/main"]
		},
		"jstree": {
			deps: ["jquery"]
		},
		"auth0-js": {
            deps:["jquery"],
            exports: "Auth0"
        }
	}
});

require(["backbone", "common/session", "common/router", "underscore", "jquery", "bootstrap"],
    function(Backbone, session, router, _){
        Backbone.history.start({pushState:true});
        document.onmousemove = session.activity;
        document.onkeyup = session.activity;
    }
);
