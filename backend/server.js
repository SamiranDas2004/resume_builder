import express from 'express'
import connectDB from './middlewares/db.js'
const app=express()

app.get('/',(req,res)=>{
    res.send("hello")
})
app.use(express.json());

// For parsing URL-encoded data (optional, if you are sending form data)
app.use(express.urlencoded({ extended: true }));

import userRouter from './routes/user.route.js'
app.use('/api/user',userRouter)


import resumeRoute from './routes/resume.route.js'
app.use('/api',resumeRoute)


app.listen(8000,()=>{
    connectDB()
    console.log("server is running");
    
})