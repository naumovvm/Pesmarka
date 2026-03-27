import { db } from "../db/db";
import { artist, song, user as userTable, songSubmission } from "../db/schema";
import {and, eq, desc} from "drizzle-orm";
import { getContext } from 'telefunc';
import { favorite } from '../db/schema';

export async function submitSong(data: {
    artistId?: number;
    artistName?: string;
    title: string;
    lyricsWithChords: string;
    difficulty: string;
    capoPosition: number;
    youtubeId?: string;
})
 {
    const { user } = getContext() as { user: { id: number; username: string; isAdmin: boolean } | null };

    if (!user) throw new Error('You must be logged in to submit a song.');

    await db.insert(songSubmission).values({
        userId: user.id,
        artistId: data.artistId ?? null,
        artistName: data.artistName ?? null,
        title: data.title,
        lyricsWithChords: data.lyricsWithChords,
        difficulty: data.difficulty,
        capoPosition: data.capoPosition,
        youtubeId: data.youtubeId ?? null,
        status: 'pending',
    });

    return { success: true };
}

export async function getAllArtists(){
    return db.select().from(artist);
}

export async function getArtistsByLetter(letter: string, category: string){
    return db.select().from(artist)
        .where(
            and(
                eq(artist.letter, letter),
                eq(artist.category, category)
            )
        );
}

export async function getSongsByArtist(artistId: number){
    return db.select().from(song).where(eq(song.artistId, artistId));
}

export async function getPendingSubmissions() {
    const { user } = getContext() as { user: { id: number; isAdmin: boolean } | null };
    if (!user?.isAdmin) throw new Error('Not allowed.');

    return db
        .select({
            id: songSubmission.id,
            title: songSubmission.title,
            artistId: songSubmission.artistId,
            artistName: songSubmission.artistName,
            difficulty: songSubmission.difficulty,
            capoPosition: songSubmission.capoPosition,
            lyricsWithChords: songSubmission.lyricsWithChords,
            youtubeId: songSubmission.youtubeId,
            createdAt: songSubmission.createdAt,
            submittedBy: userTable.username,
        })
        .from(songSubmission)
        .leftJoin(userTable, eq(userTable.id, songSubmission.userId))
        .where(eq(songSubmission.status, 'pending'))
        .orderBy(desc(songSubmission.createdAt));
}

export async function approveSubmission(id: number, overrideArtistId?: number) {
    const { user } = getContext() as { user: { id: number; isAdmin: boolean } | null };
    if (!user?.isAdmin) throw new Error('Not allowed.');

    const [submission] = await db
        .select()
        .from(songSubmission)
        .where(eq(songSubmission.id, id))
        .limit(1);

    if (!submission) throw new Error('Submission not found.');

    const artistId = overrideArtistId ?? submission.artistId;
    if (!artistId) throw new Error('No artist assigned — select one from the dropdown first.');

    await db.transaction(async (tx) => {
        await tx.insert(song).values({
            artistId,
            title: submission.title,
            lyricsWithChords: submission.lyricsWithChords,
            difficulty: submission.difficulty,
            capoPosition: submission.capoPosition ?? 0,
            youtubeId: submission.youtubeId ?? null,
            uploadedBy: submission.userId,
        });

        await tx.update(songSubmission)
            .set({ status: 'approved', artistId })
            .where(eq(songSubmission.id, id));
    });

    return { success: true };
}

export async function rejectSubmission(id: number, comment?: string) {
    const { user } = getContext() as { user: { id: number; isAdmin: boolean } | null };
    if (!user?.isAdmin) throw new Error('Not allowed.');

    await db
        .update(songSubmission)
        .set({ status: 'rejected', adminComment: comment ?? null })
        .where(eq(songSubmission.id, id));

    return { success: true };
}

export async function addArtist(data: {
    name: string;
    letter: string;
    category: string;
    bio?: string;
}) {
    const { user } = getContext() as { user: { id: number; isAdmin: boolean } | null };
    if (!user?.isAdmin) throw new Error('Not allowed.');

    await db.insert(artist).values({
        name: data.name,
        letter: data.letter,
        category: data.category,
        bio: data.bio ?? null,
    });

    return { success: true };
}

export async function onGetSong(songId: number) {
    const result = await db
        .select({
            id: song.id,
            title: song.title,
            lyricsWithChords: song.lyricsWithChords,
            difficulty: song.difficulty,
            capoPosition: song.capoPosition,
            originalKey: song.originalKey,
            youtubeId: song.youtubeId,
            artistName: artist.name,
            artistId: artist.id,
        })
        .from(song)
        .innerJoin(artist, eq(song.artistId, artist.id))
        .where(eq(song.id, songId))
        .limit(1);

    return result[0] ?? null;
}

export async function getLatestSongs(category: 'balkan' | 'foreign') {
    return db.select({
        id: song.id,
        title: song.title,
        artistName: artist.name,
        createdAt: song.createdAt,
        artistCategory: artist.category,
    })
    .from(song)
    .innerJoin(artist, eq(song.artistId, artist.id))
    .where(eq(artist.category, category))
    .orderBy(desc(song.createdAt))
    .limit(10);
}

export async function toggleFavorite(songId: number) {
    const { user } = getContext() as { user: { id: number } | null };
    if (!user) throw new Error('Must be logged in.');

    const existing = await db
        .select()
        .from(favorite)
        .where(and(eq(favorite.userId, user.id), eq(favorite.songId, songId)))
        .limit(1);

    if (existing.length > 0) {
        await db.delete(favorite)
            .where(and(eq(favorite.userId, user.id), eq(favorite.songId, songId)));
        return { favorited: false };
    } else {
        await db.insert(favorite).values({ userId: user.id, songId });
        return { favorited: true };
    }
}

export async function isFavorited(songId: number) {
    const { user } = getContext() as { user: { id: number } | null };
    if (!user) return false;

    const existing = await db
        .select()
        .from(favorite)
        .where(and(eq(favorite.userId, user.id), eq(favorite.songId, songId)))
        .limit(1);

    return existing.length > 0;
}

export async function getFavorites() {
    const { user } = getContext() as { user: { id: number } | null };
    if (!user) throw new Error('Must be logged in.');

    return db
        .select({
            id: song.id,
            title: song.title,
            artistName: artist.name,
            createdAt: favorite.createdAt,
        })
        .from(favorite)
        .innerJoin(song, eq(favorite.songId, song.id))
        .innerJoin(artist, eq(song.artistId, artist.id))
        .where(eq(favorite.userId, user.id))
        .orderBy(desc(favorite.createdAt));
}

export async function fetchApprovedSongs() {
    const { user } = getContext() as { user: { id: number; isAdmin: boolean } | null };
    if (!user?.isAdmin) throw new Error('Not allowed.');

    return db
        .select({
            id: song.id,
            title: song.title,
            difficulty: song.difficulty,
            capoPosition: song.capoPosition,
            originalKey: song.originalKey,
            youtubeId: song.youtubeId,
            lyricsWithChords: song.lyricsWithChords,
            artistId: song.artistId,
            artistName: artist.name,
        })
        .from(song)
        .innerJoin(artist, eq(song.artistId, artist.id))
        .orderBy(song.title);
}

export async function updateSong(id: number, data: {
    title: string;
    lyricsWithChords: string;
    difficulty: string;
    capoPosition: number;
    originalKey: string | null;
    youtubeId: string | null;
}) {
    const { user } = getContext() as { user: { id: number; isAdmin: boolean } | null };
    if (!user?.isAdmin) throw new Error('Not allowed.');

    await db.update(song)
        .set(data)
        .where(eq(song.id, id));

    return { success: true };
}

