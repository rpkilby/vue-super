
import tap from 'tap';
import Vue from 'vue';
import VueSuper from './vue-super';

Vue.use(VueSuper);


const Parent = Vue.extend({
    name: 'parent',
    data() {
        return {parent: 0};
    },

    methods: {
        increment() {
            this.parent += 1;
        },
    },
});


const Child = Parent.extend({
    name: 'child',
    data() {
        return {child: 0};
    },

    methods: {
        increment() {
            this.$super(Child, this).increment();
            this.child += 1;
        },
    },
});


const Final = Child.extend({
    name: 'final',
    data() {
        return {'final': 0};
    },

    methods: {
        increment() {
            this.$super.increment();
            this.final += 1;
        },
    },
});


const Skip = Child.extend({
    data() {
        return {skip: 0};
    },

    methods: {
        increment() {
            // skip child - call parent instead
            this.$super(Child, this).increment();
            this.skip += 1;
        },
    },
});


tap.test('regular method should execute', t => {
    t.plan(2);

    const vue = new Parent();

    // base case - parent data should increment
    t.equal(vue.parent, 0);
    vue.increment();
    t.equal(vue.parent, 1);
});


tap.test('inherited method should call parent', t => {
    t.plan(4);

    const vue = new Child();

    // child should also call parent
    t.equal(vue.parent, 0);
    t.equal(vue.child, 0);
    vue.increment();
    t.equal(vue.parent, 1);
    t.equal(vue.child, 1);
});


tap.test('final class should have direct method access', t => {
    t.plan(6);

    const vue = new Final();

    // test entire call chain
    t.equal(vue.parent, 0);
    t.equal(vue.child, 0);
    t.equal(vue.final, 0);
    vue.increment();
    t.equal(vue.parent, 1);
    t.equal(vue.child, 1);
    t.equal(vue.final, 1);
});


tap.test('use provided class as base', t => {
    t.plan(6);

    const vue = new Skip();

    // Child implementation skipped
    t.equal(vue.parent, 0);
    t.equal(vue.child, 0);
    t.equal(vue.skip, 0);
    vue.increment();
    t.equal(vue.parent, 1);
    t.equal(vue.child, 0);
    t.equal(vue.skip, 1);
});
