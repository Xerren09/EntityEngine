import { SpriteSheet } from "./SpriteSheet.js";

export const SpriteSheetList: Array<SpriteSheet> = [];

export const SpriteSheets = {
    Register(spriteSheet: SpriteSheet) {
        const doesSpriteSheetExist = (SpriteSheets.Find(spriteSheet.ID) != undefined);
        if (doesSpriteSheetExist == false) {
            SpriteSheetList.push(spriteSheet);
        }
        else {
            console.warn(`Can not register "${spriteSheet.ID}"; a SpriteSheet with the same name already exists.`);
        }
    },

    Find(id: string) {
        const searchedSpriteSheet = SpriteSheetList.find(element => element.ID == id);
        return searchedSpriteSheet;
    },

    Destroy(id: string) {
        const index = SpriteSheetList.findIndex(element => element.ID == id);
        if (index != -1) {
            SpriteSheetList.splice(index, 1);
        }
    }
}