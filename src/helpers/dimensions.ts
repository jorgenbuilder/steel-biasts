export function getGameWidth (scene: Phaser.Scene): number {
    const w = scene.sys.game.config.width;
    return typeof w === 'string' ? parseInt(w) : w;
}

export function getGameHeight (scene: Phaser.Scene): number {
    const h = scene.sys.game.config.height;
    return typeof h === 'string' ? parseInt(h) : h;
}