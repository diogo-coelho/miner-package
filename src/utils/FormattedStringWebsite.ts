"use strict";

import ErrorStringWebsite from "./../errors/ErrorStringWebsite";

class FormattedStringWebsite {
    private _website: string;

    constructor (website: string) {
        this.setFormattedWebsite(website);
    }

    private setFormattedWebsite (website: string) : void {
        const re = /^((https?):\/\/)?([a-z]{2,3}\.)?[a-z0-9-]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(-[a-zA-Z0-9]{0,})?/;
        if (re.test(website)) {
            this._website = website.replace(/^(https?:\/\/)?([a-z]{2,3}\.)?/,'').replace(/\/$/,'');
            if (this._website.indexOf('?') != -1) {
                this._website = this._website.replace(this._website.substring(this._website.indexOf('?'), this._website.length), '').replace(/\/$/,'').trim();
            }
        } else {
            throw new ErrorStringWebsite(`${ website } variable is not in website pattern`);
        }
    }

    public get website() : string {
        return this._website;
    }
}

export default FormattedStringWebsite;