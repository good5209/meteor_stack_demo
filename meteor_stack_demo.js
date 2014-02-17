Stack = new Meteor.Collection('stack');

if (Meteor.isClient) {
	Template.body_template.stack_isEmpty = function () {
		return Stack.find({}, {limit: 1}).count() === 0;
	};

	Template.body_template.stack_element = function () {
		return Stack.find({}, {sort: {id: 1}});
	};

	Template.body_template.events({
		'click #push' : function (event, template) {
			push_value = template.find('#value').value;
			if (typeof console !== 'undefined') {
				console.log('push "' + push_value + '"');
			}
			Meteor.call('insertElement', push_value);
		},
		'click #pop' : function () {
			if (typeof console !== 'undefined') {
				console.log('pop');
			}
			Meteor.call('removeLast');
		},
		'click #clear' : function () {
			if (typeof console !== 'undefined') {
                                console.log('clear');
                        }
			Meteor.call('clear');
		}
	});
}

if (Meteor.isServer) {
	Meteor.startup(function () {
		// code to run on server at startup
		//Stack.remove({});
	});
	/*
	 * ref: http://gaslight.co/blog/how-to-remove-all-elements-from-a-meteor-collection
	 */
	Meteor.methods({
		insertElement: function (value) {
			var count = Stack.find().count();
			return Stack.insert({id: count, value: value});
		},
		removeLast: function () {
			var lastElement = Stack.find({}, {sort: {id: -1}, limit: 1}).fetch();
			return (typeof lastElement[0] !== 'undefined') && Stack.remove({id: lastElement[0].id});
		},
		clear: function () {
			return Stack.remove({});
		}
	});
}
