import styles from './map.js';

const URL_COVID =
    'https://wuhan-coronavirus-api.laeyoung.endpoint.ainize.ai/jhu-edu/latest?onlyCountries=true';

const $map = document.querySelector('#map');

const map = new window.google.maps.Map($map, {
    center: {
        lat: 0,
        lng: 0
    },
    zoom: 3,
    styles
});

const popup = new window.google.maps.InfoWindow();

async function getData(URL) {
    const response = await fetch(URL);
    const data = await response.json();
    return data;
}

function renderContent({ countryregion, confirmed, deaths, recovered }, bandera) {
    return `
    <div class="earth-overlay">
        <img src="${bandera}"/>
        <div class="title">
            <span>${countryregion}</span>
        </div>
        <div class="info">
            <div><span>${confirmed} confirmados</span></div>
            <div><span>${deaths} muertos</span></div>
            <div><span>${recovered} recuperados</span></div>
        </div>
    </div>

    `;
}

async function renderData(URL_COVID) {
    const data = await getData(URL_COVID);

    for (const element of data) {
        const codeCountry = element.countrycode;

        if (codeCountry) {
            const URL_PAIS = `https://restcountries.eu/rest/v2/alpha/${codeCountry.iso2}`;

            const bandera = await getData(URL_PAIS);

            const marker = new window.google.maps.Marker({
                position: {
                    lat: element.location.lat,
                    lng: element.location.lng
                },
                map,
                icon: './assets/icon.png'
            });

            marker.addListener('click', () => {
                popup.setContent(renderContent(element, bandera.flag));
                popup.open(map, marker);
            });
        }
    }
}

renderData(URL_COVID);

google.maps.event.addListener(map, 'click', () => {
    popup.close();
});
