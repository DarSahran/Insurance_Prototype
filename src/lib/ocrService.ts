import axios from 'axios';
import { supabase } from './supabase';

const GOOGLE_CLOUD_VISION_API_KEY = import.meta.env.VITE_GOOGLE_CLOUD_VISION_API_KEY;
const VISION_API_URL = 'https://vision.googleapis.com/v1/images:annotate';

export interface OCRResult {
  text: string;
  confidence: number;
  structuredData: any;
  requiresVerification: boolean;
}

export interface MedicalDocumentData {
  patientName?: string;
  dateOfBirth?: string;
  medicalConditions?: string[];
  medications?: string[];
  bloodPressure?: string;
  heartRate?: string;
  weight?: string;
  height?: string;
}

export interface FinancialDocumentData {
  employerName?: string;
  annualIncome?: number;
  employmentType?: string;
  yearsEmployed?: number;
  taxYear?: number;
}

export interface IdentificationDocumentData {
  fullName?: string;
  dateOfBirth?: string;
  address?: string;
  idNumber?: string;
  expirationDate?: string;
}

export class OCRService {
  static async processDocument(file: File, documentType: string, userId: string): Promise<{ documentId: string; result: OCRResult } | null> {
    try {
      const timestamp = Date.now();
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `${userId}/${timestamp}_${sanitizedFileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('medical_records')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading file to storage:', uploadError);
        return null;
      }

      const { data: publicUrlData } = supabase.storage
        .from('medical_records')
        .getPublicUrl(filePath);

      const { data: docRecord, error: docError } = await supabase
        .from('ocr_documents')
        .insert({
          user_id: userId,
          document_type: documentType,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type,
          processing_status: 'processing'
        })
        .select()
        .single();

      if (docError || !docRecord) {
        console.error('Error creating document record:', docError);
        await supabase.storage.from('medical_records').remove([filePath]);
        return null;
      }

      const base64Image = await this.fileToBase64(file);
      const ocrResult = await this.performOCR(base64Image);

      if (!ocrResult) {
        await this.updateDocumentStatus(docRecord.id, 'failed', 'OCR processing failed');
        return null;
      }

      const structuredData = await this.parseStructuredData(ocrResult.text, documentType);

      await supabase
        .from('ocr_documents')
        .update({
          ocr_text: ocrResult.text,
          ocr_confidence: ocrResult.confidence,
          structured_data: structuredData,
          processing_status: 'completed',
          manual_verification_required: ocrResult.confidence < 0.8,
          google_vision_response: ocrResult.rawResponse
        })
        .eq('id', docRecord.id);

      return {
        documentId: docRecord.id,
        result: {
          text: ocrResult.text,
          confidence: ocrResult.confidence,
          structuredData,
          requiresVerification: ocrResult.confidence < 0.8
        }
      };
    } catch (error) {
      console.error('OCR processing error:', error);
      return null;
    }
  }

  private static async performOCR(base64Image: string): Promise<{ text: string; confidence: number; rawResponse: any } | null> {
    if (!GOOGLE_CLOUD_VISION_API_KEY || GOOGLE_CLOUD_VISION_API_KEY === 'YOUR_GOOGLE_CLOUD_VISION_API_KEY_HERE') {
      console.warn('Google Cloud Vision API key not configured, using mock OCR');
      return this.getMockOCR();
    }

    try {
      const response = await axios.post(
        `${VISION_API_URL}?key=${GOOGLE_CLOUD_VISION_API_KEY}`,
        {
          requests: [
            {
              image: {
                content: base64Image.split(',')[1]
              },
              features: [
                {
                  type: 'DOCUMENT_TEXT_DETECTION',
                  maxResults: 1
                }
              ]
            }
          ]
        }
      );

      const textAnnotations = response.data.responses[0]?.textAnnotations;
      if (!textAnnotations || textAnnotations.length === 0) {
        return null;
      }

      const fullText = textAnnotations[0].description;
      const confidence = textAnnotations[0].confidence || 0.9;

      return {
        text: fullText,
        confidence,
        rawResponse: response.data.responses[0]
      };
    } catch (error) {
      console.error('Google Vision API error:', error);
      return this.getMockOCR();
    }
  }

  private static async parseStructuredData(text: string, documentType: string): Promise<any> {
    switch (documentType) {
      case 'medical':
        return this.parseMedicalDocument(text);
      case 'financial':
        return this.parseFinancialDocument(text);
      case 'identification':
        return this.parseIdentificationDocument(text);
      default:
        return { raw_text: text };
    }
  }

  private static parseMedicalDocument(text: string): MedicalDocumentData {
    const data: MedicalDocumentData = {};

    const bpMatch = text.match(/blood\s*pressure[:\s]*(\d{2,3}\/\d{2,3})/i);
    if (bpMatch) data.bloodPressure = bpMatch[1];

    const hrMatch = text.match(/heart\s*rate[:\s]*(\d{2,3})/i);
    if (hrMatch) data.heartRate = hrMatch[1];

    const weightMatch = text.match(/weight[:\s]*(\d+\.?\d*)\s*(kg|lbs?)/i);
    if (weightMatch) data.weight = `${weightMatch[1]} ${weightMatch[2]}`;

    const heightMatch = text.match(/height[:\s]*(\d+\.?\d*)\s*(cm|ft|')/i);
    if (heightMatch) data.height = `${heightMatch[1]} ${heightMatch[2]}`;

    const medicationMatches = text.match(/medication[s]?[:\s]*([\w\s,]+)/i);
    if (medicationMatches) {
      data.medications = medicationMatches[1].split(',').map(m => m.trim());
    }

    const conditionMatches = text.match(/diagnos(?:is|es)[:\s]*([\w\s,]+)/i);
    if (conditionMatches) {
      data.medicalConditions = conditionMatches[1].split(',').map(c => c.trim());
    }

    return data;
  }

  private static parseFinancialDocument(text: string): FinancialDocumentData {
    const data: FinancialDocumentData = {};

    const incomeMatch = text.match(/(?:annual|gross|total)\s*(?:income|wages|compensation)[:\s]*\$?\s*([\d,]+\.?\d*)/i);
    if (incomeMatch) {
      data.annualIncome = parseFloat(incomeMatch[1].replace(/,/g, ''));
    }

    const employerMatch = text.match(/employer[:\s]*([\w\s]+)/i);
    if (employerMatch) {
      data.employerName = employerMatch[1].trim();
    }

    const taxYearMatch = text.match(/tax\s*year[:\s]*(\d{4})/i);
    if (taxYearMatch) {
      data.taxYear = parseInt(taxYearMatch[1]);
    }

    return data;
  }

  private static parseIdentificationDocument(text: string): IdentificationDocumentData {
    const data: IdentificationDocumentData = {};

    const nameMatch = text.match(/name[:\s]*([\w\s]+)/i);
    if (nameMatch) {
      data.fullName = nameMatch[1].trim();
    }

    const dobMatch = text.match(/(?:date\s*of\s*birth|dob|birth\s*date)[:\s]*(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/i);
    if (dobMatch) {
      data.dateOfBirth = dobMatch[1];
    }

    const addressMatch = text.match(/address[:\s]*([\w\s,]+)/i);
    if (addressMatch) {
      data.address = addressMatch[1].trim();
    }

    return data;
  }

  static async getDocument(documentId: string): Promise<any> {
    const { data, error } = await supabase
      .from('ocr_documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (error) {
      console.error('Error fetching document:', error);
      return null;
    }

    return data;
  }

  static async getUserDocuments(userId: string, documentType?: string): Promise<any[]> {
    let query = supabase
      .from('ocr_documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (documentType) {
      query = query.eq('document_type', documentType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching documents:', error);
      return [];
    }

    return data || [];
  }

  static async verifyDocument(documentId: string, verifiedBy: string): Promise<boolean> {
    const { error } = await supabase
      .from('ocr_documents')
      .update({
        manual_verification_required: false,
        verified_at: new Date().toISOString(),
        verified_by: verifiedBy
      })
      .eq('id', documentId);

    return !error;
  }

  private static async updateDocumentStatus(documentId: string, status: string, errorMessage?: string): Promise<void> {
    await supabase
      .from('ocr_documents')
      .update({
        processing_status: status,
        error_message: errorMessage || null
      })
      .eq('id', documentId);
  }

  private static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private static getMockOCR(): { text: string; confidence: number; rawResponse: any } {
    return {
      text: 'Sample OCR text from document. This is mock data as the API key is not configured.',
      confidence: 0.95,
      rawResponse: { mock: true }
    };
  }

  static async deleteDocument(documentId: string, userId: string): Promise<boolean> {
    const document = await this.getDocument(documentId);

    if (!document || document.user_id !== userId) {
      return false;
    }

    if (document.file_path) {
      await supabase.storage
        .from('medical_records')
        .remove([document.file_path]);
    }

    const { error } = await supabase
      .from('ocr_documents')
      .delete()
      .eq('id', documentId)
      .eq('user_id', userId);

    return !error;
  }

  static async getDocumentUrl(filePath: string): Promise<string | null> {
    const { data } = supabase.storage
      .from('medical_records')
      .getPublicUrl(filePath);

    return data.publicUrl || null;
  }

  static async downloadDocument(filePath: string): Promise<Blob | null> {
    const { data, error } = await supabase.storage
      .from('medical_records')
      .download(filePath);

    if (error) {
      console.error('Error downloading document:', error);
      return null;
    }

    return data;
  }
}
