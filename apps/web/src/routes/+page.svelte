<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import { CuboidIcon, UserIcon } from "@lucide/svelte";
</script>

<main class="w-screen h-screen flex flex-col gap-6 justify-center items-center">
  <CuboidIcon class="size-8 text-primary" />

  <p class="max-w-lg text-center leading-6">
    Simple SvelteKit + Hono and EffectTS boilerplate.
  </p>

  <a href="/register">
    <Button size="lg" class="w-full">Create a test account <UserIcon /></Button>
  </a>
</main>
