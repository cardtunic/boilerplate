<script lang="ts">
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<h1>Welcome to SvelteKit</h1>
<p>{data.greeting}</p>
