export function getObjectCustomProps<T> (data: Phaser.Data.DataManager): T {
    console.log(data);
    return tiledPropsToObject(data.getAll());
}

export function tiledPropsToObject<T> (data: Phaser.Types.Tilemaps.TiledObject['properties']) {
    const result: {[key: string]: any} = {};
    Object.values(data).forEach((x: any) => result[x.name] = x.value);
    return result as T;
}

export interface PortalData {
    Name: string;
    Destination: string;
    OnTouch: boolean;
    Portal: boolean;
};

export interface SpawnData {
    Name: string;
    Spawn: boolean;
};

export interface TriggerData {
    OnTouch: boolean;
    IsDialogue: boolean;
    DialogueScript: string;
    PauseGame: boolean;
}