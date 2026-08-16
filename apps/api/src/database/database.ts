import type {
  EitherDatabaseClientFn,
  TransactionContextShape,
} from "$api/database/database.defs";
import type { DatabaseError } from "$api/database/errors/databaseError";
import { makeDatabaseError } from "$api/database/errors/makeDatabaseError";
import * as schema from "$api/database/schema";
import Env from "$api/services/env";
import { drizzle } from "drizzle-orm/node-postgres";
import { Cause, Context, Effect, Exit, Option, Runtime } from "effect";
import { Client } from "pg";

export class TransactionContext extends Context.Tag("TransactionContext")<
  TransactionContext,
  TransactionContextShape
>() {
  public static provide(
    transaction: TransactionContextShape,
  ): <A, E, R>(
    self: Effect.Effect<A, E, R>,
  ) => Effect.Effect<A, E, Exclude<R, TransactionContext>> {
    return Effect.provideService(this, transaction);
  }
}

export default class Database extends Effect.Service<Database>()("Database", {
  effect: Effect.gen(function* () {
    const env = yield* Env;

    const client = new Client({
      connectionString: env.HYPERDRIVE.connectionString,
    });

    yield* Effect.tryPromise({
      try: () => client.connect(),
      catch: makeDatabaseError,
    });

    const db = drizzle({ client, schema, casing: "snake_case" });

    function execute<T>(fn: EitherDatabaseClientFn<T>) {
      return Effect.tryPromise({
        try: () => fn(db),
        catch: makeDatabaseError,
      }).pipe(
        Effect.tap(() => Effect.logInfo("DB Query")),
        Effect.withLogSpan("Database.execute"),
      );
    }

    /**
     * Function that wraps all calls done inside a transaction into an effect.
     * It uses Effect.runtime() to get the current runtime with the necessary
     * requirements, so that it can run the promise at the end of the transaction,
     * handling any errors trough Exit.
     *
     * Uses Effect.async, because the Drizzle's API for transactions is callback
     * based, the resume function is used after the Promise is executed
     * by the runtime to return the correct Effect.Effect result.
     *
     * @example
     * ```
     * transaction((execute) => function *() {
     *  yield* execute(q => q.insert(users).values({...}))
     *  yield* execute(q => q.insert(users).values({...}))
     * })
     * ```
     * @param execute
     * @returns Effect.Effect<A, DatabaseError, never>
     */
    function transaction<A>(
      execute: (tx: TransactionContextShape) => Effect.Effect<A, DatabaseError>,
    ) {
      return Effect.runtime().pipe(
        Effect.map((runtime) => Runtime.runPromiseExit(runtime)),
        Effect.flatMap((runPromiseExit) =>
          Effect.async<A, DatabaseError>((resume) => {
            db.transaction(async (tx) => {
              const result = await runPromiseExit(
                execute((fn) =>
                  Effect.tryPromise({
                    try: () => fn(tx),
                    catch: makeDatabaseError,
                  }),
                ),
              );

              Exit.match(result, {
                onSuccess: (a) => resume(Effect.succeed(a)),
                onFailure: (cause) => {
                  const optionCause = Cause.failureOption(cause);

                  if (Option.isSome(optionCause)) {
                    resume(Effect.fail(optionCause.value as DatabaseError));
                  } else resume(Effect.die(cause));
                },
              });
            });
          }),
        ),
      );
    }

    /**
     * Utility function to create repository methods that can optionally
     * execute the queries within a transaction, relying on the availability
     * of a transaction client in the context where the effect is being executed.
     * @example
     * ```
     * const createUser = makeQuery((execute, input: { email: string }) => execute(q => q.insert(users).values(input)))
     * ```
     * @param queryFn
     * @returns
     */
    function makeQuery<A, E, R, Input = never>(
      queryFn: (
        execute: <T>(
          fn: EitherDatabaseClientFn<T>,
        ) => Effect.Effect<T, DatabaseError>,
        input: Input,
      ) => Effect.Effect<A, E, R>,
    ) {
      return (
        ...args: [Input] extends [never] ? [] : [input: Input]
      ): Effect.Effect<A, E, R> => {
        const input = args[0] as Input;

        return Effect.serviceOption(TransactionContext).pipe(
          Effect.map(Option.getOrNull),
          Effect.flatMap((txOrNull) => queryFn(txOrNull ?? execute, input)),
        );
      };
    }

    return { execute, transaction, makeQuery, $client: client, $drizzle: db };
  }),

  accessors: true,
}) {}
