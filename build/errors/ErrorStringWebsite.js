"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorStringWebsite extends Error {
    constructor(message) {
        super(message);
        this._name = this.constructor.name;
        this._message = message;
    }
    get message() {
        return this._name + ":" + this._message;
    }
}
exports.default = ErrorStringWebsite;
//# sourceMappingURL=ErrorStringWebsite.js.map