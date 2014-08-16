hash-array
==========

A data structure that combines a hash and an array for add, remove and get operations by object keys or index.

Multi-level key paths can be used (e.g. `'name'` as well as `['child', 'label']` etc.).

Install
=======

    npm install hasharray

Testing
=======

    >mocha

    START

      ․․․․․․․․․․․․․․․․․․․․․․․․․․․․․․․․․․․

      38 passing (24ms)

Example
=======

**Basic Usage**

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

**Multi-level Keys**

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

**Key Duplicates**

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

**Cloning**

Cloning makes a new HashArray clone of the original, ensuring that no Array objects are shared.

Keep in mind that cloning does deep clone objects in the collection. Therefore if you clone an object with three Object items, the clonee will be a new HashArray but will contain references to the original objects.

    var HashArray = require ('hasharray');
    ...
    var ha = new HashArray(['someKey']);
    ...
    var clonee = ha.clone();

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
