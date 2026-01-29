import { relations } from "drizzle-orm";
import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  index,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";

// Halpers

export const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
};

export const createdAtOnly = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
};

// Tables

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  avatarPublicId: text("avatar_public_id"),
  isVerified: boolean("is_verified").default(false).notNull(),
  ...timestamps,
});

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    content: text("content").notNull(),
    imageUrl: text("image_url"),
    imagePublicId: text("image_public_id"),
    ...timestamps,
  },
  (table) => [
    index("posts_user_idx").on(table.userId),
    index("posts_created_at_idx").on(table.createdAt),
    index("posts_user_created_at_idx").on(table.userId, table.createdAt),
  ],
);

export const follows = pgTable(
  "follows",
  {
    followerId: uuid("follower_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    followingId: uuid("following_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    ...createdAtOnly,
  },
  (table) => [
    primaryKey({
      columns: [table.followerId, table.followingId],
    }),
    index("follows_follower_idx").on(table.followerId),
    index("follows_following_idx").on(table.followingId),
  ],
);

export const postLikes = pgTable(
  "post_likes",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),

    ...createdAtOnly,
  },
  (table) => [
    primaryKey({
      columns: [table.userId, table.postId],
    }),
    index("post_likes_user_idx").on(table.userId),
    index("post_likes_post_idx").on(table.postId),
  ],
);

export const comments = pgTable(
  "comments",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    content: text("content").notNull(),
    ...timestamps,
  },
  (table) => [
    index("comments_post_idx").on(table.postId),
    index("comments_user_idx").on(table.userId),
    index("comments_post_created_idx").on(table.postId, table.createdAt),
  ],
);

// Relations

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
  likes: many(postLikes),

  followers: many(follows, {
    relationName: "followers",
  }),

  following: many(follows, {
    relationName: "following",
  }),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  comments: many(comments),
  likes: many(postLikes),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  author: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
}));

export const followsRelations = relations(follows, ({ one }) => ({
  follower: one(users, {
    fields: [follows.followerId],
    references: [users.id],
    relationName: "following",
  }),
  following: one(users, {
    fields: [follows.followingId],
    references: [users.id],
    relationName: "followers",
  }),
}));

export const postLikesRelations = relations(postLikes, ({ one }) => ({
  user: one(users, {
    fields: [postLikes.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [postLikes.postId],
    references: [posts.id],
  }),
}));

// Schema Exports

export const schema = {
  users,
  posts,
  follows,
  postLikes,
  comments,
};
