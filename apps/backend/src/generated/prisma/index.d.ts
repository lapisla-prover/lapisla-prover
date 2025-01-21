
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model users
 * 
 */
export type users = $Result.DefaultSelection<Prisma.$usersPayload>
/**
 * Model files
 * 
 */
export type files = $Result.DefaultSelection<Prisma.$filesPayload>
/**
 * Model contents
 * 
 */
export type contents = $Result.DefaultSelection<Prisma.$contentsPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.users.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.users.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs, $Utils.Call<Prisma.TypeMapCb, {
    extArgs: ExtArgs
  }>, ClientOptions>

      /**
   * `prisma.users`: Exposes CRUD operations for the **users** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.users.findMany()
    * ```
    */
  get users(): Prisma.usersDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.files`: Exposes CRUD operations for the **files** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Files
    * const files = await prisma.files.findMany()
    * ```
    */
  get files(): Prisma.filesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.contents`: Exposes CRUD operations for the **contents** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Contents
    * const contents = await prisma.contents.findMany()
    * ```
    */
  get contents(): Prisma.contentsDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.2.1
   * Query Engine version: 4123509d24aa4dede1e864b46351bf2790323b69
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    users: 'users',
    files: 'files',
    contents: 'contents'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "users" | "files" | "contents"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      users: {
        payload: Prisma.$usersPayload<ExtArgs>
        fields: Prisma.usersFieldRefs
        operations: {
          findUnique: {
            args: Prisma.usersFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.usersFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          findFirst: {
            args: Prisma.usersFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.usersFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          findMany: {
            args: Prisma.usersFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>[]
          }
          create: {
            args: Prisma.usersCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          createMany: {
            args: Prisma.usersCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.usersDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          update: {
            args: Prisma.usersUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          deleteMany: {
            args: Prisma.usersDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.usersUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.usersUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          aggregate: {
            args: Prisma.UsersAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUsers>
          }
          groupBy: {
            args: Prisma.usersGroupByArgs<ExtArgs>
            result: $Utils.Optional<UsersGroupByOutputType>[]
          }
          count: {
            args: Prisma.usersCountArgs<ExtArgs>
            result: $Utils.Optional<UsersCountAggregateOutputType> | number
          }
        }
      }
      files: {
        payload: Prisma.$filesPayload<ExtArgs>
        fields: Prisma.filesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.filesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$filesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.filesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$filesPayload>
          }
          findFirst: {
            args: Prisma.filesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$filesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.filesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$filesPayload>
          }
          findMany: {
            args: Prisma.filesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$filesPayload>[]
          }
          create: {
            args: Prisma.filesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$filesPayload>
          }
          createMany: {
            args: Prisma.filesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.filesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$filesPayload>
          }
          update: {
            args: Prisma.filesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$filesPayload>
          }
          deleteMany: {
            args: Prisma.filesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.filesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.filesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$filesPayload>
          }
          aggregate: {
            args: Prisma.FilesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFiles>
          }
          groupBy: {
            args: Prisma.filesGroupByArgs<ExtArgs>
            result: $Utils.Optional<FilesGroupByOutputType>[]
          }
          count: {
            args: Prisma.filesCountArgs<ExtArgs>
            result: $Utils.Optional<FilesCountAggregateOutputType> | number
          }
        }
      }
      contents: {
        payload: Prisma.$contentsPayload<ExtArgs>
        fields: Prisma.contentsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.contentsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$contentsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.contentsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$contentsPayload>
          }
          findFirst: {
            args: Prisma.contentsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$contentsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.contentsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$contentsPayload>
          }
          findMany: {
            args: Prisma.contentsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$contentsPayload>[]
          }
          create: {
            args: Prisma.contentsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$contentsPayload>
          }
          createMany: {
            args: Prisma.contentsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.contentsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$contentsPayload>
          }
          update: {
            args: Prisma.contentsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$contentsPayload>
          }
          deleteMany: {
            args: Prisma.contentsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.contentsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.contentsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$contentsPayload>
          }
          aggregate: {
            args: Prisma.ContentsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateContents>
          }
          groupBy: {
            args: Prisma.contentsGroupByArgs<ExtArgs>
            result: $Utils.Optional<ContentsGroupByOutputType>[]
          }
          count: {
            args: Prisma.contentsCountArgs<ExtArgs>
            result: $Utils.Optional<ContentsCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    users?: usersOmit
    files?: filesOmit
    contents?: contentsOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model users
   */

  export type AggregateUsers = {
    _count: UsersCountAggregateOutputType | null
    _min: UsersMinAggregateOutputType | null
    _max: UsersMaxAggregateOutputType | null
  }

  export type UsersMinAggregateOutputType = {
    id: string | null
    name: string | null
  }

  export type UsersMaxAggregateOutputType = {
    id: string | null
    name: string | null
  }

  export type UsersCountAggregateOutputType = {
    id: number
    name: number
    _all: number
  }


  export type UsersMinAggregateInputType = {
    id?: true
    name?: true
  }

  export type UsersMaxAggregateInputType = {
    id?: true
    name?: true
  }

  export type UsersCountAggregateInputType = {
    id?: true
    name?: true
    _all?: true
  }

  export type UsersAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which users to aggregate.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned users
    **/
    _count?: true | UsersCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsersMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsersMaxAggregateInputType
  }

  export type GetUsersAggregateType<T extends UsersAggregateArgs> = {
        [P in keyof T & keyof AggregateUsers]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsers[P]>
      : GetScalarType<T[P], AggregateUsers[P]>
  }




  export type usersGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: usersWhereInput
    orderBy?: usersOrderByWithAggregationInput | usersOrderByWithAggregationInput[]
    by: UsersScalarFieldEnum[] | UsersScalarFieldEnum
    having?: usersScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsersCountAggregateInputType | true
    _min?: UsersMinAggregateInputType
    _max?: UsersMaxAggregateInputType
  }

  export type UsersGroupByOutputType = {
    id: string
    name: string
    _count: UsersCountAggregateOutputType | null
    _min: UsersMinAggregateOutputType | null
    _max: UsersMaxAggregateOutputType | null
  }

  type GetUsersGroupByPayload<T extends usersGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UsersGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsersGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsersGroupByOutputType[P]>
            : GetScalarType<T[P], UsersGroupByOutputType[P]>
        }
      >
    >


  export type usersSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
  }, ExtArgs["result"]["users"]>



  export type usersSelectScalar = {
    id?: boolean
    name?: boolean
  }

  export type usersOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name", ExtArgs["result"]["users"]>

  export type $usersPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "users"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
    }, ExtArgs["result"]["users"]>
    composites: {}
  }

  type usersGetPayload<S extends boolean | null | undefined | usersDefaultArgs> = $Result.GetResult<Prisma.$usersPayload, S>

  type usersCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<usersFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UsersCountAggregateInputType | true
    }

  export interface usersDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['users'], meta: { name: 'users' } }
    /**
     * Find zero or one Users that matches the filter.
     * @param {usersFindUniqueArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends usersFindUniqueArgs>(args: SelectSubset<T, usersFindUniqueArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUnique", ClientOptions> | null, null, ExtArgs, ClientOptions>

    /**
     * Find one Users that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {usersFindUniqueOrThrowArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends usersFindUniqueOrThrowArgs>(args: SelectSubset<T, usersFindUniqueOrThrowArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Find the first Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindFirstArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends usersFindFirstArgs>(args?: SelectSubset<T, usersFindFirstArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findFirst", ClientOptions> | null, null, ExtArgs, ClientOptions>

    /**
     * Find the first Users that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindFirstOrThrowArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends usersFindFirstOrThrowArgs>(args?: SelectSubset<T, usersFindFirstOrThrowArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findFirstOrThrow", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.users.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.users.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const usersWithIdOnly = await prisma.users.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends usersFindManyArgs>(args?: SelectSubset<T, usersFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findMany", ClientOptions>>

    /**
     * Create a Users.
     * @param {usersCreateArgs} args - Arguments to create a Users.
     * @example
     * // Create one Users
     * const Users = await prisma.users.create({
     *   data: {
     *     // ... data to create a Users
     *   }
     * })
     * 
     */
    create<T extends usersCreateArgs>(args: SelectSubset<T, usersCreateArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "create", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Create many Users.
     * @param {usersCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const users = await prisma.users.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends usersCreateManyArgs>(args?: SelectSubset<T, usersCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Users.
     * @param {usersDeleteArgs} args - Arguments to delete one Users.
     * @example
     * // Delete one Users
     * const Users = await prisma.users.delete({
     *   where: {
     *     // ... filter to delete one Users
     *   }
     * })
     * 
     */
    delete<T extends usersDeleteArgs>(args: SelectSubset<T, usersDeleteArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "delete", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Update one Users.
     * @param {usersUpdateArgs} args - Arguments to update one Users.
     * @example
     * // Update one Users
     * const users = await prisma.users.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends usersUpdateArgs>(args: SelectSubset<T, usersUpdateArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "update", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Delete zero or more Users.
     * @param {usersDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.users.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends usersDeleteManyArgs>(args?: SelectSubset<T, usersDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const users = await prisma.users.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends usersUpdateManyArgs>(args: SelectSubset<T, usersUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Users.
     * @param {usersUpsertArgs} args - Arguments to update or create a Users.
     * @example
     * // Update or create a Users
     * const users = await prisma.users.upsert({
     *   create: {
     *     // ... data to create a Users
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Users we want to update
     *   }
     * })
     */
    upsert<T extends usersUpsertArgs>(args: SelectSubset<T, usersUpsertArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "upsert", ClientOptions>, never, ExtArgs, ClientOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.users.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends usersCountArgs>(
      args?: Subset<T, usersCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsersCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UsersAggregateArgs>(args: Subset<T, UsersAggregateArgs>): Prisma.PrismaPromise<GetUsersAggregateType<T>>

    /**
     * Group by Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends usersGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: usersGroupByArgs['orderBy'] }
        : { orderBy?: usersGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, usersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsersGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the users model
   */
  readonly fields: usersFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for users.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__usersClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the users model
   */ 
  interface usersFieldRefs {
    readonly id: FieldRef<"users", 'String'>
    readonly name: FieldRef<"users", 'String'>
  }
    

  // Custom InputTypes
  /**
   * users findUnique
   */
  export type usersFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users findUniqueOrThrow
   */
  export type usersFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users findFirst
   */
  export type usersFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * users findFirstOrThrow
   */
  export type usersFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * users findMany
   */
  export type usersFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing users.
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * users create
   */
  export type usersCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * The data needed to create a users.
     */
    data: XOR<usersCreateInput, usersUncheckedCreateInput>
  }

  /**
   * users createMany
   */
  export type usersCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many users.
     */
    data: usersCreateManyInput | usersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * users update
   */
  export type usersUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * The data needed to update a users.
     */
    data: XOR<usersUpdateInput, usersUncheckedUpdateInput>
    /**
     * Choose, which users to update.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users updateMany
   */
  export type usersUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update users.
     */
    data: XOR<usersUpdateManyMutationInput, usersUncheckedUpdateManyInput>
    /**
     * Filter which users to update
     */
    where?: usersWhereInput
  }

  /**
   * users upsert
   */
  export type usersUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * The filter to search for the users to update in case it exists.
     */
    where: usersWhereUniqueInput
    /**
     * In case the users found by the `where` argument doesn't exist, create a new users with this data.
     */
    create: XOR<usersCreateInput, usersUncheckedCreateInput>
    /**
     * In case the users was found with the provided `where` argument, update it with this data.
     */
    update: XOR<usersUpdateInput, usersUncheckedUpdateInput>
  }

  /**
   * users delete
   */
  export type usersDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Filter which users to delete.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users deleteMany
   */
  export type usersDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which users to delete
     */
    where?: usersWhereInput
  }

  /**
   * users without action
   */
  export type usersDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
  }


  /**
   * Model files
   */

  export type AggregateFiles = {
    _count: FilesCountAggregateOutputType | null
    _avg: FilesAvgAggregateOutputType | null
    _sum: FilesSumAggregateOutputType | null
    _min: FilesMinAggregateOutputType | null
    _max: FilesMaxAggregateOutputType | null
  }

  export type FilesAvgAggregateOutputType = {
    version: number | null
  }

  export type FilesSumAggregateOutputType = {
    version: number | null
  }

  export type FilesMinAggregateOutputType = {
    id: string | null
    owner: string | null
    name: string | null
    version: number | null
    registered: boolean | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type FilesMaxAggregateOutputType = {
    id: string | null
    owner: string | null
    name: string | null
    version: number | null
    registered: boolean | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type FilesCountAggregateOutputType = {
    id: number
    owner: number
    name: number
    version: number
    registered: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type FilesAvgAggregateInputType = {
    version?: true
  }

  export type FilesSumAggregateInputType = {
    version?: true
  }

  export type FilesMinAggregateInputType = {
    id?: true
    owner?: true
    name?: true
    version?: true
    registered?: true
    created_at?: true
    updated_at?: true
  }

  export type FilesMaxAggregateInputType = {
    id?: true
    owner?: true
    name?: true
    version?: true
    registered?: true
    created_at?: true
    updated_at?: true
  }

  export type FilesCountAggregateInputType = {
    id?: true
    owner?: true
    name?: true
    version?: true
    registered?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type FilesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which files to aggregate.
     */
    where?: filesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of files to fetch.
     */
    orderBy?: filesOrderByWithRelationInput | filesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: filesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` files from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` files.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned files
    **/
    _count?: true | FilesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FilesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FilesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FilesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FilesMaxAggregateInputType
  }

  export type GetFilesAggregateType<T extends FilesAggregateArgs> = {
        [P in keyof T & keyof AggregateFiles]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFiles[P]>
      : GetScalarType<T[P], AggregateFiles[P]>
  }




  export type filesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: filesWhereInput
    orderBy?: filesOrderByWithAggregationInput | filesOrderByWithAggregationInput[]
    by: FilesScalarFieldEnum[] | FilesScalarFieldEnum
    having?: filesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FilesCountAggregateInputType | true
    _avg?: FilesAvgAggregateInputType
    _sum?: FilesSumAggregateInputType
    _min?: FilesMinAggregateInputType
    _max?: FilesMaxAggregateInputType
  }

  export type FilesGroupByOutputType = {
    id: string
    owner: string
    name: string
    version: number
    registered: boolean
    created_at: Date
    updated_at: Date
    _count: FilesCountAggregateOutputType | null
    _avg: FilesAvgAggregateOutputType | null
    _sum: FilesSumAggregateOutputType | null
    _min: FilesMinAggregateOutputType | null
    _max: FilesMaxAggregateOutputType | null
  }

  type GetFilesGroupByPayload<T extends filesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FilesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FilesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FilesGroupByOutputType[P]>
            : GetScalarType<T[P], FilesGroupByOutputType[P]>
        }
      >
    >


  export type filesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    owner?: boolean
    name?: boolean
    version?: boolean
    registered?: boolean
    created_at?: boolean
    updated_at?: boolean
    content?: boolean | files$contentArgs<ExtArgs>
  }, ExtArgs["result"]["files"]>



  export type filesSelectScalar = {
    id?: boolean
    owner?: boolean
    name?: boolean
    version?: boolean
    registered?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type filesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "owner" | "name" | "version" | "registered" | "created_at" | "updated_at", ExtArgs["result"]["files"]>
  export type filesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    content?: boolean | files$contentArgs<ExtArgs>
  }

  export type $filesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "files"
    objects: {
      content: Prisma.$contentsPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      owner: string
      name: string
      version: number
      registered: boolean
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["files"]>
    composites: {}
  }

  type filesGetPayload<S extends boolean | null | undefined | filesDefaultArgs> = $Result.GetResult<Prisma.$filesPayload, S>

  type filesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<filesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FilesCountAggregateInputType | true
    }

  export interface filesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['files'], meta: { name: 'files' } }
    /**
     * Find zero or one Files that matches the filter.
     * @param {filesFindUniqueArgs} args - Arguments to find a Files
     * @example
     * // Get one Files
     * const files = await prisma.files.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends filesFindUniqueArgs>(args: SelectSubset<T, filesFindUniqueArgs<ExtArgs>>): Prisma__filesClient<$Result.GetResult<Prisma.$filesPayload<ExtArgs>, T, "findUnique", ClientOptions> | null, null, ExtArgs, ClientOptions>

    /**
     * Find one Files that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {filesFindUniqueOrThrowArgs} args - Arguments to find a Files
     * @example
     * // Get one Files
     * const files = await prisma.files.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends filesFindUniqueOrThrowArgs>(args: SelectSubset<T, filesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__filesClient<$Result.GetResult<Prisma.$filesPayload<ExtArgs>, T, "findUniqueOrThrow", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Find the first Files that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {filesFindFirstArgs} args - Arguments to find a Files
     * @example
     * // Get one Files
     * const files = await prisma.files.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends filesFindFirstArgs>(args?: SelectSubset<T, filesFindFirstArgs<ExtArgs>>): Prisma__filesClient<$Result.GetResult<Prisma.$filesPayload<ExtArgs>, T, "findFirst", ClientOptions> | null, null, ExtArgs, ClientOptions>

    /**
     * Find the first Files that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {filesFindFirstOrThrowArgs} args - Arguments to find a Files
     * @example
     * // Get one Files
     * const files = await prisma.files.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends filesFindFirstOrThrowArgs>(args?: SelectSubset<T, filesFindFirstOrThrowArgs<ExtArgs>>): Prisma__filesClient<$Result.GetResult<Prisma.$filesPayload<ExtArgs>, T, "findFirstOrThrow", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Find zero or more Files that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {filesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Files
     * const files = await prisma.files.findMany()
     * 
     * // Get first 10 Files
     * const files = await prisma.files.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const filesWithIdOnly = await prisma.files.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends filesFindManyArgs>(args?: SelectSubset<T, filesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$filesPayload<ExtArgs>, T, "findMany", ClientOptions>>

    /**
     * Create a Files.
     * @param {filesCreateArgs} args - Arguments to create a Files.
     * @example
     * // Create one Files
     * const Files = await prisma.files.create({
     *   data: {
     *     // ... data to create a Files
     *   }
     * })
     * 
     */
    create<T extends filesCreateArgs>(args: SelectSubset<T, filesCreateArgs<ExtArgs>>): Prisma__filesClient<$Result.GetResult<Prisma.$filesPayload<ExtArgs>, T, "create", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Create many Files.
     * @param {filesCreateManyArgs} args - Arguments to create many Files.
     * @example
     * // Create many Files
     * const files = await prisma.files.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends filesCreateManyArgs>(args?: SelectSubset<T, filesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Files.
     * @param {filesDeleteArgs} args - Arguments to delete one Files.
     * @example
     * // Delete one Files
     * const Files = await prisma.files.delete({
     *   where: {
     *     // ... filter to delete one Files
     *   }
     * })
     * 
     */
    delete<T extends filesDeleteArgs>(args: SelectSubset<T, filesDeleteArgs<ExtArgs>>): Prisma__filesClient<$Result.GetResult<Prisma.$filesPayload<ExtArgs>, T, "delete", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Update one Files.
     * @param {filesUpdateArgs} args - Arguments to update one Files.
     * @example
     * // Update one Files
     * const files = await prisma.files.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends filesUpdateArgs>(args: SelectSubset<T, filesUpdateArgs<ExtArgs>>): Prisma__filesClient<$Result.GetResult<Prisma.$filesPayload<ExtArgs>, T, "update", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Delete zero or more Files.
     * @param {filesDeleteManyArgs} args - Arguments to filter Files to delete.
     * @example
     * // Delete a few Files
     * const { count } = await prisma.files.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends filesDeleteManyArgs>(args?: SelectSubset<T, filesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Files.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {filesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Files
     * const files = await prisma.files.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends filesUpdateManyArgs>(args: SelectSubset<T, filesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Files.
     * @param {filesUpsertArgs} args - Arguments to update or create a Files.
     * @example
     * // Update or create a Files
     * const files = await prisma.files.upsert({
     *   create: {
     *     // ... data to create a Files
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Files we want to update
     *   }
     * })
     */
    upsert<T extends filesUpsertArgs>(args: SelectSubset<T, filesUpsertArgs<ExtArgs>>): Prisma__filesClient<$Result.GetResult<Prisma.$filesPayload<ExtArgs>, T, "upsert", ClientOptions>, never, ExtArgs, ClientOptions>


    /**
     * Count the number of Files.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {filesCountArgs} args - Arguments to filter Files to count.
     * @example
     * // Count the number of Files
     * const count = await prisma.files.count({
     *   where: {
     *     // ... the filter for the Files we want to count
     *   }
     * })
    **/
    count<T extends filesCountArgs>(
      args?: Subset<T, filesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FilesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Files.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FilesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FilesAggregateArgs>(args: Subset<T, FilesAggregateArgs>): Prisma.PrismaPromise<GetFilesAggregateType<T>>

    /**
     * Group by Files.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {filesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends filesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: filesGroupByArgs['orderBy'] }
        : { orderBy?: filesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, filesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFilesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the files model
   */
  readonly fields: filesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for files.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__filesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    content<T extends files$contentArgs<ExtArgs> = {}>(args?: Subset<T, files$contentArgs<ExtArgs>>): Prisma__contentsClient<$Result.GetResult<Prisma.$contentsPayload<ExtArgs>, T, "findUniqueOrThrow", ClientOptions> | null, null, ExtArgs, ClientOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the files model
   */ 
  interface filesFieldRefs {
    readonly id: FieldRef<"files", 'String'>
    readonly owner: FieldRef<"files", 'String'>
    readonly name: FieldRef<"files", 'String'>
    readonly version: FieldRef<"files", 'Int'>
    readonly registered: FieldRef<"files", 'Boolean'>
    readonly created_at: FieldRef<"files", 'DateTime'>
    readonly updated_at: FieldRef<"files", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * files findUnique
   */
  export type filesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the files
     */
    select?: filesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the files
     */
    omit?: filesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: filesInclude<ExtArgs> | null
    /**
     * Filter, which files to fetch.
     */
    where: filesWhereUniqueInput
  }

  /**
   * files findUniqueOrThrow
   */
  export type filesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the files
     */
    select?: filesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the files
     */
    omit?: filesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: filesInclude<ExtArgs> | null
    /**
     * Filter, which files to fetch.
     */
    where: filesWhereUniqueInput
  }

  /**
   * files findFirst
   */
  export type filesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the files
     */
    select?: filesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the files
     */
    omit?: filesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: filesInclude<ExtArgs> | null
    /**
     * Filter, which files to fetch.
     */
    where?: filesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of files to fetch.
     */
    orderBy?: filesOrderByWithRelationInput | filesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for files.
     */
    cursor?: filesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` files from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` files.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of files.
     */
    distinct?: FilesScalarFieldEnum | FilesScalarFieldEnum[]
  }

  /**
   * files findFirstOrThrow
   */
  export type filesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the files
     */
    select?: filesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the files
     */
    omit?: filesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: filesInclude<ExtArgs> | null
    /**
     * Filter, which files to fetch.
     */
    where?: filesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of files to fetch.
     */
    orderBy?: filesOrderByWithRelationInput | filesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for files.
     */
    cursor?: filesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` files from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` files.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of files.
     */
    distinct?: FilesScalarFieldEnum | FilesScalarFieldEnum[]
  }

  /**
   * files findMany
   */
  export type filesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the files
     */
    select?: filesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the files
     */
    omit?: filesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: filesInclude<ExtArgs> | null
    /**
     * Filter, which files to fetch.
     */
    where?: filesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of files to fetch.
     */
    orderBy?: filesOrderByWithRelationInput | filesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing files.
     */
    cursor?: filesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` files from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` files.
     */
    skip?: number
    distinct?: FilesScalarFieldEnum | FilesScalarFieldEnum[]
  }

  /**
   * files create
   */
  export type filesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the files
     */
    select?: filesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the files
     */
    omit?: filesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: filesInclude<ExtArgs> | null
    /**
     * The data needed to create a files.
     */
    data: XOR<filesCreateInput, filesUncheckedCreateInput>
  }

  /**
   * files createMany
   */
  export type filesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many files.
     */
    data: filesCreateManyInput | filesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * files update
   */
  export type filesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the files
     */
    select?: filesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the files
     */
    omit?: filesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: filesInclude<ExtArgs> | null
    /**
     * The data needed to update a files.
     */
    data: XOR<filesUpdateInput, filesUncheckedUpdateInput>
    /**
     * Choose, which files to update.
     */
    where: filesWhereUniqueInput
  }

  /**
   * files updateMany
   */
  export type filesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update files.
     */
    data: XOR<filesUpdateManyMutationInput, filesUncheckedUpdateManyInput>
    /**
     * Filter which files to update
     */
    where?: filesWhereInput
  }

  /**
   * files upsert
   */
  export type filesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the files
     */
    select?: filesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the files
     */
    omit?: filesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: filesInclude<ExtArgs> | null
    /**
     * The filter to search for the files to update in case it exists.
     */
    where: filesWhereUniqueInput
    /**
     * In case the files found by the `where` argument doesn't exist, create a new files with this data.
     */
    create: XOR<filesCreateInput, filesUncheckedCreateInput>
    /**
     * In case the files was found with the provided `where` argument, update it with this data.
     */
    update: XOR<filesUpdateInput, filesUncheckedUpdateInput>
  }

  /**
   * files delete
   */
  export type filesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the files
     */
    select?: filesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the files
     */
    omit?: filesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: filesInclude<ExtArgs> | null
    /**
     * Filter which files to delete.
     */
    where: filesWhereUniqueInput
  }

  /**
   * files deleteMany
   */
  export type filesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which files to delete
     */
    where?: filesWhereInput
  }

  /**
   * files.content
   */
  export type files$contentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the contents
     */
    select?: contentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the contents
     */
    omit?: contentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: contentsInclude<ExtArgs> | null
    where?: contentsWhereInput
  }

  /**
   * files without action
   */
  export type filesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the files
     */
    select?: filesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the files
     */
    omit?: filesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: filesInclude<ExtArgs> | null
  }


  /**
   * Model contents
   */

  export type AggregateContents = {
    _count: ContentsCountAggregateOutputType | null
    _min: ContentsMinAggregateOutputType | null
    _max: ContentsMaxAggregateOutputType | null
  }

  export type ContentsMinAggregateOutputType = {
    file_id: string | null
    content: string | null
  }

  export type ContentsMaxAggregateOutputType = {
    file_id: string | null
    content: string | null
  }

  export type ContentsCountAggregateOutputType = {
    file_id: number
    content: number
    _all: number
  }


  export type ContentsMinAggregateInputType = {
    file_id?: true
    content?: true
  }

  export type ContentsMaxAggregateInputType = {
    file_id?: true
    content?: true
  }

  export type ContentsCountAggregateInputType = {
    file_id?: true
    content?: true
    _all?: true
  }

  export type ContentsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which contents to aggregate.
     */
    where?: contentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of contents to fetch.
     */
    orderBy?: contentsOrderByWithRelationInput | contentsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: contentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` contents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` contents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned contents
    **/
    _count?: true | ContentsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ContentsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ContentsMaxAggregateInputType
  }

  export type GetContentsAggregateType<T extends ContentsAggregateArgs> = {
        [P in keyof T & keyof AggregateContents]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateContents[P]>
      : GetScalarType<T[P], AggregateContents[P]>
  }




  export type contentsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: contentsWhereInput
    orderBy?: contentsOrderByWithAggregationInput | contentsOrderByWithAggregationInput[]
    by: ContentsScalarFieldEnum[] | ContentsScalarFieldEnum
    having?: contentsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ContentsCountAggregateInputType | true
    _min?: ContentsMinAggregateInputType
    _max?: ContentsMaxAggregateInputType
  }

  export type ContentsGroupByOutputType = {
    file_id: string
    content: string
    _count: ContentsCountAggregateOutputType | null
    _min: ContentsMinAggregateOutputType | null
    _max: ContentsMaxAggregateOutputType | null
  }

  type GetContentsGroupByPayload<T extends contentsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ContentsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ContentsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ContentsGroupByOutputType[P]>
            : GetScalarType<T[P], ContentsGroupByOutputType[P]>
        }
      >
    >


  export type contentsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    file_id?: boolean
    content?: boolean
    file?: boolean | filesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["contents"]>



  export type contentsSelectScalar = {
    file_id?: boolean
    content?: boolean
  }

  export type contentsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"file_id" | "content", ExtArgs["result"]["contents"]>
  export type contentsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    file?: boolean | filesDefaultArgs<ExtArgs>
  }

  export type $contentsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "contents"
    objects: {
      file: Prisma.$filesPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      file_id: string
      content: string
    }, ExtArgs["result"]["contents"]>
    composites: {}
  }

  type contentsGetPayload<S extends boolean | null | undefined | contentsDefaultArgs> = $Result.GetResult<Prisma.$contentsPayload, S>

  type contentsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<contentsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ContentsCountAggregateInputType | true
    }

  export interface contentsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['contents'], meta: { name: 'contents' } }
    /**
     * Find zero or one Contents that matches the filter.
     * @param {contentsFindUniqueArgs} args - Arguments to find a Contents
     * @example
     * // Get one Contents
     * const contents = await prisma.contents.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends contentsFindUniqueArgs>(args: SelectSubset<T, contentsFindUniqueArgs<ExtArgs>>): Prisma__contentsClient<$Result.GetResult<Prisma.$contentsPayload<ExtArgs>, T, "findUnique", ClientOptions> | null, null, ExtArgs, ClientOptions>

    /**
     * Find one Contents that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {contentsFindUniqueOrThrowArgs} args - Arguments to find a Contents
     * @example
     * // Get one Contents
     * const contents = await prisma.contents.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends contentsFindUniqueOrThrowArgs>(args: SelectSubset<T, contentsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__contentsClient<$Result.GetResult<Prisma.$contentsPayload<ExtArgs>, T, "findUniqueOrThrow", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Find the first Contents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {contentsFindFirstArgs} args - Arguments to find a Contents
     * @example
     * // Get one Contents
     * const contents = await prisma.contents.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends contentsFindFirstArgs>(args?: SelectSubset<T, contentsFindFirstArgs<ExtArgs>>): Prisma__contentsClient<$Result.GetResult<Prisma.$contentsPayload<ExtArgs>, T, "findFirst", ClientOptions> | null, null, ExtArgs, ClientOptions>

    /**
     * Find the first Contents that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {contentsFindFirstOrThrowArgs} args - Arguments to find a Contents
     * @example
     * // Get one Contents
     * const contents = await prisma.contents.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends contentsFindFirstOrThrowArgs>(args?: SelectSubset<T, contentsFindFirstOrThrowArgs<ExtArgs>>): Prisma__contentsClient<$Result.GetResult<Prisma.$contentsPayload<ExtArgs>, T, "findFirstOrThrow", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Find zero or more Contents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {contentsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Contents
     * const contents = await prisma.contents.findMany()
     * 
     * // Get first 10 Contents
     * const contents = await prisma.contents.findMany({ take: 10 })
     * 
     * // Only select the `file_id`
     * const contentsWithFile_idOnly = await prisma.contents.findMany({ select: { file_id: true } })
     * 
     */
    findMany<T extends contentsFindManyArgs>(args?: SelectSubset<T, contentsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$contentsPayload<ExtArgs>, T, "findMany", ClientOptions>>

    /**
     * Create a Contents.
     * @param {contentsCreateArgs} args - Arguments to create a Contents.
     * @example
     * // Create one Contents
     * const Contents = await prisma.contents.create({
     *   data: {
     *     // ... data to create a Contents
     *   }
     * })
     * 
     */
    create<T extends contentsCreateArgs>(args: SelectSubset<T, contentsCreateArgs<ExtArgs>>): Prisma__contentsClient<$Result.GetResult<Prisma.$contentsPayload<ExtArgs>, T, "create", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Create many Contents.
     * @param {contentsCreateManyArgs} args - Arguments to create many Contents.
     * @example
     * // Create many Contents
     * const contents = await prisma.contents.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends contentsCreateManyArgs>(args?: SelectSubset<T, contentsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Contents.
     * @param {contentsDeleteArgs} args - Arguments to delete one Contents.
     * @example
     * // Delete one Contents
     * const Contents = await prisma.contents.delete({
     *   where: {
     *     // ... filter to delete one Contents
     *   }
     * })
     * 
     */
    delete<T extends contentsDeleteArgs>(args: SelectSubset<T, contentsDeleteArgs<ExtArgs>>): Prisma__contentsClient<$Result.GetResult<Prisma.$contentsPayload<ExtArgs>, T, "delete", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Update one Contents.
     * @param {contentsUpdateArgs} args - Arguments to update one Contents.
     * @example
     * // Update one Contents
     * const contents = await prisma.contents.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends contentsUpdateArgs>(args: SelectSubset<T, contentsUpdateArgs<ExtArgs>>): Prisma__contentsClient<$Result.GetResult<Prisma.$contentsPayload<ExtArgs>, T, "update", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Delete zero or more Contents.
     * @param {contentsDeleteManyArgs} args - Arguments to filter Contents to delete.
     * @example
     * // Delete a few Contents
     * const { count } = await prisma.contents.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends contentsDeleteManyArgs>(args?: SelectSubset<T, contentsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Contents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {contentsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Contents
     * const contents = await prisma.contents.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends contentsUpdateManyArgs>(args: SelectSubset<T, contentsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Contents.
     * @param {contentsUpsertArgs} args - Arguments to update or create a Contents.
     * @example
     * // Update or create a Contents
     * const contents = await prisma.contents.upsert({
     *   create: {
     *     // ... data to create a Contents
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Contents we want to update
     *   }
     * })
     */
    upsert<T extends contentsUpsertArgs>(args: SelectSubset<T, contentsUpsertArgs<ExtArgs>>): Prisma__contentsClient<$Result.GetResult<Prisma.$contentsPayload<ExtArgs>, T, "upsert", ClientOptions>, never, ExtArgs, ClientOptions>


    /**
     * Count the number of Contents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {contentsCountArgs} args - Arguments to filter Contents to count.
     * @example
     * // Count the number of Contents
     * const count = await prisma.contents.count({
     *   where: {
     *     // ... the filter for the Contents we want to count
     *   }
     * })
    **/
    count<T extends contentsCountArgs>(
      args?: Subset<T, contentsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ContentsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Contents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ContentsAggregateArgs>(args: Subset<T, ContentsAggregateArgs>): Prisma.PrismaPromise<GetContentsAggregateType<T>>

    /**
     * Group by Contents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {contentsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends contentsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: contentsGroupByArgs['orderBy'] }
        : { orderBy?: contentsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, contentsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetContentsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the contents model
   */
  readonly fields: contentsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for contents.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__contentsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    file<T extends filesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, filesDefaultArgs<ExtArgs>>): Prisma__filesClient<$Result.GetResult<Prisma.$filesPayload<ExtArgs>, T, "findUniqueOrThrow", ClientOptions> | Null, Null, ExtArgs, ClientOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the contents model
   */ 
  interface contentsFieldRefs {
    readonly file_id: FieldRef<"contents", 'String'>
    readonly content: FieldRef<"contents", 'String'>
  }
    

  // Custom InputTypes
  /**
   * contents findUnique
   */
  export type contentsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the contents
     */
    select?: contentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the contents
     */
    omit?: contentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: contentsInclude<ExtArgs> | null
    /**
     * Filter, which contents to fetch.
     */
    where: contentsWhereUniqueInput
  }

  /**
   * contents findUniqueOrThrow
   */
  export type contentsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the contents
     */
    select?: contentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the contents
     */
    omit?: contentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: contentsInclude<ExtArgs> | null
    /**
     * Filter, which contents to fetch.
     */
    where: contentsWhereUniqueInput
  }

  /**
   * contents findFirst
   */
  export type contentsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the contents
     */
    select?: contentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the contents
     */
    omit?: contentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: contentsInclude<ExtArgs> | null
    /**
     * Filter, which contents to fetch.
     */
    where?: contentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of contents to fetch.
     */
    orderBy?: contentsOrderByWithRelationInput | contentsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for contents.
     */
    cursor?: contentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` contents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` contents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of contents.
     */
    distinct?: ContentsScalarFieldEnum | ContentsScalarFieldEnum[]
  }

  /**
   * contents findFirstOrThrow
   */
  export type contentsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the contents
     */
    select?: contentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the contents
     */
    omit?: contentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: contentsInclude<ExtArgs> | null
    /**
     * Filter, which contents to fetch.
     */
    where?: contentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of contents to fetch.
     */
    orderBy?: contentsOrderByWithRelationInput | contentsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for contents.
     */
    cursor?: contentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` contents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` contents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of contents.
     */
    distinct?: ContentsScalarFieldEnum | ContentsScalarFieldEnum[]
  }

  /**
   * contents findMany
   */
  export type contentsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the contents
     */
    select?: contentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the contents
     */
    omit?: contentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: contentsInclude<ExtArgs> | null
    /**
     * Filter, which contents to fetch.
     */
    where?: contentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of contents to fetch.
     */
    orderBy?: contentsOrderByWithRelationInput | contentsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing contents.
     */
    cursor?: contentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` contents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` contents.
     */
    skip?: number
    distinct?: ContentsScalarFieldEnum | ContentsScalarFieldEnum[]
  }

  /**
   * contents create
   */
  export type contentsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the contents
     */
    select?: contentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the contents
     */
    omit?: contentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: contentsInclude<ExtArgs> | null
    /**
     * The data needed to create a contents.
     */
    data: XOR<contentsCreateInput, contentsUncheckedCreateInput>
  }

  /**
   * contents createMany
   */
  export type contentsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many contents.
     */
    data: contentsCreateManyInput | contentsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * contents update
   */
  export type contentsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the contents
     */
    select?: contentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the contents
     */
    omit?: contentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: contentsInclude<ExtArgs> | null
    /**
     * The data needed to update a contents.
     */
    data: XOR<contentsUpdateInput, contentsUncheckedUpdateInput>
    /**
     * Choose, which contents to update.
     */
    where: contentsWhereUniqueInput
  }

  /**
   * contents updateMany
   */
  export type contentsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update contents.
     */
    data: XOR<contentsUpdateManyMutationInput, contentsUncheckedUpdateManyInput>
    /**
     * Filter which contents to update
     */
    where?: contentsWhereInput
  }

  /**
   * contents upsert
   */
  export type contentsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the contents
     */
    select?: contentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the contents
     */
    omit?: contentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: contentsInclude<ExtArgs> | null
    /**
     * The filter to search for the contents to update in case it exists.
     */
    where: contentsWhereUniqueInput
    /**
     * In case the contents found by the `where` argument doesn't exist, create a new contents with this data.
     */
    create: XOR<contentsCreateInput, contentsUncheckedCreateInput>
    /**
     * In case the contents was found with the provided `where` argument, update it with this data.
     */
    update: XOR<contentsUpdateInput, contentsUncheckedUpdateInput>
  }

  /**
   * contents delete
   */
  export type contentsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the contents
     */
    select?: contentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the contents
     */
    omit?: contentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: contentsInclude<ExtArgs> | null
    /**
     * Filter which contents to delete.
     */
    where: contentsWhereUniqueInput
  }

  /**
   * contents deleteMany
   */
  export type contentsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which contents to delete
     */
    where?: contentsWhereInput
  }

  /**
   * contents without action
   */
  export type contentsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the contents
     */
    select?: contentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the contents
     */
    omit?: contentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: contentsInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UsersScalarFieldEnum: {
    id: 'id',
    name: 'name'
  };

  export type UsersScalarFieldEnum = (typeof UsersScalarFieldEnum)[keyof typeof UsersScalarFieldEnum]


  export const FilesScalarFieldEnum: {
    id: 'id',
    owner: 'owner',
    name: 'name',
    version: 'version',
    registered: 'registered',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type FilesScalarFieldEnum = (typeof FilesScalarFieldEnum)[keyof typeof FilesScalarFieldEnum]


  export const ContentsScalarFieldEnum: {
    file_id: 'file_id',
    content: 'content'
  };

  export type ContentsScalarFieldEnum = (typeof ContentsScalarFieldEnum)[keyof typeof ContentsScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const usersOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name'
  };

  export type usersOrderByRelevanceFieldEnum = (typeof usersOrderByRelevanceFieldEnum)[keyof typeof usersOrderByRelevanceFieldEnum]


  export const filesOrderByRelevanceFieldEnum: {
    id: 'id',
    owner: 'owner',
    name: 'name'
  };

  export type filesOrderByRelevanceFieldEnum = (typeof filesOrderByRelevanceFieldEnum)[keyof typeof filesOrderByRelevanceFieldEnum]


  export const contentsOrderByRelevanceFieldEnum: {
    file_id: 'file_id',
    content: 'content'
  };

  export type contentsOrderByRelevanceFieldEnum = (typeof contentsOrderByRelevanceFieldEnum)[keyof typeof contentsOrderByRelevanceFieldEnum]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type usersWhereInput = {
    AND?: usersWhereInput | usersWhereInput[]
    OR?: usersWhereInput[]
    NOT?: usersWhereInput | usersWhereInput[]
    id?: StringFilter<"users"> | string
    name?: StringFilter<"users"> | string
  }

  export type usersOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    _relevance?: usersOrderByRelevanceInput
  }

  export type usersWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: usersWhereInput | usersWhereInput[]
    OR?: usersWhereInput[]
    NOT?: usersWhereInput | usersWhereInput[]
  }, "id" | "name">

  export type usersOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    _count?: usersCountOrderByAggregateInput
    _max?: usersMaxOrderByAggregateInput
    _min?: usersMinOrderByAggregateInput
  }

  export type usersScalarWhereWithAggregatesInput = {
    AND?: usersScalarWhereWithAggregatesInput | usersScalarWhereWithAggregatesInput[]
    OR?: usersScalarWhereWithAggregatesInput[]
    NOT?: usersScalarWhereWithAggregatesInput | usersScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"users"> | string
    name?: StringWithAggregatesFilter<"users"> | string
  }

  export type filesWhereInput = {
    AND?: filesWhereInput | filesWhereInput[]
    OR?: filesWhereInput[]
    NOT?: filesWhereInput | filesWhereInput[]
    id?: StringFilter<"files"> | string
    owner?: StringFilter<"files"> | string
    name?: StringFilter<"files"> | string
    version?: IntFilter<"files"> | number
    registered?: BoolFilter<"files"> | boolean
    created_at?: DateTimeFilter<"files"> | Date | string
    updated_at?: DateTimeFilter<"files"> | Date | string
    content?: XOR<ContentsNullableScalarRelationFilter, contentsWhereInput> | null
  }

  export type filesOrderByWithRelationInput = {
    id?: SortOrder
    owner?: SortOrder
    name?: SortOrder
    version?: SortOrder
    registered?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    content?: contentsOrderByWithRelationInput
    _relevance?: filesOrderByRelevanceInput
  }

  export type filesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    owner_name_version?: filesOwnerNameVersionCompoundUniqueInput
    AND?: filesWhereInput | filesWhereInput[]
    OR?: filesWhereInput[]
    NOT?: filesWhereInput | filesWhereInput[]
    owner?: StringFilter<"files"> | string
    name?: StringFilter<"files"> | string
    version?: IntFilter<"files"> | number
    registered?: BoolFilter<"files"> | boolean
    created_at?: DateTimeFilter<"files"> | Date | string
    updated_at?: DateTimeFilter<"files"> | Date | string
    content?: XOR<ContentsNullableScalarRelationFilter, contentsWhereInput> | null
  }, "id" | "owner_name_version">

  export type filesOrderByWithAggregationInput = {
    id?: SortOrder
    owner?: SortOrder
    name?: SortOrder
    version?: SortOrder
    registered?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: filesCountOrderByAggregateInput
    _avg?: filesAvgOrderByAggregateInput
    _max?: filesMaxOrderByAggregateInput
    _min?: filesMinOrderByAggregateInput
    _sum?: filesSumOrderByAggregateInput
  }

  export type filesScalarWhereWithAggregatesInput = {
    AND?: filesScalarWhereWithAggregatesInput | filesScalarWhereWithAggregatesInput[]
    OR?: filesScalarWhereWithAggregatesInput[]
    NOT?: filesScalarWhereWithAggregatesInput | filesScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"files"> | string
    owner?: StringWithAggregatesFilter<"files"> | string
    name?: StringWithAggregatesFilter<"files"> | string
    version?: IntWithAggregatesFilter<"files"> | number
    registered?: BoolWithAggregatesFilter<"files"> | boolean
    created_at?: DateTimeWithAggregatesFilter<"files"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"files"> | Date | string
  }

  export type contentsWhereInput = {
    AND?: contentsWhereInput | contentsWhereInput[]
    OR?: contentsWhereInput[]
    NOT?: contentsWhereInput | contentsWhereInput[]
    file_id?: StringFilter<"contents"> | string
    content?: StringFilter<"contents"> | string
    file?: XOR<FilesScalarRelationFilter, filesWhereInput>
  }

  export type contentsOrderByWithRelationInput = {
    file_id?: SortOrder
    content?: SortOrder
    file?: filesOrderByWithRelationInput
    _relevance?: contentsOrderByRelevanceInput
  }

  export type contentsWhereUniqueInput = Prisma.AtLeast<{
    file_id?: string
    AND?: contentsWhereInput | contentsWhereInput[]
    OR?: contentsWhereInput[]
    NOT?: contentsWhereInput | contentsWhereInput[]
    content?: StringFilter<"contents"> | string
    file?: XOR<FilesScalarRelationFilter, filesWhereInput>
  }, "file_id">

  export type contentsOrderByWithAggregationInput = {
    file_id?: SortOrder
    content?: SortOrder
    _count?: contentsCountOrderByAggregateInput
    _max?: contentsMaxOrderByAggregateInput
    _min?: contentsMinOrderByAggregateInput
  }

  export type contentsScalarWhereWithAggregatesInput = {
    AND?: contentsScalarWhereWithAggregatesInput | contentsScalarWhereWithAggregatesInput[]
    OR?: contentsScalarWhereWithAggregatesInput[]
    NOT?: contentsScalarWhereWithAggregatesInput | contentsScalarWhereWithAggregatesInput[]
    file_id?: StringWithAggregatesFilter<"contents"> | string
    content?: StringWithAggregatesFilter<"contents"> | string
  }

  export type usersCreateInput = {
    id?: string
    name: string
  }

  export type usersUncheckedCreateInput = {
    id?: string
    name: string
  }

  export type usersUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type usersUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type usersCreateManyInput = {
    id?: string
    name: string
  }

  export type usersUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type usersUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type filesCreateInput = {
    id?: string
    owner: string
    name: string
    version: number
    registered?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    content?: contentsCreateNestedOneWithoutFileInput
  }

  export type filesUncheckedCreateInput = {
    id?: string
    owner: string
    name: string
    version: number
    registered?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    content?: contentsUncheckedCreateNestedOneWithoutFileInput
  }

  export type filesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    owner?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    registered?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    content?: contentsUpdateOneWithoutFileNestedInput
  }

  export type filesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    owner?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    registered?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    content?: contentsUncheckedUpdateOneWithoutFileNestedInput
  }

  export type filesCreateManyInput = {
    id?: string
    owner: string
    name: string
    version: number
    registered?: boolean
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type filesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    owner?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    registered?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type filesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    owner?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    registered?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type contentsCreateInput = {
    content: string
    file: filesCreateNestedOneWithoutContentInput
  }

  export type contentsUncheckedCreateInput = {
    file_id: string
    content: string
  }

  export type contentsUpdateInput = {
    content?: StringFieldUpdateOperationsInput | string
    file?: filesUpdateOneRequiredWithoutContentNestedInput
  }

  export type contentsUncheckedUpdateInput = {
    file_id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
  }

  export type contentsCreateManyInput = {
    file_id: string
    content: string
  }

  export type contentsUpdateManyMutationInput = {
    content?: StringFieldUpdateOperationsInput | string
  }

  export type contentsUncheckedUpdateManyInput = {
    file_id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type usersOrderByRelevanceInput = {
    fields: usersOrderByRelevanceFieldEnum | usersOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type usersCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type usersMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type usersMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ContentsNullableScalarRelationFilter = {
    is?: contentsWhereInput | null
    isNot?: contentsWhereInput | null
  }

  export type filesOrderByRelevanceInput = {
    fields: filesOrderByRelevanceFieldEnum | filesOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type filesOwnerNameVersionCompoundUniqueInput = {
    owner: string
    name: string
    version: number
  }

  export type filesCountOrderByAggregateInput = {
    id?: SortOrder
    owner?: SortOrder
    name?: SortOrder
    version?: SortOrder
    registered?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type filesAvgOrderByAggregateInput = {
    version?: SortOrder
  }

  export type filesMaxOrderByAggregateInput = {
    id?: SortOrder
    owner?: SortOrder
    name?: SortOrder
    version?: SortOrder
    registered?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type filesMinOrderByAggregateInput = {
    id?: SortOrder
    owner?: SortOrder
    name?: SortOrder
    version?: SortOrder
    registered?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type filesSumOrderByAggregateInput = {
    version?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type FilesScalarRelationFilter = {
    is?: filesWhereInput
    isNot?: filesWhereInput
  }

  export type contentsOrderByRelevanceInput = {
    fields: contentsOrderByRelevanceFieldEnum | contentsOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type contentsCountOrderByAggregateInput = {
    file_id?: SortOrder
    content?: SortOrder
  }

  export type contentsMaxOrderByAggregateInput = {
    file_id?: SortOrder
    content?: SortOrder
  }

  export type contentsMinOrderByAggregateInput = {
    file_id?: SortOrder
    content?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type contentsCreateNestedOneWithoutFileInput = {
    create?: XOR<contentsCreateWithoutFileInput, contentsUncheckedCreateWithoutFileInput>
    connectOrCreate?: contentsCreateOrConnectWithoutFileInput
    connect?: contentsWhereUniqueInput
  }

  export type contentsUncheckedCreateNestedOneWithoutFileInput = {
    create?: XOR<contentsCreateWithoutFileInput, contentsUncheckedCreateWithoutFileInput>
    connectOrCreate?: contentsCreateOrConnectWithoutFileInput
    connect?: contentsWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type contentsUpdateOneWithoutFileNestedInput = {
    create?: XOR<contentsCreateWithoutFileInput, contentsUncheckedCreateWithoutFileInput>
    connectOrCreate?: contentsCreateOrConnectWithoutFileInput
    upsert?: contentsUpsertWithoutFileInput
    disconnect?: contentsWhereInput | boolean
    delete?: contentsWhereInput | boolean
    connect?: contentsWhereUniqueInput
    update?: XOR<XOR<contentsUpdateToOneWithWhereWithoutFileInput, contentsUpdateWithoutFileInput>, contentsUncheckedUpdateWithoutFileInput>
  }

  export type contentsUncheckedUpdateOneWithoutFileNestedInput = {
    create?: XOR<contentsCreateWithoutFileInput, contentsUncheckedCreateWithoutFileInput>
    connectOrCreate?: contentsCreateOrConnectWithoutFileInput
    upsert?: contentsUpsertWithoutFileInput
    disconnect?: contentsWhereInput | boolean
    delete?: contentsWhereInput | boolean
    connect?: contentsWhereUniqueInput
    update?: XOR<XOR<contentsUpdateToOneWithWhereWithoutFileInput, contentsUpdateWithoutFileInput>, contentsUncheckedUpdateWithoutFileInput>
  }

  export type filesCreateNestedOneWithoutContentInput = {
    create?: XOR<filesCreateWithoutContentInput, filesUncheckedCreateWithoutContentInput>
    connectOrCreate?: filesCreateOrConnectWithoutContentInput
    connect?: filesWhereUniqueInput
  }

  export type filesUpdateOneRequiredWithoutContentNestedInput = {
    create?: XOR<filesCreateWithoutContentInput, filesUncheckedCreateWithoutContentInput>
    connectOrCreate?: filesCreateOrConnectWithoutContentInput
    upsert?: filesUpsertWithoutContentInput
    connect?: filesWhereUniqueInput
    update?: XOR<XOR<filesUpdateToOneWithWhereWithoutContentInput, filesUpdateWithoutContentInput>, filesUncheckedUpdateWithoutContentInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type contentsCreateWithoutFileInput = {
    content: string
  }

  export type contentsUncheckedCreateWithoutFileInput = {
    content: string
  }

  export type contentsCreateOrConnectWithoutFileInput = {
    where: contentsWhereUniqueInput
    create: XOR<contentsCreateWithoutFileInput, contentsUncheckedCreateWithoutFileInput>
  }

  export type contentsUpsertWithoutFileInput = {
    update: XOR<contentsUpdateWithoutFileInput, contentsUncheckedUpdateWithoutFileInput>
    create: XOR<contentsCreateWithoutFileInput, contentsUncheckedCreateWithoutFileInput>
    where?: contentsWhereInput
  }

  export type contentsUpdateToOneWithWhereWithoutFileInput = {
    where?: contentsWhereInput
    data: XOR<contentsUpdateWithoutFileInput, contentsUncheckedUpdateWithoutFileInput>
  }

  export type contentsUpdateWithoutFileInput = {
    content?: StringFieldUpdateOperationsInput | string
  }

  export type contentsUncheckedUpdateWithoutFileInput = {
    content?: StringFieldUpdateOperationsInput | string
  }

  export type filesCreateWithoutContentInput = {
    id?: string
    owner: string
    name: string
    version: number
    registered?: boolean
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type filesUncheckedCreateWithoutContentInput = {
    id?: string
    owner: string
    name: string
    version: number
    registered?: boolean
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type filesCreateOrConnectWithoutContentInput = {
    where: filesWhereUniqueInput
    create: XOR<filesCreateWithoutContentInput, filesUncheckedCreateWithoutContentInput>
  }

  export type filesUpsertWithoutContentInput = {
    update: XOR<filesUpdateWithoutContentInput, filesUncheckedUpdateWithoutContentInput>
    create: XOR<filesCreateWithoutContentInput, filesUncheckedCreateWithoutContentInput>
    where?: filesWhereInput
  }

  export type filesUpdateToOneWithWhereWithoutContentInput = {
    where?: filesWhereInput
    data: XOR<filesUpdateWithoutContentInput, filesUncheckedUpdateWithoutContentInput>
  }

  export type filesUpdateWithoutContentInput = {
    id?: StringFieldUpdateOperationsInput | string
    owner?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    registered?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type filesUncheckedUpdateWithoutContentInput = {
    id?: StringFieldUpdateOperationsInput | string
    owner?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    registered?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}