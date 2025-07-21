import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertOrganizationSchema,
  insertOpportunitySchema,
  insertVolunteerSignupSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Organization routes
  app.post('/api/organizations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertOrganizationSchema.parse({
        ...req.body,
        ownerId: userId,
      });
      
      const organization = await storage.createOrganization(data);
      res.json(organization);
    } catch (error) {
      console.error("Error creating organization:", error);
      res.status(400).json({ message: "Failed to create organization" });
    }
  });

  app.get('/api/organizations/my', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const organizations = await storage.getUserOrganizations(userId);
      res.json(organizations);
    } catch (error) {
      console.error("Error fetching user organizations:", error);
      res.status(500).json({ message: "Failed to fetch organizations" });
    }
  });

  app.get('/api/organizations/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const organization = await storage.getOrganization(id);
      
      if (!organization) {
        return res.status(404).json({ message: "Organization not found" });
      }
      
      res.json(organization);
    } catch (error) {
      console.error("Error fetching organization:", error);
      res.status(500).json({ message: "Failed to fetch organization" });
    }
  });

  app.patch('/api/organizations/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      // Check if user has permission to update this organization
      const organization = await storage.getOrganization(id);
      if (!organization || organization.ownerId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const data = insertOrganizationSchema.partial().parse(req.body);
      const updatedOrganization = await storage.updateOrganization(id, data);
      res.json(updatedOrganization);
    } catch (error) {
      console.error("Error updating organization:", error);
      res.status(400).json({ message: "Failed to update organization" });
    }
  });

  app.get('/api/organizations/:id/stats', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const stats = await storage.getOrganizationStats(id);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching organization stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Opportunity routes
  app.post('/api/opportunities', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertOpportunitySchema.parse({
        ...req.body,
        createdById: userId,
      });
      
      const opportunity = await storage.createOpportunity(data);
      res.json(opportunity);
    } catch (error) {
      console.error("Error creating opportunity:", error);
      res.status(400).json({ message: "Failed to create opportunity" });
    }
  });

  app.get('/api/opportunities', async (req: any, res) => {
    try {
      const {
        organizationId,
        category,
        isActive = true,
        limit = 50,
        offset = 0,
      } = req.query;
      
      const filters = {
        organizationId: organizationId ? parseInt(organizationId) : undefined,
        category,
        isActive: isActive === 'true',
        limit: parseInt(limit),
        offset: parseInt(offset),
      };
      
      const opportunities = await storage.getOpportunities(filters);
      res.json(opportunities);
    } catch (error) {
      console.error("Error fetching opportunities:", error);
      res.status(500).json({ message: "Failed to fetch opportunities" });
    }
  });

  app.get('/api/opportunities/:id', async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const opportunity = await storage.getOpportunity(id);
      
      if (!opportunity) {
        return res.status(404).json({ message: "Opportunity not found" });
      }
      
      res.json(opportunity);
    } catch (error) {
      console.error("Error fetching opportunity:", error);
      res.status(500).json({ message: "Failed to fetch opportunity" });
    }
  });

  app.patch('/api/opportunities/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      // Check if user has permission to update this opportunity
      const opportunity = await storage.getOpportunity(id);
      if (!opportunity || opportunity.createdById !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const data = insertOpportunitySchema.partial().parse(req.body);
      const updatedOpportunity = await storage.updateOpportunity(id, data);
      res.json(updatedOpportunity);
    } catch (error) {
      console.error("Error updating opportunity:", error);
      res.status(400).json({ message: "Failed to update opportunity" });
    }
  });

  app.delete('/api/opportunities/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      // Check if user has permission to delete this opportunity
      const opportunity = await storage.getOpportunity(id);
      if (!opportunity || opportunity.createdById !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      await storage.deleteOpportunity(id);
      res.json({ message: "Opportunity deleted successfully" });
    } catch (error) {
      console.error("Error deleting opportunity:", error);
      res.status(500).json({ message: "Failed to delete opportunity" });
    }
  });

  // Volunteer signup routes
  app.post('/api/opportunities/:id/signup', isAuthenticated, async (req: any, res) => {
    try {
      const opportunityId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      const data = insertVolunteerSignupSchema.parse({
        opportunityId,
        userId,
        notes: req.body.notes,
      });
      
      const signup = await storage.signUpForOpportunity(data);
      res.json(signup);
    } catch (error) {
      console.error("Error signing up for opportunity:", error);
      res.status(400).json({ message: "Failed to sign up for opportunity" });
    }
  });

  app.get('/api/opportunities/:id/signups', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const signups = await storage.getVolunteerSignups(id);
      res.json(signups);
    } catch (error) {
      console.error("Error fetching volunteer signups:", error);
      res.status(500).json({ message: "Failed to fetch signups" });
    }
  });

  app.get('/api/user/signups', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const signups = await storage.getUserSignups(userId);
      res.json(signups);
    } catch (error) {
      console.error("Error fetching user signups:", error);
      res.status(500).json({ message: "Failed to fetch signups" });
    }
  });

  app.patch('/api/signups/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, hoursWorked } = req.body;
      
      const signup = await storage.updateSignupStatus(id, status, hoursWorked);
      res.json(signup);
    } catch (error) {
      console.error("Error updating signup:", error);
      res.status(400).json({ message: "Failed to update signup" });
    }
  });

  app.delete('/api/signups/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.cancelSignup(id);
      res.json({ message: "Signup cancelled successfully" });
    } catch (error) {
      console.error("Error cancelling signup:", error);
      res.status(500).json({ message: "Failed to cancel signup" });
    }
  });

  // User stats route
  app.get('/api/user/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getVolunteerStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
