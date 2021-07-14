export interface IMiner {
    companyName?: string,
    country?: string
    website?: string
}

export interface IScrapGeolocation {
    companyName?: string,
    country?: ICountryCodes
    website?: string
}

export interface ICountryCodes {
    code: string,
    list: string[],
    lat: number,
    lng: number
}

export interface IReviewInfo {
    reviewer_name?: string,
    reviews_amount?: string,
    score?: string,
    date?: string,
    review?: string
}

export interface ICompanyInfo {
    name: string,
    address?: string,
    located_in?: string,
    website?: string,
    telephone?: string,
    plus_code?: string,
    ratings?: string[]
    reviews?: IReviewInfo[]
}

export interface ICompanyLink {
    title: string,
    href: string
}