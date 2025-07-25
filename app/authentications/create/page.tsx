"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/components/auth-provider";
import DashboardLayout from "@/components/dashboard-layout";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileInput } from "@/components/ui/file-input";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Validation schemas for each step
const step0Schema = z.object({
  warranty_card: z.any(),
  purchase_receipts: z.any(),
  service_records: z.any().optional(),
  authorized_dealer: z.boolean().refine((val) => val === true, {
    message: "Dealer must be authorized",
  }),
  date_of_sale: z.date({
    required_error: "Date of sale is required",
    invalid_type_error: "Invalid date",
  }),
  warranty_card_notes: z
    .string()
    .min(10, "Please provide detailed notes (minimum 10 characters)"),
  service_history_notes: z.string().optional(),
});

const step1Schema = z.object({
  serial_number: z.string().min(1, "Serial number is required"),
  model_number: z.string().min(1, "Model number is required"),
  serial_location: z.boolean().refine((val) => val === true, {
    message: "Please confirm where the serial was found",
  }),
  match_with_documents: z.boolean().refine((val) => val === true, {
    message: "Serial must match with documents",
  }),
  engraving_quality: z.boolean().refine((val) => val === true, {
    message: "Please confirm engraving quality",
  }),
  serial_notes: z
    .string()
    .min(5, "Please provide notes (minimum 5 characters)"),
});

const step2Schema = z.object({
  // Add fields for step 2 when you implement them
});

// Combined schema for final submission
const fullFormSchema = step0Schema.merge(step1Schema).merge(step2Schema);

type FormData = z.infer<typeof fullFormSchema>;

export default function CreateAuthenticationPage() {
  const [step, setStep] = useState(0);
  const totalSteps = 3;

  // Get the current step's schema
  const getCurrentSchema = () => {
    switch (step) {
      case 0:
        return step0Schema;
      case 1:
        return step1Schema;
      case 2:
        return step2Schema;
      default:
        return step0Schema;
    }
  };

  const form = useForm<FormData>({
    resolver: zodResolver(getCurrentSchema()),
    mode: "onChange",
  });

  const {
    handleSubmit,
    control,
    reset,
    trigger,
    formState: { errors },
  } = form;

  const onSubmit = async (formData: FormData) => {
    // Validate current step before proceeding
    const isStepValid = await trigger();

    if (!isStepValid) {
      toast.error("Please fix the validation errors before proceeding");
      return;
    }

    if (step < totalSteps - 1) {
      setStep(step + 1);
      // Update resolver for next step
    } else {
      // Final submission - validate entire form
      const finalValidation = fullFormSchema.safeParse(formData);

      if (!finalValidation.success) {
        toast.error("Please complete all required fields");
        return;
      }

      console.log("Final form data:", finalValidation.data);
      setStep(0);
      reset();
      toast.success("Form successfully submitted");
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      // Update resolver for previous step
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-center">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div key={index} className="flex items-center">
              <div
                className={cn(
                  "w-4 h-4 rounded-full transition-all duration-300 ease-in-out",
                  index <= step ? "bg-primary" : "bg-primary/30",
                  index < step && "bg-primary"
                )}
              />
              {index < totalSteps - 1 && (
                <div
                  className={cn(
                    "w-8 h-0.5",
                    index < step ? "bg-primary" : "bg-primary/30"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        <Card className="w-full max-w-2xl mx-auto shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">
              Provenance & Documentation Audit
            </CardTitle>
            <CardDescription>Current step {step + 1}</CardDescription>
          </CardHeader>

          <CardContent>
            {/* Step 0 */}
            {step === 0 && (
              <Form {...form}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="grid gap-y-4"
                >
                  <FormField
                    name="warranty_card"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Upload warranty card *</FormLabel>
                        <FormControl>
                          <FileInput
                            value={field.value}
                            onChange={field.onChange}
                            accept="image/*, application/pdf"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="purchase_receipts"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Upload purchase receipts *</FormLabel>
                        <FormControl>
                          <FileInput
                            value={field.value}
                            onChange={field.onChange}
                            accept="image/*, application/pdf"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="service_records"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Upload service records</FormLabel>
                        <FormControl>
                          <FileInput
                            value={field.value}
                            onChange={field.onChange}
                            accept="image/*, application/pdf"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="authorized_dealer"
                    control={control}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Is the dealer an authorized dealer? *
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="date_of_sale"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date of Sale</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? format(field.value, "PPP")
                                  : "Pick a date"}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date > new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="warranty_card_notes"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Notes on warranty card (font, NFC check, etc.) *
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={5}
                            className="resize-none"
                            placeholder="Please provide detailed notes about the warranty card..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="service_history_notes"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Notes on service history (replacement parts,
                          authorized center?)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={5}
                            className="resize-none"
                            placeholder="Optional: Add notes about service history..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      className="font-medium"
                      size="sm"
                      onClick={handleBack}
                      disabled={step === 0}
                    >
                      Back
                    </Button>
                    <Button type="submit" size="sm" className="font-medium">
                      Next
                    </Button>
                  </div>
                </form>
              </Form>
            )}

            {/* Step 1 */}
            {step === 1 && (
              <Form {...form}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="grid gap-y-4"
                >
                  <FormField
                    name="serial_number"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Serial Number *</FormLabel>
                        <FormControl>
                          <Input {...field} autoComplete="off" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="model_number"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model Number *</FormLabel>
                        <FormControl>
                          <Input {...field} autoComplete="off" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="serial_location"
                    control={control}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Where was the serial found? *</FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="match_with_documents"
                    control={control}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Match with documents? *</FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="engraving_quality"
                    control={control}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Engraving Quality *</FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="serial_notes"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes *</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={5}
                            className="resize-none"
                            placeholder="Please provide notes about the serial number..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      className="font-medium"
                      size="sm"
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                    <Button type="submit" size="sm" className="font-medium">
                      Next
                    </Button>
                  </div>
                </form>
              </Form>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <Form {...form}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="grid gap-y-4"
                >
                  <div className="border border-dashed rounded-md">
                    <div className="flex flex-col items-center justify-center h-[8rem]">
                      <h3 className="text-base font-semibold text-center">
                        No Inputs Added Yet!
                      </h3>
                      <p className="text-xs text-muted-foreground text-center">
                        Start building your form by adding input fields.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      className="font-medium"
                      size="sm"
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                    <Button type="submit" size="sm" className="font-medium">
                      Submit
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
