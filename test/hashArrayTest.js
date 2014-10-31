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

  describe('add(items) should work with 2 item and duplicate keys', function() {
    var ha = new HashArray(['key1', 'key2']);
    var item1 = {
      key1: 'whatever',
      key2: 'whatever'
    };
    var item2 = {
      key1: 'whatever',
      key2: 'whatever'
    };

    ha.add(item1, item2);

    it('Should have a 2 items.', function() {
      assert.equal(ha.all.length, 2);
    });

    it('Should map "whatever" to both items in proper order.', function() {
      assert.equal(ha.getAsArray('whatever')[0], item1);
      assert.equal(ha.getAsArray('whatever')[1], item2);
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

	describe('clone() should work', function() {
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
		var ha2 = ha.clone();

		it('Should not strictly equal', function() {
			assert.notStrictEqual(ha, ha2);
		});

		it('Should deep equal', function() {
			assert.deepEqual(ha, ha2);
		});

		it('Original should not affect new one', function() {
			ha.removeAll();
			assert.strictEqual(ha.all.length, 0);
			assert.strictEqual(ha2.all.length, 3);
		});
	});

  describe('getAll(keys) should work', function() {
    var ha = new HashArray(['firstName', 'lastName']);

    var person1 = {firstName: 'Victor', lastName: 'Victor'},
      person2 =   {firstName: 'Victor', lastName: 'Manning'},
      person3 =   {firstName: 'Manning', lastName: 'Victor'};
      person4 =   {firstName: 'John', lastName: 'Smith'};

    ha.add(person1, person2, person3, person4);
    
    it('Should retrieve only items for the keys requested without duplicates.', function() {
      assert.equal(ha.getAll(['Victor', 'Smith']).length, 4);
      assert.equal(ha.getAll(['John', 'Smith']).length, 1);
    });
  });
  
  describe('forEach(keys, callback) should work', function() {
    var ha = new HashArray(['type']);

    var a = {type: 'airplane', data: {speed: 100, weight: 10000}},
      b =   {type: 'airplane', data: {speed: 50, weight: 20000}},
      c =   {type: 'airplane', data: {speed: 25, weight: 50000}};
      d =   {type: 'boat', data: {speed: 10, weight: 100000}};
      e =   {type: 'boat', data: {speed: 5, weight: 200000}};

    ha.add(a, b, c, d, e);

    it('should work.', function() {
      var s = 0;

      ha.forEach('airplane', function (airplane) {
        s += airplane.data.speed;
      });

      assert.equal(s, 175);
    });
    
    it('should work (speed test boats).', function() {
      var s = 0;

      ha.forEach(['boat'], function (item) {
        s += item.data.speed;
      });

      assert.equal(s, 15);
    });
    
    it('should work (speed test all).', function() {
      var s = 0;

      ha.forEach(['airplane', 'boat'], function (item) {
        s += item.data.speed;
      });

      assert.equal(s, 190);
    });
  });
  
  describe('forEachDeep(keys, key, callback) should work', function() {
    var ha = new HashArray(['type']);

    var a = {type: 'airplane', data: {speed: 100, weight: 10000}},
      b =   {type: 'airplane', data: {speed: 50, weight: 20000}},
      c =   {type: 'airplane', data: {speed: 25, weight: 50000}};
      d =   {type: 'boat', data: {speed: 10, weight: 100000}};
      e =   {type: 'boat', data: {speed: 5, weight: 200000}};

    ha.add(a, b, c, d, e);

    it('should work (speed test airplanes).', function() {
      var s = 0;

      ha.forEachDeep('airplane', ['data', 'speed'], function (speed) {
        s += speed;
      });

      assert.equal(s, 175);
    });
    
    it('should work (speed test boats).', function() {
      var s = 0;

      ha.forEachDeep(['boat'], ['data', 'speed'], function (speed) {
        s += speed;
      });

      assert.equal(s, 15);
    });
    
    it('should work (speed test all).', function() {
      var s = 0;

      ha.forEachDeep(['airplane', 'boat'], ['data', 'speed'], function (speed) {
        s += speed;
      });

      assert.equal(s, 190);
    });
  });
  
  describe('sum(keys, key) should work', function() {
    var ha = new HashArray(['type']);

    var a = {type: 'airplane', data: {speed: 100, weight: 10000}},
      b =   {type: 'airplane', data: {speed: 50, weight: 20000}},
      c =   {type: 'airplane', data: {speed: 25, weight: 50000}};
      d =   {type: 'boat', data: {speed: 10, weight: 100000}};
      e =   {type: 'boat', data: {speed: 5, weight: 200000}};

    ha.add(a, b, c, d, e);

    it('should work (speed test airplanes).', function() {
      assert.equal(ha.sum('airplane', ['data', 'speed']), 175);
    });
    
    it('should work (speed test boats).', function() {
      assert.equal(ha.sum(['boat'], ['data', 'speed']), 15);
    });
    
    it('should work (speed test all).', function() {
      assert.equal(ha.sum(['airplane', 'boat'], ['data', 'speed']), 190);
    });
    
    it('should work with weighted sums.', function() {
      assert.equal(ha.sum('boat', ['data', 'speed'], ['data', 'weight']), (10 * 100000) + (5 * 200000));
    });
  });
  
  describe('average(keys, key, weight) should work', function() {
    var ha = new HashArray(['type']);

    var a = {type: 'airplane', data: {speed: 100, weight: 0.1}},
      b =   {type: 'airplane', data: {speed: 50, weight: 0.2}},
      c =   {type: 'airplane', data: {speed: 25, weight: 0.2}};
      d =   {type: 'boat', data: {speed: 10, weight: 0.2}};
      e =   {type: 'boat', data: {speed: 5, weight: 0.3}};

    ha.add(a, b, c, d, e);

    it('should work (speed test airplanes).', function() {
      assert.equal(ha.average('airplane', ['data', 'speed']), 175 / 3);
    });

    it('should work (speed test boats).', function() {
      assert.equal(ha.average(['boat'], ['data', 'speed']), 15 / 2);
    });

    it('should work (speed test all).', function() {
      assert.equal(ha.average(['airplane', 'boat'], ['data', 'speed']), 190 / 5);
    });

    it('should work with weighted average == 1.0.', function() {
      assert.equal(ha.average(['airplane', 'boat'], ['data', 'speed'], ['data', 'weight']), 28.5);
    });

    it('should work with weighted average != 1.0.', function() {
      a.data.weight = 1.1;
      
      assert.equal(ha.average(['airplane', 'boat'], ['data', 'speed'], ['data', 'weight']), 64.25);
    });
  });
  
  describe('filter(keys, callback) should work and return new HashArray', function() {
    var ha = new HashArray(['type']);

    var a = {type: 'airplane', data: {speed: 100, weight: 0.1, mobile: true}},
      b =   {type: 'airplane', data: {speed: 50, weight: 0.2, mobile: true}},
      c =   {type: 'airplane', data: {speed: 25, weight: 0.2, mobile: false}};
      d =   {type: 'boat', data: {speed: 10, weight: 0.2, mobile: true}};
      e =   {type: 'boat', data: {speed: 5, weight: 0.3, mobile: true}};

    ha.add(a, b, c, d, e);

    it('should return a new HashArray', function() {
      assert.equal(ha.filter('*', function (item) {
        return item.data.speed == 100;
      }).isHashArray, true);
    });

    it('should return a new HashArray with the right length of items', function() {
      assert.equal(ha.filter('*', function (item) {
        return item.data.speed == 100;
      }).all.length, 1);
    });

    it('should work with a key for the callback', function() {
      assert.equal(ha.filter('airplane', ['data', 'mobile']).all.length, 2);
    });

    it('should work with a key for the callback for a non-existent key', function() {
      assert.equal(ha.filter('airplane', 'does not exist').all.length, 0);
    });
  });
});