import SpriteSheet from "./SpriteSheet.js";

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
    },

    Load(): Promise<void[]> {
        const spriteSheetLoaders = SpriteSheetList.map((spriteSheet) => spriteSheet.Load());
        return Promise.all(spriteSheetLoaders);
    }
}

export class _SpriteSheets {

    private readonly _list: Array<SpriteSheet> = [];

    public Register(spriteSheet: SpriteSheet) {
        const doesSpriteSheetExist = (this.Find(spriteSheet.ID) != undefined);
        if (doesSpriteSheetExist == false) {
            this._list.push(spriteSheet);
        }
        else {
            throw new Error(`Can not register "${spriteSheet.ID}"; a SpriteSheet with the same name already exists.`);
        }
    }

    public Find(id: string) {
        const searchedSpriteSheet = this._list.find(element => element.ID == id);
        return searchedSpriteSheet;
    }

    public Destroy(id: string) {
        const index = this._list.findIndex(element => element.ID == id);
        if (index != -1) {
            this._list.splice(index, 1);
        }
    }

    public LoadAll(): Promise<void[]> {
        const spriteSheetLoaders = this._list.map((spriteSheet) => spriteSheet.Load());
        return Promise.all(spriteSheetLoaders);
    }

}