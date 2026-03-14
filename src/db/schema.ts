import {pgTable, serial, varchar, text, integer, timestamp, boolean} from "drizzle-orm/pg-core";

export const artist = pgTable('artist', {
    id: serial('id').primaryKey(),
    // nameCyrillic: varchar('name_cyrillic', {length: 256}).notNull(),
    // nameLatin: varchar('name_latin', {length: 256}).notNull(),
    name: varchar('name', {length: 256}).notNull(),
    letter: varchar ('letter', {length: 2}).notNull(),
    category: varchar('category', { length: 50 }).notNull(),
    bio: text('bio'),
    createdAt: timestamp('created_at').defaultNow()
});

export const song = pgTable('song', {
    id: serial('id').primaryKey(),
    artistId: integer('artist_id').notNull().references(() => artist.id).notNull(),
    // titleCyrillic: varchar('title_cyrillic', {length: 256}).notNull(),
    // titleLatin: varchar('title_latin', {length: 256}).notNull(),
    title: varchar('title', {length: 256}).notNull(),
    lyricsWithChords: text('lyrics_with_chords').notNull(),
    difficulty: varchar('difficulty', {length: 20}).notNull(), // beginner, intermediate, advanced
    capoPosition: integer('capo_position').default(0),
    originalKey: varchar('original_key', {length: 10}),
    youtubeId: varchar('youtube_id', {length: 50}),
    createdAt: timestamp('created_at').defaultNow(),
    uploadedBy: integer('uploaded_by').references(() => user.id),
});

export const user = pgTable('user', {
    id: serial('id').primaryKey(),
    username: varchar('username', {length: 50}).notNull().unique(),
    email: varchar('email', {length: 256}).notNull().unique(),
    passwordHash: varchar('password_hash', {length: 255}).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    isAdmin: boolean('is_admin').notNull().default(false),
})

export const songSubmission = pgTable('song_submission', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => user.id),
    artistId: integer('artist_id').references(() => artist.id),
    artistName: varchar('artist_name', { length: 256 }),
    // titleCyrillic: varchar('title_cyrillic', { length: 256 }).notNull(),
    // titleLatin: varchar('title_latin', { length: 256 }).notNull(),
    title: varchar('title', { length: 256 }).notNull(),
    lyricsWithChords: text('lyrics_with_chords').notNull(),
    status: varchar('status', { length: 20 }).notNull().default('pending'), // pending | approved | rejected
    adminComment: text('admin_comment'),
    createdAt: timestamp('created_at').defaultNow(),
    youtubeId: varchar('youtube_id', {length: 50}),
    difficulty: varchar('difficulty', {length: 20}).notNull(),
    capoPosition: integer('capo_position').default(0),
});

// to do: remove both title types and maybe stick to just one title? no clue why i needed both in the first place
// consult with claude