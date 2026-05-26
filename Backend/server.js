const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json()); 

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',      
    database: 'mbti_system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// READ API: Get student list
app.get("/api/students", (req, res) => {
    const sql = "SELECT * FROM Student ORDER BY DeptID ASC, StudentID ASC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results); 
    });
});

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
        res.json({ message: "Student record created successfully!" });
    });
});

// PUT: Update Student Profile & Privacy
app.put("/api/students/:id", (req, res) => {
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
// GROUP & MATCHING APIs (Updated with Group Logic)
// ==========================================

// Get all projects and their requirements (Fixed CourseID missing bug)
app.get("/api/projects", (req, res) => {
    // Removed p.CourseID because it doesn't exist in the Project table schema
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

// Get all groups and members under a specific project
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
        
        // Transform flat database structure into nested group structure
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

// Create a new group and join it
app.post("/api/projects/:id/groups", (req, res) => {
    const projectId = req.params.id;
    const { groupName, studentId } = req.body;

    const createGroup = () => {
        const groupSql = "INSERT INTO Project_Group (ProjectID, GroupName) VALUES (?, ?)";
        db.query(groupSql, [projectId, groupName || "Unnamed Group"], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            const newGroupId = result.insertId;

            if (studentId) {
                // Pair the creator directly into this group as a Matched official member
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
        // Ensure this student is not currently in any group for this project
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

// Get all matched members of a specific project (compatible with the original API function)
app.get("/api/projects/:id/members", (req, res) => {
    const sql = `
        SELECT s.*, tm.Match_Status, pg.GroupName, pg.GroupID
        FROM Team_Matching tm
        JOIN Student s ON tm.StudentID = s.StudentID
        LEFT JOIN Project_Group pg ON tm.GroupID = pg.GroupID
        WHERE tm.ProjectID = ?
    `;
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Send invitation / apply to join a specific group (Pending)
app.post("/api/matching/invite", (req, res) => {
    const { projectId, studentId, groupId } = req.body;
    if (!groupId) {
        return res.status(400).json({ error: "GroupID is required to join/invite to a group." });
    }

    // Check if the student is already participating in this project
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
    });
});

// Update status (Approve/Reject)
app.put("/api/matching", (req, res) => {
    const { status, projectId, studentId } = req.body;
    
    // Query project and group name first to build descriptive notification message
    const infoSql = `
        SELECT p.Title as ProjectName, pg.GroupName
        FROM Team_Matching tm
        JOIN Project p ON tm.ProjectID = p.ProjectID
        JOIN Project_Group pg ON tm.GroupID = pg.GroupID
        WHERE tm.ProjectID = ? AND tm.StudentID = ?
    `;
    db.query(infoSql, [projectId, studentId], (infoErr, infoResults) => {
        let projectName = "Project";
        let groupName = "Group";
        if (!infoErr && infoResults.length > 0) {
            projectName = infoResults[0].ProjectName;
            groupName = infoResults[0].GroupName;
        }

        if (status === 'Rejected') {
            const delSql = "DELETE FROM Team_Matching WHERE ProjectID = ? AND StudentID = ?";
            db.query(delSql, [projectId, studentId], (err) => {
                if (err) return res.status(500).json({ error: "Failed to reject invite" });
                
                // Write decline notification record
                const msg = `Your application to join group "${groupName}" for project "${projectName}" was declined.`;
                db.query("INSERT INTO Notification (StudentID, Message) VALUES (?, ?)", [studentId, msg]);
                
                res.json({ message: "Invite rejected and removed." });
            });
        } else {
            const sql = "UPDATE Team_Matching SET Match_Status = ? WHERE ProjectID = ? AND StudentID = ?";
            db.query(sql, [status, projectId, studentId], (err) => {
                if (err) return res.status(500).json({ error: "Update failed" });
                
                // Write approval (Matched) or invitation (Invited) notification record
                let msg = "";
                if (status === 'Matched') {
                    msg = `Congratulations! Your request to join group "${groupName}" for project "${projectName}" has been APPROVED!`;
                } else if (status === 'Invited') {
                    msg = `You have been invited to join group "${groupName}" for project "${projectName}".`;
                }
                if (msg) {
                    db.query("INSERT INTO Notification (StudentID, Message) VALUES (?, ?)", [studentId, msg]);
                }
                
                res.json({ message: "Matching status updated." });
            });
        }
    });
});

// Leave project / Kick member (DELETE) + Auto clean empty groups
app.delete("/api/projects/leave", (req, res) => {
    const { projectId, studentId } = req.body;
    
    // Query project name, group name and Match_Status first to check if they were kicked (formerly Matched)
    const infoSql = `
        SELECT p.Title as ProjectName, pg.GroupName, tm.Match_Status
        FROM Team_Matching tm
        JOIN Project p ON tm.ProjectID = p.ProjectID
        JOIN Project_Group pg ON tm.GroupID = pg.GroupID
        WHERE tm.ProjectID = ? AND tm.StudentID = ?
    `;
    db.query(infoSql, [projectId, studentId], (infoErr, infoResults) => {
        let projectName = "Project";
        let groupName = "Group";
        let matchStatus = "Pending";
        if (!infoErr && infoResults.length > 0) {
            projectName = infoResults[0].ProjectName;
            groupName = infoResults[0].GroupName;
            matchStatus = infoResults[0].Match_Status;
        }

        const sql = "DELETE FROM Team_Matching WHERE ProjectID = ? AND StudentID = ?";
        db.query(sql, [projectId, studentId], (err, result) => {
            if (err) return res.status(500).json({ error: "Delete failed" });
            
            // Write notification if student was kicked by the leader (formerly in Matched status)
            if (matchStatus === 'Matched') {
                const msg = `You have been removed from group "${groupName}" for project "${projectName}".`;
                db.query("INSERT INTO Notification (StudentID, Message) VALUES (?, ?)", [studentId, msg]);
            }
            
            // After deletion, if there is an empty group left, delete it to keep database clean
            const cleanSql = `
                DELETE FROM Project_Group 
                WHERE ProjectID = ? 
                AND GroupID NOT IN (SELECT DISTINCT GroupID FROM Team_Matching WHERE ProjectID = ? AND GroupID IS NOT NULL)
            `;
            db.query(cleanSql, [projectId, projectId], (err2) => {
                res.json({ message: "Project left and empty group cleaned up successfully." });
            });
        });
    });
});

// ==========================================
// ADMIN & PROFESSOR DIRECT MATCHING API (Force to Group)
// ==========================================

// POST: Admin or Professor directly adds a student to a specific group (sets directly to Matched official member)
app.post("/api/admin/projects/add-member", (req, res) => {
    const { projectId, studentId, groupId } = req.body;
    if (!groupId) {
        return res.status(400).json({ error: "GroupID is required to assign student to a specific group." });
    }
    
    // Check if the student was originally in the matching pool
    const checkSql = "SELECT * FROM Team_Matching WHERE ProjectID = ? AND StudentID = ?";
    db.query(checkSql, [projectId, studentId], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error checking membership" });
        
        if (results.length > 0) {
            // If originally present in another group/status, directly force upgrade and update to 'Matched' for that Group
            const updateSql = "UPDATE Team_Matching SET GroupID = ?, Match_Status = 'Matched' WHERE ProjectID = ? AND StudentID = ?";
            db.query(updateSql, [groupId, projectId, studentId], (err2) => {
                if (err2) return res.status(500).json({ error: "Failed to update candidate group status." });
                return res.json({ message: "Student assigned and matched to the group successfully." });
            });
        } else {
            // Directly insert official member record
            const insertSql = "INSERT INTO Team_Matching (ProjectID, StudentID, GroupID, Match_Status) VALUES (?, ?, ?, 'Matched')";
            db.query(insertSql, [projectId, studentId, groupId], (err2) => {
                if (err2) return res.status(500).json({ error: "Failed to direct-insert team member." });
                res.json({ message: "Student added directly to group as official member." });
            });
        }
    });
});

// ==========================================
// NOTIFICATIONS API FOR REAL-TIME MATCHING
// ==========================================

// GET: Get real-time notifications for a student (invitation info, pending requests received as a leader, and system notifications like approved/declined/kicked)
app.get("/api/students/:id/notifications", (req, res) => {
    const studentId = req.params.id.toUpperCase();
    
    // 1. Query invitation info for the student (Match_Status = 'Invited')
    const inviteSql = `
        SELECT tm.ProjectID, tm.GroupID, pg.GroupName, p.Title as ProjectName
        FROM Team_Matching tm
        JOIN Project_Group pg ON tm.GroupID = pg.GroupID
        JOIN Project p ON tm.ProjectID = p.ProjectID
        WHERE tm.StudentID = ? AND tm.Match_Status = 'Invited'
    `;
    
    db.query(inviteSql, [studentId], (err, invites) => {
        if (err) return res.status(500).json({ error: err.message });
        
        // 2. Query unread system notifications for the student (Notification table)
        const sysSql = "SELECT NotificationID, Message, Created_At FROM Notification WHERE StudentID = ? AND Is_Read = 0 ORDER BY Created_At DESC";
        db.query(sysSql, [studentId], (sysErr, systemNotifications) => {
            if (sysErr) return res.status(500).json({ error: sysErr.message });
            
            // 3. Query all groups where the student is a Matched member, filter those where the student is the leader, and find Pending requests for those groups
            const groupsSql = `
                SELECT tm.GroupID, pg.GroupName, p.Title as ProjectName, tm.ProjectID
                FROM Team_Matching tm
                JOIN Project_Group pg ON tm.GroupID = pg.GroupID
                JOIN Project p ON tm.ProjectID = p.ProjectID
                WHERE tm.StudentID = ? AND tm.Match_Status = 'Matched'
            `;
            
            db.query(groupsSql, [studentId], (err2, myGroups) => {
                if (err2) return res.status(500).json({ error: err2.message });
                
                if (myGroups.length === 0) {
                    return res.json({ invitations: invites, requests: [], systemNotifications });
                }
                
                const groupIds = myGroups.map(g => g.GroupID);
                
                // Query all Matched members in these groups (sorted by student ID, the first one is the leader)
                const membersSql = `
                    SELECT GroupID, StudentID 
                    FROM Team_Matching 
                    WHERE GroupID IN (?) AND Match_Status = 'Matched'
                    ORDER BY GroupID ASC, StudentID ASC
                `;
                
                db.query(membersSql, [groupIds], (err3, allMatched) => {
                    if (err3) return res.status(500).json({ error: err3.message });
                    
                    // Find the list of GroupIDs where the student is the leader
                    const leaderGroupIds = [];
                    const groupsMap = {};
                    allMatched.forEach(row => {
                        if (!groupsMap[row.GroupID]) {
                            groupsMap[row.GroupID] = [];
                        }
                        groupsMap[row.GroupID].push(row.StudentID.toUpperCase());
                    });
                    
                    myGroups.forEach(g => {
                        const members = groupsMap[g.GroupID] || [];
                        if (members.length > 0 && members[0] === studentId) {
                            leaderGroupIds.push(g.GroupID);
                        }
                    });
                    
                    if (leaderGroupIds.length === 0) {
                        return res.json({ invitations: invites, requests: [], systemNotifications });
                    }
                    
                    // Query all "Pending" join requests in the groups belonging to these leaders
                    const pendingSql = `
                        SELECT tm.ProjectID, tm.StudentID, s.Name, tm.GroupID, pg.GroupName, p.Title as ProjectName
                        FROM Team_Matching tm
                        JOIN Student s ON tm.StudentID = s.StudentID
                        JOIN Project_Group pg ON tm.GroupID = pg.GroupID
                        JOIN Project p ON tm.ProjectID = p.ProjectID
                        WHERE tm.GroupID IN (?) AND tm.Match_Status = 'Pending'
                    `;
                    
                    db.query(pendingSql, [leaderGroupIds], (err4, requests) => {
                        if (err4) return res.status(500).json({ error: err4.message });
                        res.json({ invitations: invites, requests, systemNotifications });
                    });
                });
            });
        });
    });
});

// POST: Mark all unread notifications for a specific student as read (Is_Read = 1)
app.post("/api/students/:id/notifications/read", (req, res) => {
    const studentId = req.params.id.toUpperCase();
    const sql = "UPDATE Notification SET Is_Read = 1 WHERE StudentID = ?";
    db.query(sql, [studentId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "All system notifications marked as read." });
    });
});

app.listen(3000, () => console.log('Server is running on http://localhost:3000'));