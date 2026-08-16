const express = require('express');
const router = express.Router();
const { authenticate, requireTier } = require('../middleware/rbac');
const ShiftLog = require('../models/ShiftLog');
const MaintenanceTicket = require('../models/MaintenanceTicket');
const User = require('../models/User');

// ==========================================
// SHIFT LOG ROUTES
// ==========================================

// @route   POST api/operations/shift-log
// @desc    Submit a daily shift log
// @access  Private (Operational Tier & above)
router.post('/shift-log', authenticate, requireTier('OPERATIONAL'), async (req, res) => {
    const { ammoniaOutput, ureaOutput, dapOutput, steamPressure, powerDraw, notes } = req.body;

    try {
        const newLog = new ShiftLog({
            officer: req.user.id,
            unit: req.user.unit,
            department: req.user.department || 'Production',
            ammoniaOutput: Number(ammoniaOutput) || 0,
            ureaOutput: Number(ureaOutput) || 0,
            dapOutput: Number(dapOutput) || 0,
            steamPressure: Number(steamPressure) || 0,
            powerDraw: Number(powerDraw) || 0,
            notes: notes || '',
            verified: false
        });

        const log = await newLog.save();
        res.json(log);
    } catch (err) {
        console.error('Error saving shift log:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/operations/shift-logs
// @desc    Get shift logs based on user access
// @access  Private (All authenticated)
router.get('/shift-logs', authenticate, async (req, res) => {
    try {
        let logs;
        
        if (req.tierLevel === 3) {
            // Executive: See all logs in the cooperative
            logs = await ShiftLog.find()
                .populate('officer', 'username email grade unit department empId')
                .sort({ createdAt: -1 });
        } else if (req.tierLevel === 2) {
            // Managerial: See logs within their specific unit
            logs = await ShiftLog.find({ unit: req.user.unit })
                .populate('officer', 'username email grade unit department empId')
                .sort({ createdAt: -1 });
        } else {
            // Operational: See only their own logs
            logs = await ShiftLog.find({ officer: req.user.id })
                .populate('officer', 'username email grade unit department empId')
                .sort({ createdAt: -1 });
        }

        res.json(logs);
    } catch (err) {
        console.error('Error fetching shift logs:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/operations/shift-log/:id/verify
// @desc    Verify/Approve a shift log
// @access  Private (Managerial Tier & above)
router.put('/shift-log/:id/verify', authenticate, requireTier('MANAGERIAL'), async (req, res) => {
    try {
        let log = await ShiftLog.findById(req.params.id);
        if (!log) {
            return res.status(404).json({ msg: 'Shift log not found' });
        }

        // Managers can only verify logs in their unit
        if (req.tierLevel === 2 && log.unit !== req.user.unit) {
            return res.status(403).json({ msg: 'Not authorized to verify logs outside your unit' });
        }

        log.verified = true;
        log.verifiedBy = req.user.id;
        await log.save();

        // Populate details and return
        log = await ShiftLog.findById(req.params.id)
            .populate('officer', 'username email grade unit department empId')
            .populate('verifiedBy', 'username grade');

        res.json(log);
    } catch (err) {
        console.error('Error verifying shift log:', err.message);
        res.status(500).send('Server Error');
    }
});


// ==========================================
// MAINTENANCE TICKET ROUTES
// ==========================================

// @route   POST api/operations/ticket
// @desc    Raise a maintenance ticket
// @access  Private (Operational Tier & above)
router.post('/ticket', authenticate, requireTier('OPERATIONAL'), async (req, res) => {
    const { equipment, description } = req.body;

    try {
        const newTicket = new MaintenanceTicket({
            raisedBy: req.user.id,
            unit: req.user.unit,
            department: req.user.department || 'Electrical',
            equipment,
            description,
            status: 'pending'
        });

        const ticket = await newTicket.save();
        res.json(ticket);
    } catch (err) {
        console.error('Error saving ticket:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/operations/tickets
// @desc    Get maintenance tickets based on user tier
// @access  Private
router.get('/tickets', authenticate, async (req, res) => {
    try {
        let tickets;

        if (req.tierLevel === 3) {
            // Executive: See all tickets
            tickets = await MaintenanceTicket.find()
                .populate('raisedBy', 'username grade department empId')
                .populate('assignedTo', 'username grade department empId')
                .sort({ createdAt: -1 });
        } else if (req.tierLevel === 2) {
            // Managerial: See all tickets in their unit
            tickets = await MaintenanceTicket.find({ unit: req.user.unit })
                .populate('raisedBy', 'username grade department empId')
                .populate('assignedTo', 'username grade department empId')
                .sort({ createdAt: -1 });
        } else {
            // Operational: See tickets raised by or assigned to them
            tickets = await MaintenanceTicket.find({
                $or: [
                    { raisedBy: req.user.id },
                    { assignedTo: req.user.id }
                ]
            })
                .populate('raisedBy', 'username grade department empId')
                .populate('assignedTo', 'username grade department empId')
                .sort({ createdAt: -1 });
        }

        res.json(tickets);
    } catch (err) {
        console.error('Error fetching tickets:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/operations/ticket/:id/assign
// @desc    Assign ticket to a worker
// @access  Private (Managerial & above)
router.put('/ticket/:id/assign', authenticate, requireTier('MANAGERIAL'), async (req, res) => {
    const { assignedTo } = req.body;

    try {
        let ticket = await MaintenanceTicket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ msg: 'Ticket not found' });
        }

        // Authorize unit
        if (req.tierLevel === 2 && ticket.unit !== req.user.unit) {
            return res.status(403).json({ msg: 'Not authorized for this unit' });
        }

        ticket.assignedTo = assignedTo;
        ticket.status = 'assigned';
        await ticket.save();

        ticket = await MaintenanceTicket.findById(req.params.id)
            .populate('raisedBy', 'username grade department empId')
            .populate('assignedTo', 'username grade department empId');

        res.json(ticket);
    } catch (err) {
        console.error('Error assigning ticket:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/operations/ticket/:id/resolve
// @desc    Submit resolution notes (Operational assigned to it, or Managerial)
// @access  Private
router.put('/ticket/:id/resolve', authenticate, async (req, res) => {
    const { dispatchNotes } = req.body;

    try {
        let ticket = await MaintenanceTicket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ msg: 'Ticket not found' });
        }

        // Authorization check: Only assigned user or a supervisor in the same unit can resolve
        const isAssigned = ticket.assignedTo && ticket.assignedTo.toString() === req.user.id;
        const isSupervisor = req.tierLevel >= 2 && ticket.unit === req.user.unit;

        if (!isAssigned && !isSupervisor) {
            return res.status(403).json({ msg: 'Not authorized to resolve this ticket' });
        }

        ticket.dispatchNotes = dispatchNotes || 'Resolved during shift';
        ticket.status = 'resolved';
        await ticket.save();

        ticket = await MaintenanceTicket.findById(req.params.id)
            .populate('raisedBy', 'username grade department empId')
            .populate('assignedTo', 'username grade department empId');

        res.json(ticket);
    } catch (err) {
        console.error('Error resolving ticket:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/operations/ticket/:id/approve
// @desc    Approve resolved ticket
// @access  Private (Managerial & above)
router.put('/ticket/:id/approve', authenticate, requireTier('MANAGERIAL'), async (req, res) => {
    try {
        let ticket = await MaintenanceTicket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ msg: 'Ticket not found' });
        }

        // Unit check
        if (req.tierLevel === 2 && ticket.unit !== req.user.unit) {
            return res.status(403).json({ msg: 'Not authorized for this unit' });
        }

        ticket.status = 'approved';
        await ticket.save();

        ticket = await MaintenanceTicket.findById(req.params.id)
            .populate('raisedBy', 'username grade department empId')
            .populate('assignedTo', 'username grade department empId');

        res.json(ticket);
    } catch (err) {
        console.error('Error approving ticket:', err.message);
        res.status(500).send('Server Error');
    }
});


// ==========================================
// UTILITY & ANALYTICS ROUTES
// ==========================================

// @route   GET api/operations/staff
// @desc    Get operational staff in the unit (for ticket assignment)
// @access  Private (Managerial & above)
router.get('/staff', authenticate, requireTier('MANAGERIAL'), async (req, res) => {
    try {
        // Find users in same unit whose grade is Operational
        const staff = await User.find({
            unit: req.user.unit,
            grade: { $in: ['Worker', 'Assistant Manager'] }
        }).select('username email grade department empId');

        res.json(staff);
    } catch (err) {
        console.error('Error fetching staff list:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/operations/executive-summary
// @desc    Get aggregated company KPIs for Executive command center
// @access  Private (Executive Tier Only)
router.get('/executive-summary', authenticate, requireTier('EXECUTIVE'), async (req, res) => {
    try {
        // Collect production logs
        const logs = await ShiftLog.find();
        
        // Sum total output metrics
        let totalAmmonia = 0;
        let totalUrea = 0;
        let totalDap = 0;
        let totalPower = 0;

        // Breakdown by unit
        const unitStats = {
            'Aonla': { ammonia: 0, urea: 0, dap: 0, count: 0 },
            'Phulpur': { ammonia: 0, urea: 0, dap: 0, count: 0 },
            'Kalol': { ammonia: 0, urea: 0, dap: 0, count: 0 },
            'Kandla': { ammonia: 0, urea: 0, dap: 0, count: 0 },
            'Paradip': { ammonia: 0, urea: 0, dap: 0, count: 0 }
        };

        logs.forEach(log => {
            totalAmmonia += log.ammoniaOutput;
            totalUrea += log.ureaOutput;
            totalDap += log.dapOutput;
            totalPower += log.powerDraw;

            if (unitStats[log.unit]) {
                unitStats[log.unit].ammonia += log.ammoniaOutput;
                unitStats[log.unit].urea += log.ureaOutput;
                unitStats[log.unit].dap += log.dapOutput;
                unitStats[log.unit].count += 1;
            }
        });

        // Collect all ticket statistics
        const tickets = await MaintenanceTicket.find();
        const totalTickets = tickets.length;
        const pendingTickets = tickets.filter(t => t.status === 'pending').length;
        const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;
        const approvedTickets = tickets.filter(t => t.status === 'approved').length;

        // Mock Safety Incident Index: Calculated dynamically from unresolved tickets / department indicators
        // A clean record is 100%, each pending ticket takes down 1.5%
        const safetyIndex = Math.max(70, 100 - (pendingTickets * 1.5)).toFixed(1);

        // Carbon Footprint: Mock calculation based on steam pressure + power draw from real production data
        // Conventional MT production is converted to metric tons of CO2 equivalents
        const carbonFootprint = Math.max(120, (totalPower * 0.45) + (totalAmmonia * 0.85) + (totalUrea * 0.35)).toFixed(1);

        res.json({
            aggregate: {
                totalProduction: totalAmmonia + totalUrea + totalDap,
                ammonia: totalAmmonia,
                urea: totalUrea,
                dap: totalDap,
                power: totalPower,
                safetyIndex: parseFloat(safetyIndex),
                carbonFootprint: parseFloat(carbonFootprint),
                ticketStats: {
                    total: totalTickets,
                    pending: pendingTickets,
                    resolved: resolvedTickets,
                    approved: approvedTickets
                }
            },
            unitBreakdown: unitStats
        });
    } catch (err) {
        console.error('Error calculating executive summary:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
