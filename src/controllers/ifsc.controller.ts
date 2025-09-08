import { Request, Response } from "express";
import { IFSCService } from "../services/ifsc.service";
import { HTTP_STATUS } from "../utils/api-constants";

/**
 * Controller responsible for handling IFSC-related HTTP requests.
 */
export class IFSCController {
  private ifscService: IFSCService;

  constructor() {
    this.ifscService = new IFSCService();
  }

  /**
   * GET /api/ifsc/:code
   * Fetch IFSC details by code.
   *
   * @param req - Express Request object (expects `req.params.code`)
   * @param res - Express Response object
   * @returns JSON response containing IFSC details
   */

  getIFSCDetails = async (req: Request, res: Response): Promise<void> => {
    try {
      const { ifscCode } = req.params;

      // Validate IFSC code format
      if (!this.isValidIFSCFormat(ifscCode)) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: "Invalid IFSC code format. IFSC should be 11 characters long.",
        });
        return;
      }

      const result = await this.ifscService.getIFSCDetails(ifscCode);

      if (result.success) {
        res.status(HTTP_STATUS.OK).json(result);
      } else {
        const statusCode = result.error?.includes("not found")
          ? HTTP_STATUS.NOT_FOUND
          : HTTP_STATUS.BAD_REQUEST;
        res.status(statusCode).json(result);
      }
    } catch (error) {
      console.error("Controller error:", error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: "Internal server error",
      });
    }
  };

  private isValidIFSCFormat(ifscCode: string): boolean {
    // IFSC code should be 11 characters: 4 letters + 7 alphanumeric
    const ifscRegex = /^[A-Za-z]{4}[A-Za-z0-9]{7}$/;
    return ifscRegex.test(ifscCode);
  }
}
