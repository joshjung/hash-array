var HashArray = function(keyFields, callback) {
	this._map = {};
	this._list = [];
	this.callback = callback;

	this.keyFields = keyFields;

	this.__defineGetter__('all', function() {
		return this._list;
	});

	this.__defineGetter__('map', function() {
		return this._map;
	});

	if (callback) {
		callback('construct');
	}
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
		if (this.callback) {
			this.callback('add', arguments);
		}
	},
	addMap: function(key, obj) {
		this._map[key] = obj;
		if (this.callback) {
			this.callback('addMap', {
				key: key,
				obj: obj
			});
		}
	},
	get: function(key) {
		return this._map[key];
	},
	has: function(key) {
		return this._map.hasOwnProperty(key);
	},
	removeByKey: function() {
		var removed = [];
		for (var i = 0; i < arguments.length; i++) {
			var key = arguments[i];
			var item = this._map[key];
			if (item) {
				removed.push(item);
				for (var ix in this.keyFields) {
					var key2 = this.find(item, this.keyFields[ix]);
					if (key2)
						delete this._map[key2];
				}
				this._list.splice(this._list.indexOf(item), 1);
			}
			delete this._map[key];
		}

		if (this.callback) {
			this.callback('removeByKey', removed);
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

		if (this.callback) {
			this.callback('remove', arguments);
		}
	},
	removeAll: function() {
		var old = this._list.concat();
		this._map = {};
		this._list = [];

		if (this.callback) {
			this.callback('remove', old);
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