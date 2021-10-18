"use strict";

/** import de pacotes */
import Puppeteer from "puppeteer";
import BrowserLauncher from "../utils/BrowserLauncher";
import ErrorScrapContacts from "./../errors/ErrorScrapContacts";
/** import de types */
import { ICountryCodes } from "./../types/types";

class ScrapContacts {

    private _companyName: string;
    private _country: ICountryCodes;
    private _website: string;
    private _browserLauncher: BrowserLauncher;
    private _page: Puppeteer.Page;

    public async init (companyName: string, country: ICountryCodes, website: string) : Promise<void> {
        try {
            this._companyName = companyName;
            this._country = country;
            this._website = website;
            this._browserLauncher = await new BrowserLauncher();
            const context: Puppeteer.BrowserContext = await this._browserLauncher.browserPromise.then(browser => browser.createIncognitoBrowserContext());
            this._page = await context.newPage();
        } catch (err) {
            throw new ErrorScrapContacts(err);
        }
    }

}

export default ScrapContacts;