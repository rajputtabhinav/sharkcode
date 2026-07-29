import { z } from "zod";

// UPI ID validation: username@provider (e.g., user123@paytm, john.doe@ybl)
const upiIdRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]+$/;

// UPI Reference Number: typically 12 digits
const upiRefRegex = /^\d{12}$/;

// Validation schemas
export const upiIdSchema = z.string()
  .min(3, "UPI ID must be at least 3 characters")
  .max(50, "UPI ID must be less than 50 characters")
  .regex(upiIdRegex, "Invalid UPI ID format. Use format: username@provider");

export const upiRefSchema = z.string()
  .length(12, "UPI reference must be exactly 12 digits")
  .regex(upiRefRegex, "UPI reference must contain only digits");

export const amountSchema = z.number()
  .int("Amount must be a whole number")
  .positive("Amount must be positive")
  .min(10000, "Minimum amount is ₹100 (10000 paise)")
  .max(10000000, "Maximum amount is ₹100,000");

export const paymentSchema = z.object({
  amountPaise: z.number()
    .int("Amount must be a whole number")
    .positive("Amount must be positive")
    .refine((val) => val === 10000, "Pro membership costs exactly ₹100"),
  upiRef: upiRefSchema,
});

export const withdrawalSchema = z.object({
  amountPaise: amountSchema,
  upiId: upiIdSchema,
});

export const chatMessageSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().min(1).max(2000),
    })
  ).min(1).max(20), // Limit history to 20 messages
  conversationId: z.string().cuid().optional(),
});

// Admin action schemas
export const adminPaymentActionSchema = z.object({
  paymentId: z.string().cuid(),
  status: z.enum(["CONFIRMED", "REJECTED"]),
});

export const adminWithdrawalActionSchema = z.object({
  withdrawalId: z.string().cuid(),
  status: z.enum(["APPROVED", "PAID", "REJECTED"]),
});

// Helper function to validate and return errors
export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: string[];
} {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return {
    success: false,
    errors: result.error.errors.map((err) => err.message),
  };
}

