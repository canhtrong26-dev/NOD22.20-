import { Request, Response } from 'express';
import Product from '../models/product';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll();
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ error: 'Error fetching products' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(Number(id));
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.status(200).json(product);
  } catch (err) {
    return res.status(500).json({ error: 'Error fetching product' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  const { name, price } = req.body;
  try {
    const product = await Product.create({ name, price });
    return res.status(201).json(product);
  } catch (err) {
    return res.status(500).json({ error: 'Error creating product' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, price } = req.body;
  try {
    const product = await Product.findByPk(Number(id));
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await product.update({ name, price });
    return res.status(200).json(product);
  } catch (err) {
    return res.status(500).json({ error: 'Error updating product' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(Number(id));
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await product.destroy();
    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Error deleting product' });
  }
};