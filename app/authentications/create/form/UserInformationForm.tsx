"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { UseFormReturn, useForm, useWatch } from "react-hook-form";
type FormValues = {
  brand: string;
  model: string;
  user_type: string;
  company_name: string;
  abn: string;
  company_address: string;
  name: string;
  email: string;
  phone: string;
  contact_method: string;

  // Step 2 fields
  serial_number: string;
  model_number: string;
  serial_found_location: string;
  matches_documents: string;
  engraving_quality: string;
  serial_notes: string;

  // Step 3 fields
  case_material_verified: string;
  case_weight_feel: string;
  finishing_transitions: string;
  bezel_action: string;
  crystal_type: string;
  laser_etched_crown: string;
  crown_logo_sharpness: string;
  case_notes: string;

  // Step 4 fields
  dial_text_quality: string;
  lume_application: string;
  cyclops_magnification: string;
  date_alignment: string;
  dial_notes: string;
  // Step 5
  bracelet_link_type: string;
  connection_type: string;
  clasp_action: string;
  micro_adjustment_functioning: string;
  clasp_engravings: string;
  bracelet_notes: string;

  // Step 6
  movement_caliber: string;
  movement_engraving_quality: string;
  decorative_finishing: string[];
  movement_other: string;
  purple_reversing_wheels: string;
  blue_parachrom_hairspring: string;
  movement_notes: string;

  // Step 7

  rate_seconds_per_day: string;
  amplitude_degrees: string;
  beat_error_ms: string;
  power_reserve_test_result: string;
  time_setting_works: string;
  date_change_works: string;
  chronograph_works: string;
  performance_notes: string;

  authenticity_verdict: string;
  component_grading: {
    case: string;
    bracelet: string;
    dial: string;
    bezel: string;
    crystal: string;
  };
  was_polished: string;
  estimated_production_year: string;
  final_summary: string;
  status: string;
};

type UserInformationFormProps = {
  form: UseFormReturn<FormValues>;
  onSubmit: (data: FormValues) => void;
};

export function UserInformationForm({
  form,
  onSubmit,
}: UserInformationFormProps) {
  const { handleSubmit, control } = form;

  // Watch for user_type value
  const userType = useWatch({ control, name: "user_type" });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-y-4">
        <FormField
          name={"brand" as keyof FormValues}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Watch Brand</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Seiko">Seiko</SelectItem>
                    <SelectItem value="Casio">Casio</SelectItem>
                    <SelectItem value="Citizen">Citizen</SelectItem>
                    <SelectItem value="Rolex">Rolex</SelectItem>
                    <SelectItem value="Omega">Omega</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name={"model" as keyof FormValues}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* User Type */}
        <FormField
          name={"user_type" as keyof FormValues}
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Type</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="company">Company</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Company Fields */}
        {userType === "company" && (
          <>
            <FormField
              name={"company_name" as keyof FormValues}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                      autoComplete="organization"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name={"abn" as keyof FormValues}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ABN</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name={"company_address" as keyof FormValues}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                      autoComplete="street-address"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {/* Full Name */}
        <FormField
          name={"name" as keyof FormValues}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value || ""}
                  autoComplete="name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Email */}
        <FormField
          name={"email" as keyof FormValues}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value || ""}
                  type="email"
                  autoComplete="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone */}
        <FormField
          name={"phone" as keyof FormValues}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value || ""}
                  type="tel"
                  autoComplete="tel"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Contact Method */}
        <FormField
          name={"contact_method" as keyof FormValues}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Contact Method</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select contact method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

// Example usage with default values
export default function Page() {
  const form = useForm<FormValues>({
    defaultValues: {
      brand: "",
      model: "",
      user_type: "",
      company_name: "",
      abn: "",
      company_address: "",
      name: "",
      email: "",
      phone: "",
      contact_method: "",
      // Step 2 fields
      serial_number: "",
      model_number: "",
      serial_found_location: "",
      matches_documents: "",
      engraving_quality: "",
      serial_notes: "",

      // Step 3 fields
      case_material_verified: "",
      case_weight_feel: "",
      finishing_transitions: "",
      bezel_action: "",
      crystal_type: "",
      laser_etched_crown: "",
      crown_logo_sharpness: "",
      case_notes: "",

      // Step 4 defaults
      dial_text_quality: "",
      lume_application: "",
      cyclops_magnification: "",
      date_alignment: "",
      dial_notes: "",

      // Step 5
      bracelet_link_type: "",
      connection_type: "",
      clasp_action: "",
      micro_adjustment_functioning: "",
      clasp_engravings: "",
      bracelet_notes: "",

      // Step 6
      movement_caliber: "",
      movement_engraving_quality: "",
      movement_other: "",
      purple_reversing_wheels: "",
      blue_parachrom_hairspring: "",
      movement_notes: "",

      // step 7
      // rate_seconds_per_day: "",
      // amplitude_degrees: "",
      // beat_error_ms: "",
      // power_reserve_test_result: "",
      // time_setting_works: "yes", // or ""
      // date_change_works: "yes", // or ""
      // chronograph_works: "na", // or ""
      // performance_notes: "",

      // step 8
      authenticity_verdict: "",
      component_grading: {
        case: "",
        bracelet: "",
        dial: "",
        bezel: "",
        crystal: "",
      },
      was_polished: "",
      estimated_production_year: "",
      status: "",
      final_summary: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("All Datas", data);
  };

  return <UserInformationForm form={form} onSubmit={onSubmit} />;
}
