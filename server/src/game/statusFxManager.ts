import {
    type StatusFxInstanceData,
    type StatusFxKeys,
    StatusFxProperties,
} from "../../../shared/defs/gameObjects/statusFxDefs";
import { math } from "../../../shared/utils/math";
import type { Player } from "./objects/player";
import { SchemaManager } from "./schemaManager";

export type StatusFxInstanceInfos = {
    [S in StatusFxKeys]: {
        type: S;
        additionTime: number;
        potency: number;
        expirationTimestamp: number;
        data: StatusFxInstanceData[S];
    };
}[StatusFxKeys];

export type StatusFxInstanceInfo<S extends StatusFxKeys> = StatusFxInstanceInfos & {
    type: S;
};

export class StatusFxManager extends SchemaManager<StatusFxInstanceInfo<StatusFxKeys>> {
    get statusFxs(): ReadonlyArray<StatusFxInstanceInfo<StatusFxKeys>> {
        return this._entries;
    }

    constructor(readonly owner: Player) {
        super();
    }

    addEntry<S extends StatusFxKeys>(
        type: S,
        potency: number,
        duration: number,
        initialData: StatusFxInstanceData[S],
        conflictPolicy: "override" | "longest" = "longest",
    ) {
        const now = this.owner.game.now;
        const entry = {
            type,
            additionTime: now,
            expirationTimestamp: this.owner.game.now + duration,
            potency,
            data: initialData,
        } as StatusFxInstanceInfo<S>;

        const existingIdx = this._entries.findIndex((entry) => entry.type === type);
        if (existingIdx === -1) {
            this._addEntry(entry);
            return;
        }

        const existing = this._entries[existingIdx];
        if (existing.potency > potency) return;
        if (existing.potency === potency) {
            // take the longest duration of the two, keep original's instance data
            existing.expirationTimestamp = math.max(
                existing.expirationTimestamp,
                entry.expirationTimestamp,
            );
        }

        if (
            conflictPolicy === "override"
            || existing.expirationTimestamp < entry.expirationTimestamp
        ) {
            this._addEntry(entry);
            this._mountStatusFx(entry);
        }
    }

    removeEntry(type: string): boolean {
        const outEntry: { entry: StatusFxInstanceInfo<StatusFxKeys> | undefined } = { entry: undefined };
        const exists = super.removeEntry(type, outEntry);
        if (exists) {
            this._unmountStatusFx(outEntry.entry!);
        }
        return exists;
    }

    private _mountStatusFx(entry: StatusFxInstanceInfo<StatusFxKeys>) {
        switch (entry.type) {
            case "absorption": {
                this.owner.absorptionHealth = math.max(
                    this.owner.absorptionHealth,
                    StatusFxProperties.absorption.hp(entry.potency),
                );
                break;
            }
        }
    }

    private _unmountStatusFx(entry: StatusFxInstanceInfo<StatusFxKeys>) {
        switch (entry.type) {
            case "absorption": {
                this.owner.absorptionHealth = 0;
                this.owner.healthDirty = true;
                break;
            }
        }
    }

    update() {
        const now = this.owner.game.now;

        for (let i = 0; i < this._entries.length; ++i) {
            const entry = this._entries[i];

            // update logic
            switch (entry.type) {
                case "regeneration": {
                    if (now > entry.data.nextTick) {
                        entry.data.nextTick = now
                            + StatusFxProperties.regeneration.msPerHeal(entry.potency);
                        this.owner.health += StatusFxProperties.regeneration.HEAL_AMOUNT;
                    }
                    break;
                }
            }

            // removal logic
            if (now > entry.expirationTimestamp) {
                this._unmountStatusFx(entry);
                this.owner.setDirty();
                this._entries.splice(i, 1);
                --i;
            }
        }
    }
}
