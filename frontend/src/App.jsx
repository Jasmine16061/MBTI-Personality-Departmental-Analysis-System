import React, { useState, useEffect } from 'react';
import { 
  Users, BarChart3, Network, UserPlus, CheckCircle2, 
  XCircle, Trash2, BookOpen, Edit3, X, Lock, HelpCircle,
  RefreshCw, Search, GraduationCap, Filter, Eye, EyeOff,
  UserCircle, LogOut, Settings, MessageSquare
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

const API_BASE_URL = 'http://localhost:3000/api';

const DEPARTMENTS = {
  1: 'Computer Science',
  2: 'Information Technology',
  3: 'Cybersecurity',
  4: 'Software Engineering'
};

const MBTI_TYPES = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
];

export default function App() {
  const [activeTab, setActiveTab] = useState('profile');
  const [notification, setNotification] = useState(null);
  
  const [userRole, setUserRole] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loginInput, setLoginInput] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleLogin = async (e) => {
  e.preventDefault();
  
  // Validate that both input fields are not empty
  if (loginInput.trim() === '' || loginPassword.trim() === '') {
      showNotification('Please enter both ID and Password.', 'error');
      return;
  }

  try {
    // Send a POST request to the backend authentication API
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: loginInput, password: loginPassword })
    });

    const data = await res.json();

    if (res.ok && data.success) {
      // Store session details into the React states
      setUserRole(data.role);
      setCurrentUserId(data.id);
      
      // Route the user to their designated initial tab based on their authorization level
      if (data.role === 'admin') setActiveTab('profile');
      else if (data.role === 'professor') setActiveTab('course_feedback');
      else setActiveTab('personal_profile');

      showNotification(`Logged in successfully as ${data.name}`);
      
      // Reset input fields upon successful authentication
      setLoginInput('');
      setLoginPassword(''); 
    } else {
      // Display the error message returned from the backend or a default string
      showNotification(data.message || 'Login failed. Please check your credentials.', 'error');
    }
  } catch (err) {
    // Catch block handles potential network dropouts or backend server downtime
    showNotification('Cannot connect to the backend server.', 'error');
  }
};

  const handleLogout = () => {
    setUserRole(null);
    setCurrentUserId(null);
    setActiveTab('profile');
    showNotification('Successfully logged out.');
  };

  const canSeePersonalProfile = userRole === 'student';
  const canSeeProfileManagement = userRole === 'admin' || userRole === 'student'; 
  const canSeeStats = userRole === 'admin' || userRole === 'student' || userRole === 'professor';
  const canSeeMatching = userRole === 'admin' || userRole === 'student';
  const canSeeAcademicGuidance = userRole === 'admin' || userRole === 'professor';
  const canSeeCourseFeedback = userRole === 'student' || userRole === 'professor' || userRole === 'admin';

  return (
    <div className="min-h-screen bg-slate-50 text-black font-sans selection:bg-[#99000F] selection:text-white pb-12">
      <nav className="bg-[#99000F] text-white border-b-4 border-black sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between h-auto md:h-16 items-center py-2 md:py-0">
            <div className="flex items-center space-x-3 mb-2 md:mb-0">
              <Network className="w-8 h-8 text-white animate-pulse" />
              <span className="font-bold text-xl tracking-wider uppercase">
                MBTI System
              </span>
            </div>
            
            <div className="flex items-center bg-black/20 p-2 border-2 border-white/20 w-full md:w-auto justify-end">
              {!userRole ? (
                <form onSubmit={handleLogin} className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
                  <UserCircle className="w-5 h-5 text-amber-200 shrink-0 hidden md:block" />
                  {/* Account credentials / Student Identifier Input */}                  
                  <input 
                      type="text" 
                      value={loginInput}
                      onChange={(e) => setLoginInput(e.target.value)}
                      placeholder="User ID / Student ID"
                      className="px-2 py-1 text-sm text-black font-semibold outline-none w-full md:w-40"
                    />
                  {/* Account password verification Input */}
                  <input 
                      type="password" 
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Password"
                      className="px-2 py-1 text-sm text-black font-semibold outline-none w-full md:w-40"
                    />
                  <button type="submit" className="bg-white text-[#99000F] px-3 py-1 text-xs font-bold uppercase hover:bg-amber-100 shrink-0 w-full md:w-auto border border-black md:border-none">
                      Login
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex items-center text-amber-200 text-sm font-bold">
                    <UserCircle className="w-5 h-5 mr-1" />
                    <span className="uppercase">
                        {userRole === 'admin' ? 'Administrator' : 
                         userRole === 'professor' ? 'Professor View' : 
                         `Student: ${currentUserId}`}
                    </span>
                  </div>
                  <button onClick={handleLogout} className="bg-black/40 hover:bg-black/60 text-white px-3 py-1 text-xs font-bold uppercase flex items-center border border-white/30 transition-colors">
                    <LogOut className="w-3.5 h-3.5 mr-1" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sticky top-24">
            <div className="p-4 bg-[#99000F] text-white font-bold tracking-widest uppercase border-b-2 border-black">
              Navigation Menu
            </div>
            
            {!userRole ? (
                <div className="p-6 text-sm text-center font-bold text-slate-500 bg-slate-50">
                    Please log in via the top navigation bar to access system features.
                </div>
            ) : (
                <ul className="flex flex-col">
                  {canSeePersonalProfile && (
                    <li>
                        <button onClick={() => setActiveTab('personal_profile')} className={`w-full flex items-center px-6 py-4 text-left transition-all border-b border-gray-200 ${activeTab === 'personal_profile' ? 'text-[#99000F] font-black border-l-8 border-l-[#99000F] bg-slate-50' : 'text-black hover:bg-slate-50 hover:underline hover:font-bold active:text-[#99000F]'}`}>
                        <Settings className="w-5 h-5 mr-3" /> Personal Profile
                        </button>
                    </li>
                  )}
                  {canSeeProfileManagement && (
                    <li>
                        <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center px-6 py-4 text-left transition-all border-b border-gray-200 ${activeTab === 'profile' ? 'text-[#99000F] font-black border-l-8 border-l-[#99000F] bg-slate-50' : 'text-black hover:bg-slate-50 hover:underline hover:font-bold active:text-[#99000F]'}`}>
                        <Users className="w-5 h-5 mr-3" /> Student Directory
                        </button>
                    </li>
                  )}
                  {canSeeStats && (
                  <li>
                    <button onClick={() => setActiveTab('stats')} className={`w-full flex items-center px-6 py-4 text-left transition-all border-b border-gray-200 ${activeTab === 'stats' ? 'text-[#99000F] font-black border-l-8 border-l-[#99000F] bg-slate-50' : 'text-black hover:bg-slate-50 hover:underline hover:font-bold active:text-[#99000F]'}`}>
                      <BarChart3 className="w-5 h-5 mr-3" /> MBTI Statistics
                    </button>
                  </li>
                  )}
                  {canSeeMatching && (
                  <li>
                    <button onClick={() => setActiveTab('matching')} className={`w-full flex items-center px-6 py-4 text-left transition-all border-b border-gray-200 ${activeTab === 'matching' ? 'text-[#99000F] font-black border-l-8 border-l-[#99000F] bg-slate-50' : 'text-black hover:bg-slate-50 hover:underline hover:font-bold active:text-[#99000F]'}`}>
                      <UserPlus className="w-5 h-5 mr-3" /> Team Matching
                    </button>
                  </li>
                  )}
                  {canSeeCourseFeedback && (
                  <li>
                    <button onClick={() => setActiveTab('course_feedback')} className={`w-full flex items-center px-6 py-4 text-left transition-all border-b border-gray-200 ${activeTab === 'course_feedback' ? 'text-[#99000F] font-black border-l-8 border-l-[#99000F] bg-slate-50' : 'text-black hover:bg-slate-50 hover:underline hover:font-bold active:text-[#99000F]'}`}>
                      <MessageSquare className="w-5 h-5 mr-3" /> Course Feedback
                    </button>
                  </li>
                  )}
                  {canSeeAcademicGuidance && (
                  <li>
                    <button onClick={() => setActiveTab('academic')} className={`w-full flex items-center px-6 py-4 text-left transition-all ${activeTab === 'academic' ? 'text-[#99000F] font-black border-l-8 border-l-[#99000F] bg-slate-50' : 'text-black hover:bg-slate-50 hover:underline hover:font-bold active:text-[#99000F]'}`}>
                      <GraduationCap className="w-5 h-5 mr-3" /> Academic Admin
                    </button>
                  </li>
                  )}
                </ul>
            )}
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          {notification && (
            <div className={`mb-6 p-4 border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between font-bold animate-bounce ${
              notification.type === 'error' ? 'bg-[#99000F]/10 text-[#99000F] border-[#99000F]' : 'bg-emerald-50 text-emerald-800 border-emerald-600'
            }`}>
              <div className="flex items-center">
                {notification.type === 'error' ? <XCircle className="w-6 h-6 mr-3 text-[#99000F] shrink-0" /> : <CheckCircle2 className="w-6 h-6 mr-3 text-emerald-600 shrink-0" />}
                <span>{notification.message}</span>
              </div>
              <button onClick={() => setNotification(null)} className="ml-4 hover:scale-110"><X className="w-5 h-5" /></button>
            </div>
          )}

          {!userRole && (
            <div className="bg-white p-12 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center">
                <Network className="w-16 h-16 mx-auto mb-4 text-[#99000F] opacity-50" />
                <h2 className="text-2xl font-black uppercase mb-2">Welcome to MBTI Analysis System</h2>
                <p className="text-slate-600 font-semibold">Please enter your ID in the top navigation bar to access your portal.</p>
            </div>
          )}

          {activeTab === 'personal_profile' && canSeePersonalProfile && <PersonalProfile currentUserId={currentUserId} showNotification={showNotification} />}
          {activeTab === 'profile' && canSeeProfileManagement && <ProfileManagement userRole={userRole} showNotification={showNotification} />}
          {activeTab === 'stats' && canSeeStats && <StatsDashboard showNotification={showNotification} />}
          {activeTab === 'matching' && canSeeMatching && <TeamMatching userRole={userRole} currentUserId={currentUserId} showNotification={showNotification} />}
          {activeTab === 'course_feedback' && canSeeCourseFeedback && <CourseFeedbackPortal userRole={userRole} currentUserId={currentUserId} showNotification={showNotification} />}
          {activeTab === 'academic' && canSeeAcademicGuidance && <AcademicGuidance showNotification={showNotification} userRole={userRole} />}
        </main>
      </div>
    </div>
  );
}

/* =========================================================
   Component 0: Personal Profile (Student Only)
   ========================================================= */
function PersonalProfile({ currentUserId, showNotification }) {
    const [loading, setLoading] = useState(false);
    const [isNewProfile, setIsNewProfile] = useState(false); // FIXED: Tracking if this is a brand new ID
    
    const [formData, setFormData] = useState({
      StudentID: '',
      Name: '',
      DeptID: '1',
      MBTI_Code: 'INTJ',
      Email: '',
      isSearchable: true,
      password: ''
    });
  
    const fetchMyProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/students`);
        if (!res.ok) throw new Error('Could not access database');
        const allStudents = await res.json();
        
        const myData = allStudents.find(s => s.StudentID.toUpperCase() === currentUserId.toUpperCase());
        
        if (myData) {
            setIsNewProfile(false);
            setFormData({
                StudentID: myData.StudentID,
                Name: myData.Name,
                DeptID: myData.DeptID.toString(),
                MBTI_Code: myData.MBTI_Code,
                Email: myData.Email,
                // FIXED: Explicitly convert MySQL tinyint to Boolean
                isSearchable: Boolean(Number(myData.Is_Searchable)),
                password: myData.password || ''
            });
        } else {
            setIsNewProfile(true); // FIXED: New student logic
            setFormData(prev => ({...prev, StudentID: currentUserId.toUpperCase()}));
            showNotification('Profile not found. Please complete your registration.', 'error');
        }
      } catch (err) {
        showNotification(err.message, 'error');
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchMyProfile();
    }, [currentUserId]);
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const payload = {
            StudentID: formData.StudentID,
            Name: formData.Name,
            DeptID: formData.DeptID,
            MBTI_Code: formData.MBTI_Code,
            Email: formData.Email,
            isSearchable: formData.isSearchable ? 1 : 0,
            password: formData.password || 'password123' // 👈 Added password to the network payload
        };

        if (isNewProfile) {
           // If new profile, POST to create a brand new student
            const res = await fetch(`${API_BASE_URL}/students`, {
               method: 'POST',
            headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || 'Failed to create profile');
            showNotification('Registration complete! Profile created successfully.');
            setIsNewProfile(false);
        } else {
           // Existing profile, PUT to update student records
            const res = await fetch(`${API_BASE_URL}/students/${currentUserId}`, {
               method: 'PUT',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify(payload)
           });
           const result = await res.json();
           if (!res.ok) throw new Error(result.error || 'Failed to update database profile');
           showNotification('Personal profile and visibility settings updated successfully!');
       }
     } catch (err) {
       showNotification(err.message, 'error');
      }
    };
  
    return (
        <div className="bg-white p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
          <div className="flex justify-between items-center border-b-2 border-black pb-3 mb-6">
            <h2 className="text-xl font-bold text-black flex items-center uppercase tracking-wider">
              <Settings className="w-6 h-6 mr-2 text-[#99000F]" />
              My Personal Profile
            </h2>
          </div>
  
          {loading ? (
             <div className="text-center py-12 font-bold animate-pulse">Loading profile data...</div>
          ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-black mb-1 flex items-center">
                Student ID <Lock className="w-3.5 h-3.5 ml-1.5 text-red-600 inline" />
              </label>
              <input type="text" name="StudentID" value={formData.StudentID} disabled className="w-full px-4 py-2 border-2 border-black font-semibold bg-slate-100 border-dashed text-slate-500 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-1">Full Name</label>
              <input type="text" name="Name" value={formData.Name} onChange={handleChange} required className="w-full px-4 py-2 border-2 border-black focus:outline-none focus:bg-amber-50/20 transition-colors font-semibold bg-white" />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-1">Department</label>
              <select name="DeptID" value={formData.DeptID} onChange={handleChange} className="w-full px-4 py-2 border-2 border-black focus:outline-none focus:bg-amber-50/20 transition-colors bg-white font-semibold cursor-pointer">
                {Object.entries(DEPARTMENTS).map(([id, name]) => (<option key={id} value={id}>{name}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-1">MBTI Type</label>
              <select name="MBTI_Code" value={formData.MBTI_Code} onChange={handleChange} className="w-full px-4 py-2 border-2 border-black focus:outline-none focus:bg-amber-50/20 transition-colors bg-white font-semibold cursor-pointer">
                {MBTI_TYPES.map(type => (<option key={type} value={type}>{type}</option>))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-black mb-1">Email Address</label>
              <input type="email" name="Email" value={formData.Email} onChange={handleChange} required className="w-full px-4 py-2 border-2 border-black focus:outline-none focus:bg-amber-50/20 transition-colors font-semibold bg-white" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-black mb-1">Update Account Password</label>
              <input type="password" name="password" placeholder="Enter new password if you want to change it" value={formData.password || ''} onChange={handleChange} className="w-full px-4 py-2 border-2 border-black focus:outline-none focus:bg-amber-50/20 transition-colors font-semibold bg-white" />
            </div>
            <div className="md:col-span-2 flex items-center mt-2 bg-slate-100 p-3 border-2 border-black">
              <input type="checkbox" id="isSearchable" name="isSearchable" checked={formData.isSearchable} onChange={(e) => setFormData({ ...formData, isSearchable: e.target.checked })} className="w-5 h-5 cursor-pointer accent-[#99000F]"/>
              <label htmlFor="isSearchable" className="ml-3 text-sm font-bold text-black cursor-pointer flex items-center">
                {formData.isSearchable ? <Eye className="w-4 h-4 mr-1 text-emerald-600"/> : <EyeOff className="w-4 h-4 mr-1 text-red-600"/>}
                Allow my profile to be discovered in Team Matching (isSearchable)
              </label>
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-4 border-t-2 border-dashed border-gray-200 pt-6">
              <button type="submit" className="bg-[#99000F] text-white font-bold py-2.5 px-8 border-2 border-black hover:bg-black active:scale-95 transition-all flex items-center uppercase tracking-wider">
                <CheckCircle2 className="w-5 h-5 mr-2" /> Save Changes
              </button>
            </div>
          </form>
          )}
        </div>
    );
}

/* =========================================================
   Component 1: Profile Management (Directory View & Admin Edit)
   ========================================================= */
function ProfileManagement({ userRole, showNotification }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); 
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('ALL');
  const [filterMBTI, setFilterMBTI] = useState('ALL');

  const isAdmin = userRole === 'admin';

  const [formData, setFormData] = useState({
    StudentID: '',
    Name: '',
    DeptID: '1',
    MBTI_Code: 'INTJ',
    Email: '',
    isSearchable: true,
    password: ''
  });

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/students`);
      if (!res.ok) throw new Error('Could not access student database API');
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
    if (!isAdmin) return;
    try {
      const payload = {
        ...formData,
        isSearchable: formData.isSearchable ? 1 : 0
      };

      if (isEditing) {
        const res = await fetch(`${API_BASE_URL}/students/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Failed to update student record');
        
        showNotification(result.message || 'Student record updated successfully!');
        setFormData({ StudentID: '', Name: '', DeptID: '1', MBTI_Code: 'INTJ', Email: '', isSearchable: true, password: '' });
        cancelEdit();
      } else {
        const res = await fetch(`${API_BASE_URL}/students`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Failed to register student');
        
        showNotification(result.message || 'Student profile created successfully!');
        setFormData({ StudentID: '', Name: '', DeptID: '1', MBTI_Code: 'INTJ', Email: '', isSearchable: true });
      }
      fetchStudents(); 
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const startEdit = (student) => {
    if (!isAdmin) return;
    setIsEditing(true);
    setEditingId(student.StudentID);
    setFormData({
      StudentID: student.StudentID,
      Name: student.Name,
      DeptID: student.DeptID.toString(),
      MBTI_Code: student.MBTI_Code,
      Email: student.Email,
      // FIXED: Safely convert database value
      isSearchable: Boolean(Number(student.Is_Searchable)),
      password: student.password || '' 
  });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({ StudentID: '', Name: '', DeptID: '1', MBTI_Code: 'INTJ', Email: '', isSearchable: true });
  };

  // FIXED: Sync parsing logic for filter as well
  const displayableStudents = isAdmin ? students : students.filter(s => Boolean(Number(s.Is_Searchable)));

  const filteredStudents = displayableStudents.filter(student => {
    const matchSearch = student.StudentID.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        student.Name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDept = filterDept === 'ALL' || student.DeptID.toString() === filterDept;
    const matchMBTI = filterMBTI === 'ALL' || student.MBTI_Code === filterMBTI;
    return matchSearch && matchDept && matchMBTI;
  });

  const handleConfirmDelete = async () => {
    if (!deleteTarget || !isAdmin) return;
    try {
      const res = await fetch(`${API_BASE_URL}/students/${deleteTarget.StudentID}`, {
        method: 'DELETE'
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to remove student record');
      
      showNotification(result.message || 'Student profile removed successfully!');
      setDeleteTarget(null);
      if (isEditing && editingId === deleteTarget.StudentID) cancelEdit();
      fetchStudents();
    } catch (err) {
      showNotification(err.message, 'error');
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-8 relative">
      {isAdmin && (
      <div className="bg-white p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
        <div className="flex justify-between items-center border-b-2 border-black pb-3 mb-6">
          <h2 className="text-xl font-bold text-black flex items-center uppercase tracking-wider">
            {isEditing ? <><Edit3 className="w-6 h-6 mr-2 text-[#99000F]" />Admin: Edit Student Profile</> : <><UserPlus className="w-6 h-6 mr-2 text-[#99000F]" />Admin: Add New Student Record</>}
          </h2>
          {isEditing && <span className="bg-[#99000F] text-white px-3 py-1 font-bold text-xs uppercase animate-pulse">Edit Mode</span>}
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
            <label className="block text-sm font-bold text-black mb-1 flex items-center">
              Student ID {isEditing && <Lock className="w-3.5 h-3.5 ml-1.5 text-red-600 inline" />}
            </label>
            <input type="text" name="StudentID" value={formData.StudentID} onChange={handleChange} disabled={isEditing} required className={`w-full px-4 py-2 border-2 border-black font-semibold ${isEditing ? 'bg-slate-100 border-dashed text-slate-500 cursor-not-allowed' : 'bg-white'}`} />
          </div>
          <div><label className="block text-sm font-bold text-black mb-1">Full Name</label><input type="text" name="Name" value={formData.Name} onChange={handleChange} required className="w-full px-4 py-2 border-2 border-black bg-white font-semibold" /></div>
          <div>
            <label className="block text-sm font-bold text-black mb-1">Department</label>
            <select name="DeptID" value={formData.DeptID} onChange={handleChange} className="w-full px-4 py-2 border-2 border-black bg-white font-semibold">
              {Object.entries(DEPARTMENTS).map(([id, name]) => (<option key={id} value={id}>{name}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-1">MBTI Type</label>
            <select name="MBTI_Code" value={formData.MBTI_Code} onChange={handleChange} className="w-full px-4 py-2 border-2 border-black bg-white font-semibold">
              {MBTI_TYPES.map(type => (<option key={type} value={type}>{type}</option>))}
            </select>
          </div>
          <div className="md:col-span-2"><label className="block text-sm font-bold text-black mb-1">Email Address</label><input type="email" name="Email" value={formData.Email} onChange={handleChange} required className="w-full px-4 py-2 border-2 border-black bg-white font-semibold" /></div>
          <div className="md:col-span-2">
          < label className="block text-sm font-bold text-black mb-1">
                Account Password {isEditing && <span className="text-xs text-slate-500 font-normal">(Leave blank to keep current password)</span>}
          </label>
          <input 
              type="password" 
              name="password" 
              placeholder="Enter login password"
             value={formData.password || ''} 
              onChange={handleChange} 
              required={!isEditing} 
             className="w-full px-4 py-2 border-2 border-black bg-white font-semibold focus:outline-none" 
          />
          </div>
          <div className="md:col-span-2 flex items-center mt-2 bg-slate-100 p-3 border-2 border-black">
            <input type="checkbox" id="isSearchable" name="isSearchable" checked={formData.isSearchable} onChange={(e) => setFormData({ ...formData, isSearchable: e.target.checked })} className="w-5 h-5 cursor-pointer accent-[#99000F]"/>
            <label htmlFor="isSearchable" className="ml-3 text-sm font-bold text-black cursor-pointer flex items-center">
              {formData.isSearchable ? <Eye className="w-4 h-4 mr-1 text-emerald-600"/> : <EyeOff className="w-4 h-4 mr-1 text-red-600"/>}
              Visibility (isSearchable)
            </label>
          </div>
          <div className="md:col-span-2 flex justify-end gap-3 mt-4 border-t-2 border-dashed border-gray-200 pt-6">
            {isEditing && <button type="button" onClick={cancelEdit} className="bg-white text-black font-bold py-2.5 px-6 border-2 border-black hover:bg-slate-100 active:scale-95 transition-all uppercase flex items-center"><X className="w-5 h-5 mr-2" />Cancel Edit</button>}
            <button type="submit" className="bg-[#99000F] text-white font-bold py-2.5 px-8 border-2 border-black hover:bg-black active:scale-95 transition-all flex items-center uppercase tracking-wider">
              <CheckCircle2 className="w-5 h-5 mr-2" />{isEditing ? 'Update Profile' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
      )}

      <div className="bg-white p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-black pb-4 mb-6">
          <h2 className="text-xl font-bold text-black flex items-center uppercase tracking-wider">
            <BookOpen className="w-6 h-6 mr-2 text-[#99000F]" />
            Student Roster Directory {isAdmin ? '(Admin View)' : '(Public View)'}
          </h2>
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} className="px-3 py-1.5 border-2 border-black focus:outline-none focus:bg-amber-50/20 text-sm font-semibold bg-white cursor-pointer">
              <option value="ALL">All Departments</option>
              {Object.entries(DEPARTMENTS).map(([id, name]) => (<option key={id} value={id}>{name}</option>))}
            </select>
            <select value={filterMBTI} onChange={(e) => setFilterMBTI(e.target.value)} className="px-3 py-1.5 border-2 border-black focus:outline-none focus:bg-amber-50/20 text-sm font-semibold bg-white cursor-pointer">
              <option value="ALL">All MBTI</option>
              {MBTI_TYPES.map(type => (<option key={type} value={type}>{type}</option>))}
            </select>
            <div className="relative flex-1 sm:w-64">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><Search className="w-4 h-4 text-slate-500" /></div>
              <input type="text" placeholder="Search by ID or Name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-1.5 border-2 border-black focus:outline-none focus:bg-amber-50/20 text-sm font-semibold bg-white" />
            </div>
            <button onClick={fetchStudents} className="flex items-center text-xs font-bold text-slate-700 hover:text-black border-2 border-slate-300 hover:border-black px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 transition-colors shrink-0"><RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Reload</button>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-12 font-bold text-black uppercase animate-pulse tracking-widest flex flex-col items-center justify-center">
            <RefreshCw className="w-8 h-8 animate-spin mb-3 text-[#99000F]" /> Accessing Roster Database...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border-2 border-black">
              <thead>
                <tr className="bg-[#99000F] text-white uppercase text-sm tracking-wider border-b-2 border-black">
                  <th className="py-3 px-4 border-r border-black">ID</th>
                  <th className="py-3 px-4 border-r border-black">Full Name</th>
                  <th className="py-3 px-4 border-r border-black">Department</th>
                  <th className="py-3 px-4 border-r border-black">MBTI Profile</th>
                  <th className="py-3 px-4 border-r border-black">Email</th>
                  {isAdmin && <th className="py-3 px-4 border-r border-black text-center">Visibility</th>}
                  {isAdmin && <th className="py-3 px-4 text-center">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? "7" : "5"} className="py-12 text-center font-bold border border-black text-gray-500 bg-slate-50">
                      No students found matching your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student, idx) => (
                    <tr key={student.StudentID || idx} className={`hover:bg-amber-50/30 transition-colors border-b border-black ${editingId === student.StudentID ? 'bg-amber-50/60 font-medium' : ''}`}>
                      <td className="py-3 px-4 font-bold border-r border-black">{student.StudentID}</td>
                      <td className="py-3 px-4 border-r border-black">{student.Name}</td>
                      <td className="py-3 px-4 border-r border-black">{DEPARTMENTS[student.DeptID] || student.DeptID}</td>
                      <td className="py-3 px-4 border-r border-black"><span className="inline-flex items-center px-3 py-1 text-xs font-bold bg-[#99000F]/10 text-[#99000F] border-2 border-[#99000F]">{student.MBTI_Code}</span></td>
                      <td className="py-3 px-4 border-r border-black font-mono text-sm">{student.Email}</td>
                      {isAdmin && (
                      <td className="py-3 px-4 border-r border-black text-center">
                        {Boolean(Number(student.Is_Searchable)) ? (
                          <span className="inline-flex items-center text-emerald-600 text-xs font-bold" title="Visible in Matching"><Eye className="w-4 h-4 mr-1"/> Public</span>
                        ) : (
                          <span className="inline-flex items-center text-gray-400 text-xs font-bold" title="Hidden from Matching"><EyeOff className="w-4 h-4 mr-1"/> Hidden</span>
                        )}
                      </td>
                      )}
                      {isAdmin && (
                      <td className="py-2 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => startEdit(student)} className="bg-white hover:bg-slate-100 text-black border-2 border-black p-1.5 transition-transform hover:scale-105"><Edit3 className="w-4 h-4" /></button>
                          <button onClick={() => setDeleteTarget(student)} className="bg-white hover:bg-[#99000F] hover:text-white text-[#99000F] border-2 border-black p-1.5 transition-transform hover:scale-105"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {deleteTarget && isAdmin && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white border-4 border-black p-6 max-w-md w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 border-b-2 border-black pb-3 mb-4"><HelpCircle className="w-8 h-8 text-[#99000F] shrink-0" /><h3 className="text-lg font-bold uppercase tracking-wider">Confirm Profile Purge</h3></div>
            <p className="text-sm text-gray-800 leading-relaxed mb-6 font-semibold">Are you sure you want to permanently delete student profile <span className="text-[#99000F] underline font-mono">{deleteTarget.Name} ({deleteTarget.StudentID})</span>?</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteTarget(null)} className="bg-white text-black font-bold py-2 px-4 border-2 border-black hover:bg-slate-100 active:scale-95 transition-all text-xs uppercase">No, Keep Record</button>
              <button onClick={handleConfirmDelete} className="bg-[#99000F] text-white font-bold py-2 px-6 border-2 border-black hover:bg-black active:scale-95 transition-all text-xs uppercase">Yes, Purge Record</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   Component 2: Stats Dashboard 
   ========================================================= */
function StatsDashboard({ showNotification }) {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDept, setSelectedDept] = useState('ALL');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/students`);
        if (!res.ok) throw new Error('Failed to retrieve student data for statistics');
        const allStudents = await res.json();

        const filteredStudents = selectedDept === 'ALL' 
            ? allStudents 
            : allStudents.filter(s => s.DeptID.toString() === selectedDept);

        const counts = {};
        filteredStudents.forEach(student => {
            const mbti = student.MBTI_Code;
            counts[mbti] = (counts[mbti] || 0) + 1;
        });

        const formattedData = Object.keys(counts).map(mbti => ({
          name: mbti,
          Total: counts[mbti]
        })).sort((a, b) => b.Total - a.Total); 
        
        setStats(formattedData);
      } catch (err) {
        showNotification(err.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [selectedDept]);

  const COLORS = ['#99000F', '#1F2937', '#DC2626', '#4B5563', '#EF4444', '#6B7280', '#F87171', '#9CA3AF'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <p className="font-bold text-black uppercase tracking-wide">{`${payload[0].name || label}`}</p>
          <p className="text-[#99000F] font-black">{`Count: ${payload[0].value} student(s)`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] min-h-[500px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b-2 border-black pb-4 gap-4">
        <h2 className="text-xl font-bold text-black flex items-center uppercase tracking-wider">
          <BarChart3 className="w-6 h-6 mr-2 text-[#99000F]" />
          MBTI Population Analysis
        </h2>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} className="px-4 py-2 border-2 border-black focus:outline-none focus:bg-amber-50/20 bg-white font-semibold cursor-pointer text-sm">
            <option value="ALL">All Departments (Institution Wide)</option>
            {Object.entries(DEPARTMENTS).map(([id, name]) => (<option key={id} value={id}>{name}</option>))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 font-bold text-black uppercase animate-pulse flex flex-col items-center justify-center">
          <RefreshCw className="w-8 h-8 animate-spin mb-3 text-[#99000F]" /> Plotting Real-time Metrics...
        </div>
      ) : stats.length === 0 ? (
        <div className="text-center py-20 text-slate-500 font-semibold border-2 border-dashed border-slate-300">
          No data available for the selected department.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
          <div className="flex flex-col items-center border border-slate-200 p-4 bg-slate-50/50">
            <h3 className="font-bold text-black uppercase mb-4 tracking-widest border-b border-black pb-1">Type Distribution (Bar)</h3>
            <div className="w-full h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#CBD5E1" />
                  <XAxis dataKey="name" tick={{ fill: 'black', fontWeight: 'bold' }} axisLine={{ stroke: '#000', strokeWidth: 1.5 }} />
                  <YAxis allowDecimals={false} tick={{ fill: 'black', fontWeight: 'bold' }} axisLine={{ stroke: '#000', strokeWidth: 1.5 }} />
                  <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#e2e8f0' }} />
                  <Bar dataKey="Total" fill="#99000F" radius={[0, 0, 0, 0]} stroke="#000" strokeWidth={1} animationDuration={1000} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex flex-col items-center border border-slate-200 p-4 bg-slate-50/50">
            <h3 className="font-bold text-black uppercase mb-4 tracking-widest border-b border-black pb-1">Percentage Breakdown (Pie)</h3>
            <div className="w-full h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats} cx="50%" cy="50%" labelLine={true} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={100} fill="#8884d8" dataKey="Total" animationDuration={1000}>
                    {stats.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#000" strokeWidth={1.5} />))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   Component 3: Team Matching (Operations Panel)
   ========================================================= */
function TeamMatching({ userRole, currentUserId, showNotification }) {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectDetails, setProjectDetails] = useState({ recommendations: [], allCandidates: [], members: [] });
    const [loading, setLoading] = useState(false);
    const [candidateTab, setCandidateTab] = useState('recommended'); 
    
    const isAdmin = userRole === 'admin';
    const isProfessor = userRole === 'professor';
    const hasControlPower = isAdmin || isProfessor;
  
    useEffect(() => {
        fetch(`${API_BASE_URL}/projects`)
            .then(res => res.json())
            .then(data => setProjects(data))
            .catch(() => showNotification('Failed to fetch projects', 'error'));
    }, []);
  
    const fetchProjectDetails = async (project) => {
      setLoading(true);
      setSelectedProject(project);
      setCandidateTab('recommended');
      
      try {
        const studentsRes = await fetch(`${API_BASE_URL}/students`);
        const allStudents = await studentsRes.json();
        
        const membersRes = await fetch(`${API_BASE_URL}/projects/${project.ProjectID}/members`);
        const existingMembers = await membersRes.json();
        const memberIds = existingMembers.map(m => m.StudentID);
  
        // 【修正隱私邏輯】篩選外部可邀請名單
        const availableStudents = allStudents.filter(s => {
          // 排除已經在專案內的成員 (不論是 Pending 或 Matched)
          if (memberIds.includes(s.StudentID)) return false;
          
          // 如果是管理員或教授，擁有最高權限，可看見所有人 (包含 Is_Searchable = 0 的人)
          if (hasControlPower) return true;
          
          // 一般學生只能搜尋到開放公開搜尋 (Is_Searchable == 1) 的學生
          return Boolean(Number(s.Is_Searchable));
        });

        // 推薦名單篩選
        const recommendations = availableStudents.filter(s => {
          const matchDept = !project.reqDepts || project.reqDepts.length === 0 || project.reqDepts.includes(parseInt(s.DeptID));
          const matchMBTI = !project.prefMBTI || project.prefMBTI.length === 0 || project.prefMBTI.includes(s.MBTI_Code);
          return matchDept && matchMBTI;
        });
  
        setProjectDetails({
          recommendations: recommendations,
          allCandidates: availableStudents,
          members: existingMembers // 後端回傳此專案所有組員，此處不作 Is_Searchable 過濾，確保組內所有人互見！
        });
      } catch (err) {
        showNotification('Failed to run matching algorithm', 'error');
      } finally {
        setLoading(false);
      }
    };
  
    const handleInvite = async (student) => {
      try {
        const res = await fetch(`${API_BASE_URL}/matching/invite`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projectId: selectedProject.ProjectID, studentId: student.StudentID })
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Failed to invite');

        showNotification(`Application submitted for ${student.Name}. Status: Pending.`, 'success');
        fetchProjectDetails(selectedProject); 
      } catch(err) {
        showNotification(err.message, 'error');
      }
    };
  
    const handleStatusUpdate = async (studentId, newStatus) => {
      try {
        const res = await fetch(`${API_BASE_URL}/matching`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus, projectId: selectedProject.ProjectID, studentId })
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Failed to update status');

        showNotification(`Student status updated successfully`, 'success');
        fetchProjectDetails(selectedProject);
      } catch(err) {
        showNotification(err.message, 'error');
      }
    };
  
    const handleRevoke = async (studentId) => {
      try {
        const res = await fetch(`${API_BASE_URL}/projects/leave`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projectId: selectedProject.ProjectID, studentId })
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Failed to revoke');
        
        showNotification('Student successfully removed from the project.', 'success');
        fetchProjectDetails(selectedProject);
      } catch(err) {
        showNotification(err.message, 'error');
      }
    };

    const displayList = candidateTab === 'recommended' ? projectDetails.recommendations : projectDetails.allCandidates;
    
    // 檢查當前登入的普通學生，是否屬於這個專案的組員
    const isUserMemberOfProject = projectDetails.members.some(m => m.StudentID === currentUserId);
    // 只要是控制階級 (Admin/Professor) 或是該專案的成員，就能看見名單
    const canSeeRoster = hasControlPower || isUserMemberOfProject;
  
    return (
        <div className="bg-white p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-xl font-bold text-black mb-6 flex items-center uppercase border-b-2 border-black pb-2 inline-flex tracking-wider">
          <Network className="w-6 h-6 mr-2 text-[#99000F]" /> Smart Team Matching Workflow
        </h2>
  
        <div className="mb-8 p-4 bg-slate-50 border-2 border-black">
          <label className="block text-sm font-bold text-black mb-2 uppercase tracking-widest">Select Project for Matching</label>
          <select 
            className="w-full px-4 py-2 border-2 border-black focus:outline-none bg-white font-semibold cursor-pointer"
            onChange={(e) => fetchProjectDetails(projects.find(p => p.ProjectID === parseInt(e.target.value)))}
            defaultValue=""
          >
            <option value="" disabled>-- Select a Project to Analyze --</option>
            {projects.map(p => (
              <option key={p.ProjectID} value={p.ProjectID}>{p.ProjectName} (ID: {p.ProjectID})</option>
            ))}
          </select>
        </div>
  
        {selectedProject && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-in fade-in duration-300">
            {/* 左側：候選人池 */}
            <div className="border-2 border-black p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-black pb-3 mb-4 gap-3">
                <h3 className="font-bold text-black uppercase tracking-wider flex items-center">
                   Candidates List {hasControlPower && <span className="ml-2 text-xs bg-red-600 text-white px-1.5 py-0.5 rounded-none">Bypass Privacy (Admin View)</span>}
                </h3>
                <div className="flex border-2 border-black rounded-none overflow-hidden">
                  <button 
                    onClick={() => setCandidateTab('recommended')} 
                    className={`px-3 py-1.5 text-xs font-bold uppercase transition-colors ${candidateTab === 'recommended' ? 'bg-[#99000F] text-white' : 'bg-white text-black hover:bg-slate-100'}`}
                  >
                    Recommended ({projectDetails.recommendations.length})
                  </button>
                  <button 
                    onClick={() => setCandidateTab('all')} 
                    className={`px-3 py-1.5 text-xs font-bold uppercase border-l-2 border-black transition-colors ${candidateTab === 'all' ? 'bg-[#99000F] text-white' : 'bg-white text-black hover:bg-slate-100'}`}
                  >
                    All Available ({projectDetails.allCandidates.length})
                  </button>
                </div>
              </div>
              
              {loading ? (
                <p className="text-center py-8 font-bold animate-pulse text-[#99000F]">Running Match Logic...</p>
              ) : displayList.length === 0 ? (
                <p className="text-center py-8 text-slate-500 font-semibold border-2 border-dashed border-slate-300">
                  {candidateTab === 'recommended' ? 'No matching candidates found based on strict requirements.' : 'No available public candidates left to invite.'}
                </p>
              ) : (
                <ul className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {displayList.map(student => (
                    <li key={student.StudentID} className={`flex flex-col sm:flex-row justify-between items-start sm:items-center border border-black p-3 ${candidateTab === 'recommended' ? 'bg-amber-50/30' : 'bg-slate-50/50'}`}>
                      <div>
                        <p className="font-bold text-black">{student.Name} ({student.StudentID})</p>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs font-bold bg-white border border-black px-1.5 py-0.5">{DEPARTMENTS[student.DeptID]}</span>
                          <span className="text-xs font-bold bg-[#99000F]/10 text-[#99000F] border border-[#99000F] px-1.5 py-0.5">{student.MBTI_Code}</span>
                          {Number(student.Is_Searchable) === 0 && <span className="text-[10px] font-bold bg-gray-200 border border-gray-400 px-1 text-gray-700">Private Profile</span>}
                        </div>
                      </div>
                      <button onClick={() => handleInvite(student)} className="mt-3 sm:mt-0 bg-black text-white font-bold py-1.5 px-3 border-2 border-black hover:bg-white hover:text-black transition-colors text-xs uppercase shrink-0">
                        Invite (Pending)
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
  
            {/* 右側：專案目前內部成員狀態 (任何組員皆可互見) */}
            <div className="border-2 border-black p-4 bg-slate-50">
              <h3 className="font-bold text-black mb-4 uppercase border-b-2 border-black pb-3 flex items-center justify-between tracking-wider">
                <span>Project Roster & Workflow</span>
                <span className="text-xs bg-black text-white px-2 py-1">Review</span>
              </h3>
              
              {/* 申請中 */}
              <div className="mb-6">
                <h4 className="font-bold text-sm text-[#99000F] mb-3 uppercase tracking-wider">Pending Approvals</h4>
                {projectDetails.members.filter(m => m.Match_Status === 'Pending').length === 0 ? (
                  <p className="text-sm text-slate-500 italic p-3 border border-dashed border-slate-300">No pending applications.</p>
                ) : (
                  <ul className="space-y-3">
                    {projectDetails.members.filter(m => m.Match_Status === 'Pending').map(student => (
                      <li key={student.StudentID} className="flex justify-between items-center bg-white border border-dashed border-black p-3">
                        <div>
                          <p className="font-bold text-sm text-black">{student.Name}</p>
                          <p className="text-xs text-slate-600">{student.MBTI_Code} | {DEPARTMENTS[student.DeptID]}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          {(hasControlPower || currentUserId === student.StudentID) ? (
                              <>
                                <button onClick={() => handleStatusUpdate(student.StudentID, 'Matched')} className="bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 font-bold p-1.5 border border-emerald-600 transition-colors" title="Approve"><CheckCircle2 className="w-4 h-4" /></button>
                                <button onClick={() => handleStatusUpdate(student.StudentID, 'Rejected')} className="bg-red-50 hover:bg-red-600 hover:text-white text-red-700 font-bold p-1.5 border border-red-600 transition-colors" title="Reject"><XCircle className="w-4 h-4" /></button>
                              </>
                          ) : (
                              <span className="text-xs text-slate-500 font-bold px-2">Awaiting Response...</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
  
              {/* 正式成員（包含隱私設為0的人在此也是完全透明公開） */}
              <div>
                <h4 className="font-bold text-sm text-black mb-3 uppercase tracking-wider">Official Team Members</h4>
                {!canSeeRoster ? (
                  <p className="text-sm text-amber-700 font-semibold p-3 bg-amber-50 border border-amber-300 italic">You must be a member of this project or an Admin/Professor to view this team roster.</p>
                ) : projectDetails.members.filter(m => m.Match_Status === 'Matched').length === 0 ? (
                  <p className="text-sm text-slate-500 italic p-3 border border-dashed border-slate-300">No official members yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {projectDetails.members.filter(m => m.Match_Status === 'Matched').map(student => (
                      <li key={student.StudentID} className="flex justify-between items-center bg-white border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <div>
                          <p className="font-bold text-sm text-black">{student.Name} {student.StudentID === currentUserId && <span className="text-xs text-blue-600 font-normal">(You)</span>}</p>
                          <div className="flex gap-1.5 mt-0.5">
                            <span className="text-[10px] font-mono bg-slate-100 px-1 border border-slate-200">{student.StudentID}</span>
                            <span className="text-[10px] font-bold bg-[#99000F]/10 text-[#99000F] px-1">{student.MBTI_Code}</span>
                          </div>
                        </div>
                        {(hasControlPower || currentUserId === student.StudentID) && (
                            <button onClick={() => handleRevoke(student.StudentID)} className="text-[#99000F] hover:bg-[#99000F] hover:text-white p-1 border border-transparent hover:border-black transition-colors shrink-0" title="Revoke Membership"><Trash2 className="w-4 h-4" /></button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
}

/* =========================================================
   Component 4: Course Feedback
   ========================================================= */
function CourseFeedbackPortal({ userRole, currentUserId, showNotification }) {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [feedbackForm, setFeedbackForm] = useState({ rating: 5, comments: '' });
    const [courseFeedbackData, setCourseFeedbackData] = useState([]);
  
    // FIXED: Properly catch missing table/DB errors rather than defaulting to generic "Could not retrieve courses"
    useEffect(() => {
      const fetchCourses = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/courses`);
          if (!res.ok) {
              const errData = await res.json().catch(() => ({}));
              throw new Error(errData.error || 'Could not retrieve courses. Backend might be down.');
          }
          const data = await res.json();
          setCourses(data);
        } catch (err) {
          showNotification(err.message, 'error');
        }
      };
      fetchCourses();
    }, []);

    useEffect(() => {
        const fetchFeedback = async () => {
            if ((userRole === 'professor' || userRole === 'admin') && selectedCourse) {
                try {
                    const res = await fetch(`${API_BASE_URL}/courses/${selectedCourse}/feedback`);
                    if (!res.ok) {
                        const errData = await res.json().catch(() => ({}));
                        throw new Error(errData.error || 'Could not retrieve feedback');
                    }
                    const data = await res.json();
                    setCourseFeedbackData(data);
                } catch (err) {
                    showNotification(err.message, 'error');
                }
            }
        };
        fetchFeedback();
    }, [selectedCourse, userRole]);
  
    const handleFeedbackSubmit = async (e) => {
      e.preventDefault();
      if (!selectedCourse) return showNotification('Please select a course first.', 'error');
      
      try {
        const res = await fetch(`${API_BASE_URL}/feedback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ courseId: selectedCourse, studentId: currentUserId, rating: feedbackForm.rating, comments: feedbackForm.comments })
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Failed to submit feedback');

        showNotification('Feedback successfully recorded in the database! Professor has been notified.', 'success');
        setFeedbackForm({ rating: 5, comments: '' });
      } catch (err) {
        showNotification(err.message, 'error');
      }
    };
  
    return (
      <div className="bg-white p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-xl font-bold text-black mb-8 flex items-center uppercase border-b-2 border-black pb-2 inline-flex tracking-wider">
          <MessageSquare className="w-6 h-6 mr-2 text-[#99000F]" /> Course Feedback Portal
        </h2>
  
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-50 p-4 border-2 border-black h-fit">
            <h3 className="font-bold text-black uppercase tracking-widest mb-4 border-b border-black pb-1">Target Course</h3>
            <div>
              <label className="block text-sm font-bold text-black mb-1">Select Course</label>
              <select className="w-full px-3 py-2 border-2 border-black focus:outline-none focus:bg-amber-50/20 bg-white font-semibold cursor-pointer" onChange={(e) => setSelectedCourse(e.target.value)} value={selectedCourse}>
                <option value="" disabled>-- Choose a Course --</option>
                {courses.map(c => (<option key={c.CourseID} value={c.CourseID}>{c.CourseName} (ID: {c.CourseID})</option>))}
              </select>
            </div>
          </div>
  
          {userRole === 'student' && (
            <div className="bg-white p-6 border-2 border-black">
                <h3 className="font-bold text-black uppercase tracking-widest mb-4 border-b border-black pb-1">Submit Feedback</h3>
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-black mb-1">Course Satisfaction Rating (1-5)</label>
                    <input type="range" min="1" max="5" value={feedbackForm.rating} onChange={(e) => setFeedbackForm({...feedbackForm, rating: parseInt(e.target.value)})} className="w-full accent-[#99000F] cursor-pointer"/>
                    <div className="text-right text-xs font-bold text-[#99000F] mt-1">{feedbackForm.rating} / 5</div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-black mb-1">Qualitative Comments</label>
                    <textarea rows="4" required value={feedbackForm.comments} onChange={(e) => setFeedbackForm({...feedbackForm, comments: e.target.value})} placeholder="Describe your experience..." className="w-full px-3 py-2 border-2 border-black focus:outline-none focus:bg-amber-50/20 font-semibold resize-none"></textarea>
                </div>
                <button type="submit" disabled={!selectedCourse} className="w-full bg-[#99000F] disabled:bg-slate-300 text-white font-bold py-3 px-4 border-2 border-black hover:bg-black active:scale-95 transition-all uppercase mt-4">
                    Submit Academic Feedback
                </button>
                </form>
            </div>
          )}

          {(userRole === 'professor' || userRole === 'admin') && (
            <div className="bg-white p-6 border-2 border-black">
                <h3 className="font-bold text-black uppercase tracking-widest mb-4 border-b border-black pb-1">Feedback Analysis View</h3>
                {!selectedCourse ? (
                    <p className="text-slate-500 italic text-sm">Select a course to view student feedback.</p>
                ) : courseFeedbackData.length === 0 ? (
                    <p className="text-slate-500 italic text-sm">No feedback recorded for this course yet.</p>
                ) : (
                    <div>
                        <div className="mb-4 flex items-center justify-between bg-slate-100 p-3 border border-black">
                            <span className="font-bold">Average Rating:</span>
                            <span className="text-xl font-black text-[#99000F]">
                                {(courseFeedbackData.reduce((acc, curr) => acc + curr.Rating, 0) / courseFeedbackData.length).toFixed(1)} / 5
                            </span>
                        </div>
                        <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
                            {courseFeedbackData.map((fb, idx) => (
                                <li key={idx} className="border border-dashed border-black p-3 text-sm">
                                    <div className="flex justify-between mb-1">
                                        <span className="font-mono text-slate-500">{fb.StudentID}</span>
                                        <span className="font-bold">Rating: {fb.Rating}/5</span>
                                    </div>
                                    <p className="font-semibold">{fb.Comments}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
          )}
        </div>
      </div>
    );
}

/* =========================================================
   Component 5: Academic Guidance & Group Management Dashboard (Admin/Professor View)
   ========================================================= */
function AcademicGuidance({ showNotification, userRole }) {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [allProjects, setAllProjects] = useState([]);
  const [courseProjects, setCourseProjects] = useState([]);
  const [projectMembersMap, setProjectMembersMap] = useState({}); // 儲存 ProjectID -> 該組所有組員的 Map
  const [allStudents, setAllStudents] = useState([]);
  const [selectedStudentForProject, setSelectedStudentForProject] = useState({}); // 紀錄每個專案下拉選單選中的學生ID

  // 初始讀取基本資料
  useEffect(() => {
    fetch(`${API_BASE_URL}/courses`)
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(() => showNotification('Failed to fetch courses', 'error'));

    fetch(`${API_BASE_URL}/projects`)
      .then(res => res.json())
      .then(data => setAllProjects(data))
      .catch(() => showNotification('Failed to fetch projects', 'error'));

    fetch(`${API_BASE_URL}/students`)
      .then(res => res.json())
      .then(data => setAllStudents(data))
      .catch(() => showNotification('Failed to fetch students', 'error'));
  }, []);

  // 當選擇的課程變更時，抓取該課程下的所有專案與其內部的組員
  useEffect(() => {
    if (!selectedCourseId) {
      setCourseProjects([]);
      return;
    }
    const filteredProjects = allProjects.filter(p => p.CourseID === parseInt(selectedCourseId));
    setCourseProjects(filteredProjects);

    // 逐一去拉每個小組的組員
    filteredProjects.forEach(proj => {
      fetchProjectMembers(proj.ProjectID);
    });
  }, [selectedCourseId, allProjects]);

  const fetchProjectMembers = (projectId) => {
    fetch(`${API_BASE_URL}/projects/${projectId}/members`)
      .then(res => res.json())
      .then(members => {
        setProjectMembersMap(prev => ({ ...prev, [projectId]: members }));
      })
      .catch(() => showNotification(`Failed to fetch members for project ${projectId}`, 'error'));
  };

  // 編輯：移除組員 (踢出/取消)
  const handleRemoveMember = async (projectId, studentId) => {
    if (!window.confirm("Are you sure you want to remove this student from the project group?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/projects/leave`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, studentId })
      });
      if (!res.ok) throw new Error('Failed to remove member');
      showNotification('Member removed from group successfully.', 'success');
      fetchProjectMembers(projectId); // 刷新該組名單
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // 編輯：審核申請 (Approve / Reject)
  const handleStatusUpdate = async (projectId, studentId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/matching`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, projectId, studentId })
      });
      if (!res.ok) throw new Error('Failed to update status');
      showNotification(`Application status marked as: ${newStatus}`, 'success');
      fetchProjectMembers(projectId); // 刷新該組名單
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // 編輯：教授/Admin 直接強行將學生塞進小組 (呼叫新增的後端 API)
  const handleAddMemberDirectly = async (projectId) => {
    const studentId = selectedStudentForProject[projectId];
    if (!studentId) {
      showNotification('Please select a student from the dropdown first.', 'error');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/admin/projects/add-member`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, studentId })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to add member');
      
      showNotification('Student successfully assigned and forced into the team!', 'success');
      fetchProjectMembers(projectId); // 刷新該組名單
      
      // 清空該組選單狀態
      setSelectedStudentForProject(prev => ({ ...prev, [projectId]: '' }));
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  return (
    <div className="bg-white p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-in fade-in duration-200">
      <h2 className="text-xl font-bold text-black mb-6 flex items-center uppercase border-b-2 border-black pb-2 inline-flex tracking-wider">
        <GraduationCap className="w-6 h-6 mr-2 text-[#99000F]" /> Course & Group Roster Manager ({userRole})
      </h2>

      {/* 頂部：課程選擇下拉選單 */}
      <div className="mb-8 p-4 bg-amber-50/20 border-2 border-black max-w-xl">
        <label className="block text-sm font-bold text-black mb-2 uppercase tracking-widest">Select Course to View Groups</label>
        <select
          className="w-full px-4 py-2 border-2 border-black focus:outline-none bg-white font-semibold cursor-pointer"
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
        >
          <option value="">-- Choose a Course --</option>
          {courses.map(c => (
            <option key={c.CourseID} value={c.CourseID}>{c.CourseName} (ID: {c.CourseID})</option>
          ))}
        </select>
      </div>

      {/* 專案小組清單顯示區 */}
      {selectedCourseId && (
        <div>
          <h3 className="text-lg font-bold text-black mb-6 uppercase tracking-wide border-b-2 border-black pb-2">
            Active Groups for: <span className="text-[#99000F]">{courses.find(c => c.CourseID === parseInt(selectedCourseId))?.CourseName}</span>
          </h3>

          {courseProjects.length === 0 ? (
            <p className="p-6 border-2 border-dashed border-slate-300 bg-slate-50 font-semibold text-slate-500 italic text-center">
              No projects or team groups are currently mapped to this course.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courseProjects.map(proj => {
                const members = projectMembersMap[proj.ProjectID] || [];
                const officialMembers = members.filter(m => m.Match_Status === 'Matched');
                const pendingMembers = members.filter(m => m.Match_Status === 'Pending');
                
                // 過濾掉本組已經包含的學生，防下拉選單重複加入
                const assignedStudentIds = members.map(m => m.StudentID);
                const candidatesToInject = allStudents.filter(s => !assignedStudentIds.includes(s.StudentID));

                return (
                  <div key={proj.ProjectID} className="border-2 border-black p-4 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
                    <div>
                      {/* 組別標頭 */}
                      <div className="flex justify-between items-start border-b-2 border-black pb-2 mb-3">
                        <div>
                          <h4 className="font-bold text-md text-black">{proj.ProjectName}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">Project ID: {proj.ProjectID}</p>
                        </div>
                        <span className="text-xs font-bold bg-[#99000F] text-white px-2 py-0.5">
                          Active: {officialMembers.length}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 mb-4 line-clamp-2 italic">"{proj.Description || 'No description available.'}"</p>

                      {/* 1. 審核中區塊 (Pending) */}
                      <div className="mb-4">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">
                          ★ Pending Join Requests ({pendingMembers.length})
                        </h5>
                        {pendingMembers.length === 0 ? (
                          <p className="text-[11px] text-slate-400 italic bg-slate-50 p-2 border border-dashed border-slate-200">No active join applications.</p>
                        ) : (
                          <ul className="space-y-1.5 bg-amber-50/20 p-2 border border-amber-200">
                            {pendingMembers.map(student => (
                              <li key={student.StudentID} className="flex justify-between items-center text-xs bg-white p-2 border border-black">
                                <div>
                                  <span className="font-bold">{student.Name}</span> ({student.StudentID})
                                  <span className="ml-1.5 font-mono text-[10px] bg-slate-100 px-1 border border-slate-200">{student.MBTI_Code}</span>
                                </div>
                                <div className="flex gap-1">
                                  <button onClick={() => handleStatusUpdate(proj.ProjectID, student.StudentID, 'Matched')} className="bg-emerald-600 text-white p-1 hover:bg-emerald-700 transition-colors" title="Approve Student"><CheckCircle2 className="w-3.5 h-3.5" /></button>
                                  <button onClick={() => handleStatusUpdate(proj.ProjectID, student.StudentID, 'Rejected')} className="bg-red-600 text-white p-1 hover:bg-red-700 transition-colors" title="Reject Student"><XCircle className="w-3.5 h-3.5" /></button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {/* 2. 正式組員區塊 (Matched) */}
                      <div className="mb-4">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-black mb-2">
                          ✔ Official Group Roster ({officialMembers.length})
                        </h5>
                        {officialMembers.length === 0 ? (
                          <p className="text-[11px] text-slate-400 italic bg-slate-50 p-2 border border-dashed border-slate-200">No official group members.</p>
                        ) : (
                          <ul className="space-y-1.5">
                            {officialMembers.map(student => (
                              <li key={student.StudentID} className="flex justify-between items-center text-xs bg-slate-50/70 p-2 border border-black">
                                <div>
                                  <span className="font-bold text-black">{student.Name}</span> <span className="text-slate-500">({student.StudentID})</span>
                                  <div className="flex gap-1.5 mt-0.5">
                                    <span className="text-[10px] font-bold bg-white border border-black px-1">{DEPARTMENTS[student.DeptID] || `Dept ${student.DeptID}`}</span>
                                    <span className="text-[10px] font-bold bg-[#99000F]/10 text-[#99000F] border border-[#99000F] px-1">{student.MBTI_Code}</span>
                                    {Number(student.Is_Searchable) === 0 && <span className="text-[9px] font-bold bg-gray-200 text-gray-600 px-1 border border-gray-300">Hidden Profile</span>}
                                  </div>
                                </div>
                                <button 
                                  onClick={() => handleRemoveMember(proj.ProjectID, student.StudentID)} 
                                  className="text-[#99000F] hover:bg-[#99000F] hover:text-white p-1 border border-transparent hover:border-black transition-colors"
                                  title="Force Kick out from Group"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    {/* 3. 動作區：教授與 Admin 可以直接選學生加人 */}
                    <div className="mt-4 pt-3 border-t-2 border-dashed border-black bg-slate-100 p-2 border border-black">
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-black mb-1">Administrative: Direct Injection</label>
                      <div className="flex gap-2">
                        <select
                          className="flex-1 text-xs px-2 py-1 border border-black bg-white focus:outline-none"
                          value={selectedStudentForProject[proj.ProjectID] || ''}
                          onChange={(e) => setSelectedStudentForProject(prev => ({ ...prev, [proj.ProjectID]: e.target.value }))}
                        >
                          <option value="">-- Choose Student to Force Add --</option>
                          {candidatesToInject.map(s => (
                            <option key={s.StudentID} value={s.StudentID}>{s.Name} ({s.StudentID}) [{s.MBTI_Code}]</option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleAddMemberDirectly(proj.ProjectID)}
                          className="bg-black text-white font-bold px-3 py-1 text-xs uppercase border border-black hover:bg-slate-800 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}