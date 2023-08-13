import mongoose from 'mongoose'
import { ProductListInterface } from './product.types';

const { Schema } = mongoose

const productListSchema = new Schema<ProductListInterface>({
    alias: {
        type: String,
        required: false
    }
}, {
    collection: 'products_list'
});

const ProductList = mongoose.model('ProductList', productListSchema);

export default ProductList;