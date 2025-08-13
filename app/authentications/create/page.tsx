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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Circle,
  User,
  FileText,
  Hash,
  Watch,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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

const tabsData = [
  {
    value: "user-info",
    label: "User Info",
    icon: User,
    title: "User Information",
    schema: UserInformationSchema,
  },
  {
    value: "step-1",
    label: "Documentation",
    icon: FileText,
    title: "Provenance & Documentation Audit",
    schema: step1Schema,
  },
  {
    value: "step-2",
    label: "Serial & Model",
    icon: Hash,
    title: "Serial & Model Number Cross-Reference",
    schema: step2Schema,
  },
  {
    value: "step-3",
    label: "Case Analysis",
    icon: Watch,
    title: "Case, Bezel, and Crystal Analysis",
    schema: step3Schema,
  },
  {
    value: "step-4",
    label: "Dial & Hands",
    icon: Clock,
    title: "Dial, Hands, and Date Scrutiny",
    schema: step4Schema,
  },
  {
    value: "step-5",
    label: "Bracelet",
    icon: Watch,
    title: "Bracelet/Strap and Clasp Inspection",
    schema: step5Schema,
  },
  {
    value: "step-6",
    label: "Movement",
    icon: Clock,
    title: "Movement Examination",
    schema: step6Schema,
  },
  {
    value: "step-7",
    label: "Performance",
    icon: CheckCircle,
    title: "Performance & Function Test",
    schema: step7Schema,
  },
  {
    value: "step-8",
    label: "Final Grade",
    icon: Badge,
    title: "Final Condition & Grading",
    schema: step8Schema,
  },
];

