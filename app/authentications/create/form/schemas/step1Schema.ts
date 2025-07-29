// schemas/step0Schema.ts
import { z } from "zod";

export const step1Schema = z.object({
  warranty_card: z
    .array(
      z.instanceof(File).refine((file) => file.size > 0, {
        message: "Empty files are not allowed",
      })
    )
    .min(1, { message: "Warranty card is required" }),

  purchase_receipts: z
    .array(
      z.instanceof(File).refine((file) => file.size > 0, {
        message: "Empty files are not allowed",
      })
    )
    .min(1, { message: "At least one purchase receipt is required" }),

  service_records: z
    .array(
      z.instanceof(File).refine((file) => file.size > 0, {
        message: "Empty files are not allowed",
      })
    )
    .optional(),

  authorized_dealer: z.boolean({
    required_error: "Please select if the dealer is authorized",
    invalid_type_error: "Must select Yes or No",
  }),

  warranty_card_notes: z
    .string()
    .min(10, "Please provide detailed notes (minimum 10 characters)"),

  service_history_notes: z.string().optional(),
});
