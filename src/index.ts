import express from 'express';
import authRoutes from './routes/auth';
import sequelize from './config/database';
import userRoutes from './routes/user';  
import productRoutes from './routes/product'; 
import path from 'path';

const app = express();

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api/v1/users', userRoutes);  
app.use('/api/v1/products', productRoutes);   
app.use(express.static(path.join(__dirname, '../public'))); 


sequelize.sync({ alter: true }).then(() => {
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
});