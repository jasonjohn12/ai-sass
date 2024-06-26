import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";
import { MAX_FREE_ACCOUNTS } from "@/constants";

export const increaseAPILimit = async () => {
  const { userId } = auth();
  // console.log("my user id", userId);
  if (!userId) return;

  const userAPILimiet = await prismadb.userApiLimit.findUnique({
    where: {
      userId,
    },
  });
  if (userAPILimiet) {
    await prismadb.userApiLimit.update({
      where: {
        userId,
      },
      data: { count: userAPILimiet.count + 1 },
    });
  } else {
    await prismadb.userApiLimit.create({
      data: { userId, count: 1 },
    });
  }
};

export const checkAPILimit = async () => {
  const { userId } = auth();
  if (!userId) return false;

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: {
      userId,
    },
  });

  if (!userApiLimit || userApiLimit.count < MAX_FREE_ACCOUNTS) {
    return true;
  } else {
    return false;
  }
};

export const getApiLimitCount = async () => {
  const { userId } = auth();

  if (!userId) {
    return 0;
  }

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: {
      userId,
    },
  });

  if (!userApiLimit) {
    return 0;
  }

  return userApiLimit.count;
};
