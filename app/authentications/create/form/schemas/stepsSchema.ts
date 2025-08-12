// schemas/step0Schema.ts
import { z } from "zod";

export const UserInformationSchema = z
  .object({
    watch_brand: z.enum(["Seiko", "Casio", "Citizen", "Rolex", "Omega"], {
      required_error: "Please select a watch brand",
    }),
    user_type: z.enum(["personal", "company"], {
      required_error: "Please select a user type",
    }),
    company_name: z.string().optional(),
    abn: z.string().optional(),
    company_address: z.string().optional(),
    full_name: z.string().min(1, { message: "Full Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().optional(),
    contact_method: z.enum(["email", "phone", "whatsapp"], {
      required_error: "Please select a contact method",
    }),
  })
  .superRefine((data, ctx) => {
    // Conditional validation if user_type is company
    if (data.user_type === "company") {
      if (!data.company_name || data.company_name.trim() === "") {
        ctx.addIssue({
          path: ["company_name"],
          code: z.ZodIssueCode.custom,
          message: "Company name is required",
        });
      }
      if (!data.abn || data.abn.trim() === "") {
        ctx.addIssue({
          path: ["abn"],
          code: z.ZodIssueCode.custom,
          message: "ABN is required",
        });
      }
      if (!data.company_address || data.company_address.trim() === "") {
        ctx.addIssue({
          path: ["company_address"],
          code: z.ZodIssueCode.custom,
          message: "Company address is required",
        });
      }
    }
  });
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
export const step2Schema = z.object({
  serial_number: z.string().min(1, { message: "Serial number is required" }),

  model_number: z.string().min(1, { message: "Model number is required" }),

  serial_found_location: z
    .string()
    .min(1, { message: "Serial location is required" }),

  matches_documents: z.enum(["yes", "no"], {
    required_error: "Please select if it matches with documents",
  }),

  engraving_quality: z
    .string()
    .min(1, { message: "Engraving quality is required" }),

  serial_notes: z.string().min(10, {
    message: "Please provide notes about the serial number (min 10 characters)",
  }),
});

export const step3Schema = z.object({
  case_material_verified: z.enum(["yes", "no"], {
    required_error: "Please specify if case material is verified",
  }),

  case_weight_feel: z.enum(["Balanced & solid", "Light", "Inconsistent"], {
    required_error: "Please select case weight feel",
  }),

  finishing_transitions: z.enum(["Sharp", "Soft", "Unclear"], {
    required_error: "Please select finishing transitions",
  }),

  bezel_action: z.enum(["Precise clicks", "Loose", "No rotation"], {
    required_error: "Please select bezel action",
  }),

  crystal_type: z.enum(["Sapphire", "Mineral", "Acrylic"], {
    required_error: "Please select crystal type",
  }),

  laser_etched_crown: z.enum(["yes", "no"], {
    required_error: "Please specify if laser-etched crown was found",
  }),

  crown_logo_sharpness: z.enum(["Sharp", "Fuzzy", "Worn"], {
    required_error: "Please select crown logo sharpness",
  }),

  case_notes: z.string().optional(),
});

export const step4Schema = z.object({
  dial_text_quality: z.enum(["crisp", "blurry", "misaligned"], {
    required_error: "Dial text quality is required",
  }),
  lume_application: z.enum(["even", "uneven", "missing"], {
    required_error: "Lume application is required",
  }),
  cyclops_magnification: z.enum(["true_2.5x", "weak", "off_center"], {
    required_error: "Cyclops magnification is required",
  }),
  date_alignment: z.enum(["yes", "no"], {
    required_error: "Date alignment is required",
  }),
  dial_notes: z.string().optional(),
});

export const step5Schema = z.object({
  bracelet_link_type: z.enum(["solid", "hollow"], {
    required_error: "Bracelet link type is required",
  }),

  connection_type: z.enum(["screws", "pins", "fake_screws"], {
    required_error: "Connection type is required",
  }),

  clasp_action: z.enum(["smooth_click", "loose", "stiff"], {
    required_error: "Clasp action is required",
  }),

  micro_adjustment_functioning: z.enum(["yes", "no"], {
    required_error: "Micro-adjustment system functionality is required",
  }),

  clasp_engravings: z.enum(["clean", "shallow", "uneven"], {
    required_error: "Clasp engraving type is required",
  }),

  bracelet_notes: z.string().optional(),
});

export const step6Schema = z.object({
  movement_caliber: z.string().min(1, "Movement Caliber Number is required"),

  movement_engraving_quality: z.enum(["sharp", "engraved", "missing"], {
    required_error: "Engraving quality is required",
  }),

  decorative_finishing: z.array(z.string()).optional(), // optional checkbox field

  movement_other: z.string().optional(),

  purple_reversing_wheels: z.enum(["yes", "no"], {
    required_error: "Select an option for purple reversing wheels",
  }),

  blue_parachrom_hairspring: z.enum(["yes", "no"], {
    required_error: "Select an option for blue Parachrom hairspring",
  }),

  movement_notes: z.string().optional(),
});

export const step7Schema = z.object({
  rate_seconds_per_day: z
    .string()
    .min(1, "Rate is required")
    .refine((val) => !isNaN(Number(val)), {
      message: "Rate must be a number",
    }),

  amplitude_degrees: z
    .string()
    .min(1, "Amplitude is required")
    .refine((val) => !isNaN(Number(val)), {
      message: "Amplitude must be a number",
    }),

  beat_error_ms: z
    .string()
    .min(1, "Beat Error is required")
    .refine((val) => !isNaN(Number(val)), {
      message: "Beat Error must be a number",
    }),

  power_reserve_test_result: z
    .string()
    .min(1, "Power reserve result is required"),

  time_setting_works: z.enum(["yes", "no"], {
    required_error: "Time setting field is required",
  }),

  date_change_works: z.enum(["yes", "no"], {
    required_error: "Date change field is required",
  }),

  chronograph_works: z.enum(["yes", "no", "na"], {
    required_error: "Chronograph field is required",
  }),

  performance_notes: z.string().optional(),
});

export const step8Schema = z.object({
  authenticity_verdict: z.enum(
    ["genuine", "counterfeit", "genuine_with_aftermarket_parts"],
    {
      required_error: "Please select an authenticity verdict.",
    }
  ),

  component_grading: z.object({
    case: z.enum(["mint", "excellent", "good", "fair", "poor"], {
      required_error: "Please select a grade for the case.",
    }),
    bracelet: z.enum(["mint", "excellent", "good", "fair", "poor"], {
      required_error: "Please select a grade for the bracelet.",
    }),
    dial: z.enum(["mint", "excellent", "good", "fair", "poor"], {
      required_error: "Please select a grade for the dial.",
    }),
    bezel: z.enum(["mint", "excellent", "good", "fair", "poor"], {
      required_error: "Please select a grade for the bezel.",
    }),
    crystal: z.enum(["mint", "excellent", "good", "fair", "poor"], {
      required_error: "Please select a grade for the crystal.",
    }),
  }),

  was_polished: z.enum(["yes", "no", "uncertain"], {
    required_error: "Please indicate if the watch was polished.",
  }),

  estimated_production_year: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{4}$/.test(val), {
      message: "Year must be a 4-digit number.",
    }),

  final_summary: z.string().optional(),
});
