import { useState } from "react";
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
import axios from "axios";

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
  provenance_documentation_audit: {
    warranty_card_path?: File | null;
    purchase_receipt_path?: File | null;
    service_records_path?: File | null;
    watch_image_front_path: File | null;
    watch_image_back_path: File | null;
    watch_image_side_path: File | null;
    is_authorized_dealer?: boolean;
    warranty_card_notes?: string;
    service_history_notes?: string;
  };
  serial_and_model_number_cross_reference: {
    watch_serial_info_image_path?: File | null;
    serial_number?: string;
    model_number?: string;
    serial_found_location?: string;
    matches_documents?: string;
    engraving_quality?: string;
    notes?: string;
  };
  case_bezel_and_crystal_analysis: {
    watch_product_case_analysis_image_path?: File | null;
    case_material_verified?: string;
    case_weight_feel?: string;
    finishing_transitions?: string;
    bezel_action?: string;
    crystal_type?: string;
    laser_etched_crown?: number;
    crown_logo_sharpness?: string;
    notes?: string;
  };
  dial_hands_and_date_scrutiny: {
    watch_product_dial_analysis_image_path?: File | null;
    dial_text_quality?: string;
    lume_application?: string;
    cyclops_magnification?: string;
    date_alignment?: number;
    notes?: string;
  };
  bracelet_strap_and_clasp_inspection: {
    watch_product_bracelet_analysis_image_path?: File | null;
    bracelet_link_type?: string;
    connection_type?: string;
    clasp_action?: string;
    micro_adjustment_functioning?: string;
    clasp_engravings?: string;
    notes?: string;
  };
  movement_examination: {
    watch_movement_analysis_image_path?: File | null;
    movement_caliber?: string;
    movement_engraving_quality?: string;
    movement_other?: string;
    has_purple_reversing_wheels?: number;
    movement_notes?: string;
    has_perlage?: boolean;
    has_cotes_de_geneve?: boolean;
    has_blue_parachrom_hairspring?: boolean;
  };
  performance_and_function_test: {
    watch_performance_tests_image_path?: File | null;
    amplitude_degrees?: string;
    beat_error_ms?: string;
    chronograph_works?: "yes" | "no" | "n/a";
    date_change_works?: boolean;
    power_reserve_test_result?: string;
    rate_seconds_per_day?: string;
    time_setting_works?: boolean;
    notes?: string;
  };
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
  // Use controlled open state if provided, otherwise use internal state
  const isOpen = open !== undefined ? open : internalOpen;
  const handleOpenChange = onOpenChange || setInternalOpen;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userInformationForm = useForm({
    defaultValues: {
      id: watchData?.id || "",
      account_id: watchData?.account_id || "",
      name: watchData?.name || "",
      email: watchData?.email || "",
      date_of_sale: watchData?.date_of_sale || "",
      brand: watchData?.brand || "",
      model: watchData?.model || "",
      company_name: watchData?.company_name || "",
      company_address: watchData?.company_address || "",
      contact_method: watchData?.contact_method || "",
    },
  });

  // Step 1 Form
  const step1Form = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      warranty_card:
        watchData?.provenance_documentation_audit?.warranty_card_path || null,
      purchase_receipt:
        watchData?.provenance_documentation_audit?.purchase_receipt_path ||
        null,
      service_records:
        watchData?.provenance_documentation_audit?.service_records_path || null,
      watch_image_front:
        watchData?.provenance_documentation_audit?.watch_image_front_path ||
        null,
      watch_image_back:
        watchData?.provenance_documentation_audit?.watch_image_back_path ||
        null,
      watch_image_side:
        watchData?.provenance_documentation_audit?.watch_image_side_path ||
        null,
      is_authorized_dealer:
        watchData?.provenance_documentation_audit?.is_authorized_dealer ||
        undefined,
      warranty_card_notes:
        watchData?.provenance_documentation_audit?.warranty_card_notes || "",
      service_history_notes:
        watchData?.provenance_documentation_audit?.service_history_notes || "",
    },
  });

  // Step 2 Form
  const step2Form = useForm({
    defaultValues: {
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
  });

  // Step 3 Form
  const step3Form = useForm({
    defaultValues: {
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
  });

  const step4Form = useForm({
    defaultValues: {
      dial_text_quality:
        watchData?.dial_hands_and_date_scrutiny?.dial_text_quality || "",
      lume_application:
        watchData?.dial_hands_and_date_scrutiny?.lume_application || "",
      cyclops_magnification:
        watchData?.dial_hands_and_date_scrutiny?.cyclops_magnification || "",
      date_alignment: watchData?.dial_hands_and_date_scrutiny?.date_alignment,
      dial_notes: watchData?.dial_hands_and_date_scrutiny?.notes || "",
    },
  });

  // Step 5 Form
  const step5Form = useForm({
    defaultValues: {
      bracelet_link_type:
        watchData?.bracelet_strap_and_clasp_inspection?.bracelet_link_type ||
        "",
      connection_type:
        watchData?.bracelet_strap_and_clasp_inspection?.connection_type || "",
      clasp_action:
        watchData?.bracelet_strap_and_clasp_inspection?.clasp_action || "",
      micro_adjustment_functioning:
        watchData?.bracelet_strap_and_clasp_inspection
          ?.micro_adjustment_functioning,
      clasp_engravings:
        watchData?.bracelet_strap_and_clasp_inspection?.clasp_engravings || "",
      bracelet_notes:
        watchData?.bracelet_strap_and_clasp_inspection?.notes || "",
    },
  });

  // Step 6 Form
  const step6Form = useForm({
    defaultValues: {
      movement_caliber: watchData?.movement_examination?.movement_caliber || "",
      movement_engraving_quality:
        watchData?.movement_examination?.movement_engraving_quality || "",
      movement_other: watchData?.movement_examination?.movement_notes,
      has_purple_reversing_wheels:
        watchData?.movement_examination?.has_purple_reversing_wheels,
      has_blue_parachrom_hairspring:
        watchData?.movement_examination?.has_blue_parachrom_hairspring,
      movement_notes: watchData?.movement_examination?.movement_notes || "",
    },
  });

  const step7Form = useForm({
    defaultValues: {
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
        watchData?.performance_and_function_test?.power_reserve_test_result ||
        "",
      rate_seconds_per_day:
        watchData?.performance_and_function_test?.rate_seconds_per_day || "",
      time_setting_works:
        watchData?.performance_and_function_test?.time_setting_works,
    },
  });

  const step8Form = useForm({
    defaultValues: {
      authenticity_verdict: watchData?.authenticity_verdict || "",
      final_summary: watchData?.final_summary || "",
      estimated_production_year: watchData?.estimated_production_year || "",
    },
  });

  // Collect all form data including user information
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

    // Return flat structure that matches backend expectations
    return {
      // User information (main product fields)
      id: userInformationData.id,
      account_id: userInformationData?.account_id,
      name: userInformationData?.name,
      brand: userInformationData?.brand,
      model: userInformationData?.model,
      email: userInformationData?.email,
      company_name: userInformationData?.company_name,
      company_address: userInformationData?.company_address,
      contact_method: userInformationData?.contact_method,
      date_of_sale: watchData?.date_of_sale || "",
      authenticity_verdict: step8Data.authenticity_verdict,
      final_summary: step8Data.final_summary,
      estimated_production_year: step8Data.estimated_production_year,
      // Provenance documentation (step 1) - FILES WILL BE HANDLED SEPARATELY
      warranty_card: step1Data.warranty_card,
      purchase_receipt: step1Data.purchase_receipt,
      service_records: step1Data.service_records,
      // Watch images - these will be handled as files
      watch_image_front: step1Data.watch_image_front,
      watch_image_back: step1Data.watch_image_back,
      watch_image_side: step1Data.watch_image_side,
      is_authorized_dealer: step1Data.is_authorized_dealer,
      warranty_card_notes: step1Data.warranty_card_notes,
      service_history_notes: step1Data.service_history_notes,

      // Serial and model number (step 2)
      serial_number: step2Data.serial_number,
      model_number: step2Data.model_number,
      serial_found_location: step2Data.serial_found_location,
      matches_documents: step2Data.matches_documents,
      engraving_quality: step2Data.engraving_quality,
      serial_notes: step2Data.serial_notes,

      // Case, bezel, and crystal (step 3)
      case_material_verified: step3Data.case_material_verified,
      case_weight_feel: step3Data.case_weight_feel,
      finishing_transitions: step3Data.finishing_transitions,
      bezel_action: step3Data.bezel_action,
      crystal_type: step3Data.crystal_type,
      laser_etched_crown: step3Data.laser_etched_crown,
      crown_logo_sharpness: step3Data.crown_logo_sharpness,
      case_notes: step3Data.case_notes,

      // Dial, hands, and date (step 4)
      dial_text_quality: step4Data.dial_text_quality,
      lume_application: step4Data.lume_application,
      cyclops_magnification: step4Data.cyclops_magnification,
      date_alignment: step4Data.date_alignment,
      dial_notes: step4Data.dial_notes,

      // Bracelet/strap and clasp (step 5)
      bracelet_link_type: step5Data.bracelet_link_type,
      connection_type: step5Data.connection_type,
      clasp_action: step5Data.clasp_action,
      micro_adjustment_functioning: step5Data.micro_adjustment_functioning,
      clasp_engravings: step5Data.clasp_engravings,
      bracelet_notes: step5Data.bracelet_notes,

      // Movement examination (step 6)
      movement_caliber: step6Data.movement_caliber,
      movement_engraving_quality: step6Data.movement_engraving_quality,
      movement_other: step6Data.movement_other,
      has_purple_reversing_wheels: step6Data.has_purple_reversing_wheels,
      has_blue_parachrom_hairspring: step6Data.has_blue_parachrom_hairspring,
      has_cotes_de_geneve: false, // Add these if they exist in your forms
      has_perlage: false,
      movement_notes: step6Data.movement_notes,

      // Performance and function test (step 7)
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

  // Submit all data
  const handleSubmitAll = async () => {
    try {
      setIsSubmitting(true); // Start loading

      // Collect and validate data
      const allData = collectAllFormData();

      console.log(allData);
      // Validate all forms
      const validationResults = await Promise.all([
        userInformationForm.trigger(),
        step1Form.trigger(),
        step2Form.trigger(),
        step3Form.trigger(),
        step4Form.trigger(),
        step5Form.trigger(),
        step6Form.trigger(),
        step7Form.trigger(),
        step8Form.trigger(),
      ]);

      // Check token
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Authentication required. Please log in again.");
        return;
      }

      // Check if watchData and ID exist
      if (!watchData?.id) {
        toast.error("Watch data ID is missing");
        return;
      }

      // Create FormData for file uploads
      const formData = new FormData();

      // Add all non-file data to FormData
      Object.keys(allData).forEach((key) => {
        const value = allData[key];

        // Skip file objects - they'll be handled separately
        if (value instanceof File) {
          return;
        }

        // Handle boolean values
        if (typeof value === "boolean") {
          formData.append(key, value ? "1" : "0");
        }
        // Handle null/undefined values
        else if (value === null || value === undefined) {
          formData.append(key, "");
        }
        // Handle all other values
        else {
          formData.append(key, String(value));
        }
      });

      // Handle file uploads specifically
      const step1Data = step1Form.getValues();

      // Add document files if they exist and are File objects
      if (step1Data.warranty_card instanceof File) {
        formData.append("warranty_card", step1Data.warranty_card);
      }

      if (step1Data.purchase_receipt instanceof File) {
        formData.append("purchase_receipt", step1Data.purchase_receipt);
      }

      if (step1Data.service_records instanceof File) {
        formData.append("service_records", step1Data.service_records);
      }

      // Add watch image files if they exist and are File objects
      if (step1Data.watch_image_front instanceof File) {
        formData.append("watch_image_front", step1Data.watch_image_front);
      }

      if (step1Data.watch_image_back instanceof File) {
        formData.append("watch_image_back", step1Data.watch_image_back);
      }

      if (step1Data.watch_image_side instanceof File) {
        formData.append("watch_image_side", step1Data.watch_image_side);
      }

      // Add method spoofing for PUT request (Laravel requirement for file uploads)
      formData.append("_method", "PUT");

      const response = await axios.post(
        // Use POST with _method=PUT for file uploads
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth-products/${watchData.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Important for file uploads
            Accept: "application/json",
          },
        }
      );

      toast.success("Watch data submitted successfully");
    } catch (error) {
      toast.error(`Submission Error`);
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };

  // Step submission handlers
  const onSubmitUserInformation = (data: any) => {
    console.log("User Information:", data);
    setCompletedSteps((prev) => new Set([...prev, "userInformation"]));
    setTabValue("step1");
  };

  const onSubmitStep1 = (data: any) => {
    console.log("Step 1 data:", data);
    setCompletedSteps((prev) => new Set([...prev, "step1"]));
    setTabValue("step2");
  };

  const onSubmitStep2 = (data: any) => {
    console.log("Step 2 data:", data);
    setCompletedSteps((prev) => new Set([...prev, "step2"]));
    setTabValue("step3");
  };

  const onSubmitStep3 = (data: any) => {
    console.log("Step 3 data:", data);
    setCompletedSteps((prev) => new Set([...prev, "step3"]));
    setTabValue("step4");
  };

  const onSubmitStep4 = (data: any) => {
    console.log("Step 4 data:", data);
    setCompletedSteps((prev) => new Set([...prev, "step4"]));
    setTabValue("step5");
  };

  const onSubmitStep5 = (data: any) => {
    console.log("Step 5 data:", data);
    setCompletedSteps((prev) => new Set([...prev, "step5"]));
    setTabValue("step6");
  };

  const onSubmitStep6 = (data: any) => {
    console.log("Step 6 data:", data);
    setCompletedSteps((prev) => new Set([...prev, "step6"]));
    setTabValue("step7");
  };

  const onSubmitStep7 = (data: any) => {
    console.log("Step 7 data:", data);
    setCompletedSteps((prev) => new Set([...prev, "step7"]));
    setTabValue("step8");
  };

  const onSubmitStep8 = (data: any) => {
    console.log("Step 8 data:", data);
    setCompletedSteps((prev) => new Set([...prev, "step8"]));
    // Stay on step 8 for final submission
  };

  // Back handlers
  const onBackStep1 = () => {
    setTabValue("userInformation");
  };

  const onBackStep2 = () => {
    setTabValue("step1");
  };

  const onBackStep3 = () => {
    setTabValue("step2");
  };

  const onBackStep4 = () => {
    setTabValue("step3");
  };

  const onBackStep5 = () => {
    setTabValue("step4");
  };

  const onBackStep6 = () => {
    setTabValue("step5");
  };

  const onBackStep7 = () => {
    setTabValue("step6");
  };

  const onBackStep8 = () => {
    setTabValue("step7");
  };

  // Updated tab configuration
  const tabConfig = [
    {
      key: "userInformation",
      label: "User Info",
      fullLabel: "User Information",
    },
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

  const handleClose = () => {
    // Reset forms when closing
    userInformationForm.reset();
    step1Form.reset();
    step2Form.reset();
    step3Form.reset();
    step4Form.reset();
    step5Form.reset();
    step6Form.reset();
    step7Form.reset();
    step8Form.reset();
    setCompletedSteps(new Set());
    setTabValue("userInformation");
    handleOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">
              Edit Authentication
            </DialogTitle>
          </div>
          <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg border mt-2">
            <div>
              <Label className="text-xs font-medium text-muted-foreground">
                Watch Name
              </Label>
              <p className="text-sm font-semibold">
                {watchData?.name || "N/A"}
              </p>
            </div>
            <div className="h-6 border-l border-border"></div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">
                Brand/Model
              </Label>
              <p className="text-sm">
                {watchData?.brand} {watchData?.model}
              </p>
            </div>
            <div className="h-6 border-l border-border"></div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">
                Serial Number
              </Label>
              <p className="text-sm font-mono font-semibold">
                {watchData?.serial_and_model_number_cross_reference
                  ?.serial_number || "N/A"}
              </p>
            </div>
            <div className="h-6 border-l border-border"></div>
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
            {/* Updated Tabs List - Now includes all 9 tabs */}
            <TabsList className="grid w-full grid-cols-9 mb-4 flex-shrink-0">
              {tabConfig.map((tab) => {
                const isCompleted = completedSteps.has(tab.key);
                return (
                  <TabsTrigger
                    key={tab.key}
                    value={tab.key}
                    className="text-xs px-1 relative"
                  >
                    <div className="flex items-center gap-1">
                      {isCompleted && (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      )}
                      <span className={isCompleted ? "text-green-600" : ""}>
                        {tab.label}
                      </span>
                    </div>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* UserInformation Tab Content */}
            <TabsContent value="userInformation" className="mt-0">
              <Card className="border-none shadow-none">
                <CardHeader className="px-0 pb-4">
                  <CardTitle className="text-lg">User Information</CardTitle>
                  <CardDescription>
                    Basic information about the watch being authenticated
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <div className="space-y-6">
                    <UserInformationForm
                      form={userInformationForm}
                      onSubmit={onSubmitUserInformation}
                      onCancel={handleClose}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Step 1 */}
            <TabsContent value="step1" className="mt-0">
              <Card className="border-none shadow-none">
                <CardHeader className="px-0 pb-4">
                  <CardTitle className="text-lg">
                    Provenance & Documentation Audit
                  </CardTitle>
                  <CardDescription>
                    Upload and verify the provenance documentation of the watch.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <div className="space-y-6">
                    <Step1Form
                      form={step1Form}
                      onSubmit={onSubmitStep1}
                      onBack={onBackStep1}
                      watchData={watchData}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Step 2 */}
            <TabsContent value="step2" className="mt-0">
              <Card className="border-none shadow-none">
                <CardHeader className="px-0 pb-4">
                  <CardTitle className="text-lg">
                    Serial & Model Number Cross-Reference
                  </CardTitle>
                  <CardDescription>
                    Verify and cross-reference the serial and model numbers.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <Step2Form
                    form={step2Form}
                    onSubmit={onSubmitStep2}
                    onBack={onBackStep2}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Step 3 */}
            <TabsContent value="step3" className="mt-0">
              <Card className="border-none shadow-none">
                <CardHeader className="px-0 pb-4">
                  <CardTitle className="text-lg">
                    Case, Bezel, and Crystal Analysis
                  </CardTitle>
                  <CardDescription>
                    Analyze the case, bezel, and crystal components for
                    authenticity.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <Step3Form
                    form={step3Form}
                    onSubmit={onSubmitStep3}
                    onBack={onBackStep3}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Step 4 */}
            <TabsContent value="step4" className="mt-0">
              <Card className="border-none shadow-none">
                <CardHeader className="px-0 pb-4">
                  <CardTitle className="text-lg">
                    Dial, Hands, and Date Scrutiny
                  </CardTitle>
                  <CardDescription>
                    Examine the dial, hands, and date components for
                    authenticity.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <Step4Form
                    form={step4Form}
                    onSubmit={onSubmitStep4}
                    onBack={onBackStep4}
                    step={4}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Step 5 */}
            <TabsContent value="step5" className="mt-0">
              <Card className="border-none shadow-none">
                <CardHeader className="px-0 pb-4">
                  <CardTitle className="text-lg">
                    Bracelet/Strap and Clasp Inspection
                  </CardTitle>
                  <CardDescription>
                    Analyze the bracelet/strap and clasp mechanisms.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <Step5Form
                    form={step5Form}
                    onSubmit={onSubmitStep5}
                    onBack={onBackStep5}
                    step={5}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Step 6 */}
            <TabsContent value="step6" className="mt-0">
              <Card className="border-none shadow-none">
                <CardHeader className="px-0 pb-4">
                  <CardTitle className="text-lg">
                    Movement Examination
                  </CardTitle>
                  <CardDescription>
                    Inspect the movement components and finishing details.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <Step6Form
                    form={step6Form}
                    onSubmit={onSubmitStep6}
                    onBack={onBackStep6}
                    step={6}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Step 7 */}
            <TabsContent value="step7" className="mt-0">
              <Card className="border-none shadow-none">
                <CardHeader className="px-0 pb-4">
                  <CardTitle className="text-lg">
                    Performance & Function Test
                  </CardTitle>
                  <CardDescription>
                    Test the watch's performance and functional capabilities.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <Step7Form
                    form={step7Form}
                    onSubmit={onSubmitStep7}
                    onBack={onBackStep7}
                    step={7}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Step 8 */}
            <TabsContent value="step8" className="mt-0">
              <Card className="border-none shadow-none">
                <CardHeader className="px-0 pb-4">
                  <CardTitle className="text-lg">
                    Final Condition & Grading
                  </CardTitle>
                  <CardDescription>
                    Complete the final assessment and provide authenticity
                    verdict.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <div className="space-y-6">
                    <Step8Form
                      form={step8Form}
                      onSubmit={onSubmitStep8}
                      onBack={onBackStep8}
                      step={8}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer with progress indicator and submit button */}
        <div className="flex-shrink-0 border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Progress: {completedSteps.size}/9 steps completed
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSubmitAll}
                size="sm"
                disabled={isSubmitting}
              >
                <Send className="w-4 h-4 mr-1" />
                {isSubmitting ? "Updating..." : "Update Authentication"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
