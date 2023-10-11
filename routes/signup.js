const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const collection = require('../database/database');
const taskCollection = require('../database/taskdatabase');
const router = express.Router();

let userDetails;

router.get('/', async (req,res) => { 
    const token = req.cookies.token;
    if (token === undefined){
        res.redirect('/login');
    }else{
        const username = userDetails[0].email;
        const task = await taskCollection.find({userName:username});
        res.render('home', {task:task});     
    }
});  

router.post('/', async (req, res) => {
    const username = userDetails[0].email;
    const name = req.body.name;
    if (name === ""){
        res.redirect(`/`);
    }else{
        await taskCollection.insertMany({name:req.body.name, userName:username});
        res.redirect(`/`);
    }
});

router.get('/delete/:id', async (req,res) =>{
    const id = req.params.id;
    await taskCollection.findOneAndDelete({_id:id})
    res.redirect(`/`);
})

router.get('/edit/:id', async (req,res) =>{
    const id = req.params.id;
    const value = await taskCollection.find({_id:id})
    res.render('input', {id:id,data:value[0]});
})

router.post('/edit/:id', async (req, res) =>{
    const username = userDetails[0].email;
    const id = req.params.id;
    await taskCollection.findByIdAndUpdate(id, {name:req.body.name, userName:username});
    res.redirect(`/`);
})


router.get('/signup', (req, res) =>{
    if (req.cookies.token){
        res.redirect(`/`);
    }else{
        res.render('signup');
    }
})

router.post('/signup', async (req, res) =>{
    const hashPassword = await bcrypt.hash(req.body.password, 12);
    const data = {
        email:req.body.email,
        password: hashPassword
    }
    await collection.insertMany(data);
    res.redirect('/login');
})

router.get('/login', (req,res) =>{
    if (req.cookies.token){
        res.redirect(`/`);
    }else{
        res.render('login');
    }
})

router.post('/login', async (req, res) =>{
    const username = req.body.username
    const password = req.body.loginPassword;
    const userData = await collection.findOne({email:username});
    const dbUsername = userData.email;
    const dbPassword = userData.password;
    if (dbUsername === null){
        res.send('<h1>User Not Found</h1>');
    }else{
        const hassedPassword = await bcrypt.compare(password,dbPassword)
        if (hassedPassword === true){
            const payload = {username:username};
            const jwtToken = jwt.sign(payload, "SECERET_TOKEN");
            res.cookie('token', jwtToken);
            userDetails = await collection.find({email:username});
            res.redirect(`/`);   
        }else{
            res.send('<h1>Incorrect Password</h1>');
        }
    }
})

router.post("/logout", (req, res) =>{
    res.clearCookie('token');
    res.redirect('/login');
});

module.exports = router