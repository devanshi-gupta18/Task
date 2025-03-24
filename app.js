const express = require('express');
const mysql=require('mysql2');
const app = express();
const PORT = 3000;

app.use(express.json());

// mysql connection
const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'studentDb'
});

// connect to mysql
db.connect(err=>{
    if(err){
        console.log('Datanae connection failed');
    }
    else{
        console.log('Connected to MySql database');
    }
});


// GET All student
app.get('/student', (req, res) => {
    db.query('select * from students', (err, results) =>{
        if(err){
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

// GET ALL Student by id
app.get('/student/:id', (req, res) => {
    const id=req.params.id;
    db.query('select * from students where id=?', [id], (err, results)=>{
        if(err){
            return res.status(500).send(err);
        }
        if(results.length==0){
            return res.status(404).send('Student not found');
        }
        res.json(results[0]);
    });
});

// POST/ Student
app.post('/student', (req, res) => {
    const {name, email, age, subject, gender} = req.body;
    db.query('insert into students (name, email, age, subject, gender) values(?, ?, ?, ?, ?)',
        [name, email, age, subject, gender], (err, result) =>{
            if(err){
                return res.status(500).send(err);
            }
            elseP
            res.status(201).json({id: result.insertId, name, email, age, subject, gender});
        });
});

// PUT: Update student by id
app.put('/student/:id', (req, res) => {
    const id=req.params.id;
    const{name, email, age, subject, gender} = req.body;
    db.query('update student set name=?, email=?, age=?, subject=?, gender=? where id=?',
        [name, email, age, subject, gender, id], (err, result) =>{
            if(err){
                return res.status(505).send(err);
            }
            if(result.affectedRows===0){
                return res.status(404).send('Student not found');
            }
            res.json({message: 'Student updated'});
        });
});

// delete student by id
app.delete('/student/:id', (req, res) => {
    const id=req.params.id;
    db.query('delete from students where id = ?', [id], (err, result) =>{
        if(err){
            return res.status(500).send(err);
        }
        if(result.affectedRows===0){
            return res.status(404).send('Student not found');
        }
        res.json({message: 'Student deleted'});
    })
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});