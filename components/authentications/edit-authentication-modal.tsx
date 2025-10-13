import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step1Schema } from "@/schemas/stepsSchemas";
import { CheckCircle, Send } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

// Import step components
import { UserInformationForm } from "@/components/forms/UserInformationForm";
import { Step1Form } from "@/components/forms/Step1Form";
import { Step2Form } from "@/components/forms/Step2Form";
import { Step3Form } from "@/components/forms/Step3Form";
import { Step4Form } from "@/components/forms/Step4Form";
import { Step5Form } from "@/components/forms/Step5Form";
import { Step6Form } from "@/components/forms/Step6Form";
import { Step7Form } from "@/components/forms/Step7Form";
import { Step8Form } from "@/components/forms/Step8Form";

// Types
interface WatchAuthentication {
  id: string;
  account_id: string;
  name: string;
  email: string;
  phone: string;
  contact_method: string;
  company_name: string;
  company_address: string;
  brand: string;
  model: string;
  date_of_sale: string;
  authenticity_verdict?: string;
  final_summary?: string;
  estimated_production_year?: string;
  status?: string;
  provenance_documentation_audit: any;
  serial_and_model_number_cross_reference: any;
  case_bezel_and_crystal_analysis: any;
  dial_hands_and_date_scrutiny: any;
  bracelet_strap_and_clasp_inspection: any;
  movement_examination: any;
  performance_and_function_test: any;
}

interface EditAuthenticationModalProps {
  authId?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  watchData?: WatchAuthentication;
  onSave?: (data: any) => void;
  onSubmit?: (allData: WatchAuthentication) => void;
}

// Tab configuration
const TAB_CONFIG = [
  { key: "userInformation", label: "User Info", fullLabel: "User Information" },
  {
    key: "step1",
    label: "Provenance",
    fullLabel: "Step 1: Provenance & Documentation Audit",
  },
  {
    key: "step2",
    label: "Serial & Model",
    fullLabel: "Step 2: Serial & Model Number Cross-Reference",
  },
  {
    key: "step3",
    label: "Case & Crystal",
    fullLabel: "Step 3: Case, Bezel, and Crystal Analysis",
  },
  {
    key: "step4",
    label: "Dial & Hands",
    fullLabel: "Step 4: Dial, Hands, and Date Scrutiny",
  },
  {
    key: "step5",
    label: "Bracelet & Clasp",
    fullLabel: "Step 5: Bracelet/Strap and Clasp Inspection",
  },
  {
    key: "step6",
    label: "Movement",
    fullLabel: "Step 6: Movement Examination",
  },
  {
    key: "step7",
    label: "Performance",
    fullLabel: "Step 7: Performance & Function Test",
  },
  {
    key: "step8",
    label: "Final Grading",
    fullLabel: "Step 8: Final Condition & Grading",
  },
];

