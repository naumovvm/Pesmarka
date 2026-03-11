import { db } from "../db/db";
import { artist, song } from "../db/schema";
import {and, eq} from "drizzle-orm";
import { getContext } from 'telefunc';
import { songSubmission } from '../db/schema';

export async function submitSong(data: {
    artistId?: number;
    artistName?: string;
    titleCyrillic: string;
    titleLatin: string;
    lyricsWithChords: string;
    difficulty: string;
    capoPosition: number;
    youtubeId?: string;
}) {
    const { user } = getContext();

    if (!user) throw new Error('You must be logged in to submit a song.');

    await db.insert(songSubmission).values({
        userId: user.id,
        artistId: data.artistId ?? null,
        artistName: data.artistName ?? null,
        titleCyrillic: data.titleCyrillic,
        titleLatin: data.titleLatin,
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

export async function getSongById(songId: number){
    return db.select().from(song).where(eq(song.id, songId)).limit(1);
}