import {Interaction, InteractionCallbackType, InteractionCommandType, InteractionResponse, InteractionType} from './types';
import {get_informal_ambito, Quote} from './price';

interface InteractionHandler {
    canProcess(interaction: Interaction): boolean;
    process(interaction: Interaction): Promise<InteractionResponse>;
}

export class OzonoBot implements InteractionHandler {
    
    handlers: InteractionHandler[];

    constructor() {
        this.handlers = [
            new Ping(),
            new DollarQuote()
        ]
    }

    canProcess(interaction: Interaction): boolean {
        return true;
    }

    process(interaction: Interaction): Promise<InteractionResponse> {
        const theHandler = this.handlers.find((handler) => handler.canProcess(interaction));
        if (theHandler == undefined) {
            throw Error("unsupported interaction");
        }
        return theHandler.process(interaction);
    }
}

export class Ping implements InteractionHandler {
    
    canProcess(interaction: Interaction): boolean {
        return interaction.type == InteractionType.PING
    }

    process(interaction: Interaction): Promise<InteractionResponse> {
        return Promise.resolve({
            type: InteractionCallbackType.PONG
        });
    }
}

export class DollarQuote implements InteractionHandler {
    
    DOLAR_COMMAND_NAME = 'dolar'
    quoteSources: [() => Promise<Quote>]

    constructor() {
        this.quoteSources = [
            () => get_informal_ambito("Dolar Blue")
        ];
    }

    canProcess(interaction: Interaction): boolean {
        return interaction.type == InteractionType.APPLICATION_COMMAND
            && interaction.data?.name == this.DOLAR_COMMAND_NAME
            && interaction.data?.type == InteractionCommandType.CHAT_INPUT
    }

    async process(interaction: Interaction): Promise<InteractionResponse> {
        const quotes = await Promise.all(this.quoteSources.map(source => source()));
        const message = quotes.map(this.messageLine).join("\n");
        return {
            type: InteractionCallbackType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: message
            }
        };
    }

    messageLine(quote: Quote): string {
        return `${quote.ticker} Fecha: ${quote.time} Compra: ${quote.bid.toFixed(2)} Venta: ${quote.ask.toFixed(2)}`;
    }
}