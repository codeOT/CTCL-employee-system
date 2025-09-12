import NextAuth, { AuthOptions, User as NextAuthUser, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/connectDB";
import User from "@/models/Users";
import type { JWT } from "next-auth/jwt";
// import sendMail from "@/lib/sendMail";
import sendApprovalEmail  from "@/lib/sendApprovalEmail";

interface CustomJWT extends JWT {
  role?: string;
  lastPasswordChange?: string;
}

interface CustomSession extends Session {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

interface CustomUser extends NextAuthUser {
  id: string;
  role: string;
  lastPasswordChange?: string;
}

export const authOptions: AuthOptions = {
  session: { strategy: "jwt" },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: {}, password: {} },
async authorize(credentials) {
  await connectDB();

  if (!credentials?.email || !credentials?.password)
    throw new Error("Email and password required");

  const user = await User.findOne({ email: credentials.email });
  if (!user) throw new Error("User not found");
  if (!user.isActive) throw new Error("Account deactivated");

  const isValid = await bcrypt.compare(credentials.password, user.password);
  if (!isValid) throw new Error("Invalid credentials");

  //  Handle Admin Login Approval
if (user.role === "admin") {
  if (!user.loginApproved) {
    // Set approval as pending
    await User.findByIdAndUpdate(user._id, { 
      approvalPending: true,
      lastLoginAttempt: new Date() // Optional: track when they last tried
    });
    
    // Send approval email
    await sendApprovalEmail(user);
    
    // Include user ID in error for frontend polling
    throw new Error(`Awaiting Admin approval. Check your email for status updates.|${user._id.toString()}`);
  }
}

  return {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };
}

    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      await connectDB();

      const t = token as CustomJWT;

      if (user) {
        const u = user as CustomUser;
        t.sub = u.id;
        t.email = u.email;
        t.role = u.role;

        const dbUser = await User.findById(u.id);
        t.lastPasswordChange =
          dbUser?.passwordChangedAt?.toISOString() ||
          new Date(0).toISOString();
      }

      if (!t.sub) return {};

      const dbUser = await User.findById(t.sub);
      if (!dbUser || !dbUser.isActive) return {};

      const lastChange = new Date(t.lastPasswordChange || 0).getTime();
      const dbPasswordChange = dbUser.passwordChangedAt
        ? new Date(dbUser.passwordChangedAt).getTime()
        : 0;

      if (dbPasswordChange > lastChange) return {};

      return t;
    },

    async session({ session, token }) {
      const t = token as CustomJWT;
      const s = session as CustomSession;

      if (!t.sub) {
        s.user = { id: "", email: "", role: "user" };
        return s;
      }

      s.user = {
        id: t.sub,
        email: t.email || "",
        role: t.role || "user",
      };

      return s;
    },
  },

  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
