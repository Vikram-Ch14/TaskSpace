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
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { loginUser } from "@/api/authService/authService";

const formKeys = ["email", "password"] as const;
type FormKey = (typeof formKeys)[number];

export type FormData = Record<FormKey, string>;

export type LoginForm = FormData;

const intialFormData: FormData = {
  email: "",
  password: "",
};

export function LoginForm({
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

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await loginUser(formData);
      const token = res.token;

      if (!token.length) return;

      localStorage.setItem("token", token);
      window.location.href = `/`;
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border border-[--sidebar-border]">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="tasp@gmail.com"
                  required
                  className="border border-[--sidebar-border]"
                  value={formData.email}
                  onChange={onChange}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
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
                <Button
                  type="submit"
                  className="bg-black hover:bg-black text-white"
                >
                  Login
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <a href="/accounts/signup">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
