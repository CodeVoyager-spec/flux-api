import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  index,
  timestamp,
} from "drizzle-orm/pg-core";

export const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
};

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
    index("posts_user_id_idx").on(table.userId),
    index("posts_created_at_idx").on(table.createdAt),
    index("posts_user_created_at_idx").on(table.userId, table.createdAt),
  ],
);
