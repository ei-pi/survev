import { SchemaManager } from "./schemaManager";

export type PerkInstanceInfo = {
    type: string;
    droppable: boolean;
    replaceOnDeath?: string;
    isFromRole?: boolean;
};

export class PerkManager extends SchemaManager<PerkInstanceInfo> {
    get perks(): ReadonlyArray<PerkInstanceInfo> {
        return this._entries;
    }

    addEntry(
        type: string,
        droppable = false,
        replaceOnDeath?: string,
        isFromRole?: boolean,
    ) {
        this._addEntry({
            type,
            droppable,
            replaceOnDeath,
            isFromRole,
        });
    }
}
