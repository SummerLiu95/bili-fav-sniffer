export enum Operation {
    start,
    stop
}

export type Data = {
    code: number;
    msg: string;
    data?: object;
}
