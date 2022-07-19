export interface ReferenceData {
    id: number;
    parentId: number;
    label: string;
    children: ReferenceData[];
    key: string;
}