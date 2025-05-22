export default {
    schema: {
        name: 'app_iap',
        description: 'Retrive detailed in-app purchase information based on country code, app id. When the user does not specify a country, they usually want to know the price information for countries like Turkey, Nigeria, and India. Please do not ask the user for country information a second time. You should calculate the price list that the user wants to see by combining the exchange rate.',
        parameters: {
            type: 'object',
            properties: {
                country: {
                    type: 'string',
                    description: 'The country code for App Store search. Default value is \'us\'',
                },
                trackId: {
                    type: 'string',
                    description: 'The trackId to be queried, example value: \'363590051\'',
                },
            },
            required: [
                'country',
                'trackId',
            ],
        },
    },
    func: getAppIap,
    prompt: 'List the organized data, with line spacing between different types of data, and use appropriate formatting such as quotes/bold/unordered lists; do not include any other information, and it is best to combine the data with real-time exchange rates.',
};

async function getAppIap({ country, trackId }: { country: string; trackId: string }): Promise<{
    content: any;
    time?: string;
}> {
    if (!country || !trackId) {
        return {
            content: 'Please provide both country and trackId',
        };
    }
    const start = Date.now();
    const url = `https://apps.apple.com/${country}/app/id${trackId}`;
    const xml = await fetch(url).then(res => res.text());
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
        content: {
            app_price,
            iap_list,
        },
        time: `${((Date.now() - start) / 1000).toFixed(2)}`,
    };
}
