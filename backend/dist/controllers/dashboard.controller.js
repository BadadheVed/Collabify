"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserTeamsSummary = exports.getMyTeams = exports.getTileData = void 0;
const db_1 = require("@/DB_Client/db");
const getTileData = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const userData = await db_1.db.user.findUnique({
            where: { id: userId },
            select: {
                name: true,
                email: true,
                _count: {
                    select: {
                        ProjectMember: true,
                        teams: true,
                        documents: true,
                    },
                },
                teams: {
                    select: {
                        teamId: true,
                        team: {
                            select: {
                                _count: {
                                    select: { members: true, documents: true },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!userData) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // Flatten the counts
        const totalTeamMembers = userData.teams.reduce((acc, tm) => acc + tm.team._count.members, 0);
        const totalTeamDocuments = userData.teams.reduce((acc, tm) => acc + tm.team._count.documents, 0);
        res.status(200).json({
            name: userData.name,
            email: userData.email,
            projects: userData._count.ProjectMember,
            teams: userData._count.teams,
            teamMembers: totalTeamMembers,
            documents: totalTeamDocuments,
        });
        return;
    }
    catch (error) {
        console.error("getTileData error:", error);
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
};
exports.getTileData = getTileData;
const getMyTeams = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const teams = await db_1.db.team.findMany({
            where: {
                members: {
                    some: { userId },
                },
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });
        const formatted = teams.map((team) => {
            const currentUser = team.members.find((m) => m.userId === userId);
            return {
                teamId: team.id,
                teamName: team.name,
                currentUserRole: currentUser?.role ?? "MEMBER", // default fallback
                members: team.members.map((member) => ({
                    name: member.user.name,
                    role: member.role,
                })),
            };
        });
        res.status(200).json({
            success: true,
            teams: formatted,
        });
        return;
    }
    catch (err) {
        console.error("Error fetching teams:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getMyTeams = getMyTeams;
const getUserTeamsSummary = async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        return res.status(401).json({ message: "Unauthorized" });
    try {
        const teams = await db_1.db.team.findMany({
            where: {
                members: {
                    some: { userId },
                },
            },
            include: {
                members: {
                    select: { id: true }, // just for counting
                },
            },
        });
        const result = teams.map((team) => ({
            id: team.id,
            name: team.name,
            membersCount: team.members.length,
        }));
        res.status(200).json({ success: true, teams: result });
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getUserTeamsSummary = getUserTeamsSummary;
