import IFSCModel from "../models/ifsc.model";
import { redisClient } from "../config/redis";
import { ExternalAPIService } from "./external-api.service";
import { IFSCDetails, APIResponse } from "../types/ifsc.type";
import { CONSTANTS } from "../utils/api-constants";
import { config } from "../config/env";

export class IFSCService {
  private externalAPIService: ExternalAPIService;
  private validityDays: number;
  private cacheTTL:  number;

  constructor() {
    this.externalAPIService = ExternalAPIService.getInstance();
    this.validityDays = config.cache.updateDays;
    this.cacheTTL = config.cache.ttl
  }

  async getIFSCDetails(ifscCode: string): Promise<APIResponse<IFSCDetails>> {
    try {
      const normalizedIFSC = ifscCode.toUpperCase();

      // Step 1: Check Redis cache, if data exists
      const cachedData = await this.getCachedData(normalizedIFSC);
      if (cachedData) {
        return {
          success: true,
          data: cachedData,
          message: "Data retrieved from cache",
        };
      }

      // Step 2: Check database
      const dbData = await this.getFromDatabase(normalizedIFSC);
      if (dbData && this.isDataFresh(dbData.updatedAt!)) {
        // Cache the fresh database data
        await this.setCacheData(normalizedIFSC, dbData);
        return {
          success: true,
          data: dbData,
          message: "Data retrieved from database",
        };
      }

      // Step 3: Fetch from external API
      const externalResponse = await this.externalAPIService.fetchFromAPI(
        normalizedIFSC
      );
      if (!externalResponse.success || !externalResponse.data) {
        return {
          success: false,
          error: externalResponse.error || "Failed to fetch IFSC details",
        };
      }

      // Step 4: Save/Update in database
      const savedData = await this.saveToDatabase(externalResponse.data);

      // Step 5: Cache the new data
      await this.setCacheData(normalizedIFSC, savedData);

      return {
        success: true,
        data: savedData,
        message: "Data retrieved from external API and cached",
      };
    } catch (error: any) {
      console.error("Error in getIFSCDetails:", error);
      return {
        success: false,
        error: "Internal server error",
      };
    }
  }

  private async getCachedData(ifscCode: string): Promise<IFSCDetails | null> {
    try {
      const cacheKey = `${CONSTANTS.CACHE_PREFIX}${ifscCode}`;
      const cachedData = await redisClient.getClient().get(cacheKey);

      if (cachedData) {
        return JSON.parse(cachedData);
      }
      return null;
    } catch (error) {
      console.error("Redis get error:", error);
      return null;
    }
  }

  private async setCacheData(
    ifscCode: string,
    data: IFSCDetails
  ): Promise<void> {
    try {
      const cacheKey = `${CONSTANTS.CACHE_PREFIX}${ifscCode}`;
      await redisClient.getClient().setex(cacheKey, this.cacheTTL, JSON.stringify(data));
    } catch (error) {
      console.error("Redis set error:", error);
    }
  }

  private async getFromDatabase(ifscCode: string) {
    try {
      const result = await IFSCModel.findOne({ IFSC: ifscCode });
      return result; // This will have proper Mongoose document type
    } catch (error) {
      console.error("Database get error:", error);
      return null;
    }
  }

  private async saveToDatabase(data: IFSCDetails) {
    try {
      const result = await IFSCModel.findOneAndUpdate(
        { IFSC: data.IFSC },
        data,
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );
      return result!; // Returns Mongoose document
    } catch (error) {
      console.error("Database save error:", error);
      throw error;
    }
  }

  private isDataFresh(updatedAt: Date): boolean {
    const now = new Date();
    const daysDiff = Math.floor(
      (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysDiff < this.validityDays;
  }
}
