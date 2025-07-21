import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal,
  date,
  time,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  location: varchar("location"),
  skills: text("skills").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Churches/Organizations table
export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 50 }).notNull(),
  zipCode: varchar("zip_code", { length: 10 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }),
  website: varchar("website", { length: 255 }),
  denominationAffiliation: varchar("denomination_affiliation", { length: 100 }),
  isVerified: boolean("is_verified").default(false),
  ownerId: varchar("owner_id").notNull().references(() => users.id),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Organization members/roles table
export const organizationMembers = pgTable("organization_members", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizations.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  role: varchar("role", { length: 50 }).notNull(), // 'owner', 'admin', 'member'
  createdAt: timestamp("created_at").defaultNow(),
});

// Volunteer opportunities table
export const opportunities = pgTable("opportunities", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  date: date("date").notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  volunteersNeeded: integer("volunteers_needed").notNull(),
  currentVolunteers: integer("current_volunteers").default(0),
  requiredSkills: text("required_skills").array(),
  location: text("location"),
  isRecurring: boolean("is_recurring").default(false),
  recurringPattern: varchar("recurring_pattern", { length: 50 }), // 'weekly', 'monthly', etc.
  organizationId: integer("organization_id").notNull().references(() => organizations.id),
  createdById: varchar("created_by_id").notNull().references(() => users.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Volunteer signups table
export const volunteerSignups = pgTable("volunteer_signups", {
  id: serial("id").primaryKey(),
  opportunityId: integer("opportunity_id").notNull().references(() => opportunities.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  status: varchar("status", { length: 20 }).default("signed_up"), // 'signed_up', 'completed', 'cancelled'
  notes: text("notes"),
  hoursWorked: decimal("hours_worked", { precision: 4, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  ownedOrganizations: many(organizations),
  organizationMemberships: many(organizationMembers),
  createdOpportunities: many(opportunities),
  volunteerSignups: many(volunteerSignups),
}));

export const organizationsRelations = relations(organizations, ({ one, many }) => ({
  owner: one(users, {
    fields: [organizations.ownerId],
    references: [users.id],
  }),
  members: many(organizationMembers),
  opportunities: many(opportunities),
}));

export const organizationMembersRelations = relations(organizationMembers, ({ one }) => ({
  organization: one(organizations, {
    fields: [organizationMembers.organizationId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [organizationMembers.userId],
    references: [users.id],
  }),
}));

export const opportunitiesRelations = relations(opportunities, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [opportunities.organizationId],
    references: [organizations.id],
  }),
  createdBy: one(users, {
    fields: [opportunities.createdById],
    references: [users.id],
  }),
  volunteerSignups: many(volunteerSignups),
}));

export const volunteerSignupsRelations = relations(volunteerSignups, ({ one }) => ({
  opportunity: one(opportunities, {
    fields: [volunteerSignups.opportunityId],
    references: [opportunities.id],
  }),
  user: one(users, {
    fields: [volunteerSignups.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertOrganizationSchema = createInsertSchema(organizations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isVerified: true,
});

export const insertOpportunitySchema = createInsertSchema(opportunities).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  currentVolunteers: true,
  isActive: true,
});

export const insertVolunteerSignupSchema = createInsertSchema(volunteerSignups).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;
export type Organization = typeof organizations.$inferSelect;
export type InsertOpportunity = z.infer<typeof insertOpportunitySchema>;
export type Opportunity = typeof opportunities.$inferSelect;
export type InsertVolunteerSignup = z.infer<typeof insertVolunteerSignupSchema>;
export type VolunteerSignup = typeof volunteerSignups.$inferSelect;
export type OrganizationMember = typeof organizationMembers.$inferSelect;

// Extended types for API responses
export type OpportunityWithDetails = Opportunity & {
  organization: Organization;
  createdBy: User;
  volunteerSignups: (VolunteerSignup & { user: User })[];
};

export type OrganizationWithDetails = Organization & {
  owner: User;
  members: (OrganizationMember & { user: User })[];
  opportunities: Opportunity[];
};
