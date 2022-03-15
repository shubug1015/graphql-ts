import { extendType, intArg, nonNull, objectType } from 'nexus';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.string('name');
    t.nonNull.string('email');
    // t.nonNull.list.nonNull.field('links', {
    //   type: 'Link',
    //   resolve(parent, args, context) {
    //     return context.prisma.user
    //       .findUnique({ where: { id: parent.id } })
    //       .links();
    //   },
    // });
    // t.nonNull.list.nonNull.field('votes', {
    //   type: 'Link',
    //   resolve(parent, args, context) {
    //     return context.prisma.user
    //       .findUnique({ where: { id: parent.id } })
    //       .votes();
    //   },
    // });
  },
});

export const UserQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.field('user', {
      type: 'User',
      args: {
        id: nonNull(intArg()),
      },
      async resolve(parent, args, context) {
        const user = await context.prisma.user.findUnique({
          where: { id: args.id },
        });
        if (!user) {
          throw new Error('No such user found');
        }

        return user;
      },
    });
  },
});
