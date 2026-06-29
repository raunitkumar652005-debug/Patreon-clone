import NextAuth from 'next-auth'
// import AppleProvider from 'next-auth/providers/apple'
// import FacebookProvider from 'next-auth/providers/facebook'
import GoogleProvider from "next-auth/providers/google";
// import EmailProvider from 'next-auth/providers/email'
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from '@/models/User';
import connectDb from '@/db/connectDb';
 

const getCreatorEmail = () => process.env.CREATOR_EMAIL?.toLowerCase().trim();

const isCreatorEmail = (email) => {
  const creatorEmail = getCreatorEmail();
  return Boolean(creatorEmail && email?.toLowerCase().trim() === creatorEmail);
};


export const authOptions = {
    providers: [
      // OAuth authentication providers...
      GitHubProvider({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET
      }),
    
    //   FacebookProvider({
    //     clientId: process.env.FACEBOOK_ID,
    //     clientSecret: process.env.FACEBOOK_SECRET
    //   }),
      GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
      }),
      CredentialsProvider({
        name: "Email and Password",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          await connectDb();

          const email = credentials?.email?.toLowerCase().trim();
          const password = credentials?.password;

          if (!email || !password) {
            throw new Error("Email and password are required.");
          }

          const user = await User.findOne({ email }).select("+password");

          if (!user) {
            throw new Error("No account found with this email.");
          }

          if (!user.password) {
            throw new Error("Please sign in with Google or GitHub for this account.");
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
            throw new Error("Invalid email or password.");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.username,
            isCreator: isCreatorEmail(user.email),
          };
        },
      }),
    //   // Passwordless / email sign in
    //   EmailProvider({
    //     server: process.env.MAIL_SERVER,
    //     from: 'NextAuth.js <no-reply@example.com>'
    //   }),
    ],
    // callbacks: {
    //   async signIn({ user, account, profile, email, credentials }) {
    //      if(account.provider == "github") { 
    //       await connectDb()
    //       // Check if the user already exists in the database
    //       const currentUser =  await User.findOne({email: email}) 
    //       if(!currentUser){
    //         // Create a new user
    //          const newUser = await User.create({
    //           email: user.email, 
    //           username: user.email.split("@")[0], 
    //         })   
           
    //       } 
         
    //       return true
    //      }
    //   },
      
    //   async session({ session, user, token }) {
    //     const dbUser = await User.findOne({email: session.user.email})
    //     console.log(dbUser)
    //     session.user.name = dbUser.username
    //     return session
    //   },
    // } 
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "credentials") {
        return true;
      }

      await connectDb();

      const email = user.email?.toLowerCase().trim();

      if (!email) {
        return false;
      }

      const currentUser = await User.findOne({ email });
      const isCreator = isCreatorEmail(email);

      if (!currentUser) {
        await User.create({
          email,
          username: email.split("@")[0],
          name: user.name || "",
          isCreator,
        });
      } else if (currentUser.isCreator !== isCreator) {
        currentUser.isCreator = isCreator;
        await currentUser.save();
      }

      return true;
    },

    async session({ session }) {
      await connectDb();

      const dbUser = await User.findOne({
        email: session.user.email?.toLowerCase().trim(),
      });

      if (dbUser) {
        session.user.name = dbUser.username;
        session.user.isCreator = dbUser.isCreator;
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST}
        
        
