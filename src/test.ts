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

    app.run('method3');
}

testApp();
