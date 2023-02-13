import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import cors from "cors"
import morgan from "morgan";
import { readdirSync } from "fs";
// import csrf from "csurf"

import authRoute from "./routes/auth.js"
import courseRoute from "./routes/course.js"
import instructorRoute from "./routes/instructor.js"
import userRoute from './routes/user.js'
import functions from "firebase-functions"

// const csrfProtection = csrf({ cookie: true })
const app = express()
app.set('trust proxy', true);

dotenv.config()
// Routes

//Mongoose
const connect = () =>{
  mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(()=> {
    console.log("Connected to DB")
  })
  .catch((err)=> {
    throw err
  })
}
//middlewares
app.use(cookieParser())
app.use(express.json({ limit: '10mb' }))
app.use(bodyParser.json({limit: '10mb', parameterLimit: 1000000 }))
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb', parameterLimit: 1000000 }))


var corsOptions = {
  origin: ['http://localhost:3000', "https://elearning-front-test.et.r.appspot.com/"], 
  method: [ "GET", "POST", "PUT", "DELETE" ],
  allowedHeaders: ['Content-Type', 'Authorization', ]
}
app.use(cors())
// app.use(morgan("dev"))
// app.use(csrfProtection)

// route
app.use("/api/auth", authRoute)
app.use("/api/course", courseRoute)
app.use("/api/instructor", instructorRoute)
app.use("/api/user", userRoute)


app.get('/', (req, res)=>{
  res.status(200);
  res.send("Welcome to root URL of Server");
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

const port = 8080
connect()

app.listen(port, console.log(`Connected to Port ${port}`))



export const api = functions.https.onRequest(app)