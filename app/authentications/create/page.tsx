"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/components/auth-provider";
import DashboardLayout from "@/components/dashboard-layout";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Step1Form } from "./form/Step1Form";
import { Step2Form } from "./form/Step2Form";
import { Step3Form } from "./form/Step3Form";
import { Step4Form } from "./form/Step4Form";
import { Step5Form } from "./form/Step5Form";
import { Step6Form } from "./form/Step6Form";
import { Step7Form } from "./form/Step7Form";
import { Step8Form } from "./form/Step8Form";
import { UserInformationForm } from "./form/UserInformationForm";
import authenticatedWatchService from "../authenticatedWatchService";

import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
  step6Schema,
  step7Schema,
  step8Schema,
  UserInformationSchema,
} from "./form/schemas/stepsSchema";

const fullFormSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema)
  .merge(step5Schema)
  .merge(step6Schema)
  .merge(step7Schema)
  .merge(step8Schema);
type FormData = z.infer<typeof fullFormSchema>;

export default function CreateAuthenticationPage() {
  const [step, setStep] = useState(0);
  const totalSteps = 9;
  const emptySchema = z.object({}); // No validation
  const stepTitles = [
    "User Information",
    "Provenance & Documentation Audit",
    "Serial & Model Number Cross-Reference",
    "Case, Bezel, and Crystal Analysis", // Step 3
    "Dial, Hands, and Date Scrutiny", // Step 4
    "Bracelet/Strap and Clasp Inspection",
    "Movement Examination",
    "Performance & Function Test",
    "Final Condition & Grading",
  ];

  // Get the current step's schema
  const getCurrentSchema = () => {
    switch (step) {
      case 0:
        return UserInformationSchema;
      case 1:
        return step1Schema;
      case 2:
        return step2Schema;
      case 3:
        return step3Schema;
      case 4:
        return step4Schema;
      case 5:
        return step5Schema;
      case 6:
        return step6Schema;
      case 7:
        return step7Schema;
      case 8:
        return step8Schema;
      default:
        return emptySchema;
    }
  };

  const form = useForm<FormData>({
    resolver: zodResolver(getCurrentSchema()),
    mode: "onChange",
    defaultValues: {}, // optional: you can prefill initial data here
  });

  const {
    handleSubmit,
    control,
    reset,
    trigger,
    formState: { errors },
  } = form;

  const onSubmit = async () => {
    const isStepValid = await trigger();

    if (!isStepValid) {
      toast.error("Please fix the validation errors before proceeding");
      return;
    }

    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      const allData = form.getValues();
      const finalValidation = fullFormSchema.safeParse(allData);

      if (!finalValidation.success) {
        toast.error("Please complete all required fields");
        return;
      }
      const watchData = finalValidation.data;
      console.log("Final watch data:", watchData);
      try {
        await authenticatedWatchService.createAuthenticatedWatch(watchData);
        toast.success("Watch data submitted successfully");
        setStep(0);
      } catch (error) {
        toast.error("Failed to submit authenticated watch data");
      }
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
              {step === 0
                ? stepTitles[step]
                : `Step ${step}: ${stepTitles[step]}`}
            </CardTitle>
          </CardHeader>

          <CardContent>
            {step === 0 && (
              <UserInformationForm form={form} onSubmit={onSubmit} />
            )}

            {step === 1 && (
              <Step1Form
                form={form}
                onSubmit={onSubmit}
                onBack={handleBack}
                step={step}
              />
            )}

            {step === 2 && (
              <Step2Form
                form={form}
                onSubmit={onSubmit}
                onBack={handleBack}
                step={step}
              />
            )}
            {step === 3 && (
              <Step3Form
                form={form}
                onSubmit={onSubmit}
                onBack={handleBack}
                step={step}
              />
            )}
            {step === 4 && (
              <Step4Form
                form={form}
                onSubmit={onSubmit}
                onBack={handleBack}
                step={step}
              />
            )}
            {step === 5 && (
              <Step5Form
                form={form}
                onSubmit={onSubmit}
                onBack={handleBack}
                step={step}
              />
            )}
            {step === 6 && (
              <Step6Form
                form={form}
                onSubmit={onSubmit}
                onBack={handleBack}
                step={step}
              />
            )}
            {step === 7 && (
              <Step7Form
                form={form}
                onSubmit={onSubmit}
                onBack={handleBack}
                step={step}
              />
            )}
            {step === 8 && (
              <Step8Form
                form={form}
                onSubmit={onSubmit}
                onBack={handleBack}
                step={step}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
