import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import Spec, { ISpec } from '../models/Spec';
import { specSchema, SpecInput } from '../validation/spec';
import { generateSlug } from '../utils/slug';

// Mock data storage for development when MongoDB is not available
const mockSpecs: Record<string, any> = {};

const router = express.Router();

// POST /api/specs - Create a new spec
router.post('/api/specs', async (req: Request, res: Response) => {
  try {
    // Validate the request body
    const validationResult = specSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        ok: false, 
        error: validationResult.error.format() 
      });
    }
    
    const specData: SpecInput = validationResult.data;
    
    // Generate a slug for the spec
    const slug = generateSlug(specData.clientName);
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      // Create a new spec
      const spec = new Spec({
        ...specData,
        slug
      });
      
      // Save the spec to the database
      await spec.save();
    } else {
      // Store in mock data if MongoDB is not available
      mockSpecs[slug] = {
        ...specData,
        slug,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      console.log(`[DEV] Saved spec to mock storage with slug: ${slug}`);
    }
    
    // Return the slug and URL
    return res.status(201).json({ 
      ok: true, 
      slug, 
      url: `${baseUrl}/s/${slug}` 
    });
  } catch (error) {
    console.error('Error creating spec:', error);
    return res.status(500).json({ 
      ok: false, 
      error: 'Failed to create spec' 
    });
  }
});

// GET /api/specs/:slug - Get a spec by slug
router.get('/api/specs/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      // Find the spec by slug in MongoDB
      const spec = await Spec.findOne({ slug });
      
      if (!spec) {
        return res.status(404).json({ 
          ok: false, 
          error: 'Spec not found' 
        });
      }
      
      return res.json(spec);
    } else {
      // Use mock data if MongoDB is not available
      const mockSpec = mockSpecs[slug];
      
      if (!mockSpec) {
        return res.status(404).json({ 
          ok: false, 
          error: 'Spec not found' 
        });
      }
      
      return res.json(mockSpec);
    }
  } catch (error) {
    console.error('Error fetching spec:', error);
    return res.status(500).json({ 
      ok: false, 
      error: 'Failed to fetch spec' 
    });
  }
});

// GET /s/:slug - Render the spec page
router.get('/s/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    let specData: any = null;
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      // Find the spec by slug in MongoDB
      const spec = await Spec.findOne({ slug });
      
      if (spec) {
        specData = spec.toObject();
      }
    } else {
      // Use mock data if MongoDB is not available
      specData = mockSpecs[slug];
    }
    
    if (!specData) {
      return res.status(404).render('error', { 
        error: 'Spec not found' 
      });
    }
    
    // Render the spec page
    return res.render('spec', { spec: specData });
  } catch (error) {
    console.error('Error rendering spec page:', error);
    return res.status(500).render('error', { 
      error: 'Failed to render spec page' 
    });
  }
});

export default router;