// "use client";

// import { useState } from "react";
// import { useAuth } from "@/components/auth-provider";
// import { useRouter, useParams } from "next/navigation";
// import DashboardLayout from "@/components/dashboard-layout";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Textarea } from "@/components/ui/textarea";
// import { FileInput } from "@/components/ui/file-input";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import { useForm } from "react-hook-form";

// export default function EditAuthenticationPage() {
//   const { user } = useAuth();
//   const router = useRouter();
//   const params = useParams();
//   const [tabValue, setTabValue] = useState("step1");

//   const form = useForm({
//     defaultValues: {
//       warranty_card: [],
//       purchase_receipts: [],
//       service_records: [],
//       authorized_dealer: null,
//       warranty_card_notes: "",
//       service_history_notes: "",
//     },
//   });

//   const form2 = useForm({
//     defaultValues: {
//       serial_number: "",
//       model_number: "",
//       serial_found_location: "",
//       matches_documents: "",
//       engraving_quality: "",
//       serial_notes: "",
//     },
//   });

//   const onSubmitStep1 = (data: any) => {
//     console.log("Step 1 data:", data);
//     // Handle form submission
//     setTabValue("step2"); // Move to next step
//   };

//   const onSubmitStep2 = (data: any) => {
//     console.log("Step 2 data:", data);
//     // Handle form submission
//     setTabValue("step3"); // Move to next step
//   };

//   const onBackStep2 = () => {
//     setTabValue("step1"); // Go back to step 1
//   };

//   const onBack = () => {
//     // Handle back navigation
//   };

//   const tabLabels = [
//     "Step 1: Provenance & Documentation Audit",
//     "Step 2: Serial & Model Number Cross-Reference",
//     "Step 3: Case, Bezel, and Crystal Analysis",
//     "Step 4: Dial, Hands, and Date Scrutiny",
//     "Step 5: Bracelet/Strap and Clasp Inspection",
//     "Step 6: Movement Examination",
//     "Step 7: Performance & Function Test",
//     "Step 8: Final Condition & Grading",
//   ];

//   const shortTabLabels = [
//     "Provenance",
//     "Serial & Model",
//     "Case & Crystal",
//     "Dial & Hands",
//     "Bracelet & Clasp",
//     "Movement",
//     "Performance",
//     "Final Grading",
//   ];

//   return (
//     <DashboardLayout>
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold mb-2">Edit Authentication</h1>
//         <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg border">
//           <div>
//             <Label className="text-sm font-medium text-muted-foreground">
//               Authentication ID
//             </Label>
//             <p className="text-lg font-mono font-semibold">
//               {params.id || "AUTH-2024-001234"}
//             </p>
//           </div>
//           <div className="h-8 border-l border-border"></div>
//           <div>
//             <Label className="text-sm font-medium text-muted-foreground">
//               Status
//             </Label>
//             <p className="text-sm font-medium text-amber-600">In Progress</p>
//           </div>
//           <div className="h-8 border-l border-border"></div>
//           <div>
//             <Label className="text-sm font-medium text-muted-foreground">
//               Last Updated
//             </Label>
//             <p className="text-sm">{new Date().toLocaleDateString()}</p>
//           </div>
//         </div>
//       </div>
//       <div className="flex gap-6">
//         <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
//           {/* Tabs List - Now horizontal */}
//           <TabsList className="grid w-full grid-cols-8 mb-6">
//             <TabsTrigger value="step1" className="text-xs px-2">
//               {shortTabLabels[0]}
//             </TabsTrigger>
//             <TabsTrigger value="step2" className="text-xs px-2">
//               {shortTabLabels[1]}
//             </TabsTrigger>
//             <TabsTrigger value="step3" className="text-xs px-2">
//               {shortTabLabels[2]}
//             </TabsTrigger>
//             <TabsTrigger value="step4" className="text-xs px-2">
//               {shortTabLabels[3]}
//             </TabsTrigger>
//             <TabsTrigger value="step5" className="text-xs px-2">
//               {shortTabLabels[4]}
//             </TabsTrigger>
//             <TabsTrigger value="step6" className="text-xs px-2">
//               {shortTabLabels[5]}
//             </TabsTrigger>
//             <TabsTrigger value="step7" className="text-xs px-2">
//               {shortTabLabels[6]}
//             </TabsTrigger>
//             <TabsTrigger value="step8" className="text-xs px-2">
//               {shortTabLabels[7]}
//             </TabsTrigger>
//           </TabsList>

