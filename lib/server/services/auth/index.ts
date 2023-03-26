import { Invite } from '@prisma/client';
import prisma from 'lib/prisma';
import { AdapterUser } from 'next-auth/adapters';

export class AuthService {
  user: AdapterUser;

  constructor(_user: AdapterUser) {
    this.user = _user;
  }

  public async isAllowedToSignIn(email: string): Promise<boolean> {
    if (await this.isFirstUser()) {
      return true;
    }

    if (await this.hasBeenVerified(email)) {
      return true;
    }

    return false;
  }

  private async isFirstUser(): Promise<boolean> {
    return (await prisma.user.count()) === 0;
  }

  private async hasBeenVerified(email: string): Promise<boolean> {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    return !!user?.emailVerified;
  }

  private async getInvite(email: string): Promise<Invite | null> {
    return prisma.invite.findFirst({
      where: {
        email,
      },
    });
  }

  private async acceptInvite(email: string): Promise<boolean> {
    const invite = await this.getInvite(email);

    if (!invite) {
      return false;
    }

    await prisma.project.update({
      where: {
        id: invite.projectId,
      },
      data: {
        users: {
          create: {
            user: {
              connect: {
                id: this.user.id,
              },
            },
          },
        },
      },
    });

    return true;
  }
}
