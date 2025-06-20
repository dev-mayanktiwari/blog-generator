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
};
