import { db } from "@/DB_Client/db";
import { buildNotificationMessage } from "./notificationPayload";
import { getIO } from "@/sockets";
import { addDays } from "date-fns";

// Remove this line - don't call getIO() at module level
// const io = getIO();

export const handleUserJoinTeam = async (teamId: string, userId: string) => {
  try {
    const io = getIO(); // Get IO instance when function is called

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return;

    const message = buildNotificationMessage("USER_JOINED_TEAM", {
      userName: user.name,
    });

    const members = await db.teamMember.findMany({
      where: {
        teamId,
        NOT: { userId },
      },
      select: { userId: true },
    });

    for (const member of members) {
      // Emit real-time notification
      io.to(member.userId).emit("notification", { message });

      // Save to DB
      await db.notification.create({
        data: {
          userId: member.userId,
          message,
          expiresAt: addDays(new Date(), 7),
        },
      });
    }
  } catch (error) {
    console.error("Error in User Joining Team Notification Part:", error);
  }
};

export const handleUserLeaveTeam = async (teamId: string, userId: string) => {
  try {
    const io = getIO(); // Get IO instance when function is called

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return;

    const message = buildNotificationMessage("USER_LEFT_TEAM", {
      userName: user.name,
    });

    const members = await db.teamMember.findMany({
      where: {
        teamId,
        NOT: { userId },
      },
      select: { userId: true },
    });

    for (const member of members) {
      io.to(member.userId).emit("notification", { message });

      await db.notification.create({
        data: {
          userId: member.userId,
          message,
          expiresAt: addDays(new Date(), 7),
        },
      });
    }
  } catch (error) {
    console.error("Error in User Leaving Team Notification Part:", error);
  }
};

export const handleProjectCreated = async (
  userId: string,
  teamId: string,
  Pjname: string
) => {
  // Pj name is the ProjectName
  try {
    const io = getIO(); // Get IO instance when function is called

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return;
    const message = buildNotificationMessage("PROJECT_CREATED", {
      userName: user.name,
      projectName: Pjname,
    });
    const members = await db.teamMember.findMany({
      where: {
        teamId,
        NOT: { userId },
      },
      select: { userId: true },
    });
    for (const member of members) {
      io.to(member.userId).emit("notification", { message });

      await db.notification.create({
        data: {
          userId: member.userId,
          message,
          expiresAt: addDays(new Date(), 7),
        },
      });
    }
  } catch (error) {
    console.error("Error in creating project Notification Part:", error);
  }
};

export const handleProjectDeleted = async (
  userId: string,
  teamId: string,
  Pjname: string
) => {
  try {
    const io = getIO(); // Get IO instance when function is called

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return;
    const message = buildNotificationMessage("PROJECT_DELETED", {
      userName: user.name,
      projectName: Pjname,
    });
    const members = await db.teamMember.findMany({
      where: {
        teamId,
        NOT: { userId },
      },
      select: { userId: true },
    });
    for (const member of members) {
      io.to(member.userId).emit("notification", { message });

      await db.notification.create({
        data: {
          userId: member.userId,
          message,
          expiresAt: addDays(new Date(), 7),
        },
      });
    }
  } catch (error) {
    console.error("Error in deleting project Notification Part:", error);
  }
};

export const handleDocumentCreated = async (
  userId: string,
  teamId: string,
  DocTitle: string
) => {
  try {
    const io = getIO(); // Get IO instance when function is called

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return;
    const message = buildNotificationMessage("DOCUMENT_CREATED", {
      userName: user.name,
      documentTitle: DocTitle,
    });
    const members = await db.teamMember.findMany({
      where: {
        teamId,
        NOT: { userId },
      },
      select: { userId: true },
    });
    for (const member of members) {
      io.to(member.userId).emit("notification", { message });

      await db.notification.create({
        data: {
          userId: member.userId,
          message,
          expiresAt: addDays(new Date(), 7),
        },
      });
    }
  } catch (error) {
    console.error("Error in Creating Document Notification Part:", error);
  }
};

export const handleDocumentDeleted = async (
  userId: string,
  teamId: string,
  DocTitle: string
) => {
  try {
    const io = getIO(); // Get IO instance when function is called

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return;
    const message = buildNotificationMessage("DOCUMENT_DELETED", {
      userName: user.name,
      documentTitle: DocTitle,
    });
    const members = await db.teamMember.findMany({
      where: {
        teamId,
        NOT: { userId },
      },
      select: { userId: true },
    });
    for (const member of members) {
      io.to(member.userId).emit("notification", { message });

      await db.notification.create({
        data: {
          userId: member.userId,
          message,
          expiresAt: addDays(new Date(), 7),
        },
      });
    }
  } catch (error) {
    console.error("Error in Deleting Document Notification Part:", error);
  }
};

export const TaskAssigned = async (userId: string, taskTitle: string) => {
  try {
    const io = getIO(); // Get IO instance when function is called

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return;
    const message = buildNotificationMessage("TASK_ASSIGNED", {
      taskTitle: taskTitle,
    });

    io.to(user.id).emit("notification", message);
    await db.notification.create({
      data: {
        userId: user.id,
        message: message,
        expiresAt: addDays(new Date(), 7),
      },
    });
  } catch (error) {
    console.error("Error in Task AssignmentNotification Part:", error);
  }
};
