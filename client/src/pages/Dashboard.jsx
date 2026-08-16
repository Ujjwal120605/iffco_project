import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend
} from 'recharts';
import {
    FaIndustry, FaBoxes, FaShippingFast, FaCheckCircle,
    FaChartLine, FaClipboardCheck, FaSyncAlt, FaCalendarAlt,
    FaArrowRight, FaArrowUp, FaSignOutAlt, FaTerminal, FaUserTie,
    FaPlay, FaStop, FaTools, FaExclamationTriangle, FaPlus, FaCheck,
    FaBuilding, FaUserCheck, FaLeaf
} from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

const Dashboard = () => {
    const navigate = useNavigate();

    // User State
    const [user, setUser] = useState({ name: 'Ujjwal Bajpai', role: 'IT Internal', unit: 'Aonla', grade: 'Manager', department: 'IT', empId: 'IFFCO-1000' });
    const [tier, setTier] = useState('MANAGERIAL'); // OPERATIONAL, MANAGERIAL, EXECUTIVE

    // Punch Logic
    const [isPunchedIn, setIsPunchedIn] = useState(false);
    const [punchCount, setPunchCount] = useState(0);
    const [logs, setLogs] = useState([]);
    
    // Core Data States
    const [shiftLogs, setShiftLogs] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [staff, setStaff] = useState([]);
    const [execSummary, setExecSummary] = useState(null);

    // Form inputs for Operational Tier
    const [shiftForm, setShiftForm] = useState({ ammoniaOutput: '', ureaOutput: '', dapOutput: '', steamPressure: '', powerDraw: '', notes: '' });
    const [ticketForm, setTicketForm] = useState({ equipment: '', description: '' });

    // Ticket resolution and assignment temp states
    const [assigneeId, setAssigneeId] = useState({});
    const [resolutionText, setResolutionText] = useState({});

    // Modals
    const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

    // Load initial configurations and verify session
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                const userObj = {
                    ...parsed,
                    name: parsed.name || parsed.username || 'Ujjwal Bajpai',
                    unit: parsed.unit || 'Aonla',
                    grade: parsed.grade || 'Manager',
                    department: parsed.department || 'Production',
                    empId: parsed.empId || 'IFFCO-1000'
                };
                setUser(userObj);
                
                // Determine Grade Tier
                const oper = ["Worker", "Assistant Manager"];
                const exec = ["DGM", "JGM", "GM", "Unit Head"];
                if (oper.includes(userObj.grade)) {
                    setTier('OPERATIONAL');
                } else if (exec.includes(userObj.grade)) {
                    setTier('EXECUTIVE');
                } else {
                    setTier('MANAGERIAL');
                }
            } catch (e) {
                console.error("Error decoding user profile", e);
            }
        }

        const storedPunchStatus = localStorage.getItem('isPunchedIn') === 'true';
        const storedPunchCount = parseInt(localStorage.getItem('punchCount') || '0');
        setPunchCount(storedPunchCount);
        setIsPunchedIn(storedPunchStatus);

        // Fetch operational datasets
        fetchDashboardData();

    }, [navigate]);

    const getAuthConfig = () => {
        const token = localStorage.getItem('token');
        return {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    };

    const fetchDashboardData = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const config = getAuthConfig();
        const timestamp = new Date().toLocaleTimeString();

        try {
            // 1. Fetch Shift Logs
            const logsRes = await axios.get(`${API_BASE_URL}/api/operations/shift-logs`, config);
            setShiftLogs(logsRes.data);

            // 2. Fetch Tickets
            const ticketsRes = await axios.get(`${API_BASE_URL}/api/operations/tickets`, config);
            setTickets(ticketsRes.data);

            // 3. Conditional fetches based on Tier
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                const grade = parsed.grade || 'Manager';
                
                const oper = ["Worker", "Assistant Manager"];
                const exec = ["DGM", "JGM", "GM", "Unit Head"];

                if (exec.includes(grade)) {
                    // Executive Aggregates
                    const summaryRes = await axios.get(`${API_BASE_URL}/api/operations/executive-summary`, config);
                    setExecSummary(summaryRes.data);
                } else if (!oper.includes(grade)) {
                    // Managerial Staff List
                    const staffRes = await axios.get(`${API_BASE_URL}/api/operations/staff`, config);
                    setStaff(staffRes.data);
                }
            }
            
            setLogs(prev => [`[${timestamp}] 🔄 Live system data synchronized successfully.`, ...prev]);
        } catch (err) {
            console.warn("MERN Backend offline or seeding incomplete. Reverting to sandbox simulator mode.", err);
            // Load realistic fallback mock datasets for sandbox testing
            generateMockSandboxData();
        }
    };

    const generateMockSandboxData = () => {
        const timestamp = new Date().toLocaleTimeString();
        
        // Mock shift history
        const mockLogs = [
            { _id: 'l1', unit: user.unit, department: user.department, ammoniaOutput: 420, ureaOutput: 980, dapOutput: 120, steamPressure: 42, powerDraw: 180, verified: true, createdAt: new Date().toISOString(), officer: { username: 'System.Auto', empId: 'IFFCO-99' } },
            { _id: 'l2', unit: user.unit, department: user.department, ammoniaOutput: 390, ureaOutput: 920, dapOutput: 110, steamPressure: 39, powerDraw: 175, verified: false, createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), officer: { username: 'Operator.B', empId: 'IFFCO-102' } }
        ];
        setShiftLogs(mockLogs);

        // Mock tickets
        const mockTickets = [
            { _id: 't1', unit: user.unit, department: 'Production', equipment: 'Ammonia Line 1 Pump', description: 'Leaking seal detected on high-pressure delivery line.', status: 'pending', createdAt: new Date().toISOString(), raisedBy: { username: 'Suresh.Verma', grade: 'Worker', empId: 'IFFCO-1008' } },
            { _id: 't2', unit: user.unit, department: 'Electrical', equipment: 'Main Power Transformer', description: 'Scheduled thermal analysis of the 33kV substation.', status: 'assigned', assignedTo: { username: 'Amit.Patel', grade: 'Assistant Manager', empId: 'IFFCO-1002' }, createdAt: new Date(Date.now() - 3600000 * 48).toISOString(), raisedBy: { username: 'Rajesh.Sharma', grade: 'Unit Head', empId: 'IFFCO-1000' } }
        ];
        setTickets(mockTickets);

        // Mock staff list
        setStaff([
            { _id: 's1', username: 'Amit Patel', grade: 'Assistant Manager', department: 'Production', empId: 'IFFCO-1002' },
            { _id: 's2', username: 'Suresh Verma', grade: 'Worker', department: 'Electrical', empId: 'IFFCO-1008' },
            { _id: 's3', username: 'Karan Mehra', grade: 'Worker', department: 'Instrumentation', empId: 'IFFCO-1014' }
        ]);

        // Mock executive summary
        setExecSummary({
            aggregate: {
                totalProduction: 18240,
                ammonia: 4890,
                urea: 9230,
                dap: 4120,
                power: 2450,
                safetyIndex: 98.5,
                carbonFootprint: 320.4,
                ticketStats: { total: 12, pending: 3, resolved: 5, approved: 4 }
            },
            unitBreakdown: {
                'Aonla': { ammonia: 1200, urea: 2400, dap: 800, count: 12 },
                'Phulpur': { ammonia: 900, urea: 1800, dap: 600, count: 9 },
                'Kalol': { ammonia: 1100, urea: 2100, dap: 900, count: 10 },
                'Kandla': { ammonia: 800, urea: 1400, dap: 1000, count: 8 },
                'Paradip': { ammonia: 890, urea: 1530, dap: 820, count: 11 }
            }
        });

        setLogs(prev => [`[${timestamp}] 🔌 Sandbox simulation mode active. Local fallback data loaded.`, ...prev]);
    };

    const togglePunch = () => {
        const newStatus = !isPunchedIn;
        setIsPunchedIn(newStatus);
        localStorage.setItem('isPunchedIn', newStatus.toString());

        const timestamp = new Date().toLocaleTimeString();
        const action = newStatus ? "USER PUNCHED IN - TERMINAL ACTIVE" : "USER PUNCHED OUT - SHIFT ENDED";
        setLogs(prev => [`[${timestamp}] 🔑 ${action} (Officer: ${user.name})`, ...prev]);

        // Update local stats
        if (newStatus) {
            const newCount = punchCount + 1;
            setPunchCount(newCount);
            localStorage.setItem('punchCount', newCount.toString());
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    // ==========================================
    // OPERATIONAL INTERACTIONS
    // ==========================================

    const handleShiftSubmit = async (e) => {
        e.preventDefault();
        const config = getAuthConfig();
        const timestamp = new Date().toLocaleTimeString();

        try {
            const res = await axios.post(`${API_BASE_URL}/api/operations/shift-log`, shiftForm, config);
            setShiftLogs(prev => [res.data, ...prev]);
            setLogs(prev => [`[${timestamp}] 📝 Submitted daily Shift Output Log.`, ...prev]);
            setIsShiftModalOpen(false);
            setShiftForm({ ammoniaOutput: '', ureaOutput: '', dapOutput: '', steamPressure: '', powerDraw: '', notes: '' });
        } catch (err) {
            // Mock sandbox insertion
            const mockLog = {
                _id: 'l_' + Date.now(),
                unit: user.unit,
                department: user.department,
                ammoniaOutput: Number(shiftForm.ammoniaOutput) || 0,
                ureaOutput: Number(shiftForm.ureaOutput) || 0,
                dapOutput: Number(shiftForm.dapOutput) || 0,
                steamPressure: Number(shiftForm.steamPressure) || 0,
                powerDraw: Number(shiftForm.powerDraw) || 0,
                notes: shiftForm.notes,
                verified: false,
                createdAt: new Date().toISOString(),
                officer: { username: user.name, empId: user.empId }
            };
            setShiftLogs(prev => [mockLog, ...prev]);
            setLogs(prev => [`[${timestamp}] 📝 Submitted daily Shift Output Log (Sandbox Local).`, ...prev]);
            setIsShiftModalOpen(false);
            setShiftForm({ ammoniaOutput: '', ureaOutput: '', dapOutput: '', steamPressure: '', powerDraw: '', notes: '' });
        }
    };

    const handleTicketSubmit = async (e) => {
        e.preventDefault();
        const config = getAuthConfig();
        const timestamp = new Date().toLocaleTimeString();

        try {
            const res = await axios.post(`${API_BASE_URL}/api/operations/ticket`, ticketForm, config);
            setTickets(prev => [res.data, ...prev]);
            setLogs(prev => [`[${timestamp}] 🛠️ Safety maintenance ticket raised for ${ticketForm.equipment}.`, ...prev]);
            setIsTicketModalOpen(false);
            setTicketForm({ equipment: '', description: '' });
        } catch (err) {
            // Mock sandbox insertion
            const mockTicket = {
                _id: 't_' + Date.now(),
                unit: user.unit,
                department: user.department,
                equipment: ticketForm.equipment,
                description: ticketForm.description,
                status: 'pending',
                createdAt: new Date().toISOString(),
                raisedBy: { username: user.name, grade: user.grade, empId: user.empId }
            };
            setTickets(prev => [mockTicket, ...prev]);
            setLogs(prev => [`[${timestamp}] 🛠️ Safety maintenance ticket raised (Sandbox Local).`, ...prev]);
            setIsTicketModalOpen(false);
            setTicketForm({ equipment: '', description: '' });
        }
    };

    // ==========================================
    // MANAGERIAL INTERACTIONS
    // ==========================================

    const handleVerifyLog = async (logId) => {
        const config = getAuthConfig();
        const timestamp = new Date().toLocaleTimeString();

        try {
            const res = await axios.put(`${API_BASE_URL}/api/operations/shift-log/${logId}/verify`, {}, config);
            setShiftLogs(prev => prev.map(l => l._id === logId ? res.data : l));
            setLogs(prev => [`[${timestamp}] ✅ Verified and verified variance yield stats for log ID: ${logId.substring(0,6)}`, ...prev]);
        } catch (err) {
            setShiftLogs(prev => prev.map(l => l._id === logId ? { ...l, verified: true, verifiedBy: { username: user.name, grade: user.grade } } : l));
            setLogs(prev => [`[${timestamp}] ✅ Verified variance yield stats (Sandbox Local) for log ID: ${logId}`, ...prev]);
        }
    };

    const handleAssignTicket = async (ticketId) => {
        const assignee = assigneeId[ticketId];
        if (!assignee) return alert("Please select a staff member first.");

        const config = getAuthConfig();
        const timestamp = new Date().toLocaleTimeString();

        try {
            const res = await axios.put(`${API_BASE_URL}/api/operations/ticket/${ticketId}/assign`, { assignedTo: assignee }, config);
            setTickets(prev => prev.map(t => t._id === ticketId ? res.data : t));
            setLogs(prev => [`[${timestamp}] 👷 Assigned Maintenance Ticket to employee ID: ${assignee}`, ...prev]);
        } catch (err) {
            const staffMember = staff.find(s => s._id === assignee || s.empId === assignee);
            setTickets(prev => prev.map(t => t._id === ticketId ? { 
                ...t, 
                status: 'assigned', 
                assignedTo: { username: staffMember ? staffMember.username : 'Assigned Worker', grade: 'Worker', empId: assignee } 
            } : t));
            setLogs(prev => [`[${timestamp}] 👷 Assigned Maintenance Ticket (Sandbox Local) to employee: ${assignee}`, ...prev]);
        }
    };

    const handleResolveTicket = async (ticketId) => {
        const notes = resolutionText[ticketId] || "Resolved during operations check.";
        const config = getAuthConfig();
        const timestamp = new Date().toLocaleTimeString();

        try {
            const res = await axios.put(`${API_BASE_URL}/api/operations/ticket/${ticketId}/resolve`, { dispatchNotes: notes }, config);
            setTickets(prev => prev.map(t => t._id === ticketId ? res.data : t));
            setLogs(prev => [`[${timestamp}] 🔧 Ticket marked as resolved with dispatch notes.`, ...prev]);
        } catch (err) {
            setTickets(prev => prev.map(t => t._id === ticketId ? { ...t, status: 'resolved', dispatchNotes: notes } : t));
            setLogs(prev => [`[${timestamp}] 🔧 Ticket marked as resolved (Sandbox Local).`, ...prev]);
        }
    };

    const handleApproveTicket = async (ticketId) => {
        const config = getAuthConfig();
        const timestamp = new Date().toLocaleTimeString();

        try {
            const res = await axios.put(`${API_BASE_URL}/api/operations/ticket/${ticketId}/approve`, {}, config);
            setTickets(prev => prev.map(t => t._id === ticketId ? res.data : t));
            setLogs(prev => [`[${timestamp}] 🛡️ Approved ticket resolution. Asset returned to line service.`, ...prev]);
        } catch (err) {
            setTickets(prev => prev.map(t => t._id === ticketId ? { ...t, status: 'approved' } : t));
            setLogs(prev => [`[${timestamp}] 🛡️ Approved ticket resolution (Sandbox Local).`, ...prev]);
        }
    };

    // ==========================================
    // EXECUTIVE APPROVALS
    // ==========================================

    const [capexRequests, setCapexRequests] = useState([
        { id: 'cx1', item: "Ammonia Catalytic Convertor Upgrade", amount: "₹4.2 Cr", unit: "Aonla", status: "pending" },
        { id: 'cx2', item: "DAP Bulk Storage Solar Farm Expansion", amount: "₹1.8 Cr", unit: "Kalol", status: "pending" }
    ]);

    const handleCapexApproval = (id) => {
        const timestamp = new Date().toLocaleTimeString();
        setCapexRequests(prev => prev.map(c => c.id === id ? { ...c, status: "approved" } : c));
        setLogs(prev => [`[${timestamp}] 💰 APPROVED CapEx Budget request: ${id.toUpperCase()}`, ...prev]);
    };

    // Recharts Data preparation
    const productionTrends = shiftLogs.slice(0, 7).reverse().map((log, index) => ({
        name: `Shift ${index + 1}`,
        urea: log.ureaOutput,
        dap: log.dapOutput,
        ammonia: log.ammoniaOutput
    }));

    const execBarData = execSummary ? Object.keys(execSummary.unitBreakdown).map(u => ({
        name: u,
        urea: execSummary.unitBreakdown[u].urea,
        ammonia: execSummary.unitBreakdown[u].ammonia,
        dap: execSummary.unitBreakdown[u].dap
    })) : [];

    return (
        <div className="min-h-screen bg-gray-50 text-black font-sans selection:bg-green-500 selection:text-white relative">
            
            {/* Header Dashboard Navigation */}
            <header className="px-6 md:px-12 py-4 border-b border-black flex flex-col md:flex-row justify-between items-center sticky top-0 bg-white/90 backdrop-blur-md z-40 gap-4">
                <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${isPunchedIn ? 'bg-green-600 animate-pulse' : 'bg-red-500'}`}></div>
                    <h1 className="text-xl font-bold tracking-tighter swiss-heading uppercase">
                        IFFCO Command Center <span className="text-gray-400">//</span> {tier} TIER
                    </h1>
                </div>

                <div className="flex items-center gap-6">
                    <button
                        onClick={togglePunch}
                        className={`
                            px-6 py-2 rounded-full font-bold uppercase tracking-widest text-xs transition-all flex items-center gap-2 shadow-lg
                            ${isPunchedIn
                                ? 'bg-red-500 hover:bg-red-600 text-white ring-4 ring-red-100'
                                : 'bg-green-600 hover:bg-green-700 text-white ring-4 ring-green-100 animate-bounce'}
                        `}
                    >
                        {isPunchedIn ? <><StopIcon /> Punch Out</> : <><PlayIcon /> Punch In</>}
                    </button>
                    
                    <div className="text-right hidden md:block">
                        <div className="font-bold text-sm uppercase tracking-wide">{user.name}</div>
                        <div className="text-[10px] text-gray-500 font-mono uppercase">
                            {user.grade} <span className="text-gray-300">|</span> {user.department} <span className="text-gray-300">|</span> {user.unit}
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="text-white bg-black hover:bg-gray-800 p-2 rounded-lg transition-all"
                        title="Logout"
                    >
                        <FaSignOutAlt />
                    </button>
                </div>
            </header>

            <div className={`max-w-7xl mx-auto p-6 md:p-8 space-y-8 transition-opacity duration-500 ${isPunchedIn ? 'opacity-100' : 'opacity-40 grayscale filter pointer-events-none'}`}>
                
                {/* 1. KEY METRICS GRID BASED ON TIER */}
                {tier === 'EXECUTIVE' && execSummary ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <StatCard label="Total Production (MT)" value={execSummary.aggregate.totalProduction} icon={<FaIndustry />} trend="+12.4% vs last week" />
                        <StatCard label="Safety Incident Index" value={`${execSummary.aggregate.safetyIndex}%`} icon={<FaExclamationTriangle />} trend="Target: >95.0%" />
                        <StatCard label="Carbon Footprint (tCO2e)" value={execSummary.aggregate.carbonFootprint} icon={<FaLeaf />} trend="-5.2% YoY reduction" />
                        <StatCard label="Active Work Orders" value={execSummary.aggregate.ticketStats.total} icon={<FaTools />} trend={`${execSummary.aggregate.ticketStats.pending} unresolved`} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <StatCard label="Unit Production Output" value={shiftLogs.length > 0 ? shiftLogs[0].ureaOutput + shiftLogs[0].ammoniaOutput : '0'} icon={<FaIndustry />} trend="From today's logs" />
                        <StatCard label="Plant Health Status" value={tickets.filter(t => t.status === 'pending').length === 0 ? 'Optimal' : 'Attention'} icon={<FaTools />} trend={`${tickets.filter(t => t.status === 'pending').length} Open Tickets`} />
                        <StatCard label="Unit Active Members" value={staff.length} icon={<FaUserTie />} trend="Production crew on shift" />
                        <StatCard label="System Visits" value={punchCount} icon={<FaUserCheck />} trend="Total workspace punches" />
                    </div>
                )}

                {/* 2. DYNAMIC WORKSPACE BODY CONTAINER */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    <div className="lg:col-span-2 space-y-8">
                        {/* CHART VISUALIZATIONS */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-bold uppercase tracking-widest text-sm flex items-center gap-2 mb-6">
                                <FaChartLine className="text-green-600" /> 
                                {tier === 'EXECUTIVE' ? 'Multi-Unit Comparative Analytics' : 'Unit Production History Trends'}
                            </h3>
                            
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    {tier === 'EXECUTIVE' ? (
                                        <BarChart data={execBarData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                            <YAxis axisLine={false} tickLine={false} />
                                            <Tooltip contentStyle={{ backgroundColor: '#000', color: '#fff', borderRadius: '8px' }} />
                                            <Legend />
                                            <Bar dataKey="urea" fill="#10B981" name="Urea Yield" />
                                            <Bar dataKey="dap" fill="#3B82F6" name="DAP Yield" />
                                            <Bar dataKey="ammonia" fill="#F59E0B" name="Ammonia Yield" />
                                        </BarChart>
                                    ) : (
                                        <AreaChart data={productionTrends}>
                                            <defs>
                                                <linearGradient id="colorUrea" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#059669" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                            <YAxis axisLine={false} tickLine={false} />
                                            <Tooltip contentStyle={{ backgroundColor: '#000', color: '#fff', borderRadius: '8px' }} />
                                            <Area type="monotone" dataKey="urea" stroke="#059669" fillOpacity={1} fill="url(#colorUrea)" name="Urea (MT)" />
                                        </AreaChart>
                                    )}
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* WORKFLOW PANELS ACCORDING TO TIER */}
                        
                        {/* A. OPERATIONAL TIER WORKFLOWS */}
                        {tier === 'OPERATIONAL' && (
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => setIsShiftModalOpen(true)}
                                        className="flex-1 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg"
                                    >
                                        <FaClipboardCheck /> Submit Shift Log
                                    </button>
                                    <button 
                                        onClick={() => setIsTicketModalOpen(true)}
                                        className="flex-1 py-4 bg-black hover:bg-gray-900 text-white rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg"
                                    >
                                        <FaTools /> File Safety Maintenance Ticket
                                    </button>
                                </div>

                                {/* Shift history list for workers */}
                                <div className="bg-white p-6 rounded-xl border border-gray-100">
                                    <h3 className="font-bold uppercase tracking-widest text-sm mb-4">My Submitted Logs</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs text-left">
                                            <thead>
                                                <tr className="text-gray-400 border-b border-gray-100 pb-2 uppercase font-bold">
                                                    <th className="py-2">Date</th>
                                                    <th>Ammonia (MT)</th>
                                                    <th>Urea (MT)</th>
                                                    <th>DAP (MT)</th>
                                                    <th>Steam (Bar)</th>
                                                    <th className="text-right">Approval Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {shiftLogs.map(l => (
                                                    <tr key={l._id} className="hover:bg-gray-50/50">
                                                        <td className="py-3 font-mono">{new Date(l.createdAt).toLocaleDateString()}</td>
                                                        <td>{l.ammoniaOutput}</td>
                                                        <td>{l.ureaOutput}</td>
                                                        <td>{l.dapOutput}</td>
                                                        <td>{l.steamPressure}</td>
                                                        <td className="text-right">
                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${l.verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                                {l.verified ? 'Verified' : 'Pending Review'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* B. MANAGERIAL TIER WORKFLOWS */}
                        {tier === 'MANAGERIAL' && (
                            <div className="space-y-6">
                                {/* Shift Log Approvals desk */}
                                <div className="bg-white p-6 rounded-xl border border-gray-100">
                                    <h3 className="font-bold uppercase tracking-widest text-sm mb-4 text-green-800">Pending Operations Log Desk</h3>
                                    <div className="space-y-4">
                                        {shiftLogs.filter(l => !l.verified).length === 0 ? (
                                            <div className="text-xs text-gray-500 italic py-2">No shift log variances pending review.</div>
                                        ) : (
                                            shiftLogs.filter(l => !l.verified).map(l => (
                                                <div key={l._id} className="p-4 bg-gray-50 rounded-xl flex justify-between items-center border border-gray-200">
                                                    <div className="text-xs space-y-1">
                                                        <div className="font-bold">Logged by {l.officer?.username || 'Operator'} ({l.officer?.empId || 'N/A'})</div>
                                                        <div className="text-gray-500 font-mono">
                                                            Urea: {l.ureaOutput} MT | DAP: {l.dapOutput} MT | Ammonia: {l.ammoniaOutput} MT
                                                        </div>
                                                        <div className="text-gray-400 font-mono">Steam: {l.steamPressure} Bar | Power: {l.powerDraw} kW</div>
                                                    </div>
                                                    <button 
                                                        onClick={() => handleVerifyLog(l._id)}
                                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1"
                                                    >
                                                        <FaCheck /> Verify
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Maintenance Ticket assignment */}
                                <div className="bg-white p-6 rounded-xl border border-gray-100">
                                    <h3 className="font-bold uppercase tracking-widest text-sm mb-4 text-blue-900">Safety & Maintenance dispatch console</h3>
                                    <div className="space-y-4">
                                        {tickets.filter(t => t.status !== 'approved').length === 0 ? (
                                            <div className="text-xs text-gray-500 italic py-2">All plant Floor safety requests resolved.</div>
                                        ) : (
                                            tickets.filter(t => t.status !== 'approved').map(t => (
                                                <div key={t._id} className="p-4 border rounded-xl space-y-3 bg-white">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                                                                t.status === 'pending' ? 'bg-red-100 text-red-700' :
                                                                t.status === 'assigned' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                                                            }`}>
                                                                {t.status}
                                                            </span>
                                                            <h4 className="font-bold text-sm mt-1">{t.equipment}</h4>
                                                        </div>
                                                        <span className="text-xs text-gray-400 font-mono">Raised by: {t.raisedBy?.username}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-600">{t.description}</p>
                                                    
                                                    {t.status === 'pending' && (
                                                        <div className="flex gap-2 items-center pt-2">
                                                            <select 
                                                                onChange={(e) => setAssigneeId(prev => ({ ...prev, [t._id]: e.target.value }))}
                                                                className="text-xs border rounded p-2 flex-1 focus:ring-1 focus:ring-blue-500"
                                                                defaultValue=""
                                                            >
                                                                <option value="" disabled>Select Maintenance Worker</option>
                                                                {staff.map(s => (
                                                                    <option key={s._id} value={s._id}>{s.username} ({s.department})</option>
                                                                ))}
                                                            </select>
                                                            <button 
                                                                onClick={() => handleAssignTicket(t._id)}
                                                                className="px-3 py-2 bg-blue-600 text-white rounded text-xs font-bold uppercase"
                                                            >
                                                                Assign
                                                            </button>
                                                        </div>
                                                    )}

                                                    {t.status === 'assigned' && (
                                                        <div className="flex gap-2 pt-2">
                                                            <input 
                                                                type="text" 
                                                                placeholder="Add dispatch/resolution notes"
                                                                className="text-xs border rounded p-2 flex-1"
                                                                onChange={(e) => setResolutionText(prev => ({ ...prev, [t._id]: e.target.value }))}
                                                            />
                                                            <button 
                                                                onClick={() => handleResolveTicket(t._id)}
                                                                className="px-3 py-2 bg-green-600 text-white rounded text-xs font-bold uppercase"
                                                            >
                                                                Resolve
                                                            </button>
                                                        </div>
                                                    )}

                                                    {t.status === 'resolved' && (
                                                        <div className="bg-green-50/50 p-2 rounded border border-green-200 flex justify-between items-center text-xs">
                                                            <div>
                                                                <span className="font-bold">Resolution Notes:</span> {t.dispatchNotes}
                                                            </div>
                                                            <button 
                                                                onClick={() => handleApproveTicket(t._id)}
                                                                className="px-3 py-1.5 bg-green-600 text-white rounded font-bold uppercase"
                                                            >
                                                                Approve
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* C. EXECUTIVE TIER WORKFLOWS */}
                        {tier === 'EXECUTIVE' && (
                            <div className="space-y-6">
                                {/* Capital expenditure approvals list */}
                                <div className="bg-white p-6 rounded-xl border border-gray-100">
                                    <h3 className="font-bold uppercase tracking-widest text-sm mb-4 text-purple-800">Executive CapEx Authorization Hub</h3>
                                    <div className="divide-y divide-gray-100">
                                        {capexRequests.map(c => (
                                            <div key={c.id} className="py-3 flex justify-between items-center">
                                                <div className="text-xs">
                                                    <div className="font-bold">{c.item}</div>
                                                    <div className="text-gray-500">Unit: {c.unit} | Budget: <span className="font-mono text-purple-600 font-bold">{c.amount}</span></div>
                                                </div>
                                                {c.status === 'pending' ? (
                                                    <button 
                                                        onClick={() => handleCapexApproval(c.id)}
                                                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider"
                                                    >
                                                        Approve CapEx
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-green-600 font-bold uppercase tracking-wider flex items-center gap-1">
                                                        <FaCheckCircle /> Authorized
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Cross unit dispatch system */}
                                <div className="bg-white p-6 rounded-xl border border-gray-100">
                                    <h3 className="font-bold uppercase tracking-widest text-sm mb-4">Consolidated Cooperative Dispatches</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 bg-gray-50 rounded-xl text-xs space-y-2 border border-gray-200">
                                            <div className="font-bold flex items-center gap-1"><FaBuilding className="text-green-600" /> Aonla Unit (UP)</div>
                                            <div>Status: Running, Normal</div>
                                            <div>Primary Output: Urea & Nano Urea</div>
                                            <div className="w-full bg-gray-200 h-1.5 rounded-full"><div className="bg-green-500 h-1.5 rounded-full w-[85%]"></div></div>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-xl text-xs space-y-2 border border-gray-200">
                                            <div className="font-bold flex items-center gap-1"><FaBuilding className="text-green-600" /> Paradip Unit (Odisha)</div>
                                            <div>Status: Heavy Load</div>
                                            <div>Primary Output: Phosphate Acid / DAP</div>
                                            <div className="w-full bg-gray-200 h-1.5 rounded-full"><div className="bg-orange-500 h-1.5 rounded-full w-[94%]"></div></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* RIGHT COLUMN - TERMINAL LOGS & USER DATA */}
                    <div className="space-y-8">
                        {/* Detail card */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                                <FaUserTie className="text-blue-600" /> Officer Session Metadata
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b pb-2 text-xs">
                                    <span className="uppercase text-gray-400 font-bold">Officer Name</span>
                                    <span className="font-bold text-gray-800">{user.name}</span>
                                </div>
                                <div className="flex justify-between items-center border-b pb-2 text-xs">
                                    <span className="uppercase text-gray-400 font-bold">Grade Designation</span>
                                    <span className="font-bold text-green-600">{user.grade}</span>
                                </div>
                                <div className="flex justify-between items-center border-b pb-2 text-xs">
                                    <span className="uppercase text-gray-400 font-bold">Plant Location</span>
                                    <span className="font-bold text-gray-800">{user.unit} Unit</span>
                                </div>
                                <div className="flex justify-between items-center border-b pb-2 text-xs">
                                    <span className="uppercase text-gray-400 font-bold">Department</span>
                                    <span className="font-bold text-gray-800">{user.department}</span>
                                </div>
                                <div className="flex justify-between items-center pb-2 text-xs">
                                    <span className="uppercase text-gray-400 font-bold">Official ID</span>
                                    <span className="font-mono text-gray-800 font-bold">{user.empId}</span>
                                </div>
                            </div>
                        </div>

                        {/* Operations Terminal Logs */}
                        <div className="bg-black text-green-400 p-6 rounded-xl shadow-lg border border-gray-800 font-mono text-xs h-[300px] overflow-hidden relative">
                            <div className="absolute top-4 right-4 text-gray-600 flex items-center gap-2">
                                {isPunchedIn ? (
                                    <><span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span> LOGS LIVE</>
                                ) : (
                                    <><span className="w-2 h-2 bg-red-500 rounded-full"></span> OFFLINE</>
                                )}
                            </div>
                            
                            <h3 className="font-bold uppercase tracking-widest mb-4 flex items-center gap-2 text-white">
                                <FaTerminal /> {isPunchedIn ? 'Command Terminal Log' : 'Terminal Paused'}
                            </h3>
                            
                            <div className="overflow-y-auto h-full pb-8 space-y-2 scrollbar-none">
                                {isPunchedIn ? logs.map((log, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="border-l-2 border-green-900 pl-3 py-1"
                                    >
                                        <span className="text-gray-500 mr-2">{log.split(']')[0]}]</span>
                                        <span className="text-green-300">{log.split(']')[1]}</span>
                                    </motion.div>
                                )) : (
                                    <div className="flex items-center justify-center h-full text-gray-600 italic">
                                        Waiting for officer punch-in to stream terminal actions...
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>

            </div>

            {/* MODALS */}
            
            {/* 1. Shift Log Submission Modal */}
            <AnimatePresence>
                {isShiftModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setIsShiftModalOpen(false)}
                    >
                        <motion.div 
                            initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-200 text-xs"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-lg font-bold mb-4 uppercase tracking-wider text-green-700 flex items-center gap-2">
                                <FaClipboardCheck /> Daily production log sheet
                            </h3>
                            <form onSubmit={handleShiftSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-gray-400 font-bold uppercase mb-1">Ammonia Output (MT)</label>
                                        <input 
                                            type="number" required placeholder="0"
                                            className="w-full border rounded p-2 focus:ring-1 focus:ring-green-500 focus:outline-none"
                                            value={shiftForm.ammoniaOutput}
                                            onChange={(e) => setShiftForm({ ...shiftForm, ammoniaOutput: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 font-bold uppercase mb-1">Urea Output (MT)</label>
                                        <input 
                                            type="number" required placeholder="0"
                                            className="w-full border rounded p-2 focus:ring-1 focus:ring-green-500 focus:outline-none"
                                            value={shiftForm.ureaOutput}
                                            onChange={(e) => setShiftForm({ ...shiftForm, ureaOutput: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-gray-400 font-bold uppercase mb-1">DAP Output (MT)</label>
                                        <input 
                                            type="number" required placeholder="0"
                                            className="w-full border rounded p-2 focus:ring-1 focus:ring-green-500 focus:outline-none"
                                            value={shiftForm.dapOutput}
                                            onChange={(e) => setShiftForm({ ...shiftForm, dapOutput: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 font-bold uppercase mb-1">Steam Pressure (Bar)</label>
                                        <input 
                                            type="number" required placeholder="0"
                                            className="w-full border rounded p-2 focus:ring-1 focus:ring-green-500 focus:outline-none"
                                            value={shiftForm.steamPressure}
                                            onChange={(e) => setShiftForm({ ...shiftForm, steamPressure: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 font-bold uppercase mb-1">Power Draw (kW)</label>
                                        <input 
                                            type="number" required placeholder="0"
                                            className="w-full border rounded p-2 focus:ring-1 focus:ring-green-500 focus:outline-none"
                                            value={shiftForm.powerDraw}
                                            onChange={(e) => setShiftForm({ ...shiftForm, powerDraw: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-400 font-bold uppercase mb-1">Shift Notes / Observations</label>
                                    <textarea 
                                        placeholder="Add production summaries, logs, machinery notes..."
                                        className="w-full border rounded p-2 h-20 resize-none focus:ring-1 focus:ring-green-500 focus:outline-none"
                                        value={shiftForm.notes}
                                        onChange={(e) => setShiftForm({ ...shiftForm, notes: e.target.value })}
                                    />
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <button 
                                        type="button" onClick={() => setIsShiftModalOpen(false)}
                                        className="px-4 py-2 border rounded hover:bg-gray-50 font-bold uppercase"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="px-5 py-2 bg-green-600 text-white rounded font-bold uppercase"
                                    >
                                        Submit Output
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 2. Raise Maintenance Ticket Modal */}
            <AnimatePresence>
                {isTicketModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setIsTicketModalOpen(false)}
                    >
                        <motion.div 
                            initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-200 text-xs"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-lg font-bold mb-4 uppercase tracking-wider text-blue-900 flex items-center gap-2">
                                <FaTools /> File Safety Maintenance request
                            </h3>
                            <form onSubmit={handleTicketSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-400 font-bold uppercase mb-1">Select Machinery / Plant Line Asset</label>
                                    <select 
                                        required 
                                        className="w-full border rounded p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                        value={ticketForm.equipment}
                                        onChange={(e) => setTicketForm({ ...ticketForm, equipment: e.target.value })}
                                    >
                                        <option value="" disabled>Select Equipment</option>
                                        <option value="Ammonia Line 1 Pump">Ammonia Line 1 Pump</option>
                                        <option value="Urea Conveyor Belt">Urea Conveyor Belt</option>
                                        <option value="Steam Boiler Boiler-A">Steam Boiler Boiler-A</option>
                                        <option value="Power Substation Transformer">Power Substation Transformer</option>
                                        <option value="DAP Packager Line 2">DAP Packager Line 2</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-400 font-bold uppercase mb-1">Details & Problem Description</label>
                                    <textarea 
                                        required
                                        placeholder="Describe the issue, leakage, mechanical failure, warnings..."
                                        className="w-full border rounded p-2 h-24 resize-none focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                        value={ticketForm.description}
                                        onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                                    />
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <button 
                                        type="button" onClick={() => setIsTicketModalOpen(false)}
                                        className="px-4 py-2 border rounded hover:bg-gray-50 font-bold uppercase"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="px-5 py-2 bg-blue-600 text-white rounded font-bold uppercase"
                                    >
                                        File Work Ticket
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Offline warning overlay */}
            {!isPunchedIn && (
                <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 bg-black/80 text-white px-6 py-3 rounded-full flex items-center gap-3 backdrop-blur-md shadow-2xl border border-white/10 animate-pulse cursor-not-allowed text-xs">
                    <FaStop className="text-red-500" /> Command operations paused. Please Punch In to view live data.
                </div>
            )}

        </div>
    );
};

// Sub-components
const StatCard = ({ label, value, icon, trend }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div className="text-gray-400 bg-gray-50 p-3 rounded-lg text-lg">{icon}</div>
            <div className="text-[10px] font-bold px-2 py-1 rounded-full bg-green-50 text-green-700">
                {trend}
            </div>
        </div>
        <div className="text-2xl font-bold mb-1 font-mono tracking-tight">{value}</div>
        <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{label}</div>
    </div>
);

// SVGs inline helpers
const PlayIcon = () => (
    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
);

const StopIcon = () => (
    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M6 19h12V5H6v14z"/></svg>
);

export default Dashboard;
