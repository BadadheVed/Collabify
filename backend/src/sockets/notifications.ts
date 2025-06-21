import { getIO } from "@/sockets";
import { db } from "@/DB_Client/db";
import { addDays } from "date-fns";
type NotificationType =
  | "USER_JOINED_TEAM"
  | "USER_LEFT_TEAM"
  | "PROJECT_CREATED"
  | "PROJECT_DELETED"
  | "DOCUMENT_CREATED"
  | "DOCUMENT_DELETED"
  | "TASK_ASSIGNED";

interface NotificationPayload {
  userName?: string;
  projectName?: string;
  documentTitle?: string;
  taskTitle?: string;
}
const io = getIO();
export const SendNotificationsToUser = async (
  userId: string,
  message: string
) => {
  try {
    // saving notification to the database
    await db.notification.create({
      data: {
        userId,
        message,
        expiresAt: addDays(new Date(), 7),
      },
    });

    io.to(userId).emit("new-notification", { message });
  } catch (error) {}
};
export const sendNotificationToTeam = async (
  teamId: string,
  message: string,
  excludeUserId?: string
) => {
  const teamMembers = await db.teamMember.findMany({
    where: {
      teamId: teamId,
      NOT: excludeUserId ? { userId: excludeUserId } : undefined,
    },

    select: { userId: true },
  });
  for (const member of teamMembers) {
    io.to(member.userId).emit("notification", message);
    await db.notification.create({
      data: {
        userId: member.userId,
        message,
        expiresAt: addDays(new Date(), 7),
      },
    });
  }
};

export const buildNotificationMessage = (
  type: NotificationType,
  payload: NotificationPayload
): string => {
  switch (type) {
    case "USER_JOINED_TEAM":
      return `${payload.userName} has joined the team.`;

    case "USER_LEFT_TEAM":
      return `${payload.userName} has left the team.`;

    case "PROJECT_CREATED":
      return `${payload.userName} created a new project: ${payload.projectName}.`;

    case "PROJECT_DELETED":
      return `${payload.userName} deleted the project: ${payload.projectName}.`;

    case "DOCUMENT_CREATED":
      return `${payload.userName} created a new document: ${payload.documentTitle}.`;

    case "DOCUMENT_DELETED":
      return `${payload.userName} deleted the document: ${payload.documentTitle}.`;

    case "TASK_ASSIGNED":
      return `You've been assigned a new task: ${payload.taskTitle}.`;

    default:
      return "You have a new notification.";
  }
};
