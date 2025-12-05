import express from 'express';
import { ConnectDB } from '../config/dbConfig.js';
import 'dotenv/config';
import authRouter from '../routers/auth.routes.js';
import cookieParser from 'cookie-parser';
import taskRouter from '../routers/task.routes.js';
import cors from 'cors';
import userRouter from '../routers/user.router.js';
import passport from '../config/passport.js';
import session from "express-session";

const app = express();

const PORT = process.env.PORT || 3000;
await ConnectDB();

app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
}));

app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth',authRouter);
app.use('/api/task',taskRouter);
app.use('/api/user',userRouter);

export default app;

// app.listen(PORT,()=>{
//     console.log('server is running on http://localhost:3000');
// })