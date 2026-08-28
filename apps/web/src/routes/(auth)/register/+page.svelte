<script lang="ts">
  import { goto } from "$app/navigation";
  import { authClient } from "$lib";
  import { RegisterDto } from "dto";

  import {
    createForm,
    Field,
    Form,
    setErrors,
    type SubmitHandler,
  } from "@formisch/svelte";
  import Button from "$lib/components/ui/button/button.svelte";

  import { SquarePenIcon } from "@lucide/svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import FieldLayout from "$lib/components/form/fieldLayout.svelte";

  const registerForm = createForm({
    schema: RegisterDto,
  });

  const submitForm: SubmitHandler<typeof RegisterDto> = async (values) => {
    const result = await authClient.signUp.email(values);

    if (result.error) {
      switch (result.error.code) {
        case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
          setErrors(registerForm, {
            errors: ["An account with this email already exists"],
            path: ["email"],
          });
      }
    } else await goto("/dashboard");
  };
</script>

<Form
  of={registerForm}
  onsubmit={submitForm}
  class="flex flex-col gap-4 max-w-sm w-full"
>
  <Field of={registerForm} path={["name"]}>
    {#snippet children(field)}
      <FieldLayout label="Name" errors={field.errors} {...field.props}>
        <Input
          {...field.props}
          value={field.input}
          type="text"
          placeholder="Jonh Doe"
          aria-invalid={!!field.errors?.[0]}
          required
        />
      </FieldLayout>
    {/snippet}
  </Field>

  <Field of={registerForm} path={["email"]}>
    {#snippet children(field)}
      <FieldLayout label="E-mail" errors={field.errors} {...field.props}>
        <Input
          {...field.props}
          value={field.input}
          type="email"
          placeholder="email@example.com"
          autocomplete="email"
          aria-invalid={!!field.errors?.[0]}
          required
        />
      </FieldLayout>
    {/snippet}
  </Field>

  <Field of={registerForm} path={["password"]}>
    {#snippet children(field)}
      <FieldLayout label="Password" errors={field.errors} {...field.props}>
        <Input
          {...field.props}
          value={field.input}
          type="password"
          placeholder="***********"
          autocomplete="current-password"
          aria-invalid={!!field.errors?.[0]}
          required
        />
      </FieldLayout>
    {/snippet}
  </Field>

  <a
    href="/login"
    class="text-xs text-center my-2 underline underline-offset-3 decoration-dotted decoration-primary hover:opacity-80"
    >Already have na account? Login here.</a
  >

  <Button
    type="submit"
    disabled={registerForm.isSubmitting || !registerForm.isValid}
    >Register <SquarePenIcon />
  </Button>
</Form>
