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
          name={"id" as keyof FormValues}
          render={({ field }) => (
            <FormItem className="hidden">
              <FormLabel className="hidden">ID</FormLabel>
              <FormControl>
                <Input type="hidden" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
      </form>
    </Form>
  );
}
