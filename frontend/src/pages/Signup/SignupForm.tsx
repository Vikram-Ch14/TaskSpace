import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { createUser } from "@/api/authService/authService";

const formKeys = ["username", "email", "password", "confirmPassword"] as const;
type FormKey = (typeof formKeys)[number];

export type FormData = Record<FormKey, string>;

export type SignupForm = Omit<FormData, "confirmPassword">;

const intialFormData: FormData = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [formData, setFormData] = useState<FormData>(intialFormData);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, id } = e.target;
    if (formKeys.includes(id as FormKey)) {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const confirmPasswordCheck = () => {
    const tyPassword = formData.password;
    const rtyPassword = formData.confirmPassword;
    return tyPassword.trim().toLowerCase() === rtyPassword.trim().toLowerCase();
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!confirmPasswordCheck()) return;

    try {
      const updatedFormData: SignupForm = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };
      await createUser(updatedFormData);
      window.location.href = `/accounts/login`;
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border border-[--sidebar-border]">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Username</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="John Doe"
                  required
                  className="border border-[--sidebar-border]"
                  onChange={onChange}
                  defaultValue={formData.username}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="border border-[--sidebar-border]"
                  value={formData.email}
                  onChange={onChange}
                />
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      required
                      className="border border-[--sidebar-border]"
                      value={formData.password}
                      onChange={onChange}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirmPassword">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      id="confirmPassword"
                      type="password"
                      required
                      className="border border-[--sidebar-border]"
                      value={formData.confirmPassword}
                      onChange={onChange}
                    />
                  </Field>
                </Field>
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>
              <Field>
                <Button
                  type="submit"
                  className="bg-black hover:bg-black text-white"
                >
                  Create Account
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <a href="/accounts/login">Sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
