// Gemini AI Service for ECOTEC System
// Supports English, Sinhala, and Singlish

interface GeminiResponse {
  candidates?: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
  error?: {
    message: string;
    code: number;
  };
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// System prompt that defines AI behavior
const SYSTEM_PROMPT = `You are ECOTEC AI Assistant - a helpful, friendly, and knowledgeable assistant for the ECOTEC Computer & Mobile Shop Management System.

IMPORTANT LANGUAGE RULES:
1. You MUST respond in the SAME language the user uses:
   - If user writes in English → Reply in English
   - If user writes in Sinhala (සිංහල) → Reply in Sinhala
   - If user writes in Singlish (Sinhala words in English letters like "kohomada", "mokakda", "karanna") → Reply in Singlish
2. Be natural and conversational in the chosen language
3. Use appropriate greetings for each language

ABOUT ECOTEC SYSTEM - You have knowledge about:

📦 INVENTORY MANAGEMENT:
- Products: Add, edit, delete products with details (name, brand, category, price, stock, barcode, IMEI)
- Brands: Manage product brands
- Categories: Organize products into categories
- Stock tracking with low stock alerts
- Barcode/QR code support
- IMEI tracking for mobile phones
- Serial number tracking for computers/laptops

👥 CUSTOMER MANAGEMENT:
- Add/edit customer details (name, phone, email, NIC, address)
- Customer purchase history
- Credit sales tracking
- Customer loyalty programs
- Customer statements

📄 SALES & INVOICES:
- Create invoices with multiple products
- Invoice wizard for easy billing
- Print invoices
- Invoice history and search
- Payment tracking (Cash, Card, Bank Transfer)
- Credit payment management

📋 QUOTATIONS & ESTIMATES:
- Create professional quotations
- Convert quotations to invoices
- WhatsApp sharing
- Print quotations
- Estimate management

🔧 SERVICES & REPAIRS:
- Job Notes for repair tracking
- Service categories
- Service pricing
- Repair status tracking
- Job note printing

📥 GOODS RECEIVED (GRN):
- Record incoming stock
- Supplier purchase tracking
- GRN printing
- Purchase history

👔 SUPPLIER MANAGEMENT:
- Add/manage suppliers
- Supplier contact details
- Purchase history per supplier
- Supplier payments tracking

🛡️ WARRANTY MANAGEMENT:
- Track product warranties
- Warranty claims
- Warranty status updates
- Warranty card generation

💰 CASH MANAGEMENT:
- Daily cash summary
- Cash in/out transactions
- Expense tracking
- Bank deposits

📊 REPORTS & ANALYTICS:
- Sales reports
- Inventory reports
- Profit margin analysis
- Outstanding credit reports
- Export to PDF, CSV, Excel (.xlsx)

⚙️ SETTINGS:
- Shop details (name, address, phone)
- Tax settings
- Invoice preferences
- Theme customization (Light/Dark mode)

CURRENCY: Always use Sri Lankan Rupees (Rs.) format: Rs. 150,000.00

HELPFUL TIPS TO SHARE:
- Keyboard shortcuts and quick actions
- Best practices for inventory management
- Tips for efficient billing
- How to generate reports
- Troubleshooting common issues

PERSONALITY:
- Be helpful, friendly, and professional
- Give clear, concise answers
- Provide step-by-step instructions when needed
- If you don't know something, say so honestly
- Suggest relevant features that might help the user

Remember: You represent ECOTEC - a premium computer and mobile shop in Sri Lanka. Be proud of the system and help users make the most of it!`;

class GeminiService {
  private apiKey: string | null = null;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  private conversationHistory: ChatMessage[] = [];

  constructor() {
    // Initialize API key from environment variable or localStorage
    this.initApiKey();
  }

  private initApiKey() {
    // Priority 1: Environment variable (MUST use VITE_ prefix in Vite)
    const envKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (envKey && typeof envKey === 'string' && envKey.trim().length > 0) {
      this.apiKey = envKey.trim();
      return;
    }
    
    // Priority 2: localStorage
    const storedKey = localStorage.getItem('ecotec_gemini_api_key');
    if (storedKey && storedKey.trim().length > 0) {
      this.apiKey = storedKey.trim();
    }
  }

  setApiKey(key: string) {
    this.apiKey = key.trim();
    // Store in localStorage for persistence
    localStorage.setItem('ecotec_gemini_api_key', key.trim());
  }

