"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var error_1 = require("./error");
var Container = /** @class */ (function () {
    function Container() {
        this.container = Object.create(null);
    }
    Container.prototype.getContainer = function () {
        return this.container;
    };
    Container.prototype.getEntry = function (key) {
        if (!this.container[key]) {
            error_1.handleError('Entry Does Not Exist');
        }
        return this.container[key];
    };
    Container.prototype.addEntry = function (key, value) {
        if (this.container[key]) {
            error_1.handleError('Entry Already Exists');
        }
        this.container[key] = value;
    };
    Container.prototype.removeEntry = function (key) {
        if (this.container[key]) {
            delete this.container[key];
        }
    };
    return Container;
}());
exports.default = Container;
