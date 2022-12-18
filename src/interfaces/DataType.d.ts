export interface DataType {
    id: React.Key;
    name: string;
    type: string;
    status: string;
    createdOn: Date | string;
    archived: boolean;
}