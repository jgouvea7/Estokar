export enum ProductStatus {
    AVAILABLE = 'AVAILABLE',
    SOLD_OUT = 'SOLD OUT'
}


export class CreateProductDto {

    userId: string;
    name: string;
    description?: string;
    stock: number;
    productStatus: ProductStatus;

}
