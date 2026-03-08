import {db} from "../../db/db.ts";
import {user} from "../../db/schema.ts";
import {eq} from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "change_this_secret";

export async function register(username: string, email: string, password: string) {
    const existing = await db.select().from(user)
        .where(eq(user.email, email)).limit(1);

    if (existing.length > 0) {
        return {success: false, message: "Email already in use"};
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [newUser] = await db.insert(user).values({
        username,
        email,
        passwordHash
    }).returning({
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin
    });


    const token = jwt.sign(
        {id: newUser.id, username: newUser.username},
        JWT_SECRET,
        {expiresIn: "7d"}
    );

    return {success: true, token, username: newUser.username, isAdmin: newUser.isAdmin};
}

export async function login(username: string, password: string) {
    const [found] = await db.select().from(user)
        .where(eq(user.username, username)).limit(1);

    if (!found) {
        return {success: false, message: "Invalid username or password"};
    }

    const valid = await bcrypt.compare(password, found.passwordHash);
    if (!valid) {
        return {success: false, message: "Invalid username or password"};
    }

    const token = jwt.sign(
        {id: found.id, username: found.username, isAdmin: found.isAdmin},
        JWT_SECRET,
        {expiresIn: '7d'}
    );

    return {success: true, token, username: found.username, isAdmin: found.isAdmin};
}
