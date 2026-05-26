const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json()); 

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
<<<<<<< HEAD
    password: '0719',      
=======
    password: '',      
>>>>>>> ff60376c5f0ad789f1ba38aade68e51ebc0319fd
    database: 'mbti_system'
});

// READ API: Get student list
app.get("/api/students", (req, res) => {
<<<<<<< HEAD
    const sql = "SELECT * FROM Student ORDER BY DeptID ASC, StudentID ASC";
=======
    const sql = "SELECT * FROM Student";
>>>>>>> ff60376c5f0ad789f1ba38aade68e51ebc0319fd
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results); 
    });
});

<<<<<<< HEAD
// NEW LOGIN API (Authentication Workflow)
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;

    // 1. Hardcoded authentication for administrative and academic roles
    if (username.toLowerCase() === 'admin' && password === 'admin123') { 
        return res.json({ success: true, role: 'admin', id: 'admin', name: 'Administrator' });
    }
    if (username.toLowerCase() === 'professor' && password === 'prof123') { 
        return res.json({ success: true, role: 'professor', id: 'professor', name: 'Professor' });
    }

    // 2. Database validation for standard student accounts
    // Note: Please ensure your "Student" table contains a matching "password" column
    const sql = "SELECT * FROM Student WHERE StudentID = ? AND password = ?";
    
    db.query(sql, [username.toUpperCase(), password], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (results.length > 0) {
            // Credentials matched successfully, return user profile
            const student = results[0];
            res.json({ 
                success: true, 
                role: 'student', 
                id: student.StudentID, 
                name: student.Name 
            });
        } else {
            // Authentication failed due to missing account or mismatched password
            res.status(401).json({ success: false, message: "Invalid Student ID or Password." });
        }
    });
});

// INSERT: Create Student Profile
app.post("/api/students", (req, res) => {
    const { StudentID, Name, DeptID, MBTI_Code, Email, isSearchable, password } = req.body;    
    const isSearchableVal = isSearchable !== undefined ? isSearchable : 1; 
    const userPassword = password || 'password123';
    
    const sql = "INSERT INTO Student (StudentID, Name, DeptID, MBTI_Code, Email, Is_Searchable, password) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [StudentID, Name, DeptID, MBTI_Code, Email, isSearchableVal, userPassword], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
=======
// INSERT: Create Student Profile
app.post("/api/students", (req, res) => {
    const { StudentID, Name, DeptID, MBTI_Code, Email, isSearchable } = req.body;
    const isSearchableVal = isSearchable !== undefined ? isSearchable : 1; 
    
    const sql = "INSERT INTO Student (StudentID, Name, DeptID, MBTI_Code, Email, Is_Searchable) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [StudentID, Name, DeptID, MBTI_Code, Email, isSearchableVal], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
>>>>>>> ff60376c5f0ad789f1ba38aade68e51ebc0319fd
        res.json({ message: "Student record created successfully!" });
    });
});

