"use strict";

class ErrorScrapGeolocation extends Error {
    private _name: string;
    private _message: string;

    constructor (message: string) {
        super(message);

        this._name = this.constructor.name;
        this._message = message;
    }

    public get message () : string {
        console.log(this._message.indexOf('TimeoutError: waiting for selector'));
        if (this._message.indexOf('TimeoutError: waiting for selector') != -1) {
            console.log(this._message);
            return this._name + ": Timeout connection exceed";
        }
        return this._name + ":" + this._message;
    }
}

export default ErrorScrapGeolocation;