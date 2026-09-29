import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Product extends Model {
  public id!: number;
  public name!: string;
  public price!: number;
  public created_at!: Date;
  public update_at!: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    update_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    timestamps: false,
  }
);

export default Product;