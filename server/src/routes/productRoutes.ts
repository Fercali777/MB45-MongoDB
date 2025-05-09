import express, { Request, Response } from 'express';
import { Product } from '../models/Product';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import multer from 'multer';
import { storage } from '../config/cloudinary'; // Asegúrate de que este archivo esté correctamente configurado

// Configurar multer con Cloudinary
const upload = multer({ storage });

const router = express.Router();

// Tipado del controlador, ya no es necesario definir el interface MulterRequest
const addProduct = async (req: Request, res: Response): Promise<void> => {
  console.log('Entrando a /api/products/add');

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Token missing' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    console.log('Token decodificado:', decoded);

    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    console.log('Usuario encontrado:', user);

    console.log('req.file:', req.file);
    console.log('req.body:', req.body);

    const imageUrl = req.file?.path;
    const productData = {
      ...req.body,
      image: imageUrl,
      seller: user._id,
    };

    console.log('Datos del producto a guardar:', productData);

    const newProduct = new Product(productData);
    await newProduct.save();

    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    console.error('Error en /add:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Ruta para agregar producto con una imagen
router.post('/add', upload.single('image'), addProduct);

export default router;



// import express from 'express';
// import { Product } from '../models/Product';
// import jwt from 'jsonwebtoken';
// import { User } from '../models/User';

// const router = express.Router();

// const addProduct = async (req: express.Request, res: express.Response): Promise<void> => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     res.status(401).json({ message: 'Token missing' });
//     return;
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
//     const user = await User.findById(decoded.id);

//     if (!user) {
//       res.status(404).json({ message: 'User not found' });
//       return;
//     }

//     const productData = { ...req.body, seller: user._id };
//     const newProduct = new Product(productData);
//     await newProduct.save();

//     res.status(201).json({ message: 'Product added successfully', product: newProduct });
//   } catch (error) {
//     console.error('Error adding product:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// router.post('/add', addProduct);

// export default router;