import mongoose from 'mongoose'
import { ProductInterface } from './product.types';

const { Schema } = mongoose

const productSchema = new Schema<ProductInterface>({
  alias: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: true,
    default: 'N/A'
  },
  brand: {
    type: String,
    required: true,
    default: 'N/A'
  },
  image: {
    type: String,
    required: false,
    default: 'No Image Available'
  },
  currency: {
    type: String,
    required: false,
    default: '€'
  },
  currentPrice: {
    type: String,
    required: true,
    default: '0'
  },
  defaultPrice: {
    type: String,
    required: true,
    default: '0'
  },
  isPromo: {
    type: Boolean,
    required: true,
    default: false
  },
  discount: {
    type: String,
    required: true,
    default: '0'
  },
  productDescription: {
    type: String,
    required: false,
    default: 'No description available'
  },
  productCategories: {
    type: [String],
    required: false,
    default: []
  },
  packageSize: {
    type: String,
    required: false,
  },
  packageUnits: {
    type: String,
    required: false
  },
  wholePrice: {
    type: String,
    required: false
  },
  wholeUnits: {
    type: String,
    required: false
  },
  supermarket: {
    type: String,
    required: true,
    enum: ['continente', 'auchan', 'pingodoce', 'elcorteingles']
  }
}, {
  collection: 'products'
});

const Product = mongoose.model('Product', productSchema);

export default Product