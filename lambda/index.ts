import {verifyKey} from 'discord-interactions';
import { OzonoBot } from './handler';
import {APIGatewayEvent} from './types'

const CLIENT_PUBLIC_KEY = "1ce8b80b23b0bf9f65d4117deb4458997dc2ed64c7a40191b9e950de012283f7";

export async function post(event: APIGatewayEvent): Promise<any> {
        
    console.log(event);
    verifyEvent(event);
    
    const body = event.jsonBody;
    const bot = new OzonoBot();
    return bot.process(body);
}

function verifyEvent(event: APIGatewayEvent): void {
    const rawBody: string | null = event.rawBody;
    const signature: string | undefined = event.params.header['x-signature-ed25519'];
    const timestamp: string | undefined = event.params.header['x-signature-timestamp'];

    const isValidRequest = rawBody != null
        && signature != undefined
        && timestamp != undefined;
        
    if (!isValidRequest) {
        throw new Error("[UNAUTHORIZED] missing request signature");
    }
    
    try {
        const isVerified = verifyKey(rawBody!, signature!, timestamp!, CLIENT_PUBLIC_KEY)
        if (!isVerified) {
            throw new Error("[UNAUTHORIZED] signature verification failed");
        }
    } catch (exception) {
        console.log(exception);
        throw new Error("[UNAUTHORIZED] invalid request signature");
    }
}
