import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import taskRoutes from './routes/taskRoutes';
import userRoutes from"./routes/userRoutes";
import { graphqlHTTP } from 'express-graphql';
import schema from './schema';
import authMiddleware from './middleware/auth.middleware';
dotenv.config();

const app = express();

app.use(express.json());

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error("MONGO_URI is not defined in the environment variables");
}

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri, {});
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err);
    process.exit(1); // Exit process with failure
  }
};

connectDB();
app.use(authMiddleware);

app.use('/graphql', graphqlHTTP((req) => ({
  schema,
  rootValue: require('./resolver').default,
  graphiql: true,
  context: { user: (req as any).user },
})));

app.use('/user', userRoutes);
app.use('/tasks', taskRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
