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
/** Import de erros */
const ErrorParameters_1 = __importDefault(require("./errors/ErrorParameters"));
/** import de módulos */
const FormattedStringCompanyName_1 = __importDefault(require("./utils/FormattedStringCompanyName"));
const FormattedStringIsoCode_1 = __importDefault(require("./utils/FormattedStringIsoCode"));
const FormattedStringWebsite_1 = __importDefault(require("./utils/FormattedStringWebsite"));
const ScrapGeolocation_1 = __importDefault(require("./scrapers/ScrapGeolocation"));
class Miner {
    constructor(obj) {
        this.setParams(obj);
    }
    set companyName(companyName) {
        this._companyName = new FormattedStringCompanyName_1.default(companyName).empresa;
    }
    get companyName() {
        return this._companyName;
    }
    set country(country) {
        this._country = new FormattedStringIsoCode_1.default(country).country;
    }
    getCountry() {
        return this._country;
    }
    set website(website) {
        this._website = new FormattedStringWebsite_1.default(website).website;
    }
    get website() {
        return this._website;
    }
    setParams(obj) {
        if (!obj)
            throw new ErrorParameters_1.default("Parameters are empty");
        if (obj.companyName && obj.country) {
            this._companyName = new FormattedStringCompanyName_1.default(obj.companyName).empresa;
            this._country = new FormattedStringIsoCode_1.default(obj.country).country;
        }
        else if (obj.website) {
            this._website = new FormattedStringWebsite_1.default(obj.website).website;
        }
        else {
            throw new ErrorParameters_1.default("Parameters were not passed in a valid way");
        }
    }
    scrapGeolocation() {
        return __awaiter(this, void 0, void 0, function* () {
            this._scrapGeolocation = yield new ScrapGeolocation_1.default();
            yield this._scrapGeolocation.init(this._companyName, this._country);
            return this._scrapGeolocation;
        });
    }
    close() {
        return this._scrapGeolocation.closeBrowser();
    }
}
module.exports = Miner;
//# sourceMappingURL=index.js.map