// // function Animal() {}
// // function Dog(){}

// // Object.defineProperties(Animal.prototype,{
// //     name:{
// //         value() {
// //             return 'Animal';
// //         }
// //     },
// //     say:{
// //         value(){
// //             return `I'm ${this.name()}`
// //         }
// //     }
// // })

// // // dog instanceof Animal => true
// // //
// // // dog.__proto__.__proto__... === Animal.prototype

// // // dog.__proto__ == Dog.prototype
// // // Dog.prototype.__proto__ === Animal.prototye

// // Dog.prototype = Object.create(Animal.prototype,{
// //     constructor:{
// //         value: Dog,
// //         enumerable:false
// //     },
// //     name:{
// //         value(){
// //             return 'Dog'
// //         }
// //     }
// // });

// // console.log(Dog.prototype.constructor)


// // class Animal {
// //     name(){
// //         return 'Animal'
// //     }
// //     say(){
// //         reutrn `Im ${this.name()}`
// //     }
// // }

// // class Dog extends Animal {
// //     food = 'bone';
// //     name(){
// //         return 'Dog'
// //     }
// // }

// // console.log(new Dog() instanceof Animal)

// // function log(target){
// //     const desc = Object.getOwnPropertyDescriptors(target.prototype)

// //     for (const key of Object.keys(desc)){
// //         if(key === 'constructor'){
// //             continue;
// //         }

// //         const func = desc[key].value;
// //         if('function' === typeof func){
// //             Object.defineProperty(target.prototype,key,{
// //                 value(...args){
// //                     console.log('before'+ key)
// //                     const ret = func.apply(this,args)
// //                     console.log('after'+key)
// //                     return ret;
// //                 }
// //             })

// //         }
// //     }
// // }
// // // target 示例对象
// // // key 该类成员的名称
// // // descriptor 该类型成员的描述符
// // function readonly(target,key,descriptor){
// //     descriptor.writable = false
// // }

// // function validate(target,key,descriptor){
// //     const func = descriptor.value
// //     descriptor.value = function(...args){
// //         for(let num of args){
// //           if('number' !== typeof num){
// //             throw new Error(`"${num}" is not a number`);
// //           }  
// //         }
// //         return func.apply(this,args)
// //     }
// // }

// // @log
// // class Numberic {
// //   @readonly PI = 3.1415926;

// //   @validate
// //     add(...nums){
// //         return nums.reduce((p,n) => (p+n),0)
// //     }
// // }

// // new Numberic().add(1,'x')


// // 可观察数据
// import {runInAction, observable,isArrayLike,computed ,autorun, when,reaction,action} from 'mobx'

// // // observable.box

// // var num = observable.box(20)
// // var str = observable.box('hello')
// // var bool = observable.box(true)
// // console.log(num.get(),str.get(),bool.get())

// class Store {
//     @observable array = []
//     @observable obj = {} ;
//     @observable map = new Map();

//     @observable string = 'hello'
//     @observable num  = 20;
//     @observable bool = false;

//     @computed get mixed(){
//         return store.string + '/' + store.num
//     }
//     // 修改可观察数据
//     @action bar(){
//         store.string = 'world';
//         store.num = 30
//     }
// }

// var store = new Store();

// // var foo = computed(function(){
// //     return store.string + '/' + store.num
// // })

// // foo.observe((change)=>{
// //     console.log(change,'change')
// // })
// // store.string = 'world';
// // store.num = 30

// // console.log(foo.get())

// // autorun 自动运行
// // 修改 autorun 修改任意可观察数据
// // autorun(()=>{
// //     console.log(store.mixed)
// // })

// // when
// // when(()=> store.bool,()=>console.log("its true"))
// // store.bool = true

// reaction(()=>[store.string,store.num],arr=>console.log(arr.join('/')))
// // store.string = 'world';
// // store.num = 30

// runInAction('modify',()=>{
//     store.string = 'world';
//     store.num = 30
// })
// // var bar = store.bar
// // bar()
// // 对可观察对象作出反应

// // 观察数据变化的方式
// // - computed
// // - autorun
// // - when
// // - Reaction

// // “computed”计算值，将其他可观察数据与你想要的方式组合起来变成一个新的可观察数据，

// // “autorun”自动运行，自动运行传入autorun的参数，在可观察数据被修改之后，自动去执行依赖可观察数据 的行为（传入的函数）

// // “when函数”接收两个函数参数，第一个函数必须根据一个可观察数据返回一个布尔值（不能根据普通变量），当该布尔值为true的时候，就去执行第二个函数，并观察数据变化的方式

// // " reaction"  第一个函数引用可观察数据并返回一个值，这个值回作为第二个函数的参数，第一个函数会被先执行一次，这样mobx就知道有哪些数据被引用了，并在这些数据被修改后执行第二个函数，
// //被用到的场景：在没有数据之前，我们不想也没有必要去调用写缓存的逻辑，可以用reaction来实现在数据第一次被填充后才启用写缓存逻辑

