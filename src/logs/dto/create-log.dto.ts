export enum TypeLog {
    OPERATION = 'OPERATION',
    UPDATE =  'UPDATE',
    CREATE = 'CREATE',
    UPDATESTOCK = 'UPDATE_STOCK',
    DELETE = 'DELETE'
}


export class CreateLogDto {

    operationId?: string;
    userId: string;
    product: string;
    stockBefore: number;
    stockAfter: number;
    typeLog: TypeLog

}
