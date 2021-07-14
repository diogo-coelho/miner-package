"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorScrapGeolocation extends Error {
    constructor(message) {
        super(message);
        this._name = this.constructor.name;
        this._message = message;
    }
    get message() {
        console.log(this._message.indexOf('TimeoutError: waiting for selector'));
        if (this._message.indexOf('TimeoutError: waiting for selector') != -1) {
            console.log(this._message);
            return this._name + ": Timeout connection exceed";
        }
        return this._name + ":" + this._message;
    }
}
exports.default = ErrorScrapGeolocation;
//# sourceMappingURL=ErrorScrapGeolocation.js.map