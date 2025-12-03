import Lesson from "../models/LessonModel";
import { NotificationController } from "../controller/notification.controller";

/**
 * Check for upcoming meetings in the next 15 minutes and send notifications
 * This can be called periodically via a cron job or when users check their dashboard
 */
export async function notifyUpcomingMeetings() {
  try {
    const now = new Date();
    const fifteenMinutesFromNow = new Date(now.getTime() + 15 * 60 * 1000);

    // Get today's date in the format stored in lessons (e.g., "2025-12-03")
    const today = now.toISOString().split("T")[0];

    // Find lessons scheduled for today
    const todaysLessons = await Lesson.find({
      date: today,
      status: "scheduled",
      isPaid: true,
    })
      .populate("studentId", "_id name email")
      .populate("confirmedTutors.tutorId", "_id name email");

    const notificationPromises = [];

    for (const lesson of todaysLessons) {
      // Parse lesson time (assuming format like "10:00" or "14:30")
      const [hours, minutes] = lesson.time.split(":").map(Number);
      const lessonDateTime = new Date(now);
      lessonDateTime.setHours(hours, minutes, 0, 0);

      // Check if lesson is starting in the next 15 minutes
      if (lessonDateTime >= now && lessonDateTime <= fifteenMinutesFromNow) {
        // Notify student
        if (
          lesson.studentId &&
          typeof lesson.studentId === "object" &&
          "_id" in lesson.studentId
        ) {
          notificationPromises.push(
            NotificationController.createNotification({
              userId: lesson.studentId._id.toString(),
              type: "meeting_starting",
              title: "Meeting Starting Soon",
              message: `Your lesson "${lesson.topic}" starts in ${Math.round(
                (lessonDateTime.getTime() - now.getTime()) / 60000
              )} minutes`,
              lessonId: lesson._id.toString(),
            })
          );
        }

        // Notify confirmed tutors
        if (lesson.confirmedTutors && lesson.confirmedTutors.length > 0) {
          for (const confirmedTutor of lesson.confirmedTutors) {
            if (
              confirmedTutor.tutorId &&
              typeof confirmedTutor.tutorId === "object" &&
              "_id" in confirmedTutor.tutorId
            ) {
              notificationPromises.push(
                NotificationController.createNotification({
                  userId: confirmedTutor.tutorId._id.toString(),
                  type: "meeting_starting",
                  title: "Meeting Starting Soon",
                  message: `The lesson "${lesson.topic}" starts in ${Math.round(
                    (lessonDateTime.getTime() - now.getTime()) / 60000
                  )} minutes`,
                  lessonId: lesson._id.toString(),
                })
              );
            }
          }
        }
      }
    }

    await Promise.all(notificationPromises);
    console.log(
      `✅ Checked ${todaysLessons.length} lessons and sent ${notificationPromises.length} meeting reminders`
    );
  } catch (error) {
    console.error("Error in notifyUpcomingMeetings:", error);
  }
}

/**
 * Manually trigger meeting notifications check
 * Can be called via an API endpoint or cron job
 */
export async function checkAndNotifyUpcomingMeetings() {
  await notifyUpcomingMeetings();
}
