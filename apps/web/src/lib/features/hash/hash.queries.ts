import { api } from "$lib/api";
import { callApi } from "$lib/callApi";
import { mutationOptions } from "@tanstack/svelte-query";
import type { HashTextDto } from "dto";

export const hashTextMutationOpts = mutationOptions({
  mutationKey: ["hash-text"],
  mutationFn: (payload: HashTextDto) => callApi(api().hash.$post, { json: payload }),
});
