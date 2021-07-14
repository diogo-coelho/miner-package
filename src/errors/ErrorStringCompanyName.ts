"use strict";

class ErrorStringCompanyName extends Error {
    private _name: string;
    private _message: string;

    constructor (message: string) {
        super(message);

        this._name = this.constructor.name;
        this._message = message;
    }

    public get message () : string {
        return this._name + ":" + this._message;
    }
}

export default ErrorStringCompanyName;