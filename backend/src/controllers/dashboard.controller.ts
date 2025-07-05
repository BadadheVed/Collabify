import { db } from "@/DB_Client/db";
import { Request, Response, RequestHandler } from "express";

// export const DashBoard = async (req: Request, res: Response) => {
//   try {
//     const userId = req.user?.id;
//     if (!userId) {
//       res.status(401).json({ success: false, message: "Unauthorized" });
//       return;
//     }
//     const now = new Date();
//     const thisWeek = new Date();
//     thisWeek.setDate(now.getDate() - now.getDay());
//     const todayStart = new Date();
//     todayStart.setHours(0, 0, 0, 0);

//     const thisMonth = new Date();
//     thisMonth.setDate(1);
//     const userProjects = await db.project.findMany({
//       where: {
//         team: {
//           members: {
//             some: { userId },
//           },
//         },
//       },
//       select: { id: true },
//     });
//     const projectIds = userProjects.map((p) => p.id);
//     const [
//       totalProjects,
//       newProjectsThisWeek,
//       totalMembers,
//       newMembersThisMonth,
//       totalDocuments,
//       newDocumentsToday,
//       totalTeams,
//       recentProjects,
//       allActivities,
//     ] = await Promise.all([
//       // Total projects user is involved in
//       db.project.count({
//         where: { team: { members: { some: { userId } } } },
//       }),

//       // Projects created this week
//       db.project.count({
//         where: { createdAt: { gte: thisWeek } },
//       }),

//       // Total team members in teams the user is part of
//       db.teamMember.count({
//         where: { team: { members: { some: { userId } } } },
//       }),

//       // New team members this month
//       db.teamMember.count({
//         where: { joinedAt: { gte: thisMonth } },
//       }),

//       // Total documents owned by user
//       db.document.count({
//         where: { ownerId: userId },
//       }),

//       // New documents created today by user
//       db.document.count({
//         where: {
//           createdAt: { gte: todayStart },
//           ownerId: userId,
//         },
//       }),

//       // Total teams user is in
//       db.team.count({
//         where: { members: { some: { userId } } },
//       }),

//       // Recent 3 projects user is involved in
//       db.project.findMany({
//         where: { team: { members: { some: { userId } } } },
//         take: 3,
//         orderBy: { createdAt: "desc" },
//         include: {
//           team: {
//             include: {
//               members: true,
//             },
//           },
//         },
//       }),

//       // Recent 5 activity logs in projects where user is a team member
//       await db.activityLog.findMany({
//         where: {
//           projectId: {
//             in: projectIds,
//           },
//         },
//         orderBy: {
//           createdAt: "desc",
//         },
//         include: {
//           actor: true,
//           project: true,
//         },
//       }),
//     ]);
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//     return;
//   }
// };

// export const Projects = async (req: Request, res: Response) => {
//   try {
//     const userId = req.user?.id;
//     if (!userId) {
//       res.status(401).json({
//         success: false,
//         message: "Unauthorized",
//       });
//       return;
//     }
//     const projects = await db.project.findMany({
//       where: {
//         team: {
//           members: {
//             some: {
//               userId,
//             },
//           },
//         },
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//       include: {
//         team: {
//           select: {
//             name: true,
//             members: {
//               select: { id: true }, // just to count
//             },
//           },
//         },
//       },
//     });
//     const formattedProjects = projects.map((project) => ({
//       id: project.id,
//       name: project.name,
//       description: project.description,

//       // "active", "urgent", etc.
//       //dueDate: formatDate(project.dueDate),
//       teamName: project.team.name,
//       membersCount: project.team.members.length,
//     }));
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//     return;
//   }
// };

export const getMyTeams = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const teams = await db.team.findMany({
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
  } catch (err) {
    console.error("Error fetching teams:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserTeamsSummary = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const teams = await db.team.findMany({
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
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
