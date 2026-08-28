<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import { ArrowLeftIcon, CuboidIcon } from "@lucide/svelte";
  import { page } from "$app/state";

  const { children } = $props();
</script>

<main
  class="w-screen min-h-screen flex flex-col justify-center items-center gap-12"
>
  <header class="flex flex-col items-center max-w-sm w-full">
    <div class="w-full mb-16">
      <a href="/">
        <Button variant="outline" size="icon"><ArrowLeftIcon /></Button>
      </a>
    </div>

    <CuboidIcon class="size-7 mb-3 text-primary" />

    <p class="text-lg font-semibold">
      {page.route.id === "/(auth)/login" ? "Welcome back" : "Welcome"} to
      <span class="underline underline-offset-3 decoration-2 decoration-primary"
        >boilerplate</span
      >
    </p>

    <p class="text-sm text-muted-foreground">
      {page.route.id === "/(auth)/login"
        ? "Login with your credentials"
        : "Fill the fields and create your account"}
    </p>
  </header>

  {@render children()}
</main>
