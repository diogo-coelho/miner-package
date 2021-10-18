"use strict";

/** import de pacotes */
import Puppeteer from "puppeteer";

class BrowserLauncher {
    private _browserPromise: Promise<Puppeteer.Browser>;

    constructor () {
        this.launchBrowser();
    }

    public get browserPromise () : Promise<Puppeteer.Browser> {
        return this._browserPromise;
    }

    public async launchBrowser () : Promise<void> {
        this._browserPromise = Puppeteer.launch({
            headless: false,
            ignoreHTTPSErrors: true,
            defaultViewport: null,
            args: [
                `--no-sandbox`,
                `--disable-setuid-sandbox`,
                `--ignore-certificate-errors`,
                `--window-size=1300,768`,
            ]
        });
    }

    public closeBrowser () : void {
        this._browserPromise.then(browser => browser.close());
    }

}

export default BrowserLauncher;