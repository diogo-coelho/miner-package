"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorStringWebsite_1 = __importDefault(require("./../errors/ErrorStringWebsite"));
class FormattedStringWebsite {
    constructor(website) {
        this.setFormattedWebsite(website);
    }
    setFormattedWebsite(website) {
        const re = /^((https?):\/\/)?([a-z]{2,3}\.)?[a-z0-9-]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(-[a-zA-Z0-9]{0,})?/;
        if (re.test(website)) {
            this._website = website.replace(/^(https?:\/\/)?([a-z]{2,3}\.)?/, '').replace(/\/$/, '');
            if (this._website.indexOf('?') != -1) {
                this._website = this._website.replace(this._website.substring(this._website.indexOf('?'), this._website.length), '').replace(/\/$/, '').trim();
            }
        }
        else {
            throw new ErrorStringWebsite_1.default(`${website} variable is not in website pattern`);
        }
    }
    get website() {
        return this._website;
    }
}
exports.default = FormattedStringWebsite;
//# sourceMappingURL=FormattedStringWebsite.js.map
//# sourceMappingURL=FormattedStringWebsite.js.map
