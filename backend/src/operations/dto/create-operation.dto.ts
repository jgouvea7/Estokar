export enum OperationType {
    SELL = 'SELL',
    BROKEN = 'BROKEN',
}

export class CreateOperationDto {
    userId: string;
    productId: string;
    quantity: number;
    typeOperation = OperationType
}