// Helper function to create form default values
const createDefaultValues = (watchData?: WatchAuthentication) => ({
  userInformation: {
    id: watchData?.id || "",
    account_id: watchData?.account_id || "",
    name: watchData?.name || "",
    email: watchData?.email || "",
    phone: watchData?.phone || "",
    date_of_sale: watchData?.date_of_sale || "",
    brand: watchData?.brand || "",
    model: watchData?.model || "",
    company_name: watchData?.company_name || "",
    company_address: watchData?.company_address || "",
    contact_method: watchData?.contact_method || "",
  },
  step1: {
    warranty_card:
      watchData?.provenance_documentation_audit?.warranty_card_path || null,
    purchase_receipt:
      watchData?.provenance_documentation_audit?.purchase_receipt_path || null,
    service_records:
      watchData?.provenance_documentation_audit?.service_records_path || null,
    watch_image_front:
      watchData?.provenance_documentation_audit?.watch_image_front_path || null,
    watch_image_back:
      watchData?.provenance_documentation_audit?.watch_image_back_path || null,
    watch_image_side:
      watchData?.provenance_documentation_audit?.watch_image_side_path || null,
    is_authorized_dealer:
      watchData?.provenance_documentation_audit?.is_authorized_dealer ||
      undefined,
    warranty_card_notes:
      watchData?.provenance_documentation_audit?.warranty_card_notes || "",
    service_history_notes:
      watchData?.provenance_documentation_audit?.service_history_notes || "",
  },
  step2: {
    watch_serial_info_image_path:
      watchData?.serial_and_model_number_cross_reference
        ?.watch_serial_info_image_path || "",
    serial_number:
      watchData?.serial_and_model_number_cross_reference?.serial_number || "",
    model_number:
      watchData?.serial_and_model_number_cross_reference?.model_number || "",
    serial_found_location:
      watchData?.serial_and_model_number_cross_reference
        ?.serial_found_location || "",
    matches_documents:
      watchData?.serial_and_model_number_cross_reference?.matches_documents,
    engraving_quality:
      watchData?.serial_and_model_number_cross_reference?.engraving_quality ||
      "",
    serial_notes:
      watchData?.serial_and_model_number_cross_reference?.notes || "",
  },
  step3: {
    watch_product_case_analysis_image_path:
      watchData?.case_bezel_and_crystal_analysis
        ?.watch_product_case_analysis_image_path,
    case_material_verified:
      watchData?.case_bezel_and_crystal_analysis?.case_material_verified,
    case_weight_feel:
      watchData?.case_bezel_and_crystal_analysis?.case_weight_feel || "",
    finishing_transitions:
      watchData?.case_bezel_and_crystal_analysis?.finishing_transitions || "",
    bezel_action:
      watchData?.case_bezel_and_crystal_analysis?.bezel_action || "",
    crystal_type:
      watchData?.case_bezel_and_crystal_analysis?.crystal_type || "",
    laser_etched_crown:
      watchData?.case_bezel_and_crystal_analysis?.laser_etched_crown,
    crown_logo_sharpness:
      watchData?.case_bezel_and_crystal_analysis?.crown_logo_sharpness || "",
    case_notes: watchData?.case_bezel_and_crystal_analysis?.notes || "",
  },
  step4: {
    watch_product_dial_analysis_image_path:
      watchData?.dial_hands_and_date_scrutiny
        ?.watch_product_dial_analysis_image_path,
    dial_text_quality:
      watchData?.dial_hands_and_date_scrutiny?.dial_text_quality || "",
    lume_application:
      watchData?.dial_hands_and_date_scrutiny?.lume_application || "",
    cyclops_magnification:
      watchData?.dial_hands_and_date_scrutiny?.cyclops_magnification || "",
    date_alignment: watchData?.dial_hands_and_date_scrutiny?.date_alignment,
    dial_notes: watchData?.dial_hands_and_date_scrutiny?.notes || "",
  },
  step5: {
    watch_product_bracelet_analysis_image_path:
      watchData?.bracelet_strap_and_clasp_inspection
        ?.watch_product_bracelet_analysis_image_path,
    bracelet_link_type:
      watchData?.bracelet_strap_and_clasp_inspection?.bracelet_link_type || "",
    connection_type:
      watchData?.bracelet_strap_and_clasp_inspection?.connection_type || "",
    clasp_action:
      watchData?.bracelet_strap_and_clasp_inspection?.clasp_action || "",
    micro_adjustment_functioning:
      watchData?.bracelet_strap_and_clasp_inspection
        ?.micro_adjustment_functioning,
    clasp_engravings:
      watchData?.bracelet_strap_and_clasp_inspection?.clasp_engravings || "",
    bracelet_notes: watchData?.bracelet_strap_and_clasp_inspection?.notes || "",
  },
  step6: {
    movement_caliber: watchData?.movement_examination?.movement_caliber || "",
    watch_movement_analysis_image_path:
      watchData?.movement_examination?.watch_movement_analysis_image_path,
    movement_engraving_quality:
      watchData?.movement_examination?.movement_engraving_quality || "",
    movement_other: watchData?.movement_examination?.movement_notes,
    has_purple_reversing_wheels:
      watchData?.movement_examination?.has_purple_reversing_wheels,
    has_blue_parachrom_hairspring:
      watchData?.movement_examination?.has_blue_parachrom_hairspring,
    movement_notes: watchData?.movement_examination?.movement_notes || "",
  },
  step7: {
    watch_performance_tests_image_path:
      watchData?.performance_and_function_test
        ?.watch_performance_tests_image_path,
    amplitude_degrees:
      watchData?.performance_and_function_test?.amplitude_degrees || "",
    beat_error_ms:
      watchData?.performance_and_function_test?.beat_error_ms || "",
    chronograph_works:
      watchData?.performance_and_function_test?.chronograph_works,
    date_change_works:
      watchData?.performance_and_function_test?.date_change_works,
    performance_notes: watchData?.performance_and_function_test?.notes || "",
    power_reserve_test_result:
      watchData?.performance_and_function_test?.power_reserve_test_result || "",
    rate_seconds_per_day:
      watchData?.performance_and_function_test?.rate_seconds_per_day || "",
    time_setting_works:
      watchData?.performance_and_function_test?.time_setting_works,
  },
  step8: {
    authenticity_verdict: watchData?.authenticity_verdict || "",
    final_summary: watchData?.final_summary || "",
    estimated_production_year: watchData?.estimated_production_year || "",
  },
});

