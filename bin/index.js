"use strict";var __awaiter=this&&this.__awaiter||function(t,n,s,c){return new(s=s||Promise)(function(r,e){function a(t){try{i(c.next(t))}catch(t){e(t)}}function o(t){try{i(c.throw(t))}catch(t){e(t)}}function i(t){var e;t.done?r(t.value):((e=t.value)instanceof s?e:new s(function(t){t(e)})).then(a,o)}i((c=c.apply(t,n||[])).next())})},__importDefault=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(exports,"__esModule",{value:!0});const ErrorParameters_1=__importDefault(require("./errors/ErrorParameters")),FormattedStringCompanyName_1=__importDefault(require("./utils/FormattedStringCompanyName")),FormattedStringIsoCode_1=__importDefault(require("./utils/FormattedStringIsoCode")),FormattedStringWebsite_1=__importDefault(require("./utils/FormattedStringWebsite")),ScrapGeolocation_1=__importDefault(require("./scrapers/ScrapGeolocation")),ScrapGeolocation_2=__importDefault(require("./scrapers/ScrapGeolocation"));class Miner{constructor(t){this.setParams(t)}set companyName(t){this._companyName=new FormattedStringCompanyName_1.default(t).empresa}get companyName(){return this._companyName}set country(t){this._country=new FormattedStringIsoCode_1.default(t).country}getCountry(){return this._country}set website(t){this._website=new FormattedStringWebsite_1.default(t).website}get website(){return this._website}setParams(t){if(!t)throw new ErrorParameters_1.default("Parameters are empty");if(t.companyName&&t.country)this._companyName=new FormattedStringCompanyName_1.default(t.companyName).empresa,this._country=new FormattedStringIsoCode_1.default(t.country).country;else{if(!t.website)throw new ErrorParameters_1.default("Parameters were not passed in a valid way");this._website=new FormattedStringWebsite_1.default(t.website).website}}scrapGeolocation(){return __awaiter(this,void 0,void 0,function*(){return this._scrapGeolocation=yield new ScrapGeolocation_1.default,yield this._scrapGeolocation.init(this._companyName,this._country),this._scrapGeolocation})}scrapContacts(){return __awaiter(this,void 0,void 0,function*(){return this._scrapContacts=yield new ScrapGeolocation_2.default,yield this._scrapContacts.init(this._companyName,this._country),this._scrapContacts})}close(){return this._scrapGeolocation.closeBrowser()}}module.exports=Miner;