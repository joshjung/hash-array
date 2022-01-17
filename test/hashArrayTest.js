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
    
		var ha2 = new HashArray('key');

		it('should work with a single key not wrapped in an array.', function() {
				assert.deepEqual(ha2.keyFields, ['key']);
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

		it('Should not crash on the reserved keyword "constructor".', function() {
			assert.equal(ha.get('constructo'), undefined);
		});
    
		it('Should return true to a collides for a similar object.', function() {
			assert.equal(ha.collides({key: 'whatever'}), true);
		});
    
		it('Should return false to a collides for a non-similar object.', function() {
			assert.equal(ha.collides({otherKey: 'whatever'}), false);
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
    
		it('Should return true to a collides for a similar object.', function() {
			assert.equal(ha.collides({key1: 'whatever'}), true);
      assert.equal(ha.collides({key2: 'whatever'}), true);
		});
  });
  
  describe('add(items) should work with 2 item and duplicate keys and options.ignoreDuplicates = true', function() {
    var ha = new HashArray(['key1', 'key2'], undefined, {ignoreDuplicates: true});
    var item1 = {
      key1: 'whatever1',
      key2: 'whatever2'
    };
    var item2 = {
      key1: 'whatever2',
      key2: 'whatever1'
    };

    ha.add(item1, item2);

    it('Should have a 1 item.', function() {
      assert.equal(ha.all.length, 1);
    });

    it('Should map "whatever1" to item1 only (first inserted).', function() {
      assert.equal(ha.getAsArray('whatever1').length, 1);
    });
    
    it('Should map "whatever2" to item1 only (first inserted).', function() {
      assert.equal(ha.getAsArray('whatever2').length, 1);
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

	describe('add should not allow adding of duplicate objects (single key)', function() {
		var ha = new HashArray('key');
		var item1 = {
				key: 'whatever'
			},
			item2 = {
				key: 'whatever2'
			},
			item3 = {
				key: 'whatever3'
			};

		ha.add(item1, item2, item3, item3);
    
		it('Length should be 3', function() {
			assert(ha.all.length == 3, 'Length was not 3, was ' + ha.all.length)
		});
	});
  
	describe('add should not allow adding of duplicate objects (multi key)', function() {
		var ha = new HashArray(['key1', 'key2']);
		var item1 = {
				key1: 'whatever2',
        key2: 'whatever3'
			},
			item2 = {
				key1: 'whatever2'
			},
			item3 = {
				key1: 'whatever3'
			};

		ha.add(item1, item2, item3, item3);
    
		it('Length should be 3', function() {
			assert(ha.all.length == 3, 'Length was not 3, was ' + ha.all.length)
		});
	});
  
	describe('intersection(ha) should work with simple single-key hasharrays', function() {
		var ha1 = new HashArray('key');
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
        key: 'whatever4'
      };

		ha1.add(item1, item2, item3);

		var ha2 = ha1.clone(null, true);
    ha2.add(item1, item3, item4);

    var intersection = ha1.intersection(ha2);
    
		it('Unioned hasharray should contain item1 and item3 only', function() {
      assert(intersection.all.length == 2);
			assert(intersection.collides(item1));
      assert(!intersection.collides(item2));
      assert(intersection.collides(item3));
      assert(!intersection.collides(item4));
		});
	});
  
	describe('intersection(ha) should work with simple multi-key hasharrays', function() {
		var ha1 = new HashArray(['key1', 'key2']);
		var item1 = {
				key1: 'whatever',
        key2: 'whatever4'
			},
			item2 = {
				key1: 'whatever2'
			},
			item3 = {
				key1: 'whatever3'
			},
      item4 = {
        key1: 'whatever4'
      };

		ha1.add(item1, item2, item3);

		var ha2 = ha1.clone(null, true);
    ha2.add(item1, item3, item4);

    var intersection = ha1.intersection(ha2);
    
		it('Unioned hasharray should contain item1, item3, and item4 because of the extra key', function() {
			assert(intersection.collides(item1), 'does not contain item1');
      assert(!intersection.collides(item2), 'does contain item2');
      assert(intersection.collides(item3), 'does not contain item3');
      assert(intersection.collides(item4), 'does not contain item4');
		});
	});
  
	describe('complement(ha) should work with simple multi-key hasharrays', function() {
		var ha1 = new HashArray(['key1', 'key2']);
		var item1 = {
				key1: 'whatever',
        key2: 'whatever4'
			},
			item2 = {
				key1: 'whatever2'
			},
			item3 = {
				key1: 'whatever3'
			},
      item4 = {
        key1: 'whatever4'
      };

    // Contains keys ['whatever', 'whatever2', 'whatever3', 'whatever4']
		ha1.add(item1, item2, item3, item4);

		var ha2 = ha1.clone(null, true);
    // Contains keys ['whatever', 'whatever3', 'whatever4']
    ha2.add(item1, item3);

    // SHOULD contain keys ['whatever2'] for item2 only.
    var complement = ha1.complement(ha2);
    
		it('Complemented hasharray should contain item2 only', function() {
			assert(!complement.collides(item1), 'does contain item1');
      assert(complement.collides(item2), 'does not contain item2');
      assert(!complement.collides(item3), 'does contain item3');
      assert(!complement.collides(item4), 'does contain item4');
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

  describe('methods without a standard return should return this.', function() {
    var ha = new HashArray('type');
    var item = {type: 'blah'};
    
    it('add(...) should return this', function() {
      assert(ha.add(item) === ha);
    });
    
    it('addAll(...) should return this', function() {
      assert(ha.addAll([{type: 'blah2'}]) === ha);
    });
    
    it('remove(...) should return this', function() {
      assert(ha.remove(item) === ha);
    });
    
    it('removeByKey(...) should return this', function() {
      assert(ha.removeByKey('blah2') === ha);
    });
  });
});