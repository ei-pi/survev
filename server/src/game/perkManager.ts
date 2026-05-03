export type PerkInstanceInfo = {
    type: string;
    droppable: boolean;
    replaceOnDeath?: string;
    isFromRole?: boolean;
};

export class PerkManager {
    private _perks: Array<PerkInstanceInfo> = [];

    get perks(): ReadonlyArray<PerkInstanceInfo> {
        return this._perks;
    }

    private _perkTypes: string[] = [];

    addPerk(
        type: string,
        droppable = false,
        replaceOnDeath?: string,
        isFromRole?: boolean,
    ) {
        this._perks.push({
            type,
            droppable,
            replaceOnDeath,
            isFromRole,
        });
        this._perkTypes.push(type);
    }

    /**
     * @returns `true` if found (and removed), `false` if not present
     */
    removePerk(type: string): boolean {
        const idx = this._perks.findIndex(perk => perk.type === type);
        if (idx === -1) return false;
        this._perks.splice(idx, 1);
        this._perkTypes.splice(this._perkTypes.indexOf(type), 1);
        return true;
    }

    hasPerk(type: string) {
        return this._perkTypes.includes(type);
    }

    clear() {
        this._perks.length = 0;
        this._perkTypes.length = 0;
    }
}
