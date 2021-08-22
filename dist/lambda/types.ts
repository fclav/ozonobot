export interface APIGatewayEvent {
    rawBody: string,
    jsonBody: Interaction,
    params: APIGatewayParameters
}

interface APIGatewayParameters {
    [key: string]: any
}

export interface Interaction {
    id: snowflake,
    application_id: snowflake,
    type: InteractionType,
    data?: InteractionData,
    guild_id?: snowflake,
    channel_id?: snowflake,
    member?: any,
    user?: any,
    token: string,
    version: number,
    message?: any

}

export enum InteractionType {
    PING = 1,
    APPLICATION_COMMAND = 2,
    MESSAGE_COMPONENT = 3
}

interface InteractionData {
    id: snowflake,
    name: string,
    type: InteractionCommandType,
    resolved?: any,
    options?: any,
    custom_id?: string,
    component_type?: number,
    values?: any,
    target_id?: snowflake
}

type snowflake = string;

export interface InteractionResponse {
    type: InteractionCallbackType,
    data?: InteractionCallbackData,
}

export enum InteractionCallbackType {
    PONG = 1,
    CHANNEL_MESSAGE_WITH_SOURCE = 4,
    DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE = 5,
    DEFERRED_UPDATE_MESSAGE = 6,
    UPDATE_MESSAGE = 7,
}

export enum InteractionCommandType {
    CHAT_INPUT = 1,
    USER = 2,
    MESSAGE = 3,
}

interface InteractionCallbackData {
    tts?: boolean,
    content?: string,
    embeds?: any,
    allowed_mentions?: any,
    flags?: number,
    components?: any
}
