"use strict";
// @ts-nocheck TS2339
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = __importDefault(require("./app"));
function testApp() {
    var app = new app_1.default();
    app.addDependencies({
        EventEmitter: require("eventemitter3")
    });
    app.addLogger(function (message) {
        console.log(message);
    });
    app.addState('state1', { a: '1', b: '2' });
    app.addMethod('method1', function (_a) {
        var state1 = _a.state1;
        state1.a = "z";
    });
    app.addMethod('method2', function (_a, _b, _c) {
        var state1 = _a.state1, state2 = _a.state2;
        var method1 = _b.method1;
        var EventEmitter = _c.EventEmitter;
        console.log(typeof EventEmitter);
        console.log("state1: ", state1);
        method1(); // changes state1
        console.log("state1: ", state1);
    });
    app.start("method2");
}
// testApp();
