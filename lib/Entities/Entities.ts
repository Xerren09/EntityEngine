import Entity from "./Entity.js";

export class Entities {
    private _list: Array<Entity> = [];

    public get List() {
        return [...this._list] as ReadonlyArray<Entity>;
    }

    public Register(entity: Entity) {
        if (this.Find(entity.ID) === undefined) {
            this._list.push(entity);
        }
        else {
            throw new Error(`Can not register "${entity.ID}"; an Entity with the same name already exists.`);
        }
    }

    /**
     * Gets a list of entities that have the given tag.
     * @param tag 
     * @returns 
     */
    public FindAllTagged(tag: string) {
        let ret: Entity[] = [];
        for (const entity of this._list) {
            if (entity.Tags.includes(tag)) {
                ret.push(entity);
            }
        }
        return ret;
    }

    /**
     * Finds the first Entity with the given name.
     * @param name 
     * @returns 
     */
    public Find(name: string) : Entity | undefined {
        let ret: Entity | undefined;
        for (const entity of this._list) {
            if (entity.ID === name) {
                ret = entity;
                break;
            }
        }
        return ret;
    }

    /**
     * Destroys an Entity with the given name.
     * 
     * This removes it from the list of active entities.
     * @param name 
     * @returns 
     */
    public Destroy(name: string) : boolean {
        let deleted: boolean = false;
        for (let index = 0; index < this._list.length; index++) {
            const element = this._list[index];
            if (element.ID === name) {
                this._list.splice(index, 1);
                deleted = true;
                break;
            }
        }
        return deleted;
    }

    /**
     * Destroys all entities currently known the engine.
     */
    public Wipe() {
        this._list.length = 0;
    }
}