export default function CreateAuthenticationPage() {
  const [activeTab, setActiveTab] = useState("user-info");
  const [completedTabs, setCompletedTabs] = useState<Set<string>>(new Set());
  const emptySchema = z.object({});

  // Get the current tab's schema
  const getCurrentSchema = () => {
    const currentTab = tabsData.find((tab) => tab.value === activeTab);
    return currentTab?.schema || emptySchema;
  };

  const form = useForm<FormData>({
    resolver: zodResolver(getCurrentSchema()),
    mode: "onChange",
    defaultValues: {},
  });

  const {
    handleSubmit,
    control,
    reset,
    trigger,
    formState: { errors },
  } = form;

  const getCurrentTabIndex = () => {
    return tabsData.findIndex((tab) => tab.value === activeTab);
  };

  const handleNext = async (data: FormData) => {
    const isStepValid = await trigger();

    if (!isStepValid) {
      toast.error("Please fix the validation errors before proceeding");
      return;
    }

    // Mark current tab as completed
    setCompletedTabs((prev) => new Set([...prev, activeTab]));

    const currentIndex = getCurrentTabIndex();
    if (currentIndex < tabsData.length - 1) {
      setActiveTab(tabsData[currentIndex + 1].value);
    }
  };

  const handleBack = () => {
    const currentIndex = getCurrentTabIndex();
    if (currentIndex > 0) {
      setActiveTab(tabsData[currentIndex - 1].value);
    }
  };

  const handleFinalSubmit = async (data: FormData) => {
    const isStepValid = await trigger();

    if (!isStepValid) {
      toast.error("Please fix the validation errors before proceeding");
      return;
    }

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
      setActiveTab("user-info");
      setCompletedTabs(new Set());
      reset();
    } catch (error) {
      toast.error("Failed to submit authenticated watch data");
    }
  };

  const handleButtonNext = async () => {
    const isStepValid = await trigger();

    if (!isStepValid) {
      toast.error("Please fix the validation errors before proceeding");
      return;
    }

    // Mark current tab as completed
    setCompletedTabs((prev) => new Set([...prev, activeTab]));

    const currentIndex = getCurrentTabIndex();
    if (currentIndex < tabsData.length - 1) {
      setActiveTab(tabsData[currentIndex + 1].value);
    }
  };

  const handleButtonSubmit = async () => {
    const isStepValid = await trigger();

    if (!isStepValid) {
      toast.error("Please fix the validation errors before proceeding");
      return;
    }

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
      setActiveTab("user-info");
      setCompletedTabs(new Set());
      reset();
    } catch (error) {
      toast.error("Failed to submit authenticated watch data");
    }
  };

  const handleTabChange = async (value: string) => {
    // Validate current tab before switching
    const isCurrentValid = await trigger();
    if (isCurrentValid) {
      setCompletedTabs((prev) => new Set([...prev, activeTab]));
    }
    setActiveTab(value);
  };

  const isLastTab = getCurrentTabIndex() === tabsData.length - 1;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Watch Authentication Process</h1>
          <p className="text-muted-foreground mt-2">
            Complete all sections to authenticate your watch
          </p>
        </div>

        <Card className="w-full max-w-6xl mx-auto">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-9 h-auto p-1 bg-muted/50">
              {tabsData.map((tab, index) => {
                const Icon = tab.icon;
                const isCompleted = completedTabs.has(tab.value);
                const isActive = activeTab === tab.value;

                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className={cn(
                      "flex flex-col items-center gap-1 p-3 h-auto text-xs relative",
                      "data-[state=active]:bg-background data-[state=active]:shadow-sm",
                      isCompleted && "text-green-600 dark:text-green-400"
                    )}
                  >
                    <div className="flex items-center gap-1">
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                      {isCompleted && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                      )}
                    </div>
                    <span className="leading-none">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <CardHeader>
              <CardTitle className="text-xl">
                {tabsData.find((tab) => tab.value === activeTab)?.title}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  Step {getCurrentTabIndex() + 1} of {tabsData.length}
                </Badge>
                {completedTabs.has(activeTab) && (
                  <Badge variant="default" className="bg-green-500">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>
            </CardHeader>

            {tabsData.map((tab, index) => (
              <TabsContent key={tab.value} value={tab.value} className="mt-0">
                <CardContent className="space-y-6">
                  {index === 0 && (
                    <UserInformationForm form={form} onSubmit={handleNext} />
                  )}
                  {index === 1 && (
                    <Step1Form
                      form={form}
                      onSubmit={handleNext}
                      onBack={handleBack}
                      step={1}
                    />
                  )}
                  {index === 2 && (
                    <Step2Form
                      form={form}
                      onSubmit={handleNext}
                      onBack={handleBack}
                      step={2}
                    />
                  )}
                  {index === 3 && (
                    <Step3Form
                      form={form}
                      onSubmit={handleNext}
                      onBack={handleBack}
                      step={3}
                    />
                  )}
                  {index === 4 && (
                    <Step4Form
                      form={form}
                      onSubmit={handleNext}
                      onBack={handleBack}
                      step={4}
                    />
                  )}
                  {index === 5 && (
                    <Step5Form
                      form={form}
                      onSubmit={handleNext}
                      onBack={handleBack}
                      step={5}
                    />
                  )}
                  {index === 6 && (
                    <Step6Form
                      form={form}
                      onSubmit={handleNext}
                      onBack={handleBack}
                      step={6}
                    />
                  )}
                  {index === 7 && (
                    <Step7Form
                      form={form}
                      onSubmit={handleNext}
                      onBack={handleBack}
                      step={7}
                    />
                  )}
                  {index === 8 && (
                    <Step8Form
                      form={form}
                      onSubmit={handleFinalSubmit}
                      onBack={handleBack}
                      step={8}
                    />
                  )}

                  <div className="flex justify-between pt-4 border-t">
                    <Button
                      type="button"
                      onClick={handleButtonNext}
                      disabled={getCurrentTabIndex() === 0}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>

                    {isLastTab ? (
                      <Button
                        type="button"
                        onClick={handleButtonSubmit}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Submit Authentication
                        <CheckCircle className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button type="button" onClick={handleButtonNext}>
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </TabsContent>
            ))}
          </Tabs>
        </Card>

        {/* Progress indicator */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              {completedTabs.size} of {tabsData.length} sections completed
            </span>
            <div className="w-32 bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(completedTabs.size / tabsData.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
