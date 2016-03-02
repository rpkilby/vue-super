/**
 * Provides a $super handler for accessing parent methods from a subclass.
 * Behaves similarly to python's super implementation.
 *
 * Example:
 *
 *  const Parent = Vue.extend({
 *      methods: {
 *          doTheThing: function(){
 *              console.log('performing a parental action');
 *          },
 *      },
 *  })
 *
 *  const Child = Parent.extend({
 *      methods: {
 *          doTheThing: function() {
 *              this.$super(Child, this).doTheThing();
 *              console.log('doing a childlike thing');
 *          },
 *      },
 *  })
 *
 *  const Final = Child.extend({
 *      methods: {
 *          doTheThing: function() {
 *              this.$super.doTheThing();
 *              console.log('doing the final thing');
 *          },
 *      },
 *  })
 */


function $super(type, self) {
    if (!(self instanceof type))
        throw new TypeError(`'${self}' not instance of '${type}'`);

    const unbound = type.super.options.methods;
    const bound = {};

    for (const key of Object.keys(unbound))
        bound[key] = unbound[key].bind(self);

    return bound;
}


function install(Vue) {
    Object.defineProperties(Vue.prototype, {
        $super: {
            get: function() {
                // 'clone' the function so we don't overwrite properties
                // across invocations.
                const local = $super.bind({});

                const methods = local(this.constructor, this);
                for (const key of Object.keys(methods))
                    local[key] = methods[key].bind(this);

                return local;
            },
        },
    });
}

// auto install
if (typeof window !== 'undefined' && window.Vue)
    window.Vue.use(install);


export default install;
