import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
  date_of_sale: string;
  company_address: string;
  name: string;
  email: string;
  phone: string;
  contact_method: string;
  company_name: string;
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
  const allValues = useWatch({ control });

  console.log("Current form values:", allValues);

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

        {/* Company Fields */}

        <FormField
          name={"company_name" as keyof FormValues}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name (Optional)</FormLabel>
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
          name={"company_address" as keyof FormValues}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Address (Optional)</FormLabel>
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
                  autoComplete="phone"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Date of Sale */}
        <FormField
          name={"date_of_sale" as keyof FormValues}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Sale</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value || ""}
                  type="date"
                  autoComplete="bday"
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
