<script lang="ts">
  import { goto } from "$app/navigation";
  import { authClient } from "$lib";
  import Button from "$lib/components/ui/button/button.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import {
    createForm,
    Field as FormField,
    Form,
    type SubmitHandler,
    setErrors,
    reset,
  } from "@formisch/svelte";
  import { type PageProps } from "./$types";
  import { HashIcon, LogOutIcon } from "@lucide/svelte";
  import { HashTextDto } from "dto";
  import { createMutation } from "@tanstack/svelte-query";
  import { hashTextMutationOpts } from "$lib/features/hash/hash.queries";
  import FieldLayout from "$lib/components/form/fieldLayout.svelte";
  import Input from "$lib/components/ui/input/input.svelte";

  const { data }: PageProps = $props();

  const hashTextForm = createForm({
    schema: HashTextDto,
  });

  const hashTextMutation = createMutation(() => hashTextMutationOpts);

  const submitText: SubmitHandler<typeof HashTextDto> = async (values) => {
    reset(hashTextForm);

    const result = await hashTextMutation.mutateAsync(values);

    if (result.isErr()) {
      if ("code" in result.error) {
        switch (result.error.code) {
          case "TEST_ERROR":
            return setErrors(hashTextForm, {
              errors: [result.error.message],
              path: ["text"],
            });
        }
      }

      return setErrors(hashTextForm, {
        errors: ["Unexpected error, try again later..."],
        path: ["text"],
      });
    }
  };

  let logginOut = $state(false);

  async function handleLogout() {
    logginOut = true;

    const confirmation = window.confirm(
      "Are you sure? If you continue you gonna be disconnected from your account.",
    );

    if (!confirmation) {
      logginOut = false;
      return;
    }

    const result = await authClient.signOut();

    if (result.error) {
      return alert(result.error.message ?? "Unable to logout.");
    }

    logginOut = false;

    goto("/login");
  }
</script>

<main class="w-screen h-screen flex flex-col items-center pt-32">
  <div class="flex flex-col max-w-lg w-full">
    <div class="flex items-center justify-between p-4">
      <p>Hello, {data.user.name}!</p>

      <Button variant="destructive" size="icon" onclick={handleLogout} disabled={logginOut}>
        <LogOutIcon />
      </Button>
    </div>

    <Separator />

    <div class="flex flex-col gap-4 p-4">
      <hgroup>
        <h2 class="text-lg font-semibold mb-1">Hash the text</h2>
        <p class="text-sm text-muted-foreground">Test this protected API endpoint</p>
      </hgroup>

      <Form of={hashTextForm} onsubmit={submitText}>
        <FormField of={hashTextForm} path={["text"]}>
          {#snippet children(field)}
            <div class="flex gap-2">
              <FieldLayout errors={field.errors} {...field.props}>
                <Input
                  {...field.props}
                  placeholder="Type the string you want to hash with SHA-256"
                  aria-invalid={!!field.errors?.[0]}
                  value={field.input}
                  required
                />
              </FieldLayout>

              <Button type="submit" disabled={hashTextMutation.isPending}>
                Hash it!
                <HashIcon />
              </Button>
            </div>
          {/snippet}
        </FormField>
      </Form>

      {#if hashTextMutation.data?.isOk()}
        <div class="flex items-center justify-center gap-2 w-full h-32">
          <p class="text-lg font-semibold">
            {hashTextMutation.data.value.hash}
          </p>
        </div>
      {/if}
    </div>
  </div>
</main>
