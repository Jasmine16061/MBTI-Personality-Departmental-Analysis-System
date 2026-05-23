import React, { useState, useEffect } from 'react';
import { Users, BarChart3, Network, UserPlus, CheckCircle2, XCircle, Trash2, Mail, Hash, BookOpen } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3000/api';

// Data Dictionary: Departments
const DEPARTMENTS = {
  1: 'Computer Science',
  2: 'Information Technology',
  3: 'Cybersecurity',
  4: 'Software Engineering'
};

// Data Dictionary: MBTI Types
const MBTI_TYPES = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
];

export default function App() {
  const [activeTab, setActiveTab] = useState('profile');
  const [notification, setNotification] = useState(null);

  // Shared notification function
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#99000F] selection:text-white">
      {/* Top Navigation */}
      <nav className="bg-[#99000F] text-white border-b-4 border-[#99000F]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-3">
              <Network className="w-8 h-8 text-white" />
              <span className="font-bold text-xl tracking-wider uppercase">
                MBTI Analysis System
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Left Sidebar Menu */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white border-2 border-[#99000F] overflow-hidden">
            <div className="p-4 bg-[#99000F] text-white font-bold tracking-widest uppercase border-b-2 border-[#99000F]">
              System Menu
            </div>
            <ul className="flex flex-col">
              <li>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center px-6 py-4 text-left transition-all border-b border-[#99000F] ${
                    activeTab === 'profile' 
                      ? 'text-[#99000F] font-bold border-l-8 border-l-[#99000F] bg-gray-50' 
                      : 'text-black hover:underline hover:font-bold active:text-[#99000F]'
                  }`}
                >
                  <Users className="w-5 h-5 mr-3" />
                  Student Profile
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('stats')}
                  className={`w-full flex items-center px-6 py-4 text-left transition-all border-b border-[#99000F] ${
                    activeTab === 'stats' 
                      ? 'text-[#99000F] font-bold border-l-8 border-l-[#99000F] bg-gray-50' 
                      : 'text-black hover:underline hover:font-bold active:text-[#99000F]'
                  }`}
                >
                  <BarChart3 className="w-5 h-5 mr-3" />
                  MBTI Statistics
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('matching')}
                  className={`w-full flex items-center px-6 py-4 text-left transition-all ${
                    activeTab === 'matching' 
                      ? 'text-[#99000F] font-bold border-l-8 border-l-[#99000F] bg-gray-50' 
                      : 'text-black hover:underline hover:font-bold active:text-[#99000F]'
                  }`}
                >
                  <UserPlus className="w-5 h-5 mr-3" />
                  Team Matching
                </button>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1">
          {/* Toast Notification */}
          {notification && (
            <div className={`mb-6 p-4 border-2 flex items-center font-bold ${
              notification.type === 'error' 
                ? 'bg-[#99000F]/10 text-[#99000F] border-[#99000F]' 
                : 'bg-white text-black border-[#99000F]'
            }`}>
              {notification.type === 'error' ? <XCircle className="w-5 h-5 mr-2" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
              {notification.message}
            </div>
          )}

          {activeTab === 'profile' && <ProfileManagement showNotification={showNotification} />}
          {activeTab === 'stats' && <StatsDashboard showNotification={showNotification} />}
          {activeTab === 'matching' && <TeamMatching showNotification={showNotification} />}
        </main>
      </div>
    </div>
  );
}

/* =========================================================
   Component 1: Profile Management
   ========================================================= */
function ProfileManagement({ showNotification }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    StudentID: '',
    Name: '',
    DeptID: '1',
    MBTI_Code: 'INTJ',
    Email: ''
  });

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/students`);
      if (!res.ok) throw new Error('Failed to fetch student data');
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to add student');
      
      showNotification(result.message || 'Student added successfully!');
      setFormData({ StudentID: '', Name: '', DeptID: '1', MBTI_Code: 'INTJ', Email: '' });
      fetchStudents(); 
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Add Student Form */}
      <div className="bg-white p-6 border-2 border-[#99000F]">
        <h2 className="text-xl font-bold text-black mb-6 flex items-center uppercase border-b-2 border-[#99000F] pb-2 inline-flex">
          <UserPlus className="w-6 h-6 mr-2 text-[#99000F]" />
          Add New Student
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-black mb-1">Student ID</label>
            <input type="text" name="StudentID" value={formData.StudentID} onChange={handleChange} required
              className="w-full px-4 py-2 border-2 border-[#99000F] focus:outline-none focus:border-[#99000F] transition-colors" placeholder="e.g. D1102031" />
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-1">Name</label>
            <input type="text" name="Name" value={formData.Name} onChange={handleChange} required
              className="w-full px-4 py-2 border-2 border-[#99000F] focus:outline-none focus:border-[#99000F] transition-colors" placeholder="Full Name" />
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-1">Department</label>
            <select name="DeptID" value={formData.DeptID} onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-[#99000F] focus:outline-none focus:border-[#99000F] transition-colors bg-white">
              {Object.entries(DEPARTMENTS).map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-1">MBTI Type</label>
            <select name="MBTI_Code" value={formData.MBTI_Code} onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-[#99000F] focus:outline-none focus:border-[#99000F] transition-colors bg-white">
              {MBTI_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-black mb-1">Email</label>
            <input type="email" name="Email" value={formData.Email} onChange={handleChange} required
              className="w-full px-4 py-2 border-2 border-[#99000F] focus:outline-none focus:border-[#99000F] transition-colors" placeholder="student@example.com" />
          </div>
          <div className="md:col-span-2 flex justify-end mt-4">
            <button type="submit" className="bg-[#99000F] text-white font-bold py-3 px-8 border-2 border-[#99000F] hover:bg-black active:bg-white active:text-[#99000F] active:border-[#99000F] active:scale-95 transition-all flex items-center uppercase tracking-wider">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Save Record
            </button>
          </div>
        </form>
      </div>

      {/* Student List */}
      <div className="bg-white p-6 border-2 border-[#99000F]">
        <h2 className="text-xl font-bold text-black mb-6 flex items-center uppercase border-b-2 border-[#99000F] pb-2 inline-flex">
          <BookOpen className="w-6 h-6 mr-2 text-[#99000F]" />
          Student Roster
        </h2>
        
        {loading ? (
          <div className="text-center py-8 font-bold text-black uppercase">Loading Data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border-2 border-[#99000F]">
              <thead>
                <tr className="bg-[#99000F] text-white uppercase text-sm tracking-wider">
                  <th className="py-3 px-4 border border-[#99000F]">ID</th>
                  <th className="py-3 px-4 border border-[#99000F]">Name</th>
                  <th className="py-3 px-4 border border-[#99000F]">Department</th>
                  <th className="py-3 px-4 border border-[#99000F]">MBTI</th>
                  <th className="py-3 px-4 border border-[#99000F]">Email</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr><td colSpan="5" className="py-8 text-center font-bold border border-[#99000F]">No Data Available</td></tr>
                ) : (
                  students.map((student, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-bold border border-[#99000F]">{student.StudentID}</td>
                      <td className="py-3 px-4 border border-[#99000F]">{student.Name}</td>
                      <td className="py-3 px-4 border border-[#99000F]">{DEPARTMENTS[student.DeptID] || student.DeptID}</td>
                      <td className="py-3 px-4 border border-[#99000F]">
                        <span className="inline-flex items-center px-3 py-1 text-xs font-bold bg-white text-[#99000F] border-2 border-[#99000F]">
                          {student.MBTI_Code}
                        </span>
                      </td>
                      <td className="py-3 px-4 border border-[#99000F]">{student.Email}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   Component 2: Stats Dashboard
   ========================================================= */
function StatsDashboard({ showNotification }) {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/stats/mbti`);
        if (!res.ok) throw new Error('Failed to fetch statistics');
        const data = await res.json();
        const formattedData = data.map(item => ({
          ...item,
          Total: parseInt(item.Total, 10)
        })).sort((a, b) => b.Total - a.Total); 
        
        setStats(formattedData);
      } catch (err) {
        showNotification(err.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const maxTotal = stats.length > 0 ? Math.max(...stats.map(s => s.Total)) : 1;

  return (
    <div className="bg-white p-6 border-2 border-[#99000F] min-h-[500px]">
      <h2 className="text-xl font-bold text-black mb-8 flex items-center uppercase border-b-2 border-[#99000F] pb-2 inline-flex">
        <BarChart3 className="w-6 h-6 mr-2 text-[#99000F]" />
        MBTI Population Distribution
      </h2>

      {loading ? (
        <div className="text-center py-12 font-bold text-black uppercase">Calculating...</div>
      ) : stats.length === 0 ? (
        <div className="text-center py-12 font-bold text-black">Not enough data to generate chart</div>
      ) : (
        <div className="space-y-5 max-w-3xl mx-auto mt-8">
          {stats.map((stat) => (
            <div key={stat.MBTI_Code} className="flex items-center group">
              <div className="w-16 font-bold text-black text-right mr-4 group-hover:underline">{stat.MBTI_Code}</div>
              <div className="flex-1 bg-white border-2 border-[#99000F] h-8 flex items-center relative">
                <div 
                  className="bg-[#99000F] h-full transition-all duration-1000 ease-out border-r-2 border-[#99000F]"
                  style={{ width: `${(stat.Total / maxTotal) * 100}%` }}
                ></div>
              </div>
              <div className="w-20 text-left ml-4 font-bold text-black">{stat.Total} User(s)</div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-16 p-4 bg-white border-2 border-[#99000F] text-sm text-black font-bold flex items-start">
        <span className="text-xl mr-3 text-[#99000F]">INFO</span>
        <p className="pt-1">This chart displays the real-time distribution of MBTI types from the database. Add new records in the Profile Management tab to see updates.</p>
      </div>
    </div>
  );
}

/* =========================================================
   Component 3: Team Matching
   ========================================================= */
function TeamMatching({ showNotification }) {
  const [matchData, setMatchData] = useState({
    projectId: '',
    studentId: '',
    status: 'Accepted'
  });

  const handleChange = (e) => {
    setMatchData({ ...matchData, [e.target.name]: e.target.value });
  };

  // PUT - Update Status
  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!matchData.projectId || !matchData.studentId) return showNotification('Project ID and Student ID are required', 'error');
    
    try {
      const res = await fetch(`${API_BASE_URL}/matching`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          projectId: matchData.projectId, 
          studentId: matchData.studentId, 
          status: matchData.status 
        })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Update failed');
      showNotification(result.message || 'Matching status updated successfully!');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // DELETE - Leave/Remove Project
  const handleLeaveProject = async () => {
    if (!matchData.projectId || !matchData.studentId) return showNotification('Project ID and Student ID are required', 'error');
    
    if(!window.confirm('Are you sure you want to remove this student from the project?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/projects/leave`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: matchData.projectId, studentId: matchData.studentId })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Removal failed');
      showNotification(result.message || 'Removed from project successfully!');
      setMatchData({ ...matchData, projectId: '', studentId: '' }); 
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  return (
    <div className="bg-white p-6 border-2 border-[#99000F]">
      <h2 className="text-xl font-bold text-black mb-8 flex items-center uppercase border-b-2 border-[#99000F] pb-2 inline-flex">
        <Network className="w-6 h-6 mr-2 text-[#99000F]" />
        Team Matching Control Panel
      </h2>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Form Section */}
        <div className="bg-white p-6 border-2 border-[#99000F]">
          <h3 className="text-lg font-bold text-black mb-6 uppercase border-b border-[#99000F] pb-2">Status Control</h3>
          <form onSubmit={handleUpdateStatus} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-black mb-2 flex items-center">
                <Hash className="w-4 h-4 mr-2"/> Project ID
              </label>
              <input type="number" name="projectId" value={matchData.projectId} onChange={handleChange} required
                className="w-full px-4 py-2 border-2 border-[#99000F] focus:outline-none focus:border-[#99000F] transition-colors" placeholder="e.g. 1" />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-2 flex items-center">
                <Users className="w-4 h-4 mr-2"/> Student ID
              </label>
              <input type="text" name="studentId" value={matchData.studentId} onChange={handleChange} required
                className="w-full px-4 py-2 border-2 border-[#99000F] focus:outline-none focus:border-[#99000F] transition-colors" placeholder="e.g. D1102031" />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-2">Update Status To</label>
              <select name="status" value={matchData.status} onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-[#99000F] focus:outline-none focus:border-[#99000F] transition-colors bg-white">
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            
            <div className="pt-6 flex flex-col sm:flex-row gap-4">
              <button type="submit" className="flex-1 bg-[#99000F] text-white font-bold py-3 px-4 border-2 border-[#99000F] hover:bg-black hover:border-[#99000F] active:bg-white active:text-[#99000F] active:border-[#99000F] active:scale-95 transition-all flex justify-center items-center uppercase">
                <CheckCircle2 className="w-5 h-5 mr-2" /> Update Status
              </button>
              <button type="button" onClick={handleLeaveProject} className="flex-1 bg-white text-[#99000F] font-bold py-3 px-4 border-2 border-[#99000F] hover:bg-[#99000F] hover:text-white active:bg-white active:text-[#99000F] active:border-[#99000F] active:scale-95 transition-all flex justify-center items-center uppercase">
                <Trash2 className="w-5 h-5 mr-2" /> Remove Member
              </button>
            </div>
          </form>
        </div>

        {/* Documentation Section */}
        <div>
          <h3 className="text-lg font-bold text-black mb-6 uppercase border-b border-[#99000F] pb-2">Operations Guide</h3>
          <ul className="space-y-6 text-black text-sm">
            <li className="flex items-start">
              <div className="bg-[#99000F] text-white p-1 mt-0.5 mr-4 shrink-0 border border-[#99000F]"><CheckCircle2 className="w-4 h-4" /></div>
              <div>
                <p className="font-bold mb-1 uppercase">Update Status</p>
                <p>Triggers <code className="bg-[#99000F] text-white px-2 py-0.5 font-mono">PUT /api/matching</code>. Used by project creators or professors to review and approve/reject team joining requests.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-[#99000F] text-white p-1 mt-0.5 mr-4 shrink-0 border border-[#99000F]"><Trash2 className="w-4 h-4" /></div>
              <div>
                <p className="font-bold mb-1 uppercase text-[#99000F]">Remove Member</p>
                <p>Triggers <code className="bg-[#99000F] text-white px-2 py-0.5 font-mono">DELETE /api/projects/leave</code>. Used when a student leaves a team or is removed by an admin. This hard-deletes the association.</p>
              </div>
            </li>
            <li className="flex items-start mt-8 p-4 bg-white border-2 border-[#99000F] font-bold">
              <p>Note: Before executing the above operations, ensure the target <span className="text-[#99000F]">ProjectID</span> and <span className="text-[#99000F]">StudentID</span> correlation exists in the <code className="bg-[#99000F] text-white px-1">Team_Matching</code> table.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}