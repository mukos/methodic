import App from "./app";

export default function testApp(){
    const app = new App();

    app.addDependencies({
        EventEmitter: require("eventemitter3")
    });

    app.addLogger((message) => {
        console.log(message)
    });

    app.addState('state1', { a: '1', b: '2' });

    app.addFunction('method1', () => (a: number, b: number, c: number) => {
        return a + b + c;
    });

    app.addFunction('method2', ({ state1 }) => {
        state1.a = "x";
    });

    app.addFunction('method3', ({ state1 }, { method1, method2 }, { EventEmitter }) => {
        console.log(typeof EventEmitter); // dependency
        const sum = method1(1, 2, 3); // helper
        console.log("sum: ", sum);
        console.log("state1: ", state1)
        method2(); // changes state
        console.log("state1: ", state1);
    });

    // app.run("method3");
}

class ExtensibleFunction extends Function {
    constructor(f: Function) {
        super();
        return Object.setPrototypeOf(f, new.target.prototype);
    }
}

class X extends Function {
    constructor(fun: Function) {
        super();
        fun.bind(this.arguments);
        return fun;
    }
    // call(this: Function, thisArg: any, ...argArray: any[]): any {
    //     console.log("HELLO");
    //     this(...argArray);
    // }
}

class B extends Object {
    // @ts-ignore
    [s: string] : Function;
    constructor(s: string) {
        super({
            [s]: () => {
                console.log("ahahahh")
            }
        });
    }
}

function Test(s: string){
    return class X {
        // [a: string] : string;
        // methods: [] = new Array('0');
        // sym: Symbol
        // constructor(s: string) {
        //     this.sym = Symbol(s);
            // this.methods.push(met);
        // }
        get [s](){
            console.log('hahaha');
            return true;
        }
    }
}

class Container<Type> extends Object {
    // @ts-ignore
    [s: string] : Type
    constructor(content: Object) {
        super(content);
        return new Proxy(this, {
            get(object, property){
                if (!Reflect.has(object, property)) {
                    throw new Error('NOT EXIST');
                } else {
                    return Reflect.get(object, property);
                }
            },
            set(object, property, value){
                if (Reflect.has(object, property)) {
                    throw new Error('YES EXIST');
                } else {
                    return Reflect.set(object, property, value);
                }
            }
        });
    }
}

function testApp2(){
    // const a = new X(() => { console.log("hehe")});
    // a();
    // const x = new B("hello");
    // const a = new (Test("z"));
    // @ts-ignore
    // const x = a['z'];
    const a = new Container<number>();
    // @ts-ignore
    a['asd'] = 3;
    console.log(a.asd);
    // console.log(a['asd']);

}

testApp2();
