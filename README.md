![](https://nodei.co/npm/hasharray.png?downloads=True&stars=True)

HashArray
=========

HashArray is a data structure that combines the best features of a hash and an array. Think of it as a super-lightweight, extensible, self-indexing database in memory.

Among other things, it includes `add(...)`, `addAll(...)`, `remove(...)`, `forEach(...)` and `get(...)` operations that work for both simple keys like `'prop'` and deep keys like `['someChild', 'childProp']`.

Install
=======

    npm install hasharray

Simplest Use Case
=================

    var HashArray = require('hasharray');
    var ha = new HashArray('id');

    ha.add({id: 'someId0', name: 'Josh'},
           {id: 'someId1', name: 'Joseph'},
           {id: 'someId2', name: 'Kuba'},
           {id: 'someId3', name: 'Ty'});

    console.log(ha.get('someId0').name); // 'Kuba'

Purpose
=======

My goal with this data structure was to attempt to get the ordered features of an Array while keeping lookup O(1) for any arbitrary keys. The cost is a small loss of memory.

In addition HashArray works with deep keys. Consider the following array of customer objects:

     var customers = [{
       id: 1337,
       name: {
         first: 'Bob',
         last: 'Winkle,
       },
       dob: new Date(1985, 1, 4),
       address: {
         city: 'Chicago',
         zip: 60616
       }
     }...]
   
If we had multiple people who lived in the zip code `60616`, ideally we would want to index the data by zip code so that if we had to rapidly retrieve all those people we could do so.

With HashArray, we could index the above data for O(1) retrieval by `id`, `['name', 'first']`, and `['name', 'last]` like so:

    var HashArray = require('hasharray'),
    ha = new HashArray(['id', ['name', 'first'], ['name', 'last']]);
    ha.addAll(customers);

    // At this point we have indexed everything by ['name', 'first'] so there is already an array built internal to `ha` that
    // contains all the 'Bob' customers. So this operation is O(1).
    var bobs = ha.get('Bob');

Note: the order of the `bobs` array above will be the order in which they were inserted.

Normally when you use a standard JavaScript Object to map keys to values, the only way to retrieve the count of objects is to loop over all the keys which is O(n). However, with HashArray if you want to determine the length of all customers in O(1), it is as simple as:

    ha.all.length; // in addition, ha.all is an ordered array of all customers in the order in which they were added!

At this time, I am also working on adding functions for statistical analysis, like `sum(...)`. See the tests for more information. I'll be adding more to this documentation as I go.

Examples
========

Basic Usage
-----------

    var HashArray = require ('hasharray');

    // Create new hasharray with two key mappings.
    var ha = new HashArray(['name', 'zip']);
    
    // Add 2 objects to the hash.
    var item1 = {name: 'Josh', zip: '54321'};
    var item2 = {name: 'Josh', zip: '12345'};
    ha.add(item1, item2);

    if (ha.has('Josh'))
      console.log(ha.get('Josh')); // Will output two objects to the console

    // Display the number of unique objects. In this case, 2.
    console.log(ha.all.length);

    // Remove an element by one of the keys
    ha.removeByKey('54321'); // This removes item1

    // Remove item2 directly
    ha.remove(item2);

Deep Keys
---------

    var HashArray = require ('hasharray');
    var ha = new HashArray([
          ['name', 'last'], // Internally maps obj.name.last -> obj
          ['name', 'first'], // Internally maps obj.name.first -> obj
          'zip'
        ]);
    
    ha.add({
        name: {
          first: 'Josh',
          last: 'Jung'
        },
        zip: 60616
      });

    console.log(ha.get(60616) === ha.get('Josh') == ha.get('Jung')); // true

getAsArray(...): Retrieving Multiples of a Single Key
-----------------------------------------------------

    var ha = new HashArray(['firstName', 'lastName']);

    var person1 = {firstName: 'Bill', lastName: 'William'},
      person2 = {firstName: 'Bob', lastName: 'William'};

    ha.add(person1, person2);

    console.log(ha.getAsArray('William')); // [person1, person2]

getAll(...): Retrieving Sets by Multiple Keys
---------------------------------------------

    var ha = new HashArray(['firstName', 'lastName']);

    var person1 = {firstName: 'Victor',  lastName: 'Victor'},
      person2 =   {firstName: 'Victor',  lastName: 'Manning'},
      person3 =   {firstName: 'Manning', lastName: 'Victor'};
      person4 =   {firstName: 'John',    lastName: 'Smith'};

    ha.add(person1, person2, person3, person4);

    console.log(ha.getAll(['Victor', 'Smith'])); // [person1, person2, person3, person4]
    console.log(ha.getAll(['John', 'Smith'])); // [person4]

Key Duplicates
--------------

If two items contain the same key, they are appended to an array at that key location.

    var HashArray = require ('hasharray');
    var ha = new HashArray([
          ['name', 'last'],
          ['name', 'first']
        ]);
    
    ha.add({
        name: {
          first: 'Josh',
          last: 'Jung'
        }
      },
      {
        name: {
          first: 'Josh',
          last: 'Mills'
        }
      },
      {
        name: {
          first: 'Josh',
          last: 'Willis'
        }
      });

    console.log(ha.get('Josh').length); // Will be 3
    console.log(ha.get('Willis')); // Will be {name: {first: 'Josh', last: 'Willis'} }

has(...): duplicate check
-------------------------

If you need to check if an item already exists for a given key, simply use `has(...)`:

    ha.has('someKeyValue');

forEach(keys, callback): looping over sets of items
---------------------------------------------------

    // Here we index by item.type and item.data.speed
    var ha = new HashArray(['type', ['data', 'speed']]);

    var a = {type: 'airplane', data: {speed: 100, weight: 10000}},
      b =   {type: 'airplane', data: {speed: 100, weight: 20000}},
      c =   {type: 'airplane', data: {speed: 25, weight: 50000}};
      d =   {type: 'boat', data: {speed: 10, weight: 100000}};
      e =   {type: 'boat', data: {speed: 5, weight: 200000}};

    ha.add(a, b, c, d, e);
    
    // Loop through just airplanes
    ha.forEach('airplane', function (airplane) {console.log(airplane);});
    
    // Loop through airplanes AND boats
    ha.forEach(['airplane', 'boat'], function (airplane) {console.log(airplane);});

    // Loop through all items that have a speed of 100
    ha.forEach(100, function (airplane) {console.log(airplane);});

forEachDeep(keys, key, callback)
--------------------------------

`forEachDeep()` differs from `forEach()` in that it passes a value by key you specify to the `callback`:

    // Here we index by item.type and item.data.speed
    var ha = new HashArray(['type', ['data', 'speed']]);

    var a = {type: 'airplane', data: {speed: 100, weight: 10000}},
      b =   {type: 'airplane', data: {speed: 100, weight: 20000}},
      c =   {type: 'airplane', data: {speed: 25, weight: 50000}};
      d =   {type: 'boat', data: {speed: 10, weight: 100000}};
      e =   {type: 'boat', data: {speed: 5, weight: 200000}};

    ha.add(a, b, c, d, e);

    // Loop through all items that have a speed of 100 and only pass the speed to the callback
    ha.forEachDeep(100, ['data', 'speed'], function (speed) {
      console.log('Speed is: ' + speed);
    });

Cloning
-------

Cloning makes a new HashArray clone of the original, ensuring that no Array objects are shared.

Keep in mind that cloning does deep clone objects in the collection. Therefore if you clone an object with three Object items, the clonee will be a new HashArray but will contain references to the original objects.

    var HashArray = require ('hasharray');
    ...
    var ha = new HashArray(['someKey']);
    ...
    var clonee = ha.clone();

Extending
---------

HashArray uses [jclass](https://www.npmjs.org/package/jclass), which is an implementation of [John Resig's simple inheritance model](http://ejohn.org/blog/simple-javascript-inheritance/).

You can easily extend HashArray:

    var MyCustomHashArray = HashArray.extend({
      ...
      init: function (keyFields) 
      {
        console.log('My custom hash array!');
        this._super(keyFields);
      }
      ...
    });
    
    var myCustomHashArray = new MyCustomHashArray();

See the `jclass` documentation for more information.

Testing
=======

    >mocha

    START

      ․․․․․․․․․․․․․․․․․․․․․․․․․․․․․․․․․․․

      61 passing (25ms)

License
=======

The MIT License (MIT)

Copyright (c) 2014 Joshua Jung

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
