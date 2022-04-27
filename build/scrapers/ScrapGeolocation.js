"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BrowserLauncher_1 = __importDefault(require("../utils/BrowserLauncher"));
const ErrorScrapGeolocation_1 = __importDefault(require("./../errors/ErrorScrapGeolocation"));
class ScrapGeolocation {
    init(companyName, country) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this._companyName = companyName;
                this._country = country;
                this._browserLauncher = new BrowserLauncher_1.default();
                const context = yield this._browserLauncher.browserPromise.then((browser) => browser.defaultBrowserContext());
                yield context.overridePermissions("https://www.google.com.br/maps", ['geolocation']);
                this._page = yield context.newPage();
            }
            catch (err) {
                throw new ErrorScrapGeolocation_1.default(err);
            }
        });
    }
    openPage() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._page.setGeolocation({ latitude: this._country.lat, longitude: this._country.lng, accuracy: 100 });
                yield this._page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36");
                yield this._page.goto("https://www.google.com.br/maps/search/@" + this._country.lat + ',' + this._country.lng + ',12z/', {
                    timeout: 120000,
                    waitUntil: 'networkidle2'
                });
                return true;
            }
            catch (err) {
                throw new ErrorScrapGeolocation_1.default(err);
            }
        });
    }
    searchCompanies() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.insertCountryData();
                yield this._page.waitForTimeout(2000);
                yield this.insertCompanyData();
                const companiesList = yield this.companiesList();
                if (companiesList) {
                    return companiesList;
                }
                else {
                    const company = [];
                    company.push(yield this.getCompanyLink());
                    return company;
                }
            }
            catch (err) {
                if (err.toString().indexOf('TimeoutError')) {
                    throw new ErrorScrapGeolocation_1.default(`Timeout connection exceed`);
                }
                throw new ErrorScrapGeolocation_1.default(err);
            }
        });
    }
    insertCountryData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._page.waitForSelector('#searchboxinput', { timeout: 10000 });
                yield this._page.click('#searchboxinput');
                yield this._page.keyboard.type(`${this._country.code} `);
                yield this._page.click('#searchboxinput');
                yield this._page.waitForResponse(response => response.status() === 200);
                yield this._page.waitForSelector('#searchbox-searchbutton', { timeout: 10000 });
                return true;
            }
            catch (err) {
                throw new ErrorScrapGeolocation_1.default(err);
            }
        });
    }
    insertCompanyData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._page.waitForSelector('#searchboxinput', { timeout: 10000 });
                yield this._page.click('#searchboxinput');
                yield this._page.keyboard.type(`${this._companyName} `);
                yield this._page.click('#searchbox-searchbutton');
                yield this._page.waitForResponse(response => response.status() === 200);
                yield this._page.waitForSelector('h1', { timeout: 10000 });
                return true;
            }
            catch (err) {
                throw new ErrorScrapGeolocation_1.default(err);
            }
        });
    }
    companiesList() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._page.waitForSelector('.m6QErb.DxyBCb.kA9KIf.dS8AEf.ecceSd', { timeout: 10000 })
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const links = yield this._page.evaluate(() => {
                    const data = [];
                    const elements = document.querySelectorAll('.Nv2PK.tH5CWc.THOPZb');
                    for (const element of elements) {
                        data.push({
                            title: element.querySelector('.fontHeadlineSmall > span').textContent.replace(/\r?\n|\r/g, '').trim(),
                            href: element.querySelector('a').href
                        });
                    }
                    return data;
                });
                return links;
            }))
                // eslint-disable-next-line no-unused-vars
                .catch((err) => {
                return null;
            });
        });
    }
    getCompanyLink() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._page.waitForSelector('h1', { timeout: 10000 })
                .then(() => __awaiter(this, void 0, void 0, function* () {
                return yield this._page.evaluate(() => {
                    const data = {
                        title: document.querySelector('h1').textContent.replace(/\r?\n|\r/g, '').trim(),
                        href: window.location.href
                    };
                    return data;
                });
            }))
                .catch(err => {
                throw new ErrorScrapGeolocation_1.default(err);
            });
        });
    }
    getCompanyData(url) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.openCompany(url);
            const company = yield this.companyInfo();
            return company;
        });
    }
    openCompany(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36");
                yield this._page.goto(url, {
                    timeout: 120000,
                    waitUntil: 'networkidle2'
                });
                return true;
            }
            catch (err) {
                throw new ErrorScrapGeolocation_1.default(err);
            }
        });
    }
    companyInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._page.waitForSelector('h1', { timeout: 10000 })
                .then(() => __awaiter(this, void 0, void 0, function* () {
                return yield this._page.evaluate(() => {
                    const data = {
                        name: '',
                        address: undefined,
                        located_in: undefined,
                        website: undefined,
                        telephone: undefined,
                        plus_code: undefined,
                        ratings: undefined,
                        reviews: undefined
                    };
                    if (document.querySelector('h1') != null) {
                        data.name = document.querySelector('h1').textContent.replace(/\r?\n|\r/g, '').trim();
                    }
                    const elements = document.querySelectorAll(".m6QErb > div > button");
                    for (const element of elements) {
                        if (element.getAttribute("data-item-id") == "address") {
                            data.address = element.textContent.replace(/\r?\n|\r/g, '').trim();
                        }
                        if (element.getAttribute("data-item-id") == "authority") {
                            const regex = /^[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;
                            if (regex.test(element.textContent.replace(/\r?\n|\r/g, '').trim())) {
                                data.website = element.textContent.replace(/\r?\n|\r/g, '').trim();
                            }
                        }
                        if (element.getAttribute("data-item-id") && element.getAttribute("data-item-id").indexOf('phone:tel:') != -1) {
                            const telephone = element.textContent.replace(/\r?\n|\r/g, '').replace(/\D/g, '').trim();
                            if (telephone != '' && telephone.length > 6) {
                                data.telephone = telephone;
                            }
                        }
                        if (element.getAttribute("data-item-id") && element.getAttribute("data-item-id") == "locatedin") {
                            data.located_in = element.textContent.replace(/\r?\n|\r/g, '').trim();
                        }
                        if (element.getAttribute("data-item-id") && element.getAttribute("data-item-id") == "oloc") {
                            data.plus_code = element.textContent.replace(/\r?\n|\r/g, '').trim();
                        }
                    }
                    const ratings = document.querySelectorAll("div[jsaction = 'pane.reviewChart.moreReviews'] tr");
                    if (ratings.length > 0) {
                        data.ratings = [];
                        for (const rate of ratings) {
                            data.ratings.push(rate.getAttribute('aria-label'));
                        }
                    }
                    const reviews = document.querySelectorAll("div[jsaction='mouseover:pane.review.in;mouseout:pane.review.out']");
                    if (reviews.length > 0) {
                        data.reviews = [];
                        for (const review of reviews) {
                            const reviewer_name = review.querySelector(".WNxzHc.qLhwHc span") ? review.querySelector(".WNxzHc.qLhwHc span").textContent.replace(/\r?\n|\r/g, '').trim() : undefined;
                            const reviews_amount = review.querySelector(".RfnDt span:nth-of-type(2)") ? review.querySelector(".RfnDt span:last-child").textContent.replace(/\r?\n|\r([^a-zA-Z0-9])/g, '').trim() : undefined;
                            const score = review.querySelector(".kvMYJc") ? review.querySelector(".kvMYJc").getAttribute("aria-label") : undefined;
                            const date = review.querySelector(".rsqaWe") ? review.querySelector(".rsqaWe").textContent.replace(/\r?\n|\r/g, '').trim() : undefined;
                            const rev = review.querySelector(".wiI7pd") ? review.querySelector(".wiI7pd").textContent.replace(/\r?\n|\r/g, '').trim() : undefined;
                            data.reviews.push({ reviewer_name, reviews_amount, score, date, review: rev });
                        }
                    }
                    return data;
                });
            }))
                .catch(err => {
                throw new ErrorScrapGeolocation_1.default(err);
            });
        });
    }
    closePage() {
        this._page.close();
    }
    closeBrowser() {
        this._browserLauncher.closeBrowser();
    }
}
exports.default = ScrapGeolocation;
//# sourceMappingURL=ScrapGeolocation.js.map
//# sourceMappingURL=ScrapGeolocation.js.map
