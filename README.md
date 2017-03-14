# vue-super

[![Build Status](https://travis-ci.org/rpkilby/vue-super.svg?branch=master)](https://travis-ci.org/rpkilby/vue-super)
[![codecov](https://codecov.io/gh/rpkilby/vue-super/branch/master/graph/badge.svg)](https://codecov.io/gh/rpkilby/vue-super)


Provides a `$super` handler for accessing parent vue methods from a subclass.
Behaves similarly to python's super implementation.

Example:

```js
const Parent = Vue.extend({
    methods: {
        doTheThing: function(){
            console.log('performing a parental action');
        },
    },
})

const Child = Parent.extend({
    methods: {
        doTheThing: function() {
            this.$super(Child, this).doTheThing();
            console.log('doing a childlike thing');
        },
    },
})
```

For convenience, methods are directly accessible on the `$super` object.
However, this behavior is only valid on a final subclass.

```js
const Final = Child.extend({
    methods: {
        doTheThing: function() {
            this.$super.doTheThing();
            console.log('doing the final thing');
        },
    },
})
```
