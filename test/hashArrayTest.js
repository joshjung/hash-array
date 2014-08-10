var assert = require('assert'),
	HashArray = require('../src/HashArray'),
	i = 0;

describe('HashArray', function() {
	describe('new HashArray(keys) should work', function() {
		var ha = new HashArray(['key'], function(type) {
			it('Should callback with "construct"', function() {
				assert.equal(type, 'construct');
			});
		});

		it('Should have a all.length of 0.', function() {
			assert.equal(ha.all.length, 0);
		});

		it('Should have a map with no keys.', function() {
			for (var key in ha.map)
				assert.equal(true, false);
		});
	});

	describe('add(items) should work with 1 item', function() {
		var ha = new HashArray(['key']);
		var item = {
			key: 'whatever'
		};

		ha.callback = function(type, what) {
			it('Should have a "add" callback.', function() {
				assert.equal(type, 'add');
				assert.strictEqual(what[0], item);
			});
		};

		ha.add(item);

		it('Should have a single item.', function() {
			assert.equal(ha.all.length, 1);
		});

		it('Should map "whatever" to that item.', function() {
			assert.equal(ha.get('whatever'), item);
		});
	});

	describe('add(items) should not allow addition of same item twice.', function() {
		var ha = new HashArray(['key']);
		var item = {
			key: 'whatever'
		};

		ha.add(item);
		ha.add(item);
		ha.add(item);
		ha.add(item);

		it('Should have a single item.', function() {
			assert.equal(ha.all.length, 1);
		});

		it('Should map "whatever" to that item.', function() {
			assert.equal(ha.get('whatever'), item);
		});
	});

	describe('add(items) should work with 1 item and multiple keys and key depths.', function() {
		var ha = new HashArray([
			'key', ['child', 'key'],
			['child', 'key2']
		]);

		var item = {
			key: 'whatever',
			child: {
				key: 'deeeep',
				key2: 'sup'
			}
		};

		ha.add(item);

		it('Should map "deeeep" to that item.', function() {
			assert.equal(ha.get('deeeep'), item);
		});

		it('Should have the item be the same for all key lookups', function() {
			assert.equal(ha.get('deeeep'), ha.get('sup'));
			assert.equal(ha.get('sup'), ha.get('whatever'));
		});
	});

	describe('add(items) should work with > 1 item', function() {
		var ha = new HashArray(['key']);
		var item1 = {
				key: 'whatever'
			},
			item2 = {
				key: 'whatever2'
			},
			item3 = {
				key: 'whatever3'
			},
			item4 = {
				key: 'whatever3'
			};

		ha.callback = function(type, what) {
			it('Should have a "add" callback.', function() {
				assert.equal(type, 'add');
				assert.strictEqual(what[0], item1);
				assert.strictEqual(what[1], item2);
				assert.strictEqual(what[2], item3);
				assert.strictEqual(what[3], item4);
			});
		};

		ha.add(item1, item2, item3, item4);

		it('Should have 3 items', function() {
			assert.equal(ha.all.length, 4);
		});

		it('Should map "whatever" to item1', function() {
			assert.deepEqual(ha.get('whatever'), item1);
		});

		it('Should map "whatever2" to item2', function() {
			assert.equal(ha.get('whatever2'), item2);
		});

		it('Should map "whatever3" to item3', function() {
			assert.deepEqual(ha.get('whatever3'), [item3, item4]);
		});
	});

	describe('removeByKey(keys) should work with 1 item', function() {
		var ha = new HashArray(['key']);
		var item = {
			key: 'whatever'
		};
		ha.add(item);
		ha.removeByKey('whatever');

		it('Should have no items after remove by key', function() {
			assert.equal(ha.all.length, 0);
		});

		it('Should have a map with no keys.', function() {
			for (var key in ha.map)
				assert.equal(key, undefined);
		});
	});

	describe('removeByKey(keys) should work with 1 item and multiple key depths', function() {
		var ha = new HashArray([
			['child', 'key'],
			['child', 'key2'],
			'key'
		]);

		var item = {
			key: 'whatever',
			child: {
				key: 'deeeeep',
				key2: 'foobang'
			}
		};

		ha.add(item);

		ha.removeByKey('deeeeep');

		it('Should have no items after remove by key', function() {
			assert.equal(ha.all.length, 0);
		});

		it('Should have a map with no keys.', function() {
			for (var key in ha.map)
				assert.equal(key, undefined);
		});
	});

	describe('removeByKey(keys) should work with 4 items', function() {
		var ha = new HashArray(['key']);
		var item1 = {
				key: 'whatever'
			},
			item2 = {
				key: 'whatever2'
			},
			item3 = {
				key: 'whatever3'
			},
			item4 = {
				key: 'whatever3'
			};

		console.log("START");
		ha.add(item1, item2, item3, item4);
		ha.callback = function(type, what) {
			it('Should have a "removeByKey" callback.', function() {
				assert.equal(type, 'removeByKey');
				assert.strictEqual(what[0], item3);
				assert.strictEqual(what[1], item4);
			});
		};
		ha.removeByKey('whatever3');

		it('Should have 2 items after remove by key', function() {
			assert.equal(ha.all.length, 2);
		});

		it('Should have no key for removed item (has)', function() {
			assert.equal(ha.has('whatever3'), false);
		});

		it('Should have no key for removed item (get)', function() {
			assert.equal(ha.get('whatever3'), undefined);
		});

		it('Should have remaining two items by key', function() {
			assert.equal(ha.get('whatever'), item1);
			assert.equal(ha.get('whatever2'), item2);
		});
	});

	describe('remove(items) should work with 1 item', function() {
		var ha = new HashArray(['key']);
		var item = {
			key: 'whatever'
		};
		ha.add(item);
		ha.callback = function(type, what) {
			it('Should have a "remove" callback.', function() {
				assert.equal(type, 'remove');
				assert.strictEqual(what[0], item);
			});
		};
		ha.remove(item);

		it('Should have no items after remove', function() {
			assert.equal(ha.all.length, 0);
		});

		it('Should have a map with no keys.', function() {
			for (var key in ha.map)
				assert.equal(key, undefined);
		});
	});

	describe('remove(items) should work with 3 items', function() {
		var ha = new HashArray(['key']);
		var item1 = {
				key: 'whatever'
			},
			item2 = {
				key: 'whatever2'
			},
			item3 = {
				key: 'whatever3'
			};

		ha.add(item1, item2, item3);
		ha.callback = function(type, what) {
			it('Should have a "remove" callback.', function() {
				assert.equal(type, 'remove');
				assert.strictEqual(what[0], item2);
			});
		};
		ha.remove(item2);

		it('Should have 2 items after remove by key', function() {
			assert.equal(ha.all.length, 2);
		});

		it('Should have no key for removed item (has)', function() {
			assert.equal(ha.has('whatever2'), false);
		});

		it('Should have no key for removed item (get)', function() {
			assert.equal(ha.get('whatever2'), undefined);
		});

		it('Should have remaining two items by key', function() {
			assert.equal(ha.get('whatever'), item1);
			assert.equal(ha.get('whatever3'), item3);
		});
	});

	describe('removeAll() should work', function() {
		var ha = new HashArray(['key']);
		var item1 = {
				key: 'whatever'
			},
			item2 = {
				key: 'whatever2'
			},
			item3 = {
				key: 'whatever3'
			};

		ha.add(item1, item2, item3);
		ha.callback = function(type, what) {
			it('Should have a "remove" callback.', function() {
				assert.equal(type, 'remove');
				assert.strictEqual(what[0], item1);
				assert.strictEqual(what[1], item2);
				assert.strictEqual(what[2], item3);
			});

			it('Should have 0 items after removeAll', function() {
				assert.equal(ha.all.length, 0);
			});

			it('Should have a map with no keys.', function() {
				for (var key in ha.map)
					assert.equal(key, undefined);
			});
		};
		ha.removeAll();
	});
});