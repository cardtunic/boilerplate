import Database from "$api/database/database";
import Auth from "$api/auth/auth";
import Env from "$api/services/env";
import { Layer, Logger, ManagedRuntime } from "effect";

export function buildRuntime(env: Cloudflare.Env) {
  const bareLayer = Layer.mergeAll(
    Layer.provide(Env.Default(env), Logger.pretty),
    Logger.pretty,
  );

  const baseLayer = Layer.provide(Layer.mergeAll(Database.Default), bareLayer);

  const authLayer = Layer.provide(
    Layer.mergeAll(Auth.Default),
    Layer.mergeAll(bareLayer, baseLayer),
  );

  const appLayer = Layer.mergeAll(bareLayer, baseLayer, authLayer);
  const runtime = ManagedRuntime.make(appLayer);

  return { appLayer, runtime };
}

type _Return = ReturnType<typeof buildRuntime>;
export type Runtime = _Return["runtime"];
export type RuntimeBuiltDependecies = Layer.Layer.Success<_Return["appLayer"]>;
