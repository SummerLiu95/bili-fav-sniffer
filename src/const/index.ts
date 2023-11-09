export type Data = {
    msg: string;
    data?: object;
}

export const EasterEgg = ' __           ___                     ___                                                 ___    ___               \n' +
    '/\\ \\      __ /\\_ \\    __            /\'___\\                                          __  /\'___\\ /\'___\\              \n' +
    '\\ \\ \\____/\\_\\\\//\\ \\  /\\_\\          /\\ \\__/   __     __  __             ____    ___ /\\_\\/\\ \\__//\\ \\__/   __   _ __  \n' +
    ' \\ \\ \'__`\\/\\ \\ \\ \\ \\ \\/\\ \\  _______\\ \\ ,__\\/\'__`\\  /\\ \\/\\ \\  _______  /\',__\\ /\' _ `\\/\\ \\ \\ ,__\\ \\ ,__\\/\'__`\\/\\`\'__\\\n' +
    '  \\ \\ \\L\\ \\ \\ \\ \\_\\ \\_\\ \\ \\/\\______\\\\ \\ \\_/\\ \\L\\.\\_\\ \\ \\_/ |/\\______\\/\\__, `\\/\\ \\/\\ \\ \\ \\ \\ \\_/\\ \\ \\_/\\  __/\\ \\ \\/ \n' +
    '   \\ \\_,__/\\ \\_\\/\\____\\\\ \\_\\/______/ \\ \\_\\\\ \\__/.\\_\\\\ \\___/ \\/______/\\/\\____/\\ \\_\\ \\_\\ \\_\\ \\_\\  \\ \\_\\\\ \\____\\\\ \\_\\ \n' +
    '    \\/___/  \\/_/\\/____/ \\/_/          \\/_/ \\/__/\\/_/ \\/__/            \\/___/  \\/_/\\/_/\\/_/\\/_/   \\/_/ \\/____/ \\/_/ \n' +
    '                                                                                                                   \n' +
    '                                                                                                                   '

export enum ConnectionType {
    Tele,
    RSS
}

export interface FormDataType {
    telegram_bot_token: string;
    telegram_chat_id: string;
    fav_url: string;
    rss_domain: string;
    cron: string;
    cookies: string;
    title: string;
}

export const LocalStorageKey = 'bili';

export type UserInfo = {
    isLogin: boolean;
    face: string;
    uname: string;
    level_info: {
        current_level: number;
    }
    mid: number;
    money: number;
}

export const BV_Record_Path = '/app/BV.txt';

export const Video_Downloaded_Path = '/usr/you-get-download/'
