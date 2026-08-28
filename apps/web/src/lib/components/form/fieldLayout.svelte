<script lang="ts">
  import { type FieldElementProps } from "@formisch/svelte";
  import type { Snippet } from "svelte";
  import * as Field from "$lib/components/ui/field";

  interface Props extends FieldElementProps {
    label?: string;
    errors?: string[] | null;
    children?: Snippet;
  }

  const { label, errors, children, ...props }: Props = $props();
</script>

<Field.Field>
  {#if label}<Field.Label for={props.name}>{label}</Field.Label>{/if}

  {@render children?.()}

  {#if errors?.[0]}<Field.Error
      errors={errors.map((message) => ({ message }))}
    />{/if}
</Field.Field>
