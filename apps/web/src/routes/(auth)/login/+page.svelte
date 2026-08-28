<script lang="ts">
  import { goto } from "$app/navigation";
  import { authClient } from "$lib";
  import { LoginDto } from "dto";

  import {
    createForm,
    Field as FormField,
    Form,
    type SubmitHandler,
    setErrors,
  } from "@formisch/svelte";

  import { LockIcon } from "@lucide/svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import FieldLayout from "$lib/components/form/fieldLayout.svelte";
  import Button from "$lib/components/ui/button/button.svelte";

  const loginForm = createForm({
    schema: LoginDto,
  });

  const submitForm: SubmitHandler<typeof LoginDto> = async ({
    email,
    password,
  }) => {
    const result = await authClient.signIn.email({ email, password });

    if (result.error) {
      return setErrors(loginForm, {
        path: ["email"],
        errors: ["Incorrect e-mail or password"],
      });
    }

    await goto("/dashboard");
  };
</script>

<Form
  of={loginForm}
  onsubmit={submitForm}
  class="flex flex-col gap-4 max-w-sm w-full"
>
  <FormField of={loginForm} path={["email"]}>
    {#snippet children(field)}
      <FieldLayout label="E-mail" errors={field.errors} {...field.props}>
        <Input
          {...field.props}
          id={field.props.name}
          value={field.input}
          type="email"
          placeholder="email@example.com"
          autocomplete="email"
          aria-invalid={!!field.errors?.[0]}
          required
        />
      </FieldLayout>
    {/snippet}
  </FormField>

  <FormField of={loginForm} path={["password"]}>
    {#snippet children(field)}
      <FieldLayout label="Password" errors={field.errors} {...field.props}>
        <Input
          {...field.props}
          id={field.props.name}
          value={field.input}
          type="password"
          placeholder="***********"
          autocomplete="current-password"
          aria-invalid={!!field.errors?.[0]}
          required
        />
      </FieldLayout>
    {/snippet}
  </FormField>

  <a
    href="/register"
    class="text-xs text-center my-2 underline underline-offset-3 decoration-dotted decoration-primary hover:opacity-80"
    >No account? Register here.</a
  >

  <Button type="submit" disabled={loginForm.isSubmitting || !loginForm.isValid}
    >Login <LockIcon />
  </Button>
</Form>
