"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkMutation = exports.LinkQuery = exports.Feed = exports.Link = exports.Sort = exports.LinkOrderByInput = void 0;
const nexus_1 = require("nexus");
exports.LinkOrderByInput = (0, nexus_1.inputObjectType)({
    name: 'LinkOrderByInput',
    definition(t) {
        t.field('description', { type: exports.Sort });
        t.field('url', { type: exports.Sort });
        t.field('createdAt', { type: exports.Sort });
    },
});
exports.Sort = (0, nexus_1.enumType)({
    name: 'Sort',
    members: ['asc', 'desc'],
});
exports.Link = (0, nexus_1.objectType)({
    name: 'Link',
    definition(t) {
        t.nonNull.int('id');
        t.nonNull.string('description');
        t.nonNull.string('url');
        t.nonNull.dateTime('createdAt');
        t.field('postedBy', {
            type: 'User',
            resolve(parent, args, context) {
                return context.prisma.link
                    .findUnique({ where: { id: parent.id } })
                    .postedBy();
            },
        });
        t.nonNull.list.nonNull.field('voters', {
            type: 'User',
            resolve(parent, args, context) {
                return context.prisma.link
                    .findUnique({ where: { id: parent.id } })
                    .voters();
            },
        });
    },
});
exports.Feed = (0, nexus_1.objectType)({
    name: 'Feed',
    definition(t) {
        t.nonNull.list.nonNull.field('links', { type: exports.Link });
        t.nonNull.int('count');
    },
});
exports.LinkQuery = (0, nexus_1.extendType)({
    type: 'Query',
    definition(t) {
        t.nonNull.field('feed', {
            type: 'Feed',
            args: {
                filter: (0, nexus_1.stringArg)(),
                skip: (0, nexus_1.intArg)(),
                take: (0, nexus_1.intArg)(),
                orderBy: (0, nexus_1.arg)({ type: (0, nexus_1.list)((0, nexus_1.nonNull)(exports.LinkOrderByInput)) }),
            },
            async resolve(parent, args, context) {
                const where = args.filter
                    ? {
                        OR: [
                            { description: { contains: args.filter } },
                            { url: { contains: args.filter } },
                        ],
                    }
                    : {};
                const links = await context.prisma.link.findMany({
                    where,
                    skip: args === null || args === void 0 ? void 0 : args.skip,
                    take: args === null || args === void 0 ? void 0 : args.take,
                    orderBy: args === null || args === void 0 ? void 0 : args.orderBy,
                });
                const count = await context.prisma.link.count({ where });
                return {
                    links,
                    count,
                };
            },
        });
    },
});
exports.LinkMutation = (0, nexus_1.extendType)({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('post', {
            type: 'Link',
            args: {
                description: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                url: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
            },
            resolve(parent, args, context) {
                const { description, url } = args;
                const { userId } = context;
                if (!userId) {
                    throw new Error('Cannot post without logging in.');
                }
                const newLink = context.prisma.link.create({
                    data: {
                        description,
                        url,
                        postedBy: { connect: { id: userId } },
                    },
                });
                return newLink;
            },
        });
    },
});
//# sourceMappingURL=Link.js.map