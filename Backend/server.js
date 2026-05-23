const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json()); 

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
    const { StudentID, Name, DeptID, MBTI_Code, Email, isSearchable } = req.body;
    const isSearchableVal = isSearchable !== undefined ? isSearchable : 1; 
    
    const sql = "INSERT INTO Student (StudentID, Name, DeptID, MBTI_Code, Email, Is_Searchable) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [StudentID, Name, DeptID, MBTI_Code, Email, isSearchableVal], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Student record created successfully!" });
    });
});

// PUT: Update Student Profile & Privacy
app.put("/api/students/:id", (req, res) => {
    const { Name, DeptID, MBTI_Code, Email, isSearchable } = req.body;
    const sql = "UPDATE Student SET Name=?, DeptID=?, MBTI_Code=?, Email=?, Is_Searchable=? WHERE StudentID=?";
    db.query(sql, [Name, DeptID, MBTI_Code, Email, isSearchable, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to update profile" });
        res.json({ message: "Profile updated successfully!" });
    });
});

// DELETE: Remove Student
app.delete("/api/students/:id", (req, res) => {
    const sql = "DELETE FROM Student WHERE StudentID = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: "Delete failed" });
        res.json({ message: "Student removed successfully" });
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

// ==========================================
// COURSE & FEEDBACK APIs 
// ==========================================
app.get("/api/courses", (req, res) => {
    const sql = "SELECT * FROM Course";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get("/api/courses/:id/feedback", (req, res) => {
    const sql = "SELECT * FROM Course_Feedback WHERE CourseID = ?";
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post("/api/feedback", (req, res) => {
    const { courseId, studentId, rating, comments } = req.body;
    const sql = "INSERT INTO Course_Feedback (CourseID, StudentID, Rating, Comments) VALUES (?, ?, ?, ?)";
    db.query(sql, [courseId, studentId, rating, comments], (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to save feedback" });
        res.json({ message: "Feedback saved successfully." });
    });
});

// ==========================================
// NEW MATCHING APIs (Fixed for Issues 5 & 6)
// ==========================================

// 取得所有專案以及其需求
app.get("/api/projects", (req, res) => {
    const sql = `
        SELECT p.ProjectID, p.Title as ProjectName, p.Description, p.Status,
               GROUP_CONCAT(DISTINCT pd.DeptID) as reqDepts,
               GROUP_CONCAT(DISTINCT pm.MBTI_Code) as prefMBTI
        FROM Project p
        LEFT JOIN Project_Department pd ON p.ProjectID = pd.ProjectID
        LEFT JOIN Project_MBTI pm ON p.ProjectID = pm.ProjectID
        GROUP BY p.ProjectID
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        const formatted = results.map(r => ({
            ...r,
            reqDepts: r.reqDepts ? r.reqDepts.split(',').map(Number) : [],
            prefMBTI: r.prefMBTI ? r.prefMBTI.split(',') : []
        }));
        res.json(formatted);
    });
});

// 取得特定專案的現有組員與狀態
app.get("/api/projects/:id/members", (req, res) => {
    const sql = `
        SELECT s.*, tm.Match_Status
        FROM Team_Matching tm
        JOIN Student s ON tm.StudentID = s.StudentID
        WHERE tm.ProjectID = ?
    `;
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 發送邀請 (INSERT)
app.post("/api/matching/invite", (req, res) => {
    const { projectId, studentId } = req.body;
    const sql = "INSERT INTO Team_Matching (ProjectID, StudentID, Match_Status) VALUES (?, ?, 'Pending')";
    db.query(sql, [projectId, studentId], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: "Student is already in this project or invited." });
            }
            return res.status(500).json({ error: "Invite failed" });
        }
        res.json({ message: "Invited successfully" });
    });
});

// 更新狀態 (Approve/Reject)
app.put("/api/matching", (req, res) => {
    const { status, projectId, studentId } = req.body;
    // 如果 Reject，建議直接刪除該筆紀錄以維持資料庫整潔，或者 UPDATE 為 Rejected
    if (status === 'Rejected') {
        const delSql = "DELETE FROM Team_Matching WHERE ProjectID = ? AND StudentID = ?";
        db.query(delSql, [projectId, studentId], (err) => {
            if (err) return res.status(500).json({ error: "Failed to reject invite" });
            res.json({ message: "Invite rejected and removed." });
        });
    } else {
        const sql = "UPDATE Team_Matching SET Match_Status = ? WHERE ProjectID = ? AND StudentID = ?";
        db.query(sql, [status, projectId, studentId], (err) => {
            if (err) return res.status(500).json({ error: "Update failed" });
            res.json({ message: "Matching status updated." });
        });
    }
});

// 離開專案 / 踢出成員 (DELETE)
app.delete("/api/projects/leave", (req, res) => {
    const { projectId, studentId } = req.body;
    const sql = "DELETE FROM Team_Matching WHERE ProjectID = ? AND StudentID = ?";
    db.query(sql, [projectId, studentId], (err, result) => {
        if (err) return res.status(500).json({ error: "Delete failed" });
        res.json({ message: "Project left successfully." });
    });
});

// ==========================================
// ADMIN & PROFESSOR DIRECT MATCHING API
// ==========================================

// POST: 管理員或教授直接將學生加入特定專案 (直接設為 Matched 官方成員)
app.post("/api/admin/projects/add-member", (req, res) => {
    const { projectId, studentId } = req.body;
    
    // 1. 先檢查該學生是否已經在該專案的配對池中
    const checkSql = "SELECT * FROM Team_Matching WHERE ProjectID = ? AND StudentID = ?";
    db.query(checkSql, [projectId, studentId], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error checking membership" });
        
        if (results.length > 0) {
            // 2. 如果原本處於 Pending 或其他狀態，直接強制升級更新為 'Matched'
            const updateSql = "UPDATE Team_Matching SET Match_Status = 'Matched' WHERE ProjectID = ? AND StudentID = ?";
            db.query(updateSql, [projectId, studentId], (err2) => {
                if (err2) return res.status(500).json({ error: "Failed to upgrade candidate status." });
                return res.json({ message: "Student status updated to Matched successfully." });
            });
        } else {
            // 3. 如果原本完全不在專案內，直接插入一筆狀態為 'Matched' 的正式紀錄
            const insertSql = "INSERT INTO Team_Matching (ProjectID, StudentID, Match_Status) VALUES (?, ?, 'Matched')";
            db.query(insertSql, [projectId, studentId], (err2) => {
                if (err2) return res.status(500).json({ error: "Failed to direct-insert team member." });
                res.json({ message: "Student added directly to project as official member." });
            });
        }
    });
});

app.listen(3000, () => console.log('Server is running on http://localhost:3000'));