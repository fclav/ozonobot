import fetch from "node-fetch";

export interface Quote {
    ticker: string,
    time: string,
    bid: number,
    ask: number,
    variation: number
}

function get_mock_dollar(): Quote {
    return {
        ticker: 'dolar',
        time: 'now',
        bid: 100,
        ask: 200,
        variation: 0.5
    }
}

// async function get_dollar_ambito(): Promise<Quote[]> {
//     const turista = "https://mercados.ambito.com//dolarturista/variacion";
//     const cl = "https://mercados.ambito.com//dolarrava/cl/variacion";
//     const mep = "https://mercados.ambito.com//dolarrava/mep/variacion";
//     const mayorista = "https://mercados.ambito.com//dolar/mayorista/variacion";
//     const oficial = "https://mercados.ambito.com//dolar/oficial/variacion";
//     const futuro = "https://mercados.ambito.com//dolarfuturo/variacion";
    
//     const informal = await get_informal_ambito("Dolar Blue");
//     return Promise.resolve([informal]);
// }

export async function get_informal_ambito(ticker: string): Promise<Quote> {
    const url = "https://mercados.ambito.com//dolar/informal/variacion";
    return get_quote_ambito(ticker, url);
}

export async function get_oficial_ambito(ticker: string): Promise<Quote> {
    const url = "https://mercados.ambito.com//dolar/oficial/variacion";
    return get_quote_ambito(ticker, url);
}

export async function get_mep_ambito(ticker: string): Promise<Quote> {
    const url = "https://mercados.ambito.com//dolarrava/mep/variacion";
    return get_quote_ambito(ticker, url);
}

export async function get_turista_ambito(ticker: string): Promise<Quote> {
    const url = "https://mercados.ambito.com//dolarturista/variacion";
    return get_quote_ambito(ticker, url);
}

export async function get_quote_ambito(ticker: string, url: string) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                console.log(`dollar quote was not ok: ${response}`);
                return dummyQuote(ticker);
            }
            return response.json()
        }).then(body => {
            return {
                ticker: ticker,
                time: body["fecha"],
                bid: readNumber(body["compra"]),
                ask: readNumber(body["venta"]),
                variation: readPercentage(body["variacion"])
            }
        }).catch(reason => {
            console.log(`dollar quote failed: ${reason}`);
            return dummyQuote(ticker);
        });
}

function readNumber(s: string): number {
    return parseFloat(s.replace(',', '.'));
}

function readPercentage(s: string): number {
    return parseFloat(s.replace('%', '')) / 100.0;
}

function dummyQuote(ticker: string): Quote {
    return {
        ticker: ticker,
        time: 'N/A',
        bid: 0,
        ask: 0,
        variation: 0
    }
}