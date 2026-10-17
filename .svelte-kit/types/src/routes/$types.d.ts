import type * as Kit from '@sveltejs/kit';

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;
type RouteParams = {  };
type RouteId = '/';
type MaybeWithVoid<T> = {} extends T ? T | void : T;
export type RequiredKeys<T> = { [K in keyof T]-?: {} extends { [P in K]: T[K] } ? never : K; }[keyof T];
type OutputDataShape<T> = MaybeWithVoid<Omit<App.PageData, RequiredKeys<T>> & Partial<Pick<App.PageData, keyof T & keyof App.PageData>> & Record<string, any>>
type EnsureDefined<T> = T extends null | undefined ? {} : T;
type OptionalUnion<U extends Record<string, any>, A extends keyof U = U extends U ? keyof U : never> = U extends unknown ? { [P in Exclude<A, keyof U>]?: never } & U : never;
export type Snapshot<T = any> = Kit.Snapshot<T>;
type PageServerParentData = EnsureDefined<LayoutServerData>;
type PageParentData = EnsureDefined<LayoutData>;
type LayoutRouteId = RouteId | "/" | "/login" | "/[lab]/(protected)" | "/[lab]/(protected)/audit" | "/[lab]/(protected)/borrows" | "/[lab]/(protected)/borrows/new" | "/[lab]/(protected)/borrows/[id]" | "/[lab]/(protected)/borrows/[id]/return" | "/[lab]/(protected)/inventory" | "/[lab]/(protected)/inventory/new" | "/[lab]/(protected)/inventory/[id]" | "/[lab]/(protected)/inventory/[id]/edit" | "/[lab]/(protected)/inventory/[id]/units/new" | "/[lab]/(protected)/inventory/[id]/units/[unitId]/edit" | "/[lab]/(protected)/kits" | "/[lab]/(protected)/kits/new" | "/[lab]/(protected)/kits/[id]" | "/[lab]/(protected)/locations" | "/[lab]/(protected)/locations/diagram" | "/[lab]/(protected)/reservations" | "/[lab]/(protected)/reservations/calendar" | "/[lab]/(protected)/reservations/new" | "/[lab]/(protected)/reservations/pending" | "/[lab]/(protected)/reservations/[id]" | "/[lab]/(protected)/users" | "/[lab]/(protected)/users/[id]" | "/[lab]/catalog" | "/[lab]/catalog/[id]" | null
type LayoutParams = RouteParams & { lab?: string; id?: string; unitId?: string }
type LayoutParentData = EnsureDefined<{}>;

export type PageServerLoad<OutputData extends OutputDataShape<PageServerParentData> = OutputDataShape<PageServerParentData>> = Kit.ServerLoad<RouteParams, PageServerParentData, OutputData, RouteId>;
export type PageServerLoadEvent = Parameters<PageServerLoad>[0];
export type ActionData = unknown;
export type PageServerData = Expand<OptionalUnion<EnsureDefined<Kit.LoadProperties<Awaited<ReturnType<typeof import('./proxy+page.server.js').load>>>>>>;
export type PageData = Expand<Omit<PageParentData, keyof PageServerData> & EnsureDefined<PageServerData>>;
export type Action<OutputData extends Record<string, any> | void = Record<string, any> | void> = Kit.Action<RouteParams, OutputData, RouteId>
export type Actions<OutputData extends Record<string, any> | void = Record<string, any> | void> = Kit.Actions<RouteParams, OutputData, RouteId>
export type PageProps = { params: RouteParams; data: PageData; form: ActionData }
export type LayoutServerData = null;
export type LayoutData = Expand<LayoutParentData>;
export type LayoutProps = { params: LayoutParams; data: LayoutData; children: import("svelte").Snippet }
export type RequestEvent = Kit.RequestEvent<RouteParams, RouteId>;