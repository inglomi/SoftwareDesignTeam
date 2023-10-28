const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;
const connection = require('./database');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('client'));

connection.connect((err) => {
    if(err) throw err;
    console.log('database connected successfully!');
});

// //update
app.patch('/update_info/:clientID', (req, res) => {
    const uID = req.params.clientID;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const address1 = req.body.address1;
    const city = req.body.city;
    const state = req.body.state;
    const zipcode = req.body.zipcode;

    connection.query('UPDATE client SET first_name=?, last_name=?, address1=?, city=?, state=?, zipcode=? WHERE clientID=?', 
    [first_name,last_name,address1,city,state,zipcode,uID],(err, result) =>{
        if(err){
            console.log(err);
        }
        else{
            res.send('updated!');
            console.log(result);
        }
    });
});

app.patch('/update_login/:login_id', (req, res) => {
    const uID = req.params.login_id;
    const L_password = req.body.L_password;

    connection.query('UPDATE userLogin SET L_password=? WHERE login_id=?', [L_password,uID],(err, result) =>{
        if(err){
            console.log(err);
        }
        else{
            res.send('updated!');
            console.log(result);
        }
    });
});

app.listen(port, () => {
    console.log('server connected successfully!');
});
