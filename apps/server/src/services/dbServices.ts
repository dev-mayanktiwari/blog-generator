import { prisma } from "@workspace/db";
import { TUserRegistrationInput } from "@workspace/types";

export default {
  createUser: async (data: TUserRegistrationInput) => {
    return await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password || null,
        registerType: data.registerType,
        googleId: data.googleId || null,
      },
    });
  },

  getUserByEmail: async (email: string) => {
    return await prisma.user.findUnique({
      where: { email },
    });
  },

  addUserPost: async (post: {
    userId: string;
    title: string;
    content: string;
    videoUrl: string;
    tone: string;
    length: string;
  }) => {
    const { userId, title, content, videoUrl, tone, length } = post;
    return prisma.post.create({
      data: {
        title,
        content,
        videoUrl,
        length,
        tone,
        authorId: Number(userId),
      },
    });
  },

  getUserPosts: async (userId: string) => {
    return await prisma.post.findMany({
      where: { authorId: Number(userId) },
      orderBy: { createdAt: "desc" },
    });
  },
};
