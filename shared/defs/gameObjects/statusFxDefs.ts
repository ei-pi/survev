export const StatusFxDefs = {
    regeneration: {
        name: "Regeneration",
        type: "status_fx",
        color: 0xCD5CAB,
    },
    absorption: {
        name: "Absorption",
        type: "status_fx",
        color: 0x2552A5,
    },
} satisfies Record<string, StatusFxDef>;

export type StatusFxKeys = keyof typeof StatusFxDefs;

export const StatusFxProperties = {
    regeneration: {
        BASE_MS_PER_HEAL: 2500,
        msPerHeal(level: number) {
            return this.BASE_MS_PER_HEAL >> (level - 1);
        },
        HEAL_AMOUNT: 5,
    },
    absorption: {
        hp(level: number) {
            return 20 * level;
        },
    },
};

export type StatusFxInstanceData = {
    regeneration: {
        nextTick: number;
    };
    absorption: {};
};

export interface StatusFxDef {
    readonly type: "status_fx";
    name: string;
    color: number;
}
