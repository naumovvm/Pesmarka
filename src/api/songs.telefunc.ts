import { db } from "../db/db";
import { artist, song } from "../db/schema";
import {and, eq} from "drizzle-orm";

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