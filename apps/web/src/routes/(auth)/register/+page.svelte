<script lang="ts">
  import { goto } from "$app/navigation";
  import { authClient } from "$lib";
  import { RegisterDto } from "dto";

  import {
    createForm,
    Field,
    Form,
    type SubmitHandler,
  } from "@formisch/svelte";

  const registerForm = createForm({
    schema: RegisterDto,
  });

  let error = $state("");

  const submitForm: SubmitHandler<typeof RegisterDto> = async (values) => {
    error = "";

    const result = await authClient.signUp.email(values);

    if (result.error) {
      error = result.error.message ?? "Unable to register.";
      return;
    }

    await goto("/dashboard");
  };
</script>

<a href="/"><button>Back</button></a>
<h1>Register</h1>

<Form
  of={registerForm}
  onsubmit={submitForm}
  style="display: flex; flex-direction: column; width: fit-content; gap: 10px;"
>
  <Field of={registerForm} path={["name"]}>
    {#snippet children(field)}
      <label style="display: flex; flex-direction: column;">
        Name
        <input
          {...field.props}
          value={field.input}
          style:margin-top="2px"
          type="text"
          placeholder="Jonh Doe"
          required
        />
        {#if field.errors?.[0]}<p style="color: red; font-size: 14px;">
            {field.errors[0]}
          </p>{/if}
      </label>
    {/snippet}
  </Field>

  <Field of={registerForm} path={["email"]}>
    {#snippet children(field)}
      <label style="display: flex; flex-direction: column;">
        E-mail
        <input
          {...field.props}
          value={field.input}
          style:margin-top="2px"
          type="email"
          placeholder="email@example.com"
          autocomplete="email"
          required
        />
        {#if field.errors?.[0]}<p style="color: red; font-size: 14px;">
            {field.errors[0]}
          </p>{/if}
      </label>
    {/snippet}
  </Field>

  <Field of={registerForm} path={["password"]}>
    {#snippet children(field)}
      <label style="display: flex; flex-direction: column;">
        Password
        <input
          {...field.props}
          value={field.input}
          style:margin-top="2px"
          type="password"
          placeholder="password"
          autocomplete="current-password"
          required
        />
        {#if field.errors?.[0]}<p style="color: red; font-size: 14px;">
            {field.errors[0]}
          </p>{/if}
      </label>
    {/snippet}
  </Field>

  <a href="/register" style="font-size: 12px;">No account? Register here.</a>

  {#if error}<p>{error}</p>{/if}

  <button
    type="submit"
    disabled={registerForm.isSubmitting || !registerForm.isValid}
    >Register</button
  >
</Form>
