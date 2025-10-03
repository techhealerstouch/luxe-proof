// schemas/step0Schema.ts
import { z } from "zod";
// Remove superRefine from UserInformationSchema and make it a regular ZodObject
export const UserInformationSchema = z.object({
  brand: z.enum(["Seiko", "Casio", "Citizen", "Rolex", "Omega"], {
    required_error: "Please select a watch brand",
  }),
  model: z.string().min(1, { message: "Model is required" }),

  company_name: z.string().optional(),
  company_address: z.string().optional(),
  name: z.string().min(1, { message: "Full Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().optional(),
  contact_method: z.enum(["email", "phone", "whatsapp"], {
    required_error: "Please select a contact method",
  }),
});
// Helper function to validate image file type
const isValidImageType = (file: File): boolean => {
  const validTypes = ["image/png", "image/jpeg", "image/jpg"];
  return validTypes.includes(file.type);
};

export const step1Schema = z.object({
  warranty_card: z
    .instanceof(File)
    .refine((file) => file.size > 0, {
      message: "Empty files are not allowed",
    })
    .refine((file) => isValidImageType(file), {
      message: "Only PNG and JPG images are allowed",
    })
    .refine((file) => file.size <= 1 * 1024 * 1024, {
      message: "File size must be less than 1MB",
    }),
  watch_image_front: z
    .instanceof(File)
    .refine((file) => file.size > 0, {
      message: "Empty files are not allowed",
    })
    .refine((file) => isValidImageType(file), {
      message: "Only PNG and JPG images are allowed",
    })
    .refine((file) => file.size <= 1 * 1024 * 1024, {
      message: "File size must be less than 1MB",
    }), // Changed from watch_images_front
  watch_image_back: z
    .instanceof(File)
    .refine((file) => file.size > 0, {
      message: "Empty files are not allowed",
    })
    .refine((file) => isValidImageType(file), {
      message: "Only PNG and JPG images are allowed",
    })
    .refine((file) => file.size <= 1 * 1024 * 1024, {
      message: "File size must be less than 1MB",
    }), // Changed from watch_images_front
  watch_image_side: z
    .instanceof(File)
    .refine((file) => file.size > 0, {
      message: "Empty files are not allowed",
    })
    .refine((file) => isValidImageType(file), {
      message: "Only PNG and JPG images are allowed",
    })
    .refine((file) => file.size <= 1 * 1024 * 1024, {
      message: "File size must be less than 1MB",
    }), // Changed from watch_images_front
  purchase_receipt: z // Changed from purchase_receipts
    .instanceof(File)
    .refine((file) => file.size > 0, {
      message: "Empty files are not allowed",
    })
    .refine((file) => isValidImageType(file), {
      message: "Only PNG and JPG images are allowed",
    })
    .refine((file) => file.size <= 1 * 1024 * 1024, {
      message: "File size must be less than 1MB",
    }),

  service_records: z
    .instanceof(File)
    .refine((file) => file.size > 0, {
      message: "Empty files are not allowed",
    })
    .refine((file) => isValidImageType(file), {
      message: "Only PNG and JPG images are allowed",
    })
    .refine((file) => file.size <= 1 * 1024 * 1024, {
      message: "File size must be less than 1MB",
    })
    .optional(),

  is_authorized_dealer: z.boolean({
    // Changed from authorized_dealer
    required_error: "Please select if the dealer is authorized",
    invalid_type_error: "Must select Yes or No",
  }),

  warranty_card_notes: z
    .string()
    .min(10, "Please provide detailed notes (minimum 10 characters)"),

  service_history_notes: z.string().optional(),
});
export const step2Schema = z.object({
  watch_serial_info_image: z
    .instanceof(File)
    .refine((file) => file.size > 0, {
      message: "Empty files are not allowed",
    })
    .refine((file) => isValidImageType(file), {
      message: "Only PNG and JPG images are allowed",
    })
    .refine((file) => file.size <= 1 * 1024 * 1024, {
      message: "File size must be less than 1MB",
    }), // Changed from watch_images_front
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
  watch_product_case_analysis_image: z
    .instanceof(File)
    .refine((file) => file.size > 0, {
      message: "Empty files are not allowed",
    })
    .refine((file) => isValidImageType(file), {
      message: "Only PNG and JPG images are allowed",
    })
    .refine((file) => file.size <= 1 * 1024 * 1024, {
      message: "File size must be less than 1MB",
    }), // Changed from watch_images_front
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
  watch_product_dial_analysis_image: z
    .instanceof(File)
    .refine((file) => file.size > 0, {
      message: "Empty files are not allowed",
    })
    .refine((file) => isValidImageType(file), {
      message: "Only PNG and JPG images are allowed",
    })
    .refine((file) => file.size <= 1 * 1024 * 1024, {
      message: "File size must be less than 1MB",
    }), // Changed from watch_images_front
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
  watch_product_bracelet_analysis_image: z
    .instanceof(File)
    .refine((file) => file.size > 0, {
      message: "Empty files are not allowed",
    })
    .refine((file) => isValidImageType(file), {
      message: "Only PNG and JPG images are allowed",
    })
    .refine((file) => file.size <= 1 * 1024 * 1024, {
      message: "File size must be less than 1MB",
    }), // Changed from watch_images_front
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
  watch_movement_analysis_image: z
    .instanceof(File)
    .refine((file) => file.size > 0, {
      message: "Empty files are not allowed",
    })
    .refine((file) => isValidImageType(file), {
      message: "Only PNG and JPG images are allowed",
    })
    .refine((file) => file.size <= 1 * 1024 * 1024, {
      message: "File size must be less than 1MB",
    }), // Changed from watch_images_front
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
  watch_performance_tests_image: z
    .instanceof(File)
    .refine((file) => file.size > 0, {
      message: "Empty files are not allowed",
    })
    .refine((file) => isValidImageType(file), {
      message: "Only PNG and JPG images are allowed",
    })
    .refine((file) => file.size <= 1 * 1024 * 1024, {
      message: "File size must be less than 1MB",
    }), // Changed from watch_images_front
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

  time_setting_works: z.enum(["1", "0"]),
  date_change_works: z.enum(["1", "0"]),
  chronograph_works: z.enum(["yes", "no", "n/a", ""]), // Updated to "yes", "no", "n/a", and "" for initial state
  performance_notes: z.string().optional(),
});

export const step8Schema = z.object({
  authenticity_verdict: z.enum(
    ["Genuine", "Counterfeit", "Genuine (Aftermarket)"],
    {
      required_error: "Please select an authenticity verdict.",
    }
  ),

  estimated_production_year: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{4}$/.test(val), {
      message: "Year must be a 4-digit number.",
    }),

  final_summary: z.string().optional(),
  status: z.string().optional(),
});
