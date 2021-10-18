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
/** import de pacotes */
const puppeteer_1 = __importDefault(require("puppeteer"));
class BrowserLauncher {
    constructor() {
        this.launchBrowser();
    }
    get browserPromise() {
        return this._browserPromise;
    }
    launchBrowser() {
        return __awaiter(this, void 0, void 0, function* () {
            this._browserPromise = puppeteer_1.default.launch({
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
        });
    }
    closeBrowser() {
        this._browserPromise.then(browser => browser.close());
    }
}
exports.default = BrowserLauncher;
//# sourceMappingURL=BrowserLauncher.js.map