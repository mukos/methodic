// @ts-nocheck TS2339

import App from "./app";

function testApp(){
    const app = new App();

    app.addDependencies({
        EventEmitter: require("eventemitter3")
    });

    app.addLogger((message) => {
        console.log(message)
    });

    app.addState('state1', { a: '1', b: '2' });

    app.addMethod('method1', ({ state1 }) => {
        state1.a = "z";
    });

    app.addMethod('method2', ({ state1, state2 }, { method1 }, { EventEmitter }) => {
        console.log(typeof EventEmitter);
        console.log("state1: ", state1)
        method1(); // changes state1
        console.log("state1: ", state1);
    });

    app.start("method2");
}

// testApp();