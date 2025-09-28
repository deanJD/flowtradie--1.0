import bcrypt from "bcryptjs";

async function main() {
  const password = process.argv[2]; // grab password from command line
  if (!password) {
    console.error("❌ Please provide a password to hash. Example: npm run hash password123");
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 10);
  console.log(`✅ Hashed password for "${password}":\n${hash}`);
}

main();
