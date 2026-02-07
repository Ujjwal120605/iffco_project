
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import {
    FaIndustry, FaBoxes, FaShippingFast, FaCheckCircle,
    FaChartLine, FaClipboardCheck, FaSyncAlt, FaCalendarAlt,
    FaArrowRight, FaArrowUp, FaSignOutAlt, FaWind, FaTemperatureHigh, FaCloudRain, FaTerminal, FaMapMarkerAlt, FaUserTie, FaPlay, FaStop, FaClock, FaCalendarDay, FaUserClock, FaPlaneDeparture
} from 'react-icons/fa';

// Mock Data for Charts
const PRODUCTION_DATA = [
    { name: 'Jan', urea: 4000, dap: 2400 },
    { name: 'Feb', urea: 3000, dap: 1398 },
    { name: 'Mar', urea: 2000, dap: 9800 },
    { name: 'Apr', urea: 2780, dap: 3908 },
    { name: 'May', urea: 1890, dap: 4800 },
    { name: 'Jun', urea: 2390, dap: 3800 },
    { name: 'Jul', urea: 3490, dap: 4300 },
];

const PIE_DATA = [
    { name: 'Nano Urea', value: 400 },
    { name: 'Nano DAP', value: 300 },
    { name: 'NPK', value: 300 },
    { name: 'Bio-Fertilizer', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const UNITS = ["Aonla", "Phulpur", "Paradip", "Kandla", "Kalol"];
const GRADES = ["Worker", "Assistant Manager", "Deputy Manager", "Manager", "Senior Manager", "Chief Manager", "DGM", "JGM", "GM", "Unit Head"];

const ROSTER_DATA = [
    { day: "Mon", date: "Feb 09", shift: "General", time: "09:00 - 17:30", note: "Weekly Review" },
    { day: "Tue", date: "Feb 10", shift: "Shift A", time: "06:00 - 14:00", note: "Plant Visit" },
    { day: "Wed", date: "Feb 11", shift: "Shift A", time: "06:00 - 14:00", note: "" },
    { day: "Thu", date: "Feb 12", shift: "Shift B", time: "14:00 - 22:00", note: "Team Meeting" },
    { day: "Fri", date: "Feb 13", shift: "Shift B", time: "14:00 - 22:00", note: "" },
    { day: "Sat", date: "Feb 14", shift: "OFF", time: "-", note: "Weekly Off" },
    { day: "Sun", date: "Feb 15", shift: "OFF", time: "-", note: "Weekly Off" },
];

const Dashboard = () => {
    const navigate = useNavigate();

    // User State
    const [user, setUser] = useState({ name: 'Ujjwal Bajpai', role: 'IT Internal', unit: 'Aonla', grade: 'Manager' }); // Default fallback

    // Modal State
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [isRosterModalOpen, setIsRosterModalOpen] = useState(false);
    const [reportText, setReportText] = useState("");
    const [reportSubmitted, setReportSubmitted] = useState(false);

    // Punch Logic
    const [isPunchedIn, setIsPunchedIn] = useState(false);
    const [punchCount, setPunchCount] = useState(0);
    const [lastRefresh, setLastRefresh] = useState(new Date().toLocaleTimeString());

    // Dashboard State
    const [stats, setStats] = useState({ production: 0, inventory: 0, deliveries: 0, quality: 0 });
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        // Load User Data
        const storedUser = localStorage.getItem('user');
        const storedPunchStatus = localStorage.getItem('isPunchedIn') === 'true';
        const storedPunchCount = parseInt(localStorage.getItem('punchCount') || '0');

        setPunchCount(storedPunchCount);
        setIsPunchedIn(storedPunchStatus);

        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                // Use parsed user data, defaulting name if missing
                setUser({
                    ...parsedUser,
                    name: parsedUser.name || parsedUser.username || 'Ujjwal Bajpai',
                    unit: parsedUser.unit || 'Aonla',
                    grade: parsedUser.grade || 'Manager'
                });
            } catch (e) {
                console.error("Error parsing user data", e);
            }
        }

        const newCount = storedPunchCount + 1;
        setPunchCount(newCount);
        localStorage.setItem('punchCount', newCount.toString());

    }, []);

    const togglePunch = () => {
        const newStatus = !isPunchedIn;
        setIsPunchedIn(newStatus);
        localStorage.setItem('isPunchedIn', newStatus.toString());

        const timestamp = new Date().toLocaleTimeString();
        const action = newStatus ? "USER PUNCHED IN - SYSTEM ACTIVE" : "USER PUNCHED OUT - SYSTEM IDLE";
        setLogs(prev => [`[${timestamp}] ⚠️ ${action}`, ...prev]);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleSync = () => {
        window.location.reload();
    };

    const handleSubmitReport = (e) => {
        e.preventDefault();
        setReportSubmitted(true);
        setTimeout(() => {
            setReportSubmitted(false);
            setIsReportModalOpen(false);
            setReportText("");
            setLogs(prev => [`[${new Date().toLocaleTimeString()}] ✅ REPORT SUBMITTED: ${user.name}`, ...prev]);
        }, 1500);
    };

    const handleApplyLeave = (date) => {
        alert(`Leave request for ${date} sent to HR!`);
    };

    return (
        <div className="min-h-screen bg-gray-50 text-black font-sans selection:bg-black selection:text-white relative">

            {/* Report Modal */}

            {/* Report Modal */}
            <AnimatePresence>
                {isReportModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setIsReportModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                            className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 border border-gray-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <FaClipboardCheck className="text-green-600" /> Submit Shift Report
                            </h2>
                            {!reportSubmitted ? (
                                <form onSubmit={handleSubmitReport} className="space-y-4">
                                    <textarea
                                        className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-gray-50 resize-none font-mono text-sm"
                                        placeholder="Enter production notes, issues, or observations..."
                                        value={reportText}
                                        onChange={(e) => setReportText(e.target.value)}
                                        required
                                    />
                                    <div className="flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsReportModalOpen(false)}
                                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-sm"
                                        >
                                            Submit Report
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="text-center py-8 text-green-600 animate-pulse">
                                    <FaCheckCircle className="mx-auto text-4xl mb-2" />
                                    <p className="font-bold">Report Submitted Successfully!</p>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Roster Modal */}
            <AnimatePresence>
                {isRosterModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setIsRosterModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-6 border border-gray-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2 uppercase tracking-wide">
                                    <FaCalendarAlt className="text-orange-600" /> Duty Roster <span className="text-gray-400 text-sm font-normal normal-case">// Week 07</span>
                                </h2>
                                <button onClick={() => setIsRosterModalOpen(false)} className="text-gray-400 hover:text-black font-bold">CLOSE</button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
                                        <tr>
                                            <th className="px-4 py-3">Day</th>
                                            <th className="px-4 py-3">Date</th>
                                            <th className="px-4 py-3">Shift</th>
                                            <th className="px-4 py-3">Timings</th>
                                            <th className="px-4 py-3">Notes</th>
                                            <th className="px-4 py-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {ROSTER_DATA.map((row, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 font-bold">{row.day}</td>
                                                <td className="px-4 py-3 text-gray-600">{row.date}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${row.shift === 'OFF' ? 'bg-red-100 text-red-600' :
                                                        row.shift === 'General' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                                                        }`}>
                                                        {row.shift}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 font-mono text-gray-500">{row.time}</td>
                                                <td className="px-4 py-3 text-gray-500 italic">{row.note || '-'}</td>
                                                <td className="px-4 py-3 text-right">
                                                    {row.shift !== 'OFF' ? (
                                                        <button
                                                            onClick={() => handleApplyLeave(row.date)}
                                                            className="text-xs text-red-500 hover:text-red-700 font-bold uppercase border border-red-200 px-2 py-1 rounded hover:bg-red-50"
                                                        >
                                                            Request Leave
                                                        </button>
                                                    ) : (
                                                        <span className="text-xs text-gray-300 font-bold uppercase">OFF DAY</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                                <div>
                                    <span className="font-bold text-black">Team on Shift:</span> Rajeev K. (Sup), Anita P. (Ops), +4 others
                                </div>
                                <div className="flex gap-2">
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span> Active</span>
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-full"></span> General</span>
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded-full"></span> Off</span>
                                </div>
                            </div>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <header className="px-6 md:px-12 py-4 border-b border-black flex flex-col md:flex-row justify-between items-center sticky top-0 bg-white/90 backdrop-blur-md z-40 gap-4">
                <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${isPunchedIn ? 'bg-green-600 animate-pulse' : 'bg-red-500'}`}></div>
                    <h1 className="text-xl font-bold tracking-tighter swiss-heading uppercase">
                        IFFCO <span className="text-gray-400">//</span> {isPunchedIn ? 'ONLINE' : 'OFFLINE'}
                    </h1>
                </div>

                {/* Punch Button & Stats */}
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end text-right">
                        <span className="text-[10px] uppercase font-bold text-gray-400">Total Visits</span>
                        <span className="font-mono font-bold text-lg leading-none">{punchCount}</span>
                    </div>

                    <button
                        onClick={togglePunch}
                        className={`
                            px-6 py-2 rounded-full font-bold uppercase tracking-widest text-xs transition-all flex items-center gap-2 shadow-lg
                            ${isPunchedIn
                                ? 'bg-red-500 hover:bg-red-600 text-white ring-4 ring-red-100'
                                : 'bg-green-600 hover:bg-green-700 text-white ring-4 ring-green-100 animate-bounce'}
                        `}
                    >
                        {isPunchedIn ? <><FaStop /> Punch Out</> : <><FaPlay /> Punch In (Ready)</>}
                    </button>
                </div>

                <div className="flex items-center gap-4 border-l pl-4 border-gray-200">
                    <div className="text-right hidden md:block">
                        <div className="font-bold text-sm uppercase tracking-wide">{user.name}</div>
                        <div className="text-[10px] text-gray-500 font-mono uppercase flex items-center justify-end gap-1">
                            {user.grade} <span className="text-gray-300">|</span> {user.unit}
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

            <div className={`max-w-7xl mx-auto p-6 md:p-8 space-y-8 transition-opacity duration-500 ${isPunchedIn ? 'opacity-100' : 'opacity-50 grayscale filter'}`}>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatBox label="Production (MT)" value={Math.floor(stats.production).toLocaleString()} trend="+8.2%" icon={<FaIndustry />} />
                    <StatBox label="Inventory (%)" value={stats.inventory.toFixed(1)} trend="+3.1%" icon={<FaBoxes />} />
                    <StatBox label="Deliveries" value={Math.floor(stats.deliveries).toLocaleString()} trend="0.0%" icon={<FaShippingFast />} />
                    <StatBox label="Quality Score" value={stats.quality.toFixed(1)} trend="+1.2%" icon={<FaCheckCircle />} />
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Charts */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                                    <FaChartLine className="text-green-600" /> Production Trends
                                </h3>
                                <div className="text-xs font-mono text-gray-400">UNIT: {user.unit ? user.unit.toUpperCase() : 'N/A'}</div>
                            </div>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={PRODUCTION_DATA}>
                                        <defs>
                                            <linearGradient id="colorUrea" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#059669" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                                        <Tooltip contentStyle={{ backgroundColor: '#000', color: '#fff', borderRadius: '8px', border: 'none' }} />
                                        <Area type="monotone" dataKey="urea" stroke="#059669" fillOpacity={1} fill="url(#colorUrea)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Terminal - Active only when punched in */}
                        <div className="bg-black text-green-400 p-6 rounded-xl shadow-lg border border-gray-800 font-mono text-xs h-64 overflow-hidden relative">
                            <div className="absolute top-4 right-4 text-gray-600 flex items-center gap-2">
                                {isPunchedIn ? (
                                    <><span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span> LIVE TERMINAL</>
                                ) : (
                                    <><span className="w-2 h-2 bg-red-500 rounded-full"></span> OFFLINE</>
                                )}
                            </div>
                            <h3 className="font-bold uppercase tracking-widest mb-4 flex items-center gap-2 text-white">
                                <FaTerminal /> {isPunchedIn ? 'System Operations Log' : 'Terminal Paused'}
                            </h3>
                            <div className="overflow-y-auto h-full pb-8 space-y-2 scrollbar-none">
                                {isPunchedIn ? logs.map((log, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="border-l-2 border-green-900 pl-3 py-1"
                                    >
                                        <span className="text-gray-500 mr-2">{log.split(']')[0]}]</span>
                                        <span className="text-green-300">{log.split(']')[1]}</span>
                                    </motion.div>
                                )) : (
                                    <div className="flex items-center justify-center h-full text-gray-600 italic">
                                        Waiting for user punch-in...
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Widgets - Unit Info */}
                    <div className="space-y-8">
                        {/* User Details Widget */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                                <FaUserTie className="text-blue-600" /> Officer Details
                            </h3>
                            <div className="space-y-4">
                                <DetailRow label="Name" value={user.name} />
                                <DetailRow label="Designation" value={user.grade} highlight />
                                <DetailRow label="Unit Location" value={user.unit} />
                                <DetailRow label="Employee ID" value="IFF-8392" />
                            </div>
                        </div>

                        {/* Quick Actions Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <ActionCard
                                icon={<FaClipboardCheck />}
                                title="Add Report"
                                color="text-purple-600"
                                onClick={() => setIsReportModalOpen(true)}
                            />
                            <ActionCard
                                icon={<FaSyncAlt />}
                                title="Sync Data"
                                color="text-blue-600"
                                onClick={handleSync}
                            />
                            <ActionCard
                                icon={<FaCalendarAlt />}
                                title="My Roster"
                                color="text-orange-600"
                                onClick={() => setIsRosterModalOpen(true)}
                            />
                            <ActionCard icon={<FaArrowRight />} title="Settings" color="text-gray-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay when offline */}
            {!isPunchedIn && (
                <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 bg-black/80 text-white px-6 py-3 rounded-full flex items-center gap-3 backdrop-blur-md shadow-2xl border border-white/10 animate-pulse cursor-not-allowed">
                    <FaStop className="text-red-500" /> System is Idle. Please Punch In to view live data.
                </div>
            )}

        </div>
    );
};

const StatBox = ({ label, value, trend, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div className="text-gray-400 bg-gray-50 p-3 rounded-lg">{icon}</div>
            <div className={`text-xs font-bold px-2 py-1 rounded-full ${trend.includes('+') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                {trend}
            </div>
        </div>
        <div className="text-3xl font-bold mb-1 font-mono tracking-tight">{value}</div>
        <div className="text-xs uppercase tracking-widest text-gray-400">{label}</div>
    </div>
);

const ActionCard = ({ icon, title, color, onClick }) => (
    <button
        onClick={onClick}
        className="bg-white p-4 rounded-xl border border-gray-100 hover:border-blue-500 hover:shadow-md transition-all flex flex-col items-center justify-center gap-2 group"
    >
        <div className={`text-2xl ${color} group-hover:scale-110 transition-transform`}>{icon}</div>
        <span className="font-bold uppercase text-[10px] tracking-widest text-gray-600 group-hover:text-black">{title}</span>
    </button>
);

const DetailRow = ({ label, value, highlight }) => (
    <div className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0 last:pb-0">
        <span className="text-xs uppercase font-bold text-gray-400">{label}</span>
        <span className={`text-sm font-medium ${highlight ? 'text-green-600 font-bold' : 'text-gray-800'}`}>{value || '-'}</span>
    </div>
);

export default Dashboard;