//           {/* Tabs Content */}
//           <TabsContent value="step1">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Provenance & Documentation Audit</CardTitle>
//                 <CardDescription>
//                   Upload and verify the provenance documentation of the watch.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <Form {...form}>
//                   <form
//                     onSubmit={form.handleSubmit(onSubmitStep1)}
//                     className="grid gap-y-4"
//                   >
//                     <FormField
//                       name="warranty_card"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Upload warranty card *</FormLabel>
//                           <FormControl>
//                             <FileInput
//                               value={field.value}
//                               onChange={(newFiles: File[]) =>
//                                 field.onChange(newFiles)
//                               }
//                               accept="image/*,.pdf"
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       name="purchase_receipts"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Upload purchase receipts *</FormLabel>
//                           <FormControl>
//                             <FileInput
//                               value={field.value}
//                               onChange={(newFiles: File[]) =>
//                                 field.onChange(newFiles)
//                               }
//                               accept="image/*,.pdf"
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       name="service_records"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Upload service records</FormLabel>
//                           <FormControl>
//                             <FileInput
//                               value={field.value}
//                               onChange={(newFiles: File[]) =>
//                                 field.onChange(newFiles)
//                               }
//                               accept="image/*,.pdf"
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       name="authorized_dealer"
//                       render={({ field }) => (
//                         <FormItem className="flex flex-col space-y-2 rounded-md border p-4">
//                           <FormLabel>
//                             Is the dealer an authorized dealer? *
//                           </FormLabel>
//                           <FormControl>
//                             <RadioGroup
//                               onValueChange={(value) =>
//                                 field.onChange(value === "true")
//                               }
//                               value={field.value === true ? "true" : "false"}
//                             >
//                               <FormItem className="flex items-center space-x-2">
//                                 <FormControl>
//                                   <RadioGroupItem value="true" />
//                                 </FormControl>
//                                 <FormLabel className="font-normal">
//                                   Yes
//                                 </FormLabel>
//                               </FormItem>
//                               <FormItem className="flex items-center space-x-2">
//                                 <FormControl>
//                                   <RadioGroupItem value="false" />
//                                 </FormControl>
//                                 <FormLabel className="font-normal">
//                                   No
//                                 </FormLabel>
//                               </FormItem>
//                             </RadioGroup>
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       name="warranty_card_notes"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>
//                             Notes on warranty card (font, NFC check, etc.) *
//                           </FormLabel>
//                           <FormControl>
//                             <Textarea
//                               {...field}
//                               rows={5}
//                               className="resize-none"
//                               placeholder="Please provide detailed notes about the warranty card..."
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       name="service_history_notes"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>
//                             Notes on service history (replacement parts,
//                             authorized center?)
//                           </FormLabel>
//                           <FormControl>
//                             <Textarea
//                               {...field}
//                               rows={5}
//                               className="resize-none"
//                               placeholder="Optional: Add notes about service history..."
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <div className="flex justify-between">
//                       <Button
//                         type="button"
//                         className="font-medium"
//                         size="sm"
//                         onClick={onBack}
//                         disabled={true}
//                       >
//                         Back
//                       </Button>
//                       <Button type="submit" size="sm" className="font-medium">
//                         Save & Next
//                       </Button>
//                     </div>
//                   </form>
//                 </Form>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="step2">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Serial & Model Number Cross-Reference</CardTitle>
//                 <CardDescription>
//                   Verify and cross-reference the serial and model numbers.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <Form {...form2}>
//                   <form
//                     onSubmit={form2.handleSubmit(onSubmitStep2)}
//                     className="grid gap-y-4"
//                   >
//                     <FormField
//                       name="serial_number"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Serial Number *</FormLabel>
//                           <FormControl>
//                             <Input
//                               {...field}
//                               value={field.value ?? ""}
//                               autoComplete="off"
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       name="model_number"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Model Number *</FormLabel>
//                           <FormControl>
//                             <Input
//                               {...field}
//                               value={field.value ?? ""}
//                               autoComplete="off"
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       name="serial_found_location"
//                       render={({ field }) => (
//                         <FormItem className="flex flex-col space-y-2 rounded-md">
//                           <FormLabel>Where was the serial found?</FormLabel>
//                           <FormControl>
//                             <Select
//                               onValueChange={field.onChange}
//                               value={field.value ?? ""}
//                             >
//                               <SelectTrigger className="w-full">
//                                 <SelectValue placeholder="Select location" />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 <SelectItem value="Between lugs">
//                                   Between lugs
//                                 </SelectItem>
//                                 <SelectItem value="Rehaut">Rehaut</SelectItem>
//                                 <SelectItem value="Caseback">
//                                   Caseback
//                                 </SelectItem>
//                                 <SelectItem value="Other">Other</SelectItem>
//                               </SelectContent>
//                             </Select>
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       name="matches_documents"
//                       render={({ field }) => (
//                         <FormItem className="flex flex-col space-y-2 rounded-md border p-4">
//                           <FormLabel>Match with documents? *</FormLabel>
//                           <FormControl>
//                             <RadioGroup
//                               onValueChange={field.onChange}
//                               value={field.value ?? ""}
//                             >
//                               <FormItem className="flex items-center space-x-2">
//                                 <FormControl>
//                                   <RadioGroupItem value="yes" />
//                                 </FormControl>
//                                 <FormLabel className="font-normal">
//                                   Yes
//                                 </FormLabel>
//                               </FormItem>
//                               <FormItem className="flex items-center space-x-2">
//                                 <FormControl>
//                                   <RadioGroupItem value="no" />
//                                 </FormControl>
//                                 <FormLabel className="font-normal">
//                                   No
//                                 </FormLabel>
//                               </FormItem>
//                             </RadioGroup>
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       name="engraving_quality"
//                       render={({ field }) => (
//                         <FormItem className="flex flex-col space-y-2">
//                           <FormLabel>Engraving Quality</FormLabel>
//                           <FormControl>
//                             <Select
//                               onValueChange={field.onChange}
//                               value={field.value ?? ""}
//                             >
//                               <SelectTrigger className="w-full">
//                                 <SelectValue placeholder="Select quality" />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 <SelectItem value="Sharp">Sharp</SelectItem>
//                                 <SelectItem value="Shallow">Shallow</SelectItem>
//                                 <SelectItem value="Acid-etched">
//                                   Acid-etched
//                                 </SelectItem>
//                                 <SelectItem value="Dotty">Dotty</SelectItem>
//                                 <SelectItem value="Other">Other</SelectItem>
//                               </SelectContent>
//                             </Select>
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       name="serial_notes"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Notes *</FormLabel>
//                           <FormControl>
//                             <Textarea
//                               {...field}
//                               value={field.value ?? ""}
//                               rows={5}
//                               className="resize-none"
//                               placeholder="Please provide notes about the serial number..."
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <div className="flex justify-between">
//                       <Button
//                         type="button"
//                         className="font-medium"
//                         size="sm"
//                         onClick={onBackStep2}
//                       >
//                         Back
//                       </Button>
//                       <Button type="submit" size="sm" className="font-medium">
//                         Save & Next
//                       </Button>
//                     </div>
//                   </form>
//                 </Form>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="step3">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Case, Bezel, and Crystal Analysis</CardTitle>
//                 <CardDescription>
//                   Enter case, bezel, and crystal analysis information.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <Label htmlFor="caseMaterial">Case Material</Label>
//                   <Input id="caseMaterial" placeholder="Enter case material" />
//                 </div>
//                 <div>
//                   <Label htmlFor="crystalType">Crystal Type</Label>
//                   <Input id="crystalType" placeholder="Enter crystal type" />
//                 </div>
//                 <Button>Save Step 3</Button>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="step4">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Dial, Hands, and Date Scrutiny</CardTitle>
//                 <CardDescription>
//                   Enter dial, hands, and date scrutiny information.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <Label htmlFor="dialColor">Dial Color</Label>
//                   <Input id="dialColor" placeholder="Enter dial color" />
//                 </div>
//                 <div>
//                   <Label htmlFor="handsStyle">Hands Style</Label>
//                   <Input id="handsStyle" placeholder="Enter hands style" />
//                 </div>
//                 <Button>Save Step 4</Button>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="step5">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Bracelet/Strap and Clasp Inspection</CardTitle>
//                 <CardDescription>
//                   Enter bracelet/strap and clasp inspection information.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <Label htmlFor="braceletType">Bracelet/Strap Type</Label>
//                   <Input
//                     id="braceletType"
//                     placeholder="Enter bracelet/strap type"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="claspType">Clasp Type</Label>
//                   <Input id="claspType" placeholder="Enter clasp type" />
//                 </div>
//                 <Button>Save Step 5</Button>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="step6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Movement Examination</CardTitle>
//                 <CardDescription>
//                   Enter movement examination information.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <Label htmlFor="movementType">Movement Type</Label>
//                   <Input id="movementType" placeholder="Enter movement type" />
//                 </div>
//                 <div>
//                   <Label htmlFor="caliber">Caliber</Label>
//                   <Input id="caliber" placeholder="Enter caliber" />
//                 </div>
//                 <Button>Save Step 6</Button>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="step7">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Performance & Function Test</CardTitle>
//                 <CardDescription>
//                   Enter performance and function test information.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <Label htmlFor="timingAccuracy">Timing Accuracy</Label>
//                   <Input
//                     id="timingAccuracy"
//                     placeholder="Enter timing accuracy"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="powerReserve">Power Reserve</Label>
//                   <Input id="powerReserve" placeholder="Enter power reserve" />
//                 </div>
//                 <Button>Save Step 7</Button>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="step8">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Final Condition & Grading</CardTitle>
//                 <CardDescription>
//                   Enter final condition and grading information.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <Label htmlFor="overallCondition">Overall Condition</Label>
//                   <Input
//                     id="overallCondition"
//                     placeholder="Enter overall condition"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="grade">Grade</Label>
//                   <Input id="grade" placeholder="Enter grade" />
//                 </div>
//                 <Button>Save Step 8</Button>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </DashboardLayout>
//   );
// }
