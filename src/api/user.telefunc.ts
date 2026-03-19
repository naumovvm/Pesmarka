import { db } from "../db/db";
import { user, songSubmission } from "../db/schema";
import { eq, desc } from "drizzle-orm";

export async function getUserDashboard(userId: number) {
    const [profile] = await db
        .select({
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
        })
        .from(user)
        .where(eq(user.id, userId))
        .limit(1);

    if (!profile) return null;

    const submissions = await db
        .select({
            id: songSubmission.id,
            title: songSubmission.title,
            artistName: songSubmission.artistName,
            youtubeId: songSubmission.youtubeId,
            status: songSubmission.status,
            adminComment: songSubmission.adminComment,
            createdAt: songSubmission.createdAt,
        })
        .from(songSubmission)
        .where(eq(songSubmission.userId, userId))
        .orderBy(desc(songSubmission.createdAt));

    const lastSubmit = submissions.length > 0 ? submissions[0].createdAt : null;

    return { profile, submissions, lastSubmit };
}

export async function getPendingSubmissions() {
    return db
        .select({
            id: songSubmission.id,
            title: songSubmission.title,
            artistName: songSubmission.artistName,
            youtubeId: songSubmission.youtubeId,
            status: songSubmission.status,
            createdAt: songSubmission.createdAt,
            submittedBy: user.username,
        })
        .from(songSubmission)
        .innerJoin(user, eq(songSubmission.userId, user.id))
        .where(eq(songSubmission.status, 'pending'))
        .orderBy(desc(songSubmission.createdAt));
}

export async function approveSubmission(submissionId: number) {
    await db.update(songSubmission)
        .set({ status: 'approved' })
        .where(eq(songSubmission.id, submissionId));
    return { success: true };
}

export async function rejectSubmission(submissionId: number, comment: string) {
    await db.update(songSubmission)
        .set({ status: 'rejected', adminComment: comment })
        .where(eq(songSubmission.id, submissionId));
    return { success: true };
}
