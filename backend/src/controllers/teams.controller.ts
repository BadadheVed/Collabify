// ✅ Corrected Controller Functions for Team & Project Management
import { db } from "@/DB_Client/db";
import { Request, Response } from "express";
import { nanoid } from "nanoid";
import { RequestHandler } from "express";
export const CreateTeam: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const { name, projectId } = req.body;

    if (!name || !userId) {
      res.status(400).json({ message: "Team name and user required." });
      return;
    }

    const team = await db.team.create({
      data: {
        name,
        createdBy: userId,
        members: {
          create: {
            userId,
            role: "ADMIN",
          },
        },
        projectId,
      },
    });

    res.status(201).json({
      success: true,
      message: `Team created successfully`,
      teamId: team.id,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

export const InviteByLink: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { teamId, role } = req.body;
    const invitedById = req.user?.id;

    if (!invitedById) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const token = nanoid();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invite = await db.invite.create({
      data: {
        token,
        teamId,
        role,
        invitedById,
        expiresAt,
        used: false,
      },
    });

    const inviteLink = `${process.env.FRONTEND_URL}/join-team/${token}`;
    res.status(201).json({
      success: true,
      message: "Invite link created successfully",
      inviteLink,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};

export const ValidateInvite: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { token } = req.params;
  try {
    const invite = await db.invite.findUnique({
      where: { token },
      include: { team: true },
    });

    if (!invite || invite.used || new Date(invite.expiresAt) < new Date()) {
      res.status(400).json({ message: "Invalid or expired invite" });
      return;
    }

    res.status(200).json({
      success: true,
      teamName: invite.team.name,
      role: invite.role,
      token: invite.token,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};

export const AcceptInvite: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { token } = req.params;
  const { isAccepting } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: "Login To Continue Joining",
    });
    return;
  }

  try {
    const invite = await db.invite.findUnique({
      where: { token },
      include: {
        team: {
          include: {
            project: true, // 🟢 Needed to get projectId
          },
        },
      },
    });

    if (!invite || invite.used || new Date(invite.expiresAt) < new Date()) {
      res.status(410).json({ message: "Invite expired or used" });
      return;
    }

    if (!isAccepting) {
      res
        .status(200)
        .json({ message: `Invite to ${invite.team.name} rejected` });
      return;
    }

    // 🟢 Add to TeamMember
    await db.teamMember.create({
      data: {
        userId,
        teamId: invite.teamId,
        role: invite.role,
      },
    });

    // 🟢 Add to ProjectMember if not already present
    await db.projectMember.upsert({
      where: {
        userId_projectId: {
          userId,
          projectId: invite.team.project.id, // 🟢 Get from team.project
        },
      },
      update: {}, // No update needed if already present
      create: {
        userId,
        projectId: invite.team.project.id,
        role: "MEMBER",
      },
    });

    // 🟢 Mark invite as used
    await db.invite.update({
      where: { token },
      data: {
        used: true,
        invitedUserId: userId,
      },
    });

    res.status(200).json({
      success: true,
      message: `You've joined the team "${invite.team.name}"`,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};

export const CreateProject: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, description } = req.body;
    const userId = req.user?.id;

    if (!userId || !name) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    // ✅ Create the project with the current user as creator
    const project = await db.project.create({
      data: {
        name,
        description,
        createdById: userId,
      },
    });

    // ✅ Add the creator as ADMIN in projectMember table
    await db.projectMember.create({
      data: {
        userId,
        projectId: project.id,
        role: "ADMIN", // assuming Role is enum
      },
    });

    res.status(201).json({ success: true, project });
    return;
  } catch (error) {
    console.error("CreateProject Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

export const getAllMyProjects: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    console.log("Fetching projects for user:", userId);

    // Step 1: Get all team memberships for the user
    const teamMemberships = await db.teamMember.findMany({
      where: { userId },
      include: {
        team: {
          include: {
            project: {
              include: {
                createdBy: {
                  select: { name: true },
                },
              },
            },
          },
        },
      },
    });

    console.log(
      `Found ${teamMemberships.length} team memberships for user ${userId}`
    );

    // Step 2: Get any direct project memberships (for admin roles, etc.)
    const directProjectMemberships = await db.projectMember.findMany({
      where: { userId },
      select: {
        projectId: true,
        role: true,
      },
    });

    console.log(
      `Found ${directProjectMemberships.length} direct project memberships`
    );

    // Create a map of projectId -> role for direct memberships
    const directRoleMap = new Map<string, string>();
    for (const membership of directProjectMemberships) {
      directRoleMap.set(membership.projectId, membership.role);
    }

    // Step 3: Process team memberships and build project list
    const projectMap = new Map<string, any>();

    for (const teamMembership of teamMemberships) {
      const team = teamMembership.team;
      const project = team.project;

      if (project) {
        console.log(`Processing project: ${project.name} (ID: ${project.id})`);

        // Determine the user's role in this project
        // Priority: Direct ProjectMember role > TeamMember role
        const directRole = directRoleMap.get(project.id);
        const effectiveRole = directRole || teamMembership.role;

        // Only add if not already processed (avoid duplicates if user is in multiple teams of same project)
        if (!projectMap.has(project.id)) {
          projectMap.set(project.id, {
            id: project.id,
            name: project.name,
            description: project.description,
            createdAt: project.createdAt,
            createdBy: project.createdBy.name,
            role: effectiveRole,
            team: {
              id: team.id,
              name: team.name,
            },
          });
        }
      } else {
        console.log(`Team ${team.name} has no associated project`);
      }
    }

    // Step 4: Handle any direct project memberships that weren't covered by team memberships
    for (const directMembership of directProjectMemberships) {
      if (!projectMap.has(directMembership.projectId)) {
        // This user has direct project access but no team membership
        const project = await db.project.findUnique({
          where: { id: directMembership.projectId },
          include: {
            createdBy: {
              select: { name: true },
            },
            teams: {
              take: 1, // Get first team for display purposes
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

        if (project) {
          const firstTeam = project.teams[0] || {
            id: "direct-access",
            name: "Direct Access",
          };

          projectMap.set(project.id, {
            id: project.id,
            name: project.name,
            description: project.description,
            createdAt: project.createdAt,
            createdBy: project.createdBy.name,
            role: directMembership.role,
            team: {
              id: firstTeam.id,
              name: firstTeam.name,
            },
          });
        }
      }
    }

    const projects = Array.from(projectMap.values());

    console.log(`Returning ${projects.length} projects for user ${userId}`);
    console.log(
      "Projects:",
      projects.map((p) => ({ id: p.id, name: p.name, role: p.role }))
    );

    res.status(200).json({ success: true, projects });
    return;
  } catch (err) {
    console.error("Error fetching user projects:", err);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export const deleteProject: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { projectId } = req.params;

    if (!userId || !projectId) {
      res.status(400).json({ message: "Missing projectId or unauthorized" });
      return;
    }

    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        teams: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    const authorizedTeamMember = await db.teamMember.findFirst({
      where: {
        userId,
        teamId: {
          in: project.teams.map((team) => team.id),
        },
        role: {
          in: ["ADMIN", "MANAGER"],
        },
      },
    });

    if (!authorizedTeamMember) {
      res
        .status(403)
        .json({ message: "Not authorized to delete this project" });
      return;
    }

    await db.project.delete({
      where: { id: projectId },
    });

    res.status(200).json({ success: true, message: "Project deleted" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getTeamMembers = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { teamId } = req.params;

  if (!userId || !teamId) {
    res.status(400).json({ success: false, message: "Invalid request" });
    return;
  }

  try {
    // Check if the requesting user is a member of the team
    const isMember = await db.teamMember.findFirst({
      where: { userId, teamId },
    });

    if (!isMember) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to view this team",
      });
      return;
    }

    const members = await db.teamMember.findMany({
      where: { teamId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const formatted = members.map((member) => ({
      id: member.user.id,
      name: member.user.name,
      email: member.user.email,
      role: member.role,
    }));

    res.status(200).json({ success: true, members: formatted });
    return;
  } catch (error) {
    console.error("Error fetching team members:", error);
    res.status(500).json({ success: false, message: "Server error" });
    return;
  }
};

export const getUserTeams = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  try {
    const teams = await db.teamMember.findMany({
      where: { userId },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            createdAt: true,
          },
        },
      },
    });

    const formatted = teams.map((tm) => ({
      teamId: tm.team.id,
      teamName: tm.team.name,
      joinedAt: tm.joinedAt,
      role: tm.role,
    }));

    res.status(200).json({ success: true, teams: formatted });
    return;
  } catch (error) {
    console.error("Error fetching user teams:", error);
    res.status(500).json({ success: false, message: "Server error" });
    return;
  }
};

export const getAdminTeams = async (req: Request, res: Response) => {
  try {
    // Get the user ID from the request (assuming it's from authentication middleware)
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        error: "Unauthorized - User ID not found",
      });
      return;
    }

    // Get teams where the user is ADMIN or MANAGER - only return id and name
    const adminTeams = await db.team.findMany({
      where: {
        members: {
          some: {
            userId: userId,
            role: {
              in: ["ADMIN", "MANAGER"],
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const FinaladminTeams = adminTeams.map((team) => ({
      id: team.id,
      name: team.name,
      projectId: team.project.id,
      projectName: team.project.name,
    }));

    res.status(200).json({
      success: true,
      teams: FinaladminTeams,
      count: adminTeams.length,
    });
    return;
  } catch (error: any) {
    console.error("Error fetching admin teams:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
    return;
  }
};

export const getAdminProjects = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized - User ID not found" });
      return;
    }

    const projects = await db.project.findMany({
      where: {
        ProjectMember: {
          some: {
            userId,
            role: {
              in: ["ADMIN", "MANAGER"],
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    res.status(200).json({
      success: true,
      projects,
    });
    return;
  } catch (error) {
    console.error("Error fetching admin projects:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};
