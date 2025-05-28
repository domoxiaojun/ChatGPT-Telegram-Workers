export default {
    schema: {
        name: 'app_iap',
        description: 'Retrive detailed in-app purchase information based on country code, app id. You should calculate the price list that the user wants to see by combining the exchange rate.',
        parameters: {
            type: 'object',
            properties: {
                countries: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'The country code list for App Store search.',
                    default: ['us', 'tr', 'ng', 'eg'],
                },
                trackId: {
                    type: 'string',
                    description: 'The trackId to be queried, example value: \'363590051\'',
                },
            },
            required: [
                'trackId',
            ],
        },
    },
    func: getAppIap,
    prompt: 'List the organized data, with line spacing between different types of data, and use appropriate formatting such as quotes/bold/unordered lists; do not include any other information, and it is best to combine the data with real-time exchange rates.',
};

async function getAppIap({ countries = ['us', 'tr', 'ng', 'eg'], trackId }: { countries: string[]; trackId: string }): Promise<{
    content: any;
    time?: string;
}> {
    if (!trackId) {
        return {
            content: [{ type: 'text', text: 'Please provide trackId' }],
        };
    }

    const xmls = await Promise.all(countries.map(async (country) => {
        const url = `https://apps.apple.com/${country}/app/id${trackId}`;
        return {
            xml: await fetch(url).then(res => res.text()),
            country,
        };
    }));

    const app_iap_list = xmls.map(({ xml, country }) => extractAppIap(xml, country));
    return {
        content: app_iap_list.map(data => ({
            type: 'text',
            text: data,
        })),
    };
}

function extractAppIap(xml: string, country: string) {
    const iap_data = xml.match(/<dd\sclass="information-list__item__definition">[\s\S]+?<div>([\s\S]*?)<\/div>/)?.[1] || '';
    const iap_list_reg = /<li class="list-with-numbers__item">([\s\S]+?)<\/li>/g;
    const iap_title_reg = /<span.*?item__title[\s\S]+?block">(.*?)<\/span>/;
    const iap_price_reg = /<span.*?item__price[\s\S]+?">(.*?)<\/span>/;
    const iap_list = Array.from(iap_data.matchAll(iap_list_reg)).map(item => ({
        title: item[1].match(iap_title_reg)?.[1],
        price: item[1].match(iap_price_reg)?.[1],
    }));
    const app_price_reg = /<li class=.*?--price">(.*?)<\/li>/;
    const app_price = xml.match(app_price_reg)?.[1] ?? 'get app price error';
    return {
        country,
        app_price,
        iap_list,
    };
}
