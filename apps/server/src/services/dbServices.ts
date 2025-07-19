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

  addUserPostWithoutImage: async (post: {
    userId: string;
    title: string;
    content: string;
    videoUrl: string;
    tone: string;
    length: string;
    contentType: string;
    generateImage: boolean;
  }) => {
    const { userId, title, content, videoUrl, tone, length, contentType } =
      post;
    return prisma.post.create({
      data: {
        title,
        content,
        videoUrl,
        length,
        tone,
        contentType,
        authorId: Number(userId),
        generatedImage: false,
      },
    });
  },

  addUserPostWithEmail: async (post: {
    userId: string;
    title: string;
    content: string;
    videoUrl: string;
    tone: string;
    length: string;
    contentType: string;
    generateImage: boolean;
    imageUrl: string;
  }) => {
    const {
      userId,
      title,
      content,
      videoUrl,
      tone,
      length,
      contentType,
      imageUrl,
    } = post;
    return prisma.post.create({
      data: {
        title,
        content,
        videoUrl,
        tone,
        length,
        contentType,
        authorId: Number(userId),
        generatedImage: true,
        images: {
          create: {
            url: imageUrl,
          },
        },
      },
    });
  },

  getUserPosts: async (userId: string) => {
    return await prisma.post.findMany({
      where: { authorId: Number(userId) },
      orderBy: { createdAt: "desc" },
      include: {
        images: {
          select: {
            url: true,
          },
        },
      },
    });
  },
};
