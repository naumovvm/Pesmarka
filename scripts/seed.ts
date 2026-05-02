import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import {db} from '../src/db/db.ts';
import {user} from '../src/db/schema.ts';

const ADMIN_USERNAME = 'admin';
const ADMIN_EMAIL = 'admin@pesmarka.com';
const ADMIN_PASSWORD = 'admin123';

async function seed() {
    console.log('🌱 Seeding admin user...');

    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

    await db.insert(user).values({
        username: ADMIN_USERNAME,
        email: ADMIN_EMAIL,
        passwordHash: passwordHash,
        isAdmin: true,
    }).onConflictDoNothing();

    console.log('✅ Admin user created!');
    console.log(`   Username: ${ADMIN_USERNAME}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);

    process.exit(0);
}

seed().catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});