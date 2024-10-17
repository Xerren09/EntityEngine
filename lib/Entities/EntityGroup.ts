import { vector2D } from "../Types/Types";
import Entity from "./Entity";

export default class EntityGroup {
    private _items: Entity[] = [];

    public get Items(): Entity[] {
        return [...this._items];
    }

    public Add(entity: Entity) {
        if (this._items.includes(entity) == false) {
            this._items.push(entity);
        }
    }

    public Remove(entity: Entity) {
        const idx = this._items.indexOf(entity);
        if (idx === -1) {
            return;
        }
        this._items.splice(idx, 1);
    }

    public Translate(vector: vector2D) {
        for (const item of this._items) {
            item.Translate(vector);
        }
    }

    public MoveTowards(targetCoordinates: vector2D, step: number) {
        for (const item of this._items) {
            item.MoveTowards(targetCoordinates, step);
        }
    }

    public IsIntersecting(target: Entity): boolean {
        for (const item of this._items) {
            let res = item.IsIntersecting(target);
            if (res == true) {
                return res;
            }
        }
    }

    public GetIntersections(target: Entity): Entity[] {
        let res: Entity[] = [];
        for (const item of this._items) {
            let chk = item.IsIntersecting(target);
            if (chk == true) {
                res.push(item);
            }
        }
        return res;
    }
}