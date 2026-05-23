const express=require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json()); 

// 5C: Secure Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',      
    database: 'mbti_system'
});

// READ API: Get student list
app.get("/api/students", (req, res) => {
    const sql = "SELECT * FROM Student";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results); 
    });
});

// INSERT: Create Student Profile
app.post("/api/students", (req, res) => {
    const { StudentID, Name, DeptID, MBTI_Code, Email } = req.body;
    const sql = "INSERT INTO Student (StudentID, Name, DeptID, MBTI_Code, Email) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [StudentID, Name, DeptID, MBTI_Code, Email], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ message: "Student record created successfully!" });
    });
});

// SELECT: Department MBTI Statistics
app.get("/api/stats/mbti", (req, res) => {
    const sql = "SELECT MBTI_Code, COUNT(*) as Total FROM Student GROUP BY MBTI_Code";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// UPDATE: Update Project Matching Status
app.put("/api/matching", (req, res) => {
    const { status, projectId, studentId } = req.body;
    const sql = "UPDATE Team_Matching SET Match_Status = ? WHERE ProjectID = ? AND StudentID = ?";
    db.query(sql, [status, projectId, studentId], (err, result) => {
        if (err) return res.status(500).json({ error: "Update failed" });
        res.json({ message: "Matching status updated." });
    });
});

// DELETE: Leave Project Member
app.delete("/api/projects/leave", (req, res) => {
    const { projectId, studentId } = req.body;
    const sql = "DELETE FROM Team_Matching WHERE ProjectID = ? AND StudentID = ?";
    db.query(sql, [projectId, studentId], (err, result) => {
        if (err) return res.status(500).json({ error: "Delete failed" });
        res.json({ message: "Project left successfully." });
    });
});
app.listen(3000, () => console.log('Server is running on http://localhost:3000'));