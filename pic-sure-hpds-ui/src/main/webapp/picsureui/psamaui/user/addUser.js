define(["backbone", "handlebars", "user/connections", "picSure/userFunctions", "picSure/picsureFunctions", "text!user/addUser.hbs", "text!user/addUserConnectionForm.hbs", "util/notification"],
		function(BB, HBS, connections, userFunctions, picsureFunctions, template, connectionTemplate, notification){
	var view = BB.View.extend({
		initialize: function(opts){
			this.connectionTemplate = HBS.compile(connectionTemplate);
			this.template = HBS.compile(template);
			this.managementConsole = opts.managementConsole;
        },
		events: {
			"change #new-user-connection-dropdown":"renderConnectionForm",
			"click #save-user-button": "createUser",
			"input #email": "validateEmail"
		},
		validateEmail: function(event){
	        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	        if(!emailReg.test($('input[name=email]').val())) {
	        	$('#error-email').html('Enter a valid email address.');
	        	$("#error-email").show();
	        	$("#save-user-button").prop( "disabled", true);
        	} else {
        		//only check the current connection's users; unique per connection
    			var emails = _.pluck(this.connection.users, "email")
    			if(emails.includes($("#email").val())){
    				$('#error-email').html('That email address is already in use.');
    				$("#error-email").show();
    				$("#save-user-button").prop( "disabled", true);
    			} else {
    				//happy path - valid and unique
    				$("#error-email").hide();
    				$("#save-user-button").prop( "disabled", false);
    			}
        	}
		},
		createUser: function(event){
			// cheeck to see if an email has been entered
            if ($("input[name=email]").val().trim() == "") {
                notification.showFailureMessage("Missing: You must enter a value for user's email");
                return;
            }
			var metadata = {};
			var roles = [];
			_.each(this.$('input:checked'), function (checkbox) {
                roles.push({uuid: checkbox.value});
            })
            //var roles = this.$('input:checked').each;
			_.each($('#current-connection-form input[type=text]'), function(entry){
			metadata[entry.name] = entry.value});
			var user = {
				connection: {
					id: $('#new-user-connection-dropdown').val()
				},
				generalMetadata:JSON.stringify(metadata),
				roles: roles
			};
			userFunctions.createOrUpdateUser(
				[user],
				"POST",
				function(result){
					console.log(result);
                    this.managementConsole.render();
				}.bind(this)
			);
		},
		renderConnectionForm: function(event){
            this.connection = _.find(this.connections, {id:event.target.value});
			userFunctions.getAvailableRoles(function (roles) {
				$('#current-connection-form', this.$el).html(
						this.connectionTemplate({
								connection: this.connection,
								createOrUpdateUser: true, 
								availableRoles: roles
						}));
            }.bind(this));
		},
        getConnections : function(callback){
            picsureFunctions.getConnection("", false, callback);
        },
		render: function(){
			// load available connections first
            this.getConnections(function (connections) {
                this.connections = connections;
                this.$el.html(this.template({connections: this.connections}));
                this.renderConnectionForm({target:{value:this.connections[0].id}})
            }.bind(this));
		}
	});
	return view;
});