// PUT: Update Student Profile & Privacy
app.put("/api/students/:id", (req, res) => {
<<<<<<< HEAD
    const { Name, DeptID, MBTI_Code, Email, isSearchable, password } = req.body;
    let sql, params;
    if (password) {
        sql = "UPDATE Student SET Name=?, DeptID=?, MBTI_Code=?, Email=?, Is_Searchable=?, password=? WHERE StudentID=?";
        params = [Name, DeptID, MBTI_Code, Email, isSearchable, password, req.params.id];
    } else {
        sql = "UPDATE Student SET Name=?, DeptID=?, MBTI_Code=?, Email=?, Is_Searchable=? WHERE StudentID=?";
        params = [Name, DeptID, MBTI_Code, Email, isSearchable, req.params.id];
    }

    db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to update profile" });
=======
    const { Name, DeptID, MBTI_Code, Email, isSearchable } = req.body;
    const sql = "UPDATE Student SET Name=?, DeptID=?, MBTI_Code=?, Email=?, Is_Searchable=? WHERE StudentID=?";
    db.query(sql, [Name, DeptID, MBTI_Code, Email, isSearchable, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to update profile" });
>>>>>>> ff60376c5f0ad789f1ba38aade68e51ebc0319fd
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
<<<<<<< HEAD
// GROUP & MATCHING APIs (Updated with Group Logic)
=======
// NEW MATCHING APIs (Fixed for Issues 5 & 6)
>>>>>>> ff60376c5f0ad789f1ba38aade68e51ebc0319fd
// ==========================================

// 取得所有專案以及其需求
app.get("/api/projects", (req, res) => {
    const sql = `
<<<<<<< HEAD
        SELECT p.ProjectID, p.Title as ProjectName, p.Description, p.Status, p.CourseID,
=======
        SELECT p.ProjectID, p.Title as ProjectName, p.Description, p.Status,
>>>>>>> ff60376c5f0ad789f1ba38aade68e51ebc0319fd
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

<<<<<<< HEAD
// 取得特定專案底下的所有群組與組員
app.get("/api/projects/:id/groups", (req, res) => {
    const sql = `
        SELECT 
            pg.GroupID, 
            pg.GroupName, 
            tm.StudentID, 
            tm.Match_Status,
            s.Name, 
            s.DeptID, 
            s.MBTI_Code, 
            s.Email,
            s.Is_Searchable
        FROM Project_Group pg
        LEFT JOIN Team_Matching tm ON pg.GroupID = tm.GroupID
        LEFT JOIN Student s ON tm.StudentID = s.StudentID
        WHERE pg.ProjectID = ?
        ORDER BY pg.GroupID ASC
    `;
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        
        // 將資料庫扁平結構轉換為群組巢狀結構
        const groupsMap = {};
        results.forEach(row => {
            if (!groupsMap[row.GroupID]) {
                groupsMap[row.GroupID] = {
                    GroupID: row.GroupID,
                    GroupName: row.GroupName,
                    members: []
                };
            }
            if (row.StudentID) {
                groupsMap[row.GroupID].members.push({
                    StudentID: row.StudentID,
                    Name: row.Name,
                    DeptID: row.DeptID,
                    MBTI_Code: row.MBTI_Code,
                    Email: row.Email,
                    Is_Searchable: row.Is_Searchable,
                    Match_Status: row.Match_Status
                });
            }
        });
        res.json(Object.values(groupsMap));
    });
});

// 新增一個小組並加入
app.post("/api/projects/:id/groups", (req, res) => {
    const projectId = req.params.id;
    const { groupName, studentId } = req.body;

    const createGroup = () => {
        const groupSql = "INSERT INTO Project_Group (ProjectID, GroupName) VALUES (?, ?)";
        db.query(groupSql, [projectId, groupName || "Unnamed Group"], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            const newGroupId = result.insertId;

            if (studentId) {
                // 將該創立者直接配對進此小組 (Matched 官方成員)
                const matchSql = "INSERT INTO Team_Matching (ProjectID, StudentID, GroupID, Match_Status) VALUES (?, ?, ?, 'Matched')";
                db.query(matchSql, [projectId, studentId, newGroupId], (err2) => {
                    if (err2) return res.status(500).json({ error: err2.message });
                    res.json({ message: "Group created successfully and you joined as official member.", groupId: newGroupId });
                });
            } else {
                res.json({ message: "New group created successfully.", groupId: newGroupId });
            }
        });
    };

    if (studentId) {
        // 先確保此學生目前不在這個專案的任何一組
        const checkSql = "SELECT * FROM Team_Matching WHERE ProjectID = ? AND StudentID = ?";
        db.query(checkSql, [projectId, studentId], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length > 0) {
                return res.status(400).json({ error: "You are already matched or pending in another group for this project." });
            }
            createGroup();
        });
    } else {
        createGroup();
    }
});

// 取得特定專案的現有所有配對組員（相容原有 API 功能）
app.get("/api/projects/:id/members", (req, res) => {
    const sql = `
        SELECT s.*, tm.Match_Status, pg.GroupName, pg.GroupID
        FROM Team_Matching tm
        JOIN Student s ON tm.StudentID = s.StudentID
        LEFT JOIN Project_Group pg ON tm.GroupID = pg.GroupID
=======
// 取得特定專案的現有組員與狀態
app.get("/api/projects/:id/members", (req, res) => {
    const sql = `
        SELECT s.*, tm.Match_Status
        FROM Team_Matching tm
        JOIN Student s ON tm.StudentID = s.StudentID
>>>>>>> ff60376c5f0ad789f1ba38aade68e51ebc0319fd
        WHERE tm.ProjectID = ?
    `;
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

<<<<<<< HEAD
// 發送邀請 / 申請加入特定小組 (Pending)
app.post("/api/matching/invite", (req, res) => {
    const { projectId, studentId, groupId } = req.body;
    if (!groupId) {
        return res.status(400).json({ error: "GroupID is required to join/invite to a group." });
    }

    // 先檢查學生是否已參與該專案
    const checkSql = "SELECT * FROM Team_Matching WHERE ProjectID = ? AND StudentID = ?";
    db.query(checkSql, [projectId, studentId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) {
            return res.status(400).json({ error: "Student is already in a group or has a pending request in this project." });
        }

        const insertSql = "INSERT INTO Team_Matching (ProjectID, StudentID, GroupID, Match_Status) VALUES (?, ?, ?, 'Pending')";
        db.query(insertSql, [projectId, studentId, groupId], (err2) => {
            if (err2) return res.status(500).json({ error: "Invite failed" });
            res.json({ message: "Group request / Invite pending successfully." });
        });
=======
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
>>>>>>> ff60376c5f0ad789f1ba38aade68e51ebc0319fd
    });
});

// 更新狀態 (Approve/Reject)
app.put("/api/matching", (req, res) => {
    const { status, projectId, studentId } = req.body;
<<<<<<< HEAD
=======
    // 如果 Reject，建議直接刪除該筆紀錄以維持資料庫整潔，或者 UPDATE 為 Rejected
>>>>>>> ff60376c5f0ad789f1ba38aade68e51ebc0319fd
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

<<<<<<< HEAD
// 離開專案 / 踢出成員 (DELETE) ＋ 自動清理空群組
=======
// 離開專案 / 踢出成員 (DELETE)
>>>>>>> ff60376c5f0ad789f1ba38aade68e51ebc0319fd
app.delete("/api/projects/leave", (req, res) => {
    const { projectId, studentId } = req.body;
    const sql = "DELETE FROM Team_Matching WHERE ProjectID = ? AND StudentID = ?";
    db.query(sql, [projectId, studentId], (err, result) => {
        if (err) return res.status(500).json({ error: "Delete failed" });
<<<<<<< HEAD
        
        // 刪除後，若該 ProjectID 存在空組別（在 Team_Matching 中已無任何組員紀錄），將其徹底刪除以維持整潔
        const cleanSql = `
            DELETE FROM Project_Group 
            WHERE ProjectID = ? 
            AND GroupID NOT IN (SELECT DISTINCT GroupID FROM Team_Matching WHERE ProjectID = ? AND GroupID IS NOT NULL)
        `;
        db.query(cleanSql, [projectId, projectId], (err2) => {
            res.json({ message: "Project left and empty group cleaned up successfully." });
        });
=======
        res.json({ message: "Project left successfully." });
>>>>>>> ff60376c5f0ad789f1ba38aade68e51ebc0319fd
    });
});

// ==========================================
<<<<<<< HEAD
// ADMIN & PROFESSOR DIRECT MATCHING API (Force to Group)
// ==========================================

// POST: 管理員或教授直接將學生加入特定小組 (直接設為 Matched 官方成員)
app.post("/api/admin/projects/add-member", (req, res) => {
    const { projectId, studentId, groupId } = req.body;
    if (!groupId) {
        return res.status(400).json({ error: "GroupID is required to assign student to a specific group." });
    }
    
    // 檢查原本是否在配對池中
=======
// ADMIN & PROFESSOR DIRECT MATCHING API
// ==========================================

// POST: 管理員或教授直接將學生加入特定專案 (直接設為 Matched 官方成員)
app.post("/api/admin/projects/add-member", (req, res) => {
    const { projectId, studentId } = req.body;
    
    // 1. 先檢查該學生是否已經在該專案的配對池中
>>>>>>> ff60376c5f0ad789f1ba38aade68e51ebc0319fd
    const checkSql = "SELECT * FROM Team_Matching WHERE ProjectID = ? AND StudentID = ?";
    db.query(checkSql, [projectId, studentId], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error checking membership" });
        
        if (results.length > 0) {
<<<<<<< HEAD
            // 如果原本存在其他組別/狀態，直接強制升級更新為該 Group 的 'Matched'
            const updateSql = "UPDATE Team_Matching SET GroupID = ?, Match_Status = 'Matched' WHERE ProjectID = ? AND StudentID = ?";
            db.query(updateSql, [groupId, projectId, studentId], (err2) => {
                if (err2) return res.status(500).json({ error: "Failed to update candidate group status." });
                return res.json({ message: "Student assigned and matched to the group successfully." });
            });
        } else {
            // 直接插入正式組員紀錄
            const insertSql = "INSERT INTO Team_Matching (ProjectID, StudentID, GroupID, Match_Status) VALUES (?, ?, ?, 'Matched')";
            db.query(insertSql, [projectId, studentId, groupId], (err2) => {
                if (err2) return res.status(500).json({ error: "Failed to direct-insert team member." });
                res.json({ message: "Student added directly to group as official member." });
=======
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
>>>>>>> ff60376c5f0ad789f1ba38aade68e51ebc0319fd
            });
        }
    });
});

<<<<<<< HEAD
app.listen(4000, () => console.log('Server is running on http://localhost:4000'));
=======
app.listen(3000, () => console.log('Server is running on http://localhost:3000'));
>>>>>>> ff60376c5f0ad789f1ba38aade68e51ebc0319fd
