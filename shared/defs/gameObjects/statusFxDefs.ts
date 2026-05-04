export const StatusFxDefs = {
} satisfies Record<string, StatusFxDef>;

export type StatusFxKeys = keyof typeof StatusFxDefs;

export const StatusFxProperties = {
};

export type StatusFxInstanceData = {
};

export interface StatusFxDef {
    readonly type: "status_fx";
    name: string;
    color: number;
}
