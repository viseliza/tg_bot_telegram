export * from './event';
export * from './strategies';
export * from './setting';

export type Role = "USER" | "OWNER";

export type IDates = {
    [key: string]: IDateValue;
}

type IDateValue = {
    dates: string[];
}