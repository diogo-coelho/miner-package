# Miner-Package
version 0.0.2-BETA

### Instalação 

- `npm install miner-package`

### Como utilizar

``` node

import Miner from 'miner-package';

const miner = new Miner({
    companyName: 'Empresa123', 
    country: 'Brasil'
});

var data = [];

miner.scrapGeolocation().then(async (scraper) => {
    await scraper.openPage();
    const listaEmpresas = await scraper.searchCompanies();
    for (let empresa of listaEmpresas) {
        data.push(await scraper.getCompanyData(empresa.href));
    }

    console.log(data);
})
.catch(err => {
    console.log(err);
})
.finally(() => miner.close());

````
