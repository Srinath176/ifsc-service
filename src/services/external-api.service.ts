import axios, { AxiosResponse } from 'axios';
import { IFSCDetails, ExternalAPIResponse } from '../types/ifsc.type';
import { CONSTANTS } from '../utils/api-constants';

export class ExternalAPIService {
  private static instance: ExternalAPIService;
  private baseURL: string;

  private constructor() {
    this.baseURL = process.env.RAZORPAY_API_BASE || CONSTANTS.RAZORPAY_BASE_URL;
  }

  public static getInstance(): ExternalAPIService {
    if (!ExternalAPIService.instance) {
      ExternalAPIService.instance = new ExternalAPIService();
    }
    return ExternalAPIService.instance;
  }

  async fetchFromRazorpay(ifscCode: string): Promise<ExternalAPIResponse> {
    try {
      const response: AxiosResponse<IFSCDetails> = await axios.get(
        `${this.baseURL}/${ifscCode.toUpperCase()}`,
        {
          timeout: 10000,
          headers: {
            'User-Agent': 'IFSC-API-Service/1.0'
          }
        }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error(`Error fetching IFSC ${ifscCode} from Razorpay:`, error.message);
      
      if (error.response?.status === 404) {
        return {
          success: false,
          error: 'IFSC code not found'
        };
      }

      return {
        success: false,
        error: 'Failed to fetch IFSC details from external API'
      };
    }
  }

  // Extensible method for future APIs
  async fetchFromAPI(ifscCode: string, apiProvider: string = 'razorpay'): Promise<ExternalAPIResponse> {
    switch (apiProvider.toLowerCase()) {
      case 'razorpay':
        return this.fetchFromRazorpay(ifscCode);
      // Add more providers here in the future
      // case 'another-api':
      //   return this.fetchFromAnotherAPI(ifscCode);
      default:
        return {
          success: false,
          error: 'Unsupported API provider'
        };
    }
  }
}