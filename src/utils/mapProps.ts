export function getObjectCustomProps<T> (data: Phaser.Data.DataManager): T {
    const result: {[key: string]: any} = {};
    Object.values(data.getAll()).forEach((x: any) => result[x.name] = x.value);
    return result as T;
}

export interface PortalData {
    Destination: string;
    OnTouch: boolean;
    Portal: boolean;
};