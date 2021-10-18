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
const ErrorScrapContacts_1 = __importDefault(require("./../errors/ErrorScrapContacts"));
class ScrapContacts {
    init(companyName, country, website) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this._companyName = companyName;
                this._country = country;
                this._website = website;
                this._browserLauncher = yield new BrowserLauncher_1.default();
                const context = yield this._browserLauncher.browserPromise.then(browser => browser.createIncognitoBrowserContext());
                this._page = yield context.newPage();
            }
            catch (err) {
                throw new ErrorScrapContacts_1.default(err);
            }
        });
    }
}
exports.default = ScrapContacts;
//# sourceMappingURL=ScrapContacts.js.map