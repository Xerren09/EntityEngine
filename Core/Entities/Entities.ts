import { Entity } from "./Entity.js";

export const EntityList: Array<Entity> = [];

export const Entities = {
    Register(entity: Entity) {
        const doesEntityExist = (Entities.Find(entity.Name) != undefined);
        if (doesEntityExist == false) {
            EntityList.push(entity);
        }
        else {
            console.warn(`Can not register "${entity.Name}"; an Entity with the same name already exists.`);
        }
    },

    FindAllTagged(tag: string) {
        const taggedEntities = EntityList.filter(element => element.Tags.includes(tag));
        return taggedEntities;
    },

    Find(name: string) {
        const searchedEntity = EntityList.find(element => element.Name == name);
        return searchedEntity;
    },

    Destroy(name: string) {
        const index = EntityList.findIndex(element => element.Name == name);
        if (index != -1) {
            EntityList.splice(index, 1);
        }
    }
}