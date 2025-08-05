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

async function seedUsers() {
  try {
    console.log("Seeding predefined user accounts...");

    // Get all existing users
    const existingUsers = await db.select({ username: users.username }).from(users);
    const existingUsernames = existingUsers.map(u => u.username);
    
    console.log(`Found ${existingUsers.length} existing users: ${existingUsernames.join(", ")}`);
    
    // We'll create users that don't exist

    // Get role IDs for assignment
    const [superAdminRole] = await db.select().from(roles).where(eq(roles.name, "super_admin"));
    const [adminRole] = await db.select().from(roles).where(eq(roles.name, "admin"));
    const [userRole] = await db.select().from(roles).where(eq(roles.name, "user"));

    if (!superAdminRole || !adminRole || !userRole) {
      console.log("⚠️  Roles not found. Seeding permissions first...");
      // Roles should be created by seedPermissions function
      return;
    }

    const predefinedUsers = [
      {
        username: "admin",
        email: "admin@bayg.com",
        password: "admin123",
        isAdmin: true,
        isSuperAdmin: true,
        roleId: superAdminRole.id,
        role: "Super Admin"
      },
      {
        username: "manager",
        email: "manager@bayg.com",
        password: "manager123",
        isAdmin: true,
        isSuperAdmin: false,
        roleId: adminRole.id,
        role: "Admin"
      },
      {
        username: "customer1",
        email: "customer1@example.com", 
        password: "customer123",
        isAdmin: false,
        isSuperAdmin: false,
        roleId: userRole.id,
        role: "User"
      },
      {
        username: "customer2",
        email: "customer2@example.com",
        password: "customer123", 
        isAdmin: false,
        isSuperAdmin: false,
        roleId: userRole.id,
        role: "User"
      },
      {
        username: "customer3",
        email: "customer3@example.com",
        password: "customer123",
        isAdmin: false,
        isSuperAdmin: false,
        roleId: userRole.id,
        role: "User"
      },
      {
        username: "testuser",
        email: "test@example.com",
        password: "test123",
        isAdmin: false,
        isSuperAdmin: false,
        roleId: userRole.id,
        role: "User"
      },
      {
        username: "demo",
        email: "demo@innovanceorbit.com",
        password: "demo123",
        isAdmin: false,
        isSuperAdmin: false,
        roleId: userRole.id,
        role: "User"
      },
      // Random users for testing
      {
        username: "john_doe",
        email: "john.doe@example.com",
        password: "john123",
        isAdmin: false,
        isSuperAdmin: false,
        roleId: userRole.id,
        role: "User"
      },
      {
        username: "sarah_wilson",
        email: "sarah.wilson@example.com",
        password: "sarah123",
        isAdmin: false,
        isSuperAdmin: false,
        roleId: userRole.id,
        role: "User"
      },
      {
        username: "mike_johnson",
        email: "mike.johnson@example.com",
        password: "mike123",
        isAdmin: false,
        isSuperAdmin: false,
        roleId: userRole.id,
        role: "User"
      },
      {
        username: "emma_brown",
        email: "emma.brown@example.com",
        password: "emma123",
        isAdmin: false,
        isSuperAdmin: false,
        roleId: userRole.id,
        role: "User"
      },
      {
        username: "david_smith",
        email: "david.smith@example.com",
        password: "david123",
        isAdmin: false,
        isSuperAdmin: false,
        roleId: userRole.id,
        role: "User"
      },
      {
        username: "lisa_garcia",
        email: "lisa.garcia@example.com",
        password: "lisa123",
        isAdmin: false,
        isSuperAdmin: false,
        roleId: userRole.id,
        role: "User"
      },
      {
        username: "alex_taylor",
        email: "alex.taylor@example.com",
        password: "alex123",
        isAdmin: false,
        isSuperAdmin: false,
        roleId: userRole.id,
        role: "User"
      },
      {
        username: "maria_lopez",
        email: "maria.lopez@example.com",
        password: "maria123",
        isAdmin: false,
        isSuperAdmin: false,
        roleId: userRole.id,
        role: "User"
      }
    ];

    let createdCount = 0;
    for (const userData of predefinedUsers) {
      // Only create user if they don't exist
      if (existingUsernames.includes(userData.username)) {
        console.log(`⚠️ User ${userData.username} already exists, skipping...`);
        continue;
      }
      
      const hashedPassword = await hashPassword(userData.password);
      
      await db.insert(users).values({
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        isAdmin: userData.isAdmin,
        isSuperAdmin: userData.isSuperAdmin,
        roleId: userData.roleId
      });
      
      console.log(`✓ Created ${userData.role} account: ${userData.username}`);
    }

    console.log("\n🎉 All predefined accounts created successfully!");
    console.log("\n📋 Available test accounts with roles:");
    console.log("┌──────────────┬─────────────┬──────────────┐");
    console.log("│   Username   │   Password  │     Role     │");
    console.log("├──────────────┼─────────────┼──────────────┤");
    console.log("│   admin      │   admin123  │ Super Admin  │");
    console.log("│  manager     │ manager123  │    Admin     │");
    console.log("│  customer1   │ customer123 │     User     │");
    console.log("│  customer2   │ customer123 │     User     │");
    console.log("│  customer3   │ customer123 │     User     │");
    console.log("│  testuser    │   test123   │     User     │");
    console.log("│    demo      │   demo123   │     User     │");
    console.log("│  john_doe    │   john123   │     User     │");
    console.log("│ sarah_wilson │  sarah123   │     User     │");
    console.log("│ mike_johnson │   mike123   │     User     │");
    console.log("│  emma_brown  │   emma123   │     User     │");
    console.log("│ david_smith  │  david123   │     User     │");
    console.log("│ lisa_garcia  │   lisa123   │     User     │");
    console.log("│ alex_taylor  │   alex123   │     User     │");
    console.log("│ maria_lopez  │  maria123   │     User     │");
    console.log("└──────────────┴─────────────┴──────────────┘");

  } catch (error) {
    console.error("Error seeding users:", error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedUsers().then(() => {
    console.log("Seeding completed!");
    process.exit(0);
  }).catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
}

export { seedUsers };