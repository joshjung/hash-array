hash-array
==========

HashArray is a data structure that combines the best features of a hash and an array.  Among other things, it includes `add()`, `remove()` and `get()` operations work for both simple (`'prop'`) and deep keys (`['someChild', 'childProp']`).

Purpose
=======

HashMap(HashTable) lookup by key is O(1), whereas finding items in an Array is O(N). My goal with this data structure was to attempt to get the ordered features of an Array while making lookup O(1). The cost is small loss of memory.

In addition, I realized that Javascript data structures are multi-level. Consider an Array with a structure like this:

     var customers = [{
       id: 1337,
       name: {
         first: 'Bob',
         last: 'Winkle,
       }
       dob: new Date(1985, 1, 4),
       address: {
         city: 'Chicago',
         zip: 60616
       }
     }...]
   
If we had multiple people who lived in the zip code 60616, ideally we would want to index the data by zip code so that if we had to rapidly retrieve all those people we could do so.

This data structure allows you to index the data by any number of keys. For example, we could index the above data like so:

   var HashArray = require('hasharray');
   var ha = new HashArray(['id', ['name', 'first'], ['name', 'last']]);
   ha.addAll(customers);

Now if we wanted to we could retrieve every single customer that has the first name of 'Bob' in O(1) time by doing so:

   // At this point we have indexed everything by ['name', 'first'] so there is already an array built internal to `ha` that
   // contains all the 'Bob' customers. So this operation is O(1).
   var bobs = ha.get('Bob');
   
Note: the order of the `bobs` array above will be the order in which they were inserted.

This said, if you want to determine the length of all customers added in O(1), it is as simple as:

   ha.all.length; // ha.all is an ordered array of all customers in the order in which they were added!

At this time, I am also working on adding functions for statistical analysis, like `sum(...)`. See the tests for more information. I'll be adding more to this documentation as I go.

Install
=======

    npm install hasharray

Testing
=======

    >mocha

    START

      ․․․․․․․․․․․․․․․․․․․․․․․․․․․․․․․․․․․

      60 passing (25ms)

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

** Retreiving Multiples of a Single Key (getAsArray) **

    var ha = new HashArray(['firstName', 'lastName']);

    var person1 = {firstName: 'Bill', lastName: 'William'},
      person2 = {firstName: 'Bob', lastName: 'William'};

    ha.add(person1, person2);

    console.log(ha.getAsArray('William')); // [person1, person2]

** Retrieving Sets by Multiple Keys (getAll) **

    var ha = new HashArray(['firstName', 'lastName']);

    var person1 = {firstName: 'Victor',  lastName: 'Victor'},
      person2 =   {firstName: 'Victor',  lastName: 'Manning'},
      person3 =   {firstName: 'Manning', lastName: 'Victor'};
      person4 =   {firstName: 'John',    lastName: 'Smith'};

    ha.add(person1, person2, person3, person4);

    console.log(ha.getAll(['Victor', 'Smith'])); // [person1, person2, person3, person4]
    console.log(ha.getAll(['John', 'Smith'])); // [person4]

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
