import {
  users,
  organizations,
  opportunities,
  volunteerSignups,
  organizationMembers,
  type User,
  type InsertUser,
  type InsertOrganization,
  type Organization,
  type InsertOpportunity,
  type Opportunity,
  type InsertVolunteerSignup,
  type VolunteerSignup,
  type OpportunityWithDetails,
  type OrganizationWithDetails,
  type OrganizationMember,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, sql, count } from "drizzle-orm";

export interface IStorage {
  // User operations (required for authentication)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Organization operations
  createOrganization(data: InsertOrganization): Promise<Organization>;
  getOrganization(id: number): Promise<OrganizationWithDetails | undefined>;
  getOrganizationsByOwner(ownerId: string): Promise<Organization[]>;
  updateOrganization(id: number, data: Partial<InsertOrganization>): Promise<Organization>;
  verifyOrganization(id: number): Promise<void>;
  
  // Organization member operations
  addOrganizationMember(organizationId: number, userId: number, role: string): Promise<OrganizationMember>;
  getOrganizationMembers(organizationId: number): Promise<(OrganizationMember & { user: User })[]>;
  updateMemberRole(organizationId: number, userId: number, role: string): Promise<void>;
  removeMemberFromOrganization(organizationId: number, userId: number): Promise<void>;
  getUserOrganizations(userId: number): Promise<(OrganizationMember & { organization: Organization })[]>;
  
  // Opportunity operations
  createOpportunity(data: InsertOpportunity): Promise<Opportunity>;
  getOpportunity(id: number): Promise<OpportunityWithDetails | undefined>;
  getOpportunities(filters?: {
    organizationId?: number;
    category?: string;
    isActive?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<OpportunityWithDetails[]>;
  updateOpportunity(id: number, data: Partial<InsertOpportunity>): Promise<Opportunity>;
  deleteOpportunity(id: number): Promise<void>;
  
  // Volunteer signup operations
  signUpForOpportunity(data: InsertVolunteerSignup): Promise<VolunteerSignup>;
  getVolunteerSignups(opportunityId: number): Promise<(VolunteerSignup & { user: User })[]>;
  getUserSignups(userId: number): Promise<(VolunteerSignup & { opportunity: OpportunityWithDetails })[]>;
  updateSignupStatus(id: number, status: string, hoursWorked?: number): Promise<VolunteerSignup>;
  cancelSignup(id: number): Promise<void>;
  
  // Dashboard data
  getVolunteerStats(userId: number): Promise<{
    hoursVolunteered: number;
    opportunitiesCompleted: number;
    churchesServed: number;
  }>;
  getOrganizationStats(organizationId: number): Promise<{
    activeOpportunities: number;
    totalVolunteers: number;
    completedOpportunities: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  // Organization operations
  async createOrganization(data: InsertOrganization): Promise<Organization> {
    const [organization] = await db
      .insert(organizations)
      .values(data)
      .returning();
    
    // Add the owner as an organization member with 'owner' role
    await db.insert(organizationMembers).values({
      organizationId: organization.id,
      userId: data.ownerId,
      role: 'owner',
    });
    
    return organization;
  }

  async getOrganization(id: number): Promise<OrganizationWithDetails | undefined> {
    const [organization] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, id));
    
    if (!organization) return undefined;
    
    const owner = await this.getUser(organization.ownerId);
    const members = await this.getOrganizationMembers(id);
    const orgOpportunities = await db
      .select()
      .from(opportunities)
      .where(eq(opportunities.organizationId, id))
      .orderBy(desc(opportunities.createdAt));
    
    return {
      ...organization,
      owner: owner!,
      members,
      opportunities: orgOpportunities,
    };
  }

  async getOrganizationsByOwner(ownerId: number): Promise<Organization[]> {
    return await db
      .select()
      .from(organizations)
      .where(eq(organizations.ownerId, ownerId))
      .orderBy(asc(organizations.name));
  }

  async updateOrganization(id: number, data: Partial<InsertOrganization>): Promise<Organization> {
    const [organization] = await db
      .update(organizations)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(organizations.id, id))
      .returning();
    return organization;
  }

  async verifyOrganization(id: number): Promise<void> {
    await db
      .update(organizations)
      .set({ isVerified: true, updatedAt: new Date() })
      .where(eq(organizations.id, id));
  }

  // Organization member operations
  async addOrganizationMember(organizationId: number, userId: number, role: string): Promise<OrganizationMember> {
    const [member] = await db
      .insert(organizationMembers)
      .values({ organizationId, userId, role })
      .returning();
    return member;
  }

