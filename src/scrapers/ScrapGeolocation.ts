"use strict";

/** import de pacotes */
import Puppeteer from "puppeteer";
import ErrorScrapGeolocation from "./../errors/ErrorScrapGeolocation";
/** import de types */
import { ICountryCodes, ICompanyLink, ICompanyInfo } from "./../types/types";

class ScrapGeolocation {

    private _companyName: string;
    private _country: ICountryCodes;
    private _browser: Puppeteer.Browser;
    private _page: Puppeteer.Page;

    public async init (companyName: string, country: ICountryCodes) : Promise<void> {
        try {
            this._companyName = companyName;
            this._country = country;
            await this.launchBrowser();
            const context: Puppeteer.BrowserContext = this._browser.defaultBrowserContext();
            await context.overridePermissions("https://www.google.com.br/maps", ['geolocation']);
            this._page = await context.newPage();
        } catch (err) {
            throw new ErrorScrapGeolocation(err);
        }
    }

    private async launchBrowser () : Promise<void> {
        this._browser = await Puppeteer.launch({
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

    public async openPage () : Promise<boolean> {
        try {
            await this._page.setGeolocation({ latitude: this._country.lat, longitude: this._country.lng, accuracy: 100 });
            await this._page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36");
            await this._page.goto("https://www.google.com.br/maps/search/@" + this._country.lat + ',' + this._country.lng + ',12z/', {
                timeout: 120000,
                waitUntil: 'networkidle2'
            });

            return true;
        } catch (err) {
            throw new ErrorScrapGeolocation(err);
        }
    }

    public async searchCompanies () : Promise<ICompanyLink[]> {
        try {
            await this.insertCompanyData();            
            
            const companiesList: ICompanyLink[] = await this.companiesList();
            if (companiesList) {                
                return companiesList;
            } else {
                const company = [];
                company.push(await this.getCompanyLink());
                return company;
            }           

        } catch (err) {
            throw new ErrorScrapGeolocation(`Timeout connection exceed`);
        }
    }

    private async insertCountryData () : Promise<boolean> {
        try {
            await this._page.waitForSelector('.tactile-searchbox-input', { timeout: 10000 });
            await this._page.click('.tactile-searchbox-input');
            await this._page.keyboard.type(`${ this._country.code } `);
            await this._page.click('.searchbox-searchbutton');
            await this._page.waitForResponse(response => response.status() === 200);
            await this._page.waitForSelector('.section-layout', { timeout: 10000 });
            
            return true;
        } catch (err) {
            throw new ErrorScrapGeolocation(err);
        }
    }

    private async insertCompanyData () : Promise<boolean> {
        try {
            await this._page.waitForSelector('.tactile-searchbox-input', { timeout: 10000 });
            await this._page.click('.tactile-searchbox-input');
            await this._page.keyboard.type(`${ this._companyName }`);
            await this._page.click('.searchbox-searchbutton');
            await this._page.waitForResponse(response => response.status() === 200);
            await this._page.waitForSelector('.section-layout', { timeout: 10000 });

            return true;
        } catch (err) {
            throw new ErrorScrapGeolocation(err);
        }
    }

    private async companiesList () : Promise<ICompanyLink[]> {
        return await this._page.waitForSelector('.section-layout.section-scrollbox', { timeout: 10000 })
            .then(async () => {
                const links: ICompanyLink[] = await this._page.evaluate(() => {
                    const data: ICompanyLink[] = [];
                    const elements: NodeListOf<Element> = document.querySelectorAll('.section-layout.section-scrollbox > div:not([class])');
                    for (const element of elements) {
                        data.push({ 
                            title: element.querySelector('.gm2-subtitle-alt-1').textContent.replace(/\r?\n|\r/g,'').trim(), 
                            href: element.querySelector('a').href
                        });                            
                    }
                    return data;
                });

                return links;
            })
            .catch(() => {
                return null;
            })
    }

    private async getCompanyLink() : Promise<ICompanyLink> {
        return await this._page.waitForSelector('.widget-pane-content-holder .section-layout h1', { timeout: 10000 })
            .then(async () => {
                return await this._page.evaluate(() => {
                    const data = {
                        title: document.querySelector('.widget-pane-content-holder .section-layout h1').textContent.replace(/\r?\n|\r/g,'').trim(),
                        href: window.location.href
                    }

                    return data;                 
                });
            })
            .catch(err => {
                throw new ErrorScrapGeolocation(err);
            })
    }

    public async getCompanyData (url: string) : Promise<ICompanyInfo> {
        await this.openCompany(url);        
        const company = await this.companyInfo();
        return company;
    }

    private async openCompany (url:string) : Promise<boolean> {
        try {
            await this._page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36");
            await this._page.goto(url, {
                timeout: 120000,
                waitUntil: 'networkidle2'
            });

            return true;
        } catch (err) {
            throw new ErrorScrapGeolocation(err);
        }
    }

    private async companyInfo () : Promise<ICompanyInfo> {
        return await this._page.waitForSelector('.widget-pane-content-holder .section-layout h1', { timeout: 10000 })
            .then(async () => {
                return await this._page.evaluate(() => {
                    const data: ICompanyInfo = {
                        name: '',
                        address: undefined,
                        located_in: undefined,
                        website: undefined,
                        telephone: undefined,
                        plus_code: undefined,
                        ratings: undefined,
                        reviews: undefined
                    }

                    if (document.querySelector('.widget-pane-content-holder .section-layout h1') != null) {
                        data.name = document.querySelector('.widget-pane-content-holder .section-layout h1').textContent.replace(/\r?\n|\r/g,'').trim();
                    }

                    const elements: NodeListOf<Element> = document.querySelectorAll(".widget-pane-content-holder .section-layout > div > button");
                    for (const element of elements) {
                        if (element.getAttribute("data-item-id") == "address") {
                            data.address = element.textContent.replace(/\r?\n|\r/g,'').trim();
                        }

                        if (element.getAttribute("data-item-id") == "authority") {
                            const regex = /^[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;
                            if (regex.test(element.textContent.replace(/\r?\n|\r/g,'').trim())) {
                                data.website = element.textContent.replace(/\r?\n|\r/g,'').trim();
                            }
                        }

                        if (element.getAttribute("data-item-id") && element.getAttribute("data-item-id").indexOf('phone:tel:') != -1) {
                            const telephone = element.textContent.replace(/\r?\n|\r/g,'').replace(/\D/g, '').trim();
                            if (telephone != '' && telephone.length > 6) {
                                data.telephone = telephone
                            }
                        }

                        if (element.getAttribute("data-item-id") && element.getAttribute("data-item-id") == "locatedin") {
                            data.located_in = element.textContent.replace(/\r?\n|\r/g,'').trim();
                        }

                        if (element.getAttribute("data-item-id") && element.getAttribute("data-item-id") == "oloc") {
                            data.plus_code = element.textContent.replace(/\r?\n|\r/g,'').trim();
                        }
                    }

                    const ratings: NodeListOf<Element> = document.querySelectorAll("div[jsaction = 'pane.reviewChart.moreReviews'] tr");
                    if (ratings.length > 0) {
                        data.ratings = [];
                        for (const rate of ratings) {
                            data.ratings.push(rate.getAttribute('aria-label'));
                        }
                    }
                    
                    const reviews: NodeListOf<Element> = document.querySelectorAll("div[jsaction='mouseover:pane.review.in;mouseout:pane.review.out']");
                    if (reviews.length > 0) {
                        data.reviews = [];
                        for (const review of reviews) {
                            const reviewer_name = review.querySelector(".ODSEW-ShBeI-title span") ? review.querySelector(".ODSEW-ShBeI-title span").textContent.replace(/\r?\n|\r/g,'').trim() : undefined;
                            const reviews_amount = review.querySelector(".ODSEW-ShBeI-VdSJob span:nth-of-type(2)") ? review.querySelector(".ODSEW-ShBeI-VdSJob span:last-child").textContent.replace(/\r?\n|\r/g,'').trim() : undefined;
                            const score = review.querySelector(".ODSEW-ShBeI-H1e3jb") ? review.querySelector(".ODSEW-ShBeI-H1e3jb").getAttribute("aria-label") : undefined;
                            const date = review.querySelector(".ODSEW-ShBeI-RgZmSc-date") ? review.querySelector(".ODSEW-ShBeI-RgZmSc-date").textContent.replace(/\r?\n|\r/g,'').trim() : undefined;
                            const rev = review.querySelector(".ODSEW-ShBeI-text") ? review.querySelector(".ODSEW-ShBeI-text").textContent.replace(/\r?\n|\r/g,'').trim() : undefined;

                            data.reviews.push({ reviewer_name, reviews_amount, score, date, review: rev });
                        }
                    }

                    return data;
                }); 
            })
            .catch(err => {
                throw new ErrorScrapGeolocation(err);
            });
    }

    public closePage () : void {
        this._page.close();
    }

    public closeBrowser () : void {
        this._browser.close();
    }
}

export default ScrapGeolocation;