export function EditAuthenticationModal({
  authId,
  open,
  onOpenChange,
  trigger,
  watchData,
}: EditAuthenticationModalProps) {
  const [tabValue, setTabValue] = useState("userInformation");
  const [internalOpen, setInternalOpen] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOpen = open !== undefined ? open : internalOpen;
  const handleOpenChange = onOpenChange || setInternalOpen;

  // Memoize default values
  const defaultValues = useMemo(
    () => createDefaultValues(watchData),
    [watchData]
  );

  // Initialize all forms
  const userInformationForm = useForm({
    defaultValues: defaultValues.userInformation,
  });
  const step1Form = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: defaultValues.step1,
  });
  const step2Form = useForm({ defaultValues: defaultValues.step2 });
  const step3Form = useForm({ defaultValues: defaultValues.step3 });
  const step4Form = useForm({ defaultValues: defaultValues.step4 });
  const step5Form = useForm({ defaultValues: defaultValues.step5 });
  const step6Form = useForm({ defaultValues: defaultValues.step6 });
  const step7Form = useForm({ defaultValues: defaultValues.step7 });
  const step8Form = useForm({ defaultValues: defaultValues.step8 });

  const forms = {
    userInformationForm,
    step1Form,
    step2Form,
    step3Form,
    step4Form,
    step5Form,
    step6Form,
    step7Form,
    step8Form,
  };

  // Collect all form data
  const collectAllFormData = () => {
    const userInformationData = userInformationForm.getValues();
    const step1Data = step1Form.getValues();
    const step2Data = step2Form.getValues();
    const step3Data = step3Form.getValues();
    const step4Data = step4Form.getValues();
    const step5Data = step5Form.getValues();
    const step6Data = step6Form.getValues();
    const step7Data = step7Form.getValues();
    const step8Data = step8Form.getValues();

    return {
      // User information
      ...userInformationData,
      date_of_sale: watchData?.date_of_sale || "",
      authenticity_verdict: step8Data.authenticity_verdict,
      final_summary: step8Data.final_summary,
      estimated_production_year: step8Data.estimated_production_year,

      // Step 1
      ...step1Data,

      // Step 2
      serial_number: step2Data.serial_number,
      watch_serial_info_image: step2Data.watch_serial_info_image_path,
      model_number: step2Data.model_number,
      serial_found_location: step2Data.serial_found_location,
      matches_documents: step2Data.matches_documents,
      engraving_quality: step2Data.engraving_quality,
      serial_notes: step2Data.serial_notes,

      // Step 3
      case_material_verified: step3Data.case_material_verified,
      watch_product_case_analysis_image:
        step3Data.watch_product_case_analysis_image_path,
      case_weight_feel: step3Data.case_weight_feel,
      finishing_transitions: step3Data.finishing_transitions,
      bezel_action: step3Data.bezel_action,
      crystal_type: step3Data.crystal_type,
      laser_etched_crown: step3Data.laser_etched_crown,
      crown_logo_sharpness: step3Data.crown_logo_sharpness,
      case_notes: step3Data.case_notes,

      // Step 4
      dial_text_quality: step4Data.dial_text_quality,
      watch_product_dial_analysis_image:
        step4Data.watch_product_dial_analysis_image_path,
      lume_application: step4Data.lume_application,
      cyclops_magnification: step4Data.cyclops_magnification,
      date_alignment: step4Data.date_alignment,
      dial_notes: step4Data.dial_notes,

      // Step 5
      bracelet_link_type: step5Data.bracelet_link_type,
      watch_product_bracelet_analysis_image:
        step5Data.watch_product_bracelet_analysis_image_path,
      connection_type: step5Data.connection_type,
      clasp_action: step5Data.clasp_action,
      micro_adjustment_functioning: step5Data.micro_adjustment_functioning,
      clasp_engravings: step5Data.clasp_engravings,
      bracelet_notes: step5Data.bracelet_notes,

      // Step 6
      movement_caliber: step6Data.movement_caliber,
      watch_movement_analysis_image:
        step6Data.watch_movement_analysis_image_path,
      movement_engraving_quality: step6Data.movement_engraving_quality,
      movement_other: step6Data.movement_other,
      has_purple_reversing_wheels: step6Data.has_purple_reversing_wheels,
      has_blue_parachrom_hairspring: step6Data.has_blue_parachrom_hairspring,
      has_cotes_de_geneve: false,
      has_perlage: false,
      movement_notes: step6Data.movement_notes,

      // Step 7
      watch_performance_tests_image:
        step7Data.watch_performance_tests_image_path,
      amplitude_degrees: step7Data.amplitude_degrees,
      beat_error_ms: step7Data.beat_error_ms,
      chronograph_works: step7Data.chronograph_works,
      date_change_works: step7Data.date_change_works,
      power_reserve_test_result: step7Data.power_reserve_test_result,
      rate_seconds_per_day: step7Data.rate_seconds_per_day,
      time_setting_works: step7Data.time_setting_works,
      performance_notes: step7Data.performance_notes,
    };
  };

  // File upload configuration
  const FILE_UPLOADS = [
    {
      form: step1Form,
      fields: [
        "warranty_card",
        "purchase_receipt",
        "service_records",
        "watch_image_front",
        "watch_image_back",
        "watch_image_side",
      ],
    },
    {
      form: step2Form,
      fields: [
        {
          key: "watch_serial_info_image_path",
          name: "watch_serial_info_image",
        },
      ],
    },
    {
      form: step3Form,
      fields: [
        {
          key: "watch_product_case_analysis_image_path",
          name: "watch_product_case_analysis_image",
        },
      ],
    },
    {
      form: step4Form,
      fields: [
        {
          key: "watch_product_dial_analysis_image_path",
          name: "watch_product_dial_analysis_image",
        },
      ],
    },
    {
      form: step5Form,
      fields: [
        {
          key: "watch_product_bracelet_analysis_image_path",
          name: "watch_product_bracelet_analysis_image",
        },
      ],
    },
    {
      form: step6Form,
      fields: [
        {
          key: "watch_movement_analysis_image_path",
          name: "watch_movement_analysis_image",
        },
      ],
    },
    {
      form: step7Form,
      fields: [
        {
          key: "watch_performance_tests_image_path",
          name: "watch_performance_tests_image",
        },
      ],
    },
  ];

  // Handle file uploads
  const appendFileUploads = (formData: FormData) => {
    FILE_UPLOADS.forEach(({ form, fields }) => {
      const data = form.getValues();
      fields.forEach((field) => {
        const fieldKey = typeof field === "string" ? field : field.key;
        const fieldName = typeof field === "string" ? field : field.name;

        if (data[fieldKey] instanceof File) {
          formData.append(fieldName, data[fieldKey]);
        }
      });
    });
  };

  // Submit all data
  const handleSubmitAll = async () => {
    try {
      setIsSubmitting(true);
      const allData = collectAllFormData();

      // Validate all forms
      await Promise.all(
        Object.values(forms).map((form: any) => form.trigger())
      );
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Authentication required. Please log in again.");
        return;
      }

      if (!watchData?.id) {
        toast.error("Watch data ID is missing");
        return;
      }

      const formData = new FormData();

      // Add non-file data
      Object.entries(allData).forEach(([key, value]) => {
        if (value instanceof File) return;

        if (typeof value === "boolean") {
          formData.append(key, value ? "1" : "0");
        } else if (value === null || value === undefined) {
          formData.append(key, "");
        } else {
          formData.append(key, String(value));
        }
      });

      // Add file uploads
      appendFileUploads(formData);
      formData.append("_method", "PUT");

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth-products/${watchData.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        }
      );

      toast.success("Watch data submitted successfully");
    } catch (error) {
      toast.error("Submission Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generic step handlers
  const createStepHandler =
    (stepKey: string, nextTab: string) => (data: any) => {
      console.log(`${stepKey} data:`, data);
      setCompletedSteps((prev) => new Set([...prev, stepKey]));
      setTabValue(nextTab);
    };

  const createBackHandler = (prevTab: string) => () => setTabValue(prevTab);

  const handleClose = () => {
    Object.values(forms).forEach((form) => form.reset());
    setCompletedSteps(new Set());
    setTabValue("userInformation");
    handleOpenChange(false);
  };

  // Render step content
  const renderStepContent = (step: string) => {
    const stepComponents = {
      userInformation: (
        <UserInformationForm
          form={userInformationForm}
          onSubmit={createStepHandler("userInformation", "step1")}
          onCancel={handleClose}
        />
      ),
      step1: (
        <Step1Form
          form={step1Form}
          onSubmit={createStepHandler("step1", "step2")}
          onBack={createBackHandler("userInformation")}
          watchData={watchData}
        />
      ),
      step2: (
        <Step2Form
          form={step2Form}
          onSubmit={createStepHandler("step2", "step3")}
          onBack={createBackHandler("step1")}
          watchData={watchData}
        />
      ),
      step3: (
        <Step3Form
          form={step3Form}
          onSubmit={createStepHandler("step3", "step4")}
          onBack={createBackHandler("step2")}
          watchData={watchData}
        />
      ),
      step4: (
        <Step4Form
          form={step4Form}
          onSubmit={createStepHandler("step4", "step5")}
          onBack={createBackHandler("step3")}
          step={4}
          watchData={watchData}
        />
      ),
      step5: (
        <Step5Form
          form={step5Form}
          onSubmit={createStepHandler("step5", "step6")}
          onBack={createBackHandler("step4")}
          step={5}
          watchData={watchData}
        />
      ),
      step6: (
        <Step6Form
          form={step6Form}
          onSubmit={createStepHandler("step6", "step7")}
          onBack={createBackHandler("step5")}
          step={6}
          watchData={watchData}
        />
      ),
      step7: (
        <Step7Form
          form={step7Form}
          onSubmit={createStepHandler("step7", "step8")}
          onBack={createBackHandler("step6")}
          step={7}
          watchData={watchData}
        />
      ),
      step8: (
        <Step8Form
          form={step8Form}
          onSubmit={createStepHandler("step8", "step8")}
          onBack={createBackHandler("step7")}
          step={8}
          watchData={watchData}
        />
      ),
    };

    return stepComponents[step as keyof typeof stepComponents];
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-bold">
            Edit Authentication
          </DialogTitle>

          <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg border mt-2">
            <div>
              <Label className="text-xs font-medium text-muted-foreground">
                Watch Name
              </Label>
              <p className="text-sm font-semibold">
                {watchData?.name || "N/A"}
              </p>
            </div>
            <div className="h-6 border-l border-border" />
            <div>
              <Label className="text-xs font-medium text-muted-foreground">
                Brand/Model
              </Label>
              <p className="text-sm">
                {watchData?.brand} {watchData?.model}
              </p>
            </div>
            <div className="h-6 border-l border-border" />
            <div>
              <Label className="text-xs font-medium text-muted-foreground">
                Serial Number
              </Label>
              <p className="text-sm font-mono font-semibold">
                {watchData?.serial_and_model_number_cross_reference
                  ?.serial_number || "N/A"}
              </p>
            </div>
            <div className="h-6 border-l border-border" />
            <div>
              <Label className="text-xs font-medium text-muted-foreground">
                Last Updated
              </Label>
              <p className="text-xs">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
            <TabsList className="grid w-full grid-cols-9 mb-4 flex-shrink-0">
              {TAB_CONFIG.map((tab) => (
                <TabsTrigger
                  key={tab.key}
                  value={tab.key}
                  className="text-xs px-1 relative"
                >
                  <div className="flex items-center gap-1">
                    {completedSteps.has(tab.key) && (
                      <CheckCircle className="w-3 h-3 text-green-500" />
                    )}
                    <span
                      className={
                        completedSteps.has(tab.key) ? "text-green-600" : ""
                      }
                    >
                      {tab.label}
                    </span>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            {TAB_CONFIG.map((tab) => (
              <TabsContent key={tab.key} value={tab.key} className="mt-0">
                <Card className="border-none shadow-none">
                  <CardHeader className="px-0 pb-4">
                    <CardTitle className="text-lg">{tab.fullLabel}</CardTitle>
                    <CardDescription>
                      {tab.key === "userInformation"
                        ? "Basic information about the watch being authenticated"
                        : `Complete ${tab.label.toLowerCase()} section`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-0">
                    <div className="space-y-6">
                      {renderStepContent(tab.key)}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="flex-shrink-0 border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Progress: {completedSteps.size}/9 steps completed
            </div>
            <Button onClick={handleSubmitAll} size="sm" disabled={isSubmitting}>
              <Send className="w-4 h-4 mr-1" />
              {isSubmitting ? "Updating..." : "Update Authentication"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
