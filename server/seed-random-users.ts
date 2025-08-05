import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { db } from "./db";
import { users, roles } from "@shared/schema";
import { eq } from "drizzle-orm";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function seedRandomUsers() {
  try {
    console.log("Seeding random user accounts...");

    // Get role IDs for assignment
    const [userRole] = await db.select().from(roles).where(eq(roles.name, "user"));

    if (!userRole) {
      console.log("⚠️ User role not found.");
      return;
    }

    const randomUsers = Array.from({ length: 5 }, (_, index) => ({
      username: `randomuser${index + 1}`,
      email: `randomuser${index + 1}@example.com`,
      password: `randompass${index + 1}`,
      isAdmin: false,
      isSuperAdmin: false,
      roleId: userRole.id,
      role: "User"
    }));

    for (const userData of randomUsers) {
      const hashedPassword = await hashPassword(userData.password);

      await db.insert(users).values({
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        isAdmin: userData.isAdmin,
        isSuperAdmin: userData.isSuperAdmin,
        roleId: userData.roleId
      });

      console.log(`✓ Created random user account: ${userData.username}`);
    }

    console.log("\n🎉 Random user accounts created successfully!");
  } catch (error) {
    console.error("Error seeding random users:", error);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedRandomUsers().then(() => {
    console.log("Random user seeding completed!");
    process.exit(0);
  }).catch((error) => {
    console.error("Random user seeding failed:", error);
    process.exit(1);
  });
}

export { seedRandomUsers };
