<script lang="ts">
  import { goto } from "$app/navigation";
  import { authClient } from "$lib";

  let error = $state("");
  let loading = $state(false);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    error = "";
    loading = true;

    const formData = new FormData(e.currentTarget as HTMLFormElement);

    const name = String(formData.get("name"));
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    const result = await authClient.signUp.email({ name, email, password });

    loading = false;

    if (result.error) {
      error = result.error.message ?? "Unable to register.";
      return;
    }

    await goto("/dashboard");
  }
</script>

<a href="/"><button>Back</button></a>
<h1>Register</h1>

<form
  style="display: flex; flex-direction: column; width: fit-content; gap: 10px;"
  onsubmit={handleSubmit}
>
  <label style="display: flex; flex-direction: column;">
    Name
    <input
      style:margin-top="2px"
      type="text"
      name="name"
      placeholder="Jonh Doe"
      required
    />
  </label>

  <label style="display: flex; flex-direction: column;">
    E-mail
    <input
      style:margin-top="2px"
      type="email"
      name="email"
      placeholder="email@example.com"
      autocomplete="email"
      required
    />
  </label>

  <label style="display: flex; flex-direction: column;">
    Password
    <input
      style:margin-top="2px"
      type="password"
      name="password"
      placeholder="password"
      autocomplete="current-password"
      required
    />
  </label>

  <a href="/login" style="font-size: 12px;">Have an account? Login here.</a>

  {#if error}<p>{error}</p>{/if}
  <button type="submit" disabled={loading}
    >{loading ? "Registering..." : "Register"}</button
  >
</form>
