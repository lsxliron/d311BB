requirejs.config({
	baseUrl: "./",

	paths: {
		jquery : './assets/jquery/jquery-2.1.4',
		underscore : './assets/Backbone/underscore',
		backbone : './assets/Backbone/backbone',
	},

	shim : {
		underscore: {
			exports: '_'
		},

		backbone : {
			deps : ['jquery', 'underscore'],
			exports: 'Backbone'
		}
	}
});

requirejs(['main']);