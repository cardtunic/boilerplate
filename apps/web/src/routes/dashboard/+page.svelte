<script lang="ts">
  import { goto } from "$app/navigation";
  import { authClient } from "$lib";
  import { type PageProps } from "./$types";

  const { data }: PageProps = $props();

  let error = $state("");
  let loading = $state(false);

  async function handleLogout() {
    loading = true;

    const result = await authClient.signOut();

    if (result.error) error = result.error.message ?? "Unable to logout.";

    loading = false;

    goto("/login");
  }
</script>

<h1>Dashboard</h1>
<p>Hello, {data.user.name}!</p>
<p>From protected route: {data.protected}</p>

{#if error}<p>{error}</p>{/if}
<button onclick={handleLogout}>
  {loading ? "Logging out..." : "Logout"}
</button>
