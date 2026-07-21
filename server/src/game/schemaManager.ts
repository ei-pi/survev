export class SchemaManager<InstanceData extends { type: string }> {
    protected _entries: Array<InstanceData> = [];

    get entries(): ReadonlyArray<InstanceData> {
        return this._entries;
    }

    protected _entryTypes: string[] = [];

    protected _addEntry(entry: InstanceData) {
        this._entries.push(entry);
        this._entryTypes.push(entry.type);
    }

    /**
     * @returns `true` if found (and removed), `false` if not present
     */
    removeEntry(type: string, outEntry?: { entry?: InstanceData }): boolean {
        const idx = this._entries.findIndex((statusFx) => statusFx.type === type);
        if (idx === -1) return false;
        if (outEntry !== undefined) {
            outEntry.entry = this._entries[idx];
        }
        this._entries.splice(idx, 1);
        this._entryTypes.splice(this._entryTypes.indexOf(type), 1);
        return true;
    }

    hasEntry(type: string) {
        return this._entryTypes.includes(type);
    }

    clear() {
        this._entries.length = 0;
        this._entryTypes.length = 0;
    }
}
