import Entity from "./Entity.js";

export const EntityList: Array<Entity> = [];

export const Entities = {
    Register(entity: Entity) {
        const doesEntityExist = (Entities.Find(entity.ID) != undefined);
        if (doesEntityExist == false) {
            EntityList.push(entity);
        }
        else {
            console.warn(`Can not register "${entity.ID}"; an Entity with the same name already exists.`);
        }
    },

    FindAllTagged(tag: string) {
        const taggedEntities = EntityList.filter(element => element.Tags.includes(tag));
        return taggedEntities;
    },

    Find(name: string) {
        const searchedEntity = EntityList.find(element => element.ID == name);
        return searchedEntity;
    },

    Destroy(name: string) {
        const index = EntityList.findIndex(element => element.ID == name);
        if (index != -1) {
            EntityList.splice(index, 1);
        }
    }
}