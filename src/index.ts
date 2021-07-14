"use strict";

/** Import de erros */
import ErrorParameters from "./errors/ErrorParameters";
/** import de tipos */
import { IMiner, ICountryCodes } from "./types/types";
/** import de módulos */
import FormattedStringCompanyName from "./utils/FormattedStringCompanyName";
import FormattedStringIsoCode from "./utils/FormattedStringIsoCode";
import FormattedStringWebsite from "./utils/FormattedStringWebsite";
import ScrapGeolocation from "./scrapers/ScrapGeolocation";

class Miner {

    private _companyName: string;
    private _country: ICountryCodes;
    private _website: string;
    public _scrapGeolocation: ScrapGeolocation;

    constructor (obj: IMiner) {
        this.setParams(obj);
    }

    public set companyName (companyName: string) {
        this._companyName = new FormattedStringCompanyName(companyName).empresa;
    }

    public get companyName () {
        return this._companyName;
    }

    public set country (country: string) {
        this._country = new FormattedStringIsoCode(country).country;
    }
    
    public getCountry () : ICountryCodes {
        return this._country;
    }

    public set website (website: string) {
        this._website = new FormattedStringWebsite(website).website;
    }

    public get website () {
        return this._website;
    }

    private setParams (obj: IMiner) : void {
        if (!obj) throw new ErrorParameters("Parameters are empty");

        if (obj.companyName && obj.country) {
            this._companyName = new FormattedStringCompanyName(obj.companyName).empresa;
            this._country = new FormattedStringIsoCode(obj.country).country;
        } else if (obj.website) {
            this._website = new FormattedStringWebsite(obj.website).website
        } else {
            throw new ErrorParameters("Parameters were not passed in a valid way");
        }
    }

    public async scrapGeolocation () : Promise<ScrapGeolocation> {
        this._scrapGeolocation = await new ScrapGeolocation();
        await this._scrapGeolocation.init(this._companyName, this._country);

        return this._scrapGeolocation;
    }

    public close () : void {
        return this._scrapGeolocation.closeBrowser();
    }
}

module.exports = Miner;