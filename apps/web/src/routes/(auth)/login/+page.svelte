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
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const result = await authClient.signIn.email({ email, password });

    loading = false;

    if (result.error) {
      error = result.error.message ?? "Unable to sign in.";
      return;
    }

    await goto("/dashboard");
  }
</script>

<a href="/"><button>Back</button></a>
<h1>Login</h1>

<form
  style="display: flex; flex-direction: column; width: fit-content; gap: 10px;"
  onsubmit={handleSubmit}
>
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

  <a href="/register" style="font-size: 12px;">No account? Register here.</a>

  {#if error}<p>{error}</p>{/if}
  <button type="submit" disabled={loading}
    >{loading ? "Signing in..." : "Login"}</button
  >
</form>
