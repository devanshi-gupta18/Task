const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const PORT = 3000;

app.use(express.json());

const dataFile = path.join('./', 'student.json');
function getData() {
    return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
}

function saveData(data){
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf8');
}
// GET All student
app.get('/student', (req, res) => {
    res.json(getData());
})

// GET ALL Student by id
app.get('/student/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const student = getData().find(s => s.id === id);
    if (student) {
        res.json(student);
    }
    else {
        res.status(404).send('Student not found');
    }
});

// POST/ Student
app.post('/student', (req, res) => {
    const student = getData();
    const newStudent = req.body;

    if (student.length > 0) {
        newStudent.id = student[student.length - 1].id + 1;
    }
    else {
        newStudent.id = 1;
    }

    student.push(newStudent);
    saveData(student);
    res.status(201).json(newStudent);
});

// PUT: Update student by id
app.put('/student/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const student = getData();
    const index = student.findIndex(s => s.id === id);

    if (index === -1) {
        return res.status(404).send('Student not found');
    }

    student[index] = { ...student[index], ...req.body };
    saveData(student);
    res.json(student[index]);
});

// delete student by id
app.delete('/student/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let students = getData();

    const newStudents = students.filter(s => s.id !== id);
    if (newStudents.length === students.length) {
        return res.status(404).send('Student not found');
    }
    saveData(newStudents);
    res.json({ message: 'Student deleted' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});