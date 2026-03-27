CREATE TABLE "favorite" (
                            "id" serial PRIMARY KEY NOT NULL,
                            "user_id" integer NOT NULL,
                            "song_id" integer NOT NULL,
                            "created_at" timestamp DEFAULT now()
);