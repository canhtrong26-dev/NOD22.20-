import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './user';

class RefreshToken extends Model {
  public id!: number;
  public token!: string;
  public userId!: number;
  public expiryDate!: Date;
}

RefreshToken.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'RefreshToken',
    tableName: 'refresh_tokens',
  }
);

RefreshToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default RefreshToken;