  async getOrganizationMembers(organizationId: number): Promise<(OrganizationMember & { user: User })[]> {
    const members = await db
      .select({
        id: organizationMembers.id,
        organizationId: organizationMembers.organizationId,
        userId: organizationMembers.userId,
        role: organizationMembers.role,
        createdAt: organizationMembers.createdAt,
        user: users,
      })
      .from(organizationMembers)
      .innerJoin(users, eq(organizationMembers.userId, users.id))
      .where(eq(organizationMembers.organizationId, organizationId));
    
    return members;
  }

  async updateMemberRole(organizationId: number, userId: number, role: string): Promise<void> {
    await db
      .update(organizationMembers)
      .set({ role })
      .where(
        and(
          eq(organizationMembers.organizationId, organizationId),
          eq(organizationMembers.userId, userId)
        )
      );
  }

  async removeMemberFromOrganization(organizationId: number, userId: number): Promise<void> {
    await db
      .delete(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, organizationId),
          eq(organizationMembers.userId, userId)
        )
      );
  }

  async getUserOrganizations(userId: number): Promise<(OrganizationMember & { organization: Organization })[]> {
    const userOrgs = await db
      .select({
        id: organizationMembers.id,
        organizationId: organizationMembers.organizationId,
        userId: organizationMembers.userId,
        role: organizationMembers.role,
        createdAt: organizationMembers.createdAt,
        organization: organizations,
      })
      .from(organizationMembers)
      .innerJoin(organizations, eq(organizationMembers.organizationId, organizations.id))
      .where(eq(organizationMembers.userId, userId));
    
    return userOrgs;
  }

  // Opportunity operations
  async createOpportunity(data: InsertOpportunity): Promise<Opportunity> {
    const [opportunity] = await db
      .insert(opportunities)
      .values(data)
      .returning();
    return opportunity;
  }

  async getOpportunity(id: number): Promise<OpportunityWithDetails | undefined> {
    const [opportunity] = await db
      .select()
      .from(opportunities)
      .where(eq(opportunities.id, id));
    
    if (!opportunity) return undefined;
    
    const organization = await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, opportunity.organizationId));
    
    const createdBy = await this.getUser(opportunity.createdById);
    const signups = await this.getVolunteerSignups(id);
    
    return {
      ...opportunity,
      organization: organization[0],
      createdBy: createdBy!,
      volunteerSignups: signups,
    };
  }

  async getOpportunities(filters: {
    organizationId?: number;
    category?: string;
    isActive?: boolean;
    limit?: number;
    offset?: number;
  } = {}): Promise<OpportunityWithDetails[]> {
    let query = db
      .select({
        opportunity: opportunities,
        organization: organizations,
        createdBy: users,
      })
      .from(opportunities)
      .innerJoin(organizations, eq(opportunities.organizationId, organizations.id))
      .innerJoin(users, eq(opportunities.createdById, users.id));
    
    const conditions = [];
    if (filters.organizationId) {
      conditions.push(eq(opportunities.organizationId, filters.organizationId));
    }
    if (filters.category) {
      conditions.push(eq(opportunities.category, filters.category));
    }
    if (filters.isActive !== undefined) {
      conditions.push(eq(opportunities.isActive, filters.isActive));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    query = query.orderBy(desc(opportunities.createdAt));
    
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    if (filters.offset) {
      query = query.offset(filters.offset);
    }
    
    const results = await query;
    
    // Get volunteer signups for each opportunity
    const opportunitiesWithSignups = await Promise.all(
      results.map(async (result) => {
        const signups = await this.getVolunteerSignups(result.opportunity.id);
        return {
          ...result.opportunity,
          organization: result.organization,
          createdBy: result.createdBy,
          volunteerSignups: signups,
        };
      })
    );
    
    return opportunitiesWithSignups;
  }

  async updateOpportunity(id: number, data: Partial<InsertOpportunity>): Promise<Opportunity> {
    const [opportunity] = await db
      .update(opportunities)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(opportunities.id, id))
      .returning();
    return opportunity;
  }

  async deleteOpportunity(id: number): Promise<void> {
    // First delete all volunteer signups
    await db.delete(volunteerSignups).where(eq(volunteerSignups.opportunityId, id));
    // Then delete the opportunity
    await db.delete(opportunities).where(eq(opportunities.id, id));
  }

  // Volunteer signup operations
  async signUpForOpportunity(data: InsertVolunteerSignup): Promise<VolunteerSignup> {
    const [signup] = await db
      .insert(volunteerSignups)
      .values(data)
      .returning();
    
    // Update current volunteers count
    await db
      .update(opportunities)
      .set({
        currentVolunteers: sql`${opportunities.currentVolunteers} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(opportunities.id, data.opportunityId));
    
    return signup;
  }

  async getVolunteerSignups(opportunityId: number): Promise<(VolunteerSignup & { user: User })[]> {
    const signups = await db
      .select({
        id: volunteerSignups.id,
        opportunityId: volunteerSignups.opportunityId,
        userId: volunteerSignups.userId,
        status: volunteerSignups.status,
        notes: volunteerSignups.notes,
        hoursWorked: volunteerSignups.hoursWorked,
        createdAt: volunteerSignups.createdAt,
        updatedAt: volunteerSignups.updatedAt,
        user: users,
      })
      .from(volunteerSignups)
      .innerJoin(users, eq(volunteerSignups.userId, users.id))
      .where(eq(volunteerSignups.opportunityId, opportunityId));
    
    return signups;
  }

  async getUserSignups(userId: number): Promise<(VolunteerSignup & { opportunity: OpportunityWithDetails })[]> {
    const signups = await db
      .select()
      .from(volunteerSignups)
      .where(eq(volunteerSignups.userId, userId))
      .orderBy(desc(volunteerSignups.createdAt));
    
    const signupsWithOpportunities = await Promise.all(
      signups.map(async (signup) => {
        const opportunity = await this.getOpportunity(signup.opportunityId);
        return {
          ...signup,
          opportunity: opportunity!,
        };
      })
    );
    
    return signupsWithOpportunities;
  }

  async updateSignupStatus(id: number, status: string, hoursWorked?: number): Promise<VolunteerSignup> {
    const updateData: any = { status, updatedAt: new Date() };
    if (hoursWorked !== undefined) {
      updateData.hoursWorked = hoursWorked;
    }
    
    const [signup] = await db
      .update(volunteerSignups)
      .set(updateData)
      .where(eq(volunteerSignups.id, id))
      .returning();
    
    return signup;
  }

  async cancelSignup(id: number): Promise<void> {
    const [signup] = await db
      .select()
      .from(volunteerSignups)
      .where(eq(volunteerSignups.id, id));
    
    if (signup) {
      await db.delete(volunteerSignups).where(eq(volunteerSignups.id, id));
      
      // Update current volunteers count
      await db
        .update(opportunities)
        .set({
          currentVolunteers: sql`${opportunities.currentVolunteers} - 1`,
          updatedAt: new Date(),
        })
        .where(eq(opportunities.id, signup.opportunityId));
    }
  }

  // Dashboard data
  async getVolunteerStats(userId: number): Promise<{
    hoursVolunteered: number;
    opportunitiesCompleted: number;
    churchesServed: number;
  }> {
    const [hoursResult] = await db
      .select({
        total: sql<number>`COALESCE(SUM(${volunteerSignups.hoursWorked}), 0)`,
      })
      .from(volunteerSignups)
      .where(
        and(
          eq(volunteerSignups.userId, userId),
          eq(volunteerSignups.status, 'completed')
        )
      );
    
    const [opportunitiesResult] = await db
      .select({
        count: count(),
      })
      .from(volunteerSignups)
      .where(
        and(
          eq(volunteerSignups.userId, userId),
          eq(volunteerSignups.status, 'completed')
        )
      );
    
    const churchesResult = await db
      .selectDistinct({
        organizationId: opportunities.organizationId,
      })
      .from(volunteerSignups)
      .innerJoin(opportunities, eq(volunteerSignups.opportunityId, opportunities.id))
      .where(eq(volunteerSignups.userId, userId));
    
    return {
      hoursVolunteered: Number(hoursResult.total),
      opportunitiesCompleted: opportunitiesResult.count,
      churchesServed: churchesResult.length,
    };
  }

  async getOrganizationStats(organizationId: number): Promise<{
    activeOpportunities: number;
    totalVolunteers: number;
    completedOpportunities: number;
  }> {
    const [activeResult] = await db
      .select({
        count: count(),
      })
      .from(opportunities)
      .where(
        and(
          eq(opportunities.organizationId, organizationId),
          eq(opportunities.isActive, true)
        )
      );
    
    const [volunteersResult] = await db
      .select({
        count: sql<number>`COUNT(DISTINCT ${volunteerSignups.userId})`,
      })
      .from(opportunities)
      .innerJoin(volunteerSignups, eq(opportunities.id, volunteerSignups.opportunityId))
      .where(eq(opportunities.organizationId, organizationId));
    
    const [completedResult] = await db
      .select({
        count: count(),
      })
      .from(opportunities)
      .where(
        and(
          eq(opportunities.organizationId, organizationId),
          eq(opportunities.isActive, false)
        )
      );
    
    return {
      activeOpportunities: activeResult.count,
      totalVolunteers: Number(volunteersResult.count),
      completedOpportunities: completedResult.count,
    };
  }
}

export const storage = new DatabaseStorage();
