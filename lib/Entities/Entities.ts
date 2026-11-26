import type Entity from "./Entity.js";

export class EntityManager implements Iterable<Entity> {
    /**
     * Used for fast iteration during rendering. The order of items is not static and may change at any time.
     */
    private _list: Array<Entity> = [];
    /**
     * Used for game code lookups and storage.
     */
    private _items: Map<string, Entity> = new Map();

    public get List(): ReadonlyArray<Entity> {
        return this._list as ReadonlyArray<Entity>;
    }

    /**
     * Registers an entity to this engine instance. Only registered entities will be rendered or can interact with eachother.
     * @param entity 
     */
    public Add(entity: Entity) {
        if (this._items.has(entity.ID) === false) {
            this._list.push(entity);
            this._items.set(entity.ID, entity);
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
    public FindAllTagged(tag: string): Entity[] {
        let ret: Entity[] = [];
        let i = 0;
        while (i < this._list.length) {
            const entity = this._list[i];
            if (entity.Tags.has(tag)) {
                ret.push(entity);
            }
            i++;
        }
        return ret;
    }

    /**
     * Finds the first Entity with the given name.
     * @param name 
     * @returns 
     */
    public Find(name: string): Entity | undefined {
        return this._items.get(name);
    }

    /**
     * Removes an Entity with the given name.
     * 
     * This removes it from the list of active entities.
     * @param name 
     * @returns 
     */
    public Remove(name: string): boolean {
        const known = this._items.delete(name);
        if (known === false) {
            return false;
        }
        // Delete from array
        let deleted: boolean = false;
        let i = 0;
        while (i < this._list.length) {
            const entity = this._list[i];
            if (entity.ID === name) {
                this._list.splice(i, 1);
                deleted = true;
                break;
            }
            i++;
        }
        return deleted;
    }

    /**
     * De-registers all entities currently known to the engine.
     */
    public Wipe() {
        this._list.length = 0;
        this._items.clear();
    }

    *[Symbol.iterator](): IterableIterator<Entity> {
        let i = 0;
        while (i < this._list.length) {
            yield this._list[i];
            i++;
        }
    }
}