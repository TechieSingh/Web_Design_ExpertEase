import express from "express";
import dotenv from "dotenv";
import initialize from "./app/app.js";
import axios from "axios";

dotenv.config();

const app = express();
const port = process.env.PORT;
console.log(process.env.REDIRECT_URI);
console.log(process.env.ZOOM_API_KEY);
console.log(process.env.ZOOM_API_SECRET);

app.get('/',async (req,res)=>{
    const code = req.query.code;

    try{
        const response = await axios.post('https://zoom.us/oauth/token',null,{
            params:{
                grant_type: 'authorization_code',
                code:'A7zwJgUJxo1CAnb3Zc_SZCZl_eLBxbWWw',
                redirect_uri: process.env.REDIRECT_URI
            },
            headers:{
                'Authorization':`Basic ${Buffer.from(`${process.env.ZOOM_API_KEY}:${process.env.ZOOM_API_SECRET}`).toString('base64')}`
            }
        });
        res.send(response.data.access_token);    
    }catch(error){
        console.error('Error',error);
        res.send('Error');
    }
    
});

app.listen(port,()=>{
    console.log('Server running');
})



initialize(app);

// app.listen(port, () => console.log(`Server is runnong on port ${port}`));