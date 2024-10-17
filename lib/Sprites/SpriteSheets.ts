import SpriteSheet from "./SpriteSheet.js";

export function spriteSheetLoader(...spriteSheets: SpriteSheet[]) : Promise<void[]> {
    const spriteSheetLoaders = spriteSheets.filter(sheet => sheet.ready == false).map((sheet) => sheet.Load());
    return Promise.all(spriteSheetLoaders);
}