  getApiKey(): string | null {
    // Re-check env variable in case it wasn't available at construction
    if (!this.apiKey) {
      this.initApiKey();
    }
    return this.apiKey;
  }

  hasApiKey(): boolean {
    return !!this.getApiKey();
  }

  hasEnvApiKey(): boolean {
    const envKey = import.meta.env.VITE_GEMINI_API_KEY;
    return !!(envKey && typeof envKey === 'string' && envKey.trim().length > 0);
  }

  removeApiKey() {
    // Only clear if not using env key
    if (!this.hasEnvApiKey()) {
      this.apiKey = null;
    }
    localStorage.removeItem('ecotec_gemini_api_key');
    // Re-init to pick up env key if available
    this.initApiKey();
  }

  clearHistory() {
    this.conversationHistory = [];
  }

  getHistory(): ChatMessage[] {
    return [...this.conversationHistory];
  }

  async sendMessage(userMessage: string, responseLanguage: 'auto' | 'english' | 'sinhala' | 'singlish' = 'auto'): Promise<string> {
    const apiKey = this.getApiKey();
    
    if (!apiKey) {
      throw new Error('API key not configured. Please add your Gemini API key in Settings or .env file.');
    }

    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    });

    // Build conversation context
    const conversationContext = this.conversationHistory
      .slice(-10) // Keep last 10 messages for context
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n\n');

    // Language instruction based on preference
    let languageInstruction = '';
    let finalInstructions = 'Please respond to the user\'s latest message naturally and helpfully. Remember to match their language (English, Sinhala, or Singlish).';
    
    if (responseLanguage === 'english') {
      languageInstruction = '\n\nLANGUAGE REQUIREMENT: The user has selected ENGLISH as the response language.';
      finalInstructions = 'Please respond ONLY in English, regardless of what language the user types in. Do not mix languages. Always respond in clear, proper English.';
    } else if (responseLanguage === 'sinhala') {
      languageInstruction = '\n\nLANGUAGE REQUIREMENT: The user has selected SINHALA (සිංහල) as the response language.';
      finalInstructions = 'Please respond ONLY in Sinhala script (සිංහල), regardless of what language the user types in. Use proper Sinhala Unicode characters. Do not use English or transliterated text.';
    } else if (responseLanguage === 'singlish') {
      languageInstruction = '\n\nLANGUAGE REQUIREMENT: The user has selected SINGLISH as the response language.';
      finalInstructions = 'Please respond in Singlish - a mix of Sinhala words written in English letters combined with English words. This is casual Sri Lankan style. Example: "Ow bro, meka hondai. Revenue eka Rs. 6.9 million wage tiyenawa." Be friendly and conversational.';
    }

    const fullPrompt = `${SYSTEM_PROMPT}${languageInstruction}

CONVERSATION HISTORY:
${conversationContext}

${finalInstructions}`;

    try {
      const response = await fetch(`${this.baseUrl}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: fullPrompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || `API Error: ${response.status}`;
        console.error('Gemini API Error:', response.status, errorData);
        
        // Check for specific error types
        if (response.status === 400) {
          throw new Error(`Bad Request: ${errorMessage}`);
        }
        if (response.status === 401 || response.status === 403) {
          throw new Error(`API Key Invalid: ${errorMessage}`);
        }
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        }
        throw new Error(errorMessage);
      }

      const data: GeminiResponse = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      const assistantMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || 
        'Sorry, I could not generate a response. Please try again.';

      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage,
        timestamp: new Date()
      });

      return assistantMessage;
    } catch (error) {
      // Remove the failed user message from history
      this.conversationHistory.pop();
      
      if (error instanceof Error) {
        const errorMsg = error.message.toLowerCase();
        if (errorMsg.includes('api key') || errorMsg.includes('api_key_invalid') || errorMsg.includes('invalid api') || errorMsg.includes('401')) {
          throw new Error('Invalid API key. Please check your Gemini API key in Settings or .env file (GEMINI_API_KEY).');
        }
        if (errorMsg.includes('quota') || errorMsg.includes('429')) {
          throw new Error('API quota exceeded. Please try again later or upgrade your plan.');
        }
        if (errorMsg.includes('permission') || errorMsg.includes('403')) {
          throw new Error('API permission denied. Please check your API key has the required permissions.');
        }
        if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
          throw new Error('Network error. Please check your internet connection and try again.');
        }
        throw error;
      }
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }
}

// Export singleton instance
export const geminiService = new GeminiService();
export type { ChatMessage };
