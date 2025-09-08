import mongoose, { Schema, Document } from "mongoose";
import { IFSCDocument } from "../types/ifsc.type";

/**
 * MongoDB representation of an IFSC record.
 * Stores bank details fetched from external APIs.
 */
interface IFSCModel extends IFSCDocument, Document {}

const ifscSchema = new Schema<IFSCModel>(
  {
    IFSC: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    BANK: {
      type: String,
      required: true,
    },
    BRANCH: {
      type: String,
      required: true,
    },
    ADDRESS: {
      type: String,
      required: true,
    },
    CITY: {
      type: String,
      required: true,
    },
    DISTRICT: {
      type: String,
      required: true,
    },
    STATE: {
      type: String,
      required: true,
    },
    CONTACT: {
      type: String,
      default: null,
    },
    IMPS: {
      type: Boolean,
      default: false,
    },
    RTGS: {
      type: Boolean,
      default: false,
    },
    NEFT: {
      type: Boolean,
      default: false,
    },
    UPI: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const IFSCModel = mongoose.model<IFSCModel>("IFSC", ifscSchema);

export default IFSCModel;
