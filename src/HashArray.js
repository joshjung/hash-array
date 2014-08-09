var HashArray = function(keyFields) {
	this._map = {};
	this._list = [];

	this.keyFields = keyFields;

	this.__defineGetter__('all', function() {
		return this._list;
	});

	this.__defineGetter__('map', function() {
		return this._map;
	});
};

HashArray.prototype = {
	add: function() {
		for (var i = 0; i < arguments.length; i++) {
			var obj = arguments[i];
			for (var key in this.keyFields) {
				key = this.keyFields[key];
				var inst = this.find(obj, key);
				if (inst) {
					if (this._map[inst]) {
						throw Error('HashArray key ' + obj[key] + ' already exists');
					}

					this._map[inst] = obj;
				}
			}

			this._list.push(obj);
		}
	},
	addMap: function(key, obj) {
		this._map[key] = obj;
	},
	get: function(key) {
		return this._map[key];
	},
	has: function(key) {
		return this._map.hasOwnProperty(key);
	},
	removeByKey: function() {
		for (var i = 0; i < arguments.length; i++) {
			var key = arguments[i];
			var item = this._map[key];
			if (item) {
				for (var ix in this.keyFields) {
					var key2 = this.find(item, this.keyFields[ix]);
					if (key2)
						delete this._map[key2];
				}
				this._list.splice(this._list.indexOf(item), 1);
			}
			delete this._map[key];
		}
	},
	remove: function() {
		for (var i = 0; i < arguments.length; i++) {
			for (var ix in this.keyFields) {
				var key = this.find(arguments[i], this.keyFields[ix]);
				if (key) {
					delete this._map[key];
				}
			}

			this._list.splice(this._list.indexOf(arguments[i]), 1);
		}
	},
	find: function(obj, path) {
		if (typeof path === 'string') {
			return obj[path];
		}

		var dup = path.concat();
		// else assume array.
		while (dup.length && obj) {
			obj = obj[dup.shift()];
		}

		return obj;
	}
};

module.exports = HashArray;