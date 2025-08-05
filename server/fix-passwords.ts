import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function fixUserPasswords() {
  console.log("🔧 Fixing user passwords...");

  const usersToFix = [
    { username: "admin", password: "admin123" },
    { username: "manager", password: "manager123" },
    { username: "customer1", password: "customer123" },
    { username: "customer2", password: "customer123" },
    { username: "customer3", password: "customer123" },
    { username: "testuser", password: "test123" },
    { username: "demo", password: "demo123" },
    { username: "john_doe", password: "john123" },
    { username: "sarah_wilson", password: "sarah123" },
    { username: "mike_johnson", password: "mike123" },
    { username: "emma_brown", password: "emma123" },
    { username: "david_smith", password: "david123" },
    { username: "lisa_garcia", password: "lisa123" },
    { username: "alex_taylor", password: "alex123" },
    { username: "maria_lopez", password: "maria123" }
  ];

  for (const userData of usersToFix) {
    try {
      const hashedPassword = await hashPassword(userData.password);
      
      await db
        .update(users)
        .set({ password: hashedPassword })
        .where(eq(users.username, userData.username));
      
      console.log(`✅ Fixed password for: ${userData.username}`);
    } catch (error) {
      console.error(`❌ Failed to fix password for ${userData.username}:`, error);
    }
  }

  console.log("🎉 Password fixing completed!");
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  fixUserPasswords().then(() => {
    console.log("Password fixing completed!");
    process.exit(0);
  }).catch((error) => {
    console.error("Password fixing failed:", error);
    process.exit(1);
  });
}

export { fixUserPasswords };
