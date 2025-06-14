import { prisma } from "@workspace/db";
import { TUserRegistrationInput } from "@workspace/types";

export default {
  createUser: async (data: TUserRegistrationInput) => {
    return await prisma.user.create({
      data,
    });
  },
};
