
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/" | "/api" | "/api/auth" | "/api/auth/login" | "/api/auth/logout" | "/api/auth/me" | "/api/auth/refresh" | "/api/auth/totp" | "/api/auth/totp/enroll" | "/api/auth/totp/verify" | "/api/health" | "/api/labs" | "/api/labs/[labId]" | "/api/[labId]" | "/api/[labId]/alerts" | "/api/[labId]/alerts/[id]" | "/api/[labId]/alerts/[id]/acknowledge" | "/api/[labId]/audit" | "/api/[labId]/authorizations" | "/api/[labId]/authorizations/[id]" | "/api/[labId]/borrows" | "/api/[labId]/borrows/[id]" | "/api/[labId]/borrows/[id]/approve-extension" | "/api/[labId]/borrows/[id]/pdf" | "/api/[labId]/borrows/[id]/print" | "/api/[labId]/borrows/[id]/reject-extension" | "/api/[labId]/borrows/[id]/request-extension" | "/api/[labId]/borrows/[id]/return" | "/api/[labId]/borrows/[id]/signature" | "/api/[labId]/borrows/[id]/signature/[role]" | "/api/[labId]/incident-reports" | "/api/[labId]/incident-reports/[id]" | "/api/[labId]/items" | "/api/[labId]/items/barcode" | "/api/[labId]/items/barcode/[code]" | "/api/[labId]/items/bulk-import" | "/api/[labId]/items/[id]" | "/api/[labId]/items/[id]/accessories" | "/api/[labId]/items/[id]/assets" | "/api/[labId]/items/[id]/assets/fetch" | "/api/[labId]/items/[id]/availability" | "/api/[labId]/items/[id]/image" | "/api/[labId]/items/[id]/label" | "/api/[labId]/items/[id]/units" | "/api/[labId]/kits" | "/api/[labId]/kits/[id]" | "/api/[labId]/locations" | "/api/[labId]/locations/diagram" | "/api/[labId]/locations/[id]" | "/api/[labId]/reservations" | "/api/[labId]/reservations/calendar" | "/api/[labId]/reservations/[id]" | "/api/[labId]/reservations/[id]/convert-to-borrow" | "/api/[labId]/reservations/[id]/instructor-approve" | "/api/[labId]/reservations/[id]/instructor-reject" | "/api/[labId]/reservations/[id]/manager-approve" | "/api/[labId]/reservations/[id]/manager-reject" | "/api/[labId]/units" | "/api/[labId]/units/[id]" | "/api/[labId]/units/[id]/label" | "/api/[labId]/users" | "/api/[labId]/users/rfid" | "/api/[labId]/users/rfid/[tag]" | "/api/[labId]/users/[id]" | "/api/[labId]/users/[id]/export" | "/login" | "/[lab]/(protected)" | "/[lab]" | "/[lab]/(protected)/audit" | "/[lab]/(protected)/borrows" | "/[lab]/(protected)/borrows/new" | "/[lab]/(protected)/borrows/[id]" | "/[lab]/(protected)/borrows/[id]/return" | "/[lab]/catalog" | "/[lab]/catalog/[id]" | "/[lab]/(protected)/inventory" | "/[lab]/(protected)/inventory/new" | "/[lab]/(protected)/inventory/[id]" | "/[lab]/(protected)/inventory/[id]/edit" | "/[lab]/(protected)/inventory/[id]/units" | "/[lab]/(protected)/inventory/[id]/units/new" | "/[lab]/(protected)/inventory/[id]/units/[unitId]" | "/[lab]/(protected)/inventory/[id]/units/[unitId]/edit" | "/[lab]/(protected)/kits" | "/[lab]/(protected)/kits/new" | "/[lab]/(protected)/kits/[id]" | "/[lab]/(protected)/locations" | "/[lab]/(protected)/locations/diagram" | "/[lab]/(protected)/reservations" | "/[lab]/(protected)/reservations/calendar" | "/[lab]/(protected)/reservations/new" | "/[lab]/(protected)/reservations/pending" | "/[lab]/(protected)/reservations/[id]" | "/[lab]/(protected)/users" | "/[lab]/(protected)/users/[id]";
		RouteParams(): {
			"/api/labs/[labId]": { labId: string };
			"/api/[labId]": { labId: string };
			"/api/[labId]/alerts": { labId: string };
			"/api/[labId]/alerts/[id]": { labId: string; id: string };
			"/api/[labId]/alerts/[id]/acknowledge": { labId: string; id: string };
			"/api/[labId]/audit": { labId: string };
			"/api/[labId]/authorizations": { labId: string };
			"/api/[labId]/authorizations/[id]": { labId: string; id: string };
			"/api/[labId]/borrows": { labId: string };
			"/api/[labId]/borrows/[id]": { labId: string; id: string };
			"/api/[labId]/borrows/[id]/approve-extension": { labId: string; id: string };
			"/api/[labId]/borrows/[id]/pdf": { labId: string; id: string };
			"/api/[labId]/borrows/[id]/print": { labId: string; id: string };
			"/api/[labId]/borrows/[id]/reject-extension": { labId: string; id: string };
			"/api/[labId]/borrows/[id]/request-extension": { labId: string; id: string };
			"/api/[labId]/borrows/[id]/return": { labId: string; id: string };
			"/api/[labId]/borrows/[id]/signature": { labId: string; id: string };
			"/api/[labId]/borrows/[id]/signature/[role]": { labId: string; id: string; role: string };
			"/api/[labId]/incident-reports": { labId: string };
			"/api/[labId]/incident-reports/[id]": { labId: string; id: string };
			"/api/[labId]/items": { labId: string };
			"/api/[labId]/items/barcode": { labId: string };
			"/api/[labId]/items/barcode/[code]": { labId: string; code: string };
			"/api/[labId]/items/bulk-import": { labId: string };
			"/api/[labId]/items/[id]": { labId: string; id: string };
			"/api/[labId]/items/[id]/accessories": { labId: string; id: string };
			"/api/[labId]/items/[id]/assets": { labId: string; id: string };
			"/api/[labId]/items/[id]/assets/fetch": { labId: string; id: string };
			"/api/[labId]/items/[id]/availability": { labId: string; id: string };
			"/api/[labId]/items/[id]/image": { labId: string; id: string };
			"/api/[labId]/items/[id]/label": { labId: string; id: string };
			"/api/[labId]/items/[id]/units": { labId: string; id: string };
			"/api/[labId]/kits": { labId: string };
			"/api/[labId]/kits/[id]": { labId: string; id: string };
			"/api/[labId]/locations": { labId: string };
			"/api/[labId]/locations/diagram": { labId: string };
			"/api/[labId]/locations/[id]": { labId: string; id: string };
			"/api/[labId]/reservations": { labId: string };
			"/api/[labId]/reservations/calendar": { labId: string };
			"/api/[labId]/reservations/[id]": { labId: string; id: string };
			"/api/[labId]/reservations/[id]/convert-to-borrow": { labId: string; id: string };
			"/api/[labId]/reservations/[id]/instructor-approve": { labId: string; id: string };
			"/api/[labId]/reservations/[id]/instructor-reject": { labId: string; id: string };
			"/api/[labId]/reservations/[id]/manager-approve": { labId: string; id: string };
			"/api/[labId]/reservations/[id]/manager-reject": { labId: string; id: string };
			"/api/[labId]/units": { labId: string };
			"/api/[labId]/units/[id]": { labId: string; id: string };
			"/api/[labId]/units/[id]/label": { labId: string; id: string };
			"/api/[labId]/users": { labId: string };
			"/api/[labId]/users/rfid": { labId: string };
			"/api/[labId]/users/rfid/[tag]": { labId: string; tag: string };
			"/api/[labId]/users/[id]": { labId: string; id: string };
			"/api/[labId]/users/[id]/export": { labId: string; id: string };
			"/[lab]/(protected)": { lab: string };
			"/[lab]": { lab: string };
			"/[lab]/(protected)/audit": { lab: string };
			"/[lab]/(protected)/borrows": { lab: string };
			"/[lab]/(protected)/borrows/new": { lab: string };
			"/[lab]/(protected)/borrows/[id]": { lab: string; id: string };
			"/[lab]/(protected)/borrows/[id]/return": { lab: string; id: string };
			"/[lab]/catalog": { lab: string };
			"/[lab]/catalog/[id]": { lab: string; id: string };
			"/[lab]/(protected)/inventory": { lab: string };
			"/[lab]/(protected)/inventory/new": { lab: string };
			"/[lab]/(protected)/inventory/[id]": { lab: string; id: string };
			"/[lab]/(protected)/inventory/[id]/edit": { lab: string; id: string };
			"/[lab]/(protected)/inventory/[id]/units": { lab: string; id: string };
			"/[lab]/(protected)/inventory/[id]/units/new": { lab: string; id: string };
			"/[lab]/(protected)/inventory/[id]/units/[unitId]": { lab: string; id: string; unitId: string };
			"/[lab]/(protected)/inventory/[id]/units/[unitId]/edit": { lab: string; id: string; unitId: string };
			"/[lab]/(protected)/kits": { lab: string };
			"/[lab]/(protected)/kits/new": { lab: string };
			"/[lab]/(protected)/kits/[id]": { lab: string; id: string };
			"/[lab]/(protected)/locations": { lab: string };
			"/[lab]/(protected)/locations/diagram": { lab: string };
			"/[lab]/(protected)/reservations": { lab: string };
			"/[lab]/(protected)/reservations/calendar": { lab: string };
			"/[lab]/(protected)/reservations/new": { lab: string };
			"/[lab]/(protected)/reservations/pending": { lab: string };
			"/[lab]/(protected)/reservations/[id]": { lab: string; id: string };
			"/[lab]/(protected)/users": { lab: string };
			"/[lab]/(protected)/users/[id]": { lab: string; id: string }
		};
		LayoutParams(): {
			"/": { labId?: string; id?: string; role?: string; code?: string; tag?: string; lab?: string; unitId?: string };
			"/api": { labId?: string; id?: string; role?: string; code?: string; tag?: string };
			"/api/auth": Record<string, never>;
			"/api/auth/login": Record<string, never>;
			"/api/auth/logout": Record<string, never>;
			"/api/auth/me": Record<string, never>;
			"/api/auth/refresh": Record<string, never>;
			"/api/auth/totp": Record<string, never>;
			"/api/auth/totp/enroll": Record<string, never>;
			"/api/auth/totp/verify": Record<string, never>;
			"/api/health": Record<string, never>;
			"/api/labs": { labId?: string };
			"/api/labs/[labId]": { labId: string };
			"/api/[labId]": { labId: string; id?: string; role?: string; code?: string; tag?: string };
			"/api/[labId]/alerts": { labId: string; id?: string };
			"/api/[labId]/alerts/[id]": { labId: string; id: string };
			"/api/[labId]/alerts/[id]/acknowledge": { labId: string; id: string };
			"/api/[labId]/audit": { labId: string };
			"/api/[labId]/authorizations": { labId: string; id?: string };
			"/api/[labId]/authorizations/[id]": { labId: string; id: string };
			"/api/[labId]/borrows": { labId: string; id?: string; role?: string };
			"/api/[labId]/borrows/[id]": { labId: string; id: string; role?: string };
			"/api/[labId]/borrows/[id]/approve-extension": { labId: string; id: string };
			"/api/[labId]/borrows/[id]/pdf": { labId: string; id: string };
			"/api/[labId]/borrows/[id]/print": { labId: string; id: string };
			"/api/[labId]/borrows/[id]/reject-extension": { labId: string; id: string };
			"/api/[labId]/borrows/[id]/request-extension": { labId: string; id: string };
			"/api/[labId]/borrows/[id]/return": { labId: string; id: string };
			"/api/[labId]/borrows/[id]/signature": { labId: string; id: string; role?: string };
			"/api/[labId]/borrows/[id]/signature/[role]": { labId: string; id: string; role: string };
			"/api/[labId]/incident-reports": { labId: string; id?: string };
			"/api/[labId]/incident-reports/[id]": { labId: string; id: string };
			"/api/[labId]/items": { labId: string; code?: string; id?: string };
			"/api/[labId]/items/barcode": { labId: string; code?: string };
			"/api/[labId]/items/barcode/[code]": { labId: string; code: string };
			"/api/[labId]/items/bulk-import": { labId: string };
			"/api/[labId]/items/[id]": { labId: string; id: string };
			"/api/[labId]/items/[id]/accessories": { labId: string; id: string };
			"/api/[labId]/items/[id]/assets": { labId: string; id: string };
			"/api/[labId]/items/[id]/assets/fetch": { labId: string; id: string };
			"/api/[labId]/items/[id]/availability": { labId: string; id: string };
			"/api/[labId]/items/[id]/image": { labId: string; id: string };
			"/api/[labId]/items/[id]/label": { labId: string; id: string };
			"/api/[labId]/items/[id]/units": { labId: string; id: string };
			"/api/[labId]/kits": { labId: string; id?: string };
			"/api/[labId]/kits/[id]": { labId: string; id: string };
			"/api/[labId]/locations": { labId: string; id?: string };
			"/api/[labId]/locations/diagram": { labId: string };
			"/api/[labId]/locations/[id]": { labId: string; id: string };
			"/api/[labId]/reservations": { labId: string; id?: string };
			"/api/[labId]/reservations/calendar": { labId: string };
			"/api/[labId]/reservations/[id]": { labId: string; id: string };
			"/api/[labId]/reservations/[id]/convert-to-borrow": { labId: string; id: string };
			"/api/[labId]/reservations/[id]/instructor-approve": { labId: string; id: string };
			"/api/[labId]/reservations/[id]/instructor-reject": { labId: string; id: string };
			"/api/[labId]/reservations/[id]/manager-approve": { labId: string; id: string };
			"/api/[labId]/reservations/[id]/manager-reject": { labId: string; id: string };
			"/api/[labId]/units": { labId: string; id?: string };
			"/api/[labId]/units/[id]": { labId: string; id: string };
			"/api/[labId]/units/[id]/label": { labId: string; id: string };
			"/api/[labId]/users": { labId: string; tag?: string; id?: string };
			"/api/[labId]/users/rfid": { labId: string; tag?: string };
			"/api/[labId]/users/rfid/[tag]": { labId: string; tag: string };
			"/api/[labId]/users/[id]": { labId: string; id: string };
			"/api/[labId]/users/[id]/export": { labId: string; id: string };
			"/login": Record<string, never>;
			"/[lab]/(protected)": { lab: string; id?: string; unitId?: string };
			"/[lab]": { lab: string; id?: string; unitId?: string };
			"/[lab]/(protected)/audit": { lab: string };
			"/[lab]/(protected)/borrows": { lab: string; id?: string };
			"/[lab]/(protected)/borrows/new": { lab: string };
			"/[lab]/(protected)/borrows/[id]": { lab: string; id: string };
			"/[lab]/(protected)/borrows/[id]/return": { lab: string; id: string };
			"/[lab]/catalog": { lab: string; id?: string };
			"/[lab]/catalog/[id]": { lab: string; id: string };
			"/[lab]/(protected)/inventory": { lab: string; id?: string; unitId?: string };
			"/[lab]/(protected)/inventory/new": { lab: string };
			"/[lab]/(protected)/inventory/[id]": { lab: string; id: string; unitId?: string };
			"/[lab]/(protected)/inventory/[id]/edit": { lab: string; id: string };
			"/[lab]/(protected)/inventory/[id]/units": { lab: string; id: string; unitId?: string };
			"/[lab]/(protected)/inventory/[id]/units/new": { lab: string; id: string };
			"/[lab]/(protected)/inventory/[id]/units/[unitId]": { lab: string; id: string; unitId: string };
			"/[lab]/(protected)/inventory/[id]/units/[unitId]/edit": { lab: string; id: string; unitId: string };
			"/[lab]/(protected)/kits": { lab: string; id?: string };
			"/[lab]/(protected)/kits/new": { lab: string };
			"/[lab]/(protected)/kits/[id]": { lab: string; id: string };
			"/[lab]/(protected)/locations": { lab: string };
			"/[lab]/(protected)/locations/diagram": { lab: string };
			"/[lab]/(protected)/reservations": { lab: string; id?: string };
			"/[lab]/(protected)/reservations/calendar": { lab: string };
			"/[lab]/(protected)/reservations/new": { lab: string };
			"/[lab]/(protected)/reservations/pending": { lab: string };
			"/[lab]/(protected)/reservations/[id]": { lab: string; id: string };
			"/[lab]/(protected)/users": { lab: string; id?: string };
			"/[lab]/(protected)/users/[id]": { lab: string; id: string }
		};
		Pathname(): "/" | "/api/auth/login" | "/api/auth/logout" | "/api/auth/me" | "/api/auth/refresh" | "/api/auth/totp/enroll" | "/api/auth/totp/verify" | "/api/health" | "/api/labs" | `/api/labs/${string}` & {} | `/api/${string}/alerts` & {} | `/api/${string}/alerts/${string}/acknowledge` & {} | `/api/${string}/audit` & {} | `/api/${string}/authorizations` & {} | `/api/${string}/authorizations/${string}` & {} | `/api/${string}/borrows` & {} | `/api/${string}/borrows/${string}` & {} | `/api/${string}/borrows/${string}/approve-extension` & {} | `/api/${string}/borrows/${string}/pdf` & {} | `/api/${string}/borrows/${string}/print` & {} | `/api/${string}/borrows/${string}/reject-extension` & {} | `/api/${string}/borrows/${string}/request-extension` & {} | `/api/${string}/borrows/${string}/return` & {} | `/api/${string}/borrows/${string}/signature/${string}` & {} | `/api/${string}/incident-reports` & {} | `/api/${string}/incident-reports/${string}` & {} | `/api/${string}/items` & {} | `/api/${string}/items/barcode/${string}` & {} | `/api/${string}/items/bulk-import` & {} | `/api/${string}/items/${string}` & {} | `/api/${string}/items/${string}/accessories` & {} | `/api/${string}/items/${string}/assets/fetch` & {} | `/api/${string}/items/${string}/availability` & {} | `/api/${string}/items/${string}/image` & {} | `/api/${string}/items/${string}/label` & {} | `/api/${string}/items/${string}/units` & {} | `/api/${string}/kits` & {} | `/api/${string}/kits/${string}` & {} | `/api/${string}/locations` & {} | `/api/${string}/locations/diagram` & {} | `/api/${string}/locations/${string}` & {} | `/api/${string}/reservations` & {} | `/api/${string}/reservations/calendar` & {} | `/api/${string}/reservations/${string}` & {} | `/api/${string}/reservations/${string}/convert-to-borrow` & {} | `/api/${string}/reservations/${string}/instructor-approve` & {} | `/api/${string}/reservations/${string}/instructor-reject` & {} | `/api/${string}/reservations/${string}/manager-approve` & {} | `/api/${string}/reservations/${string}/manager-reject` & {} | `/api/${string}/units/${string}` & {} | `/api/${string}/units/${string}/label` & {} | `/api/${string}/users` & {} | `/api/${string}/users/rfid/${string}` & {} | `/api/${string}/users/${string}` & {} | `/api/${string}/users/${string}/export` & {} | "/login" | `/${string}` & {} | `/${string}/audit` & {} | `/${string}/borrows` & {} | `/${string}/borrows/new` & {} | `/${string}/borrows/${string}` & {} | `/${string}/borrows/${string}/return` & {} | `/${string}/catalog` & {} | `/${string}/catalog/${string}` & {} | `/${string}/inventory` & {} | `/${string}/inventory/new` & {} | `/${string}/inventory/${string}` & {} | `/${string}/inventory/${string}/edit` & {} | `/${string}/inventory/${string}/units/new` & {} | `/${string}/inventory/${string}/units/${string}/edit` & {} | `/${string}/kits` & {} | `/${string}/kits/new` & {} | `/${string}/kits/${string}` & {} | `/${string}/locations` & {} | `/${string}/locations/diagram` & {} | `/${string}/reservations` & {} | `/${string}/reservations/calendar` & {} | `/${string}/reservations/new` & {} | `/${string}/reservations/pending` & {} | `/${string}/reservations/${string}` & {} | `/${string}/users` & {} | `/${string}/users/${string}` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/favicon.ico" | "/favicon.svg" | "/manifest.webmanifest" | "/sw-register.js" | "/sw.js" | string & {};
	}
}