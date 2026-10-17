export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.ico","favicon.svg","manifest.webmanifest","sw-register.js","sw.js"]),
	mimeTypes: {".svg":"image/svg+xml",".webmanifest":"application/manifest+json",".js":"text/javascript"},
	_: {
		client: {start:"_app/immutable/entry/start.DO58E5vm.js",app:"_app/immutable/entry/app.BvQWa4nQ.js",imports:["_app/immutable/entry/start.DO58E5vm.js","_app/immutable/chunks/DPUirqnb.js","_app/immutable/chunks/BiTaY2zf.js","_app/immutable/entry/app.BvQWa4nQ.js","_app/immutable/chunks/Dp1pzeXC.js","_app/immutable/chunks/BiTaY2zf.js","_app/immutable/chunks/CNzBoeg_.js","_app/immutable/chunks/BkvbpPaU.js","_app/immutable/chunks/BcjqAjE2.js","_app/immutable/chunks/CalA7r5p.js","_app/immutable/chunks/BcVH-kG-.js","_app/immutable/chunks/Bj8_z-AJ.js","_app/immutable/chunks/Bdkh7MDL.js","_app/immutable/chunks/CTKbGokI.js","_app/immutable/chunks/DZ7lF1Hu.js","_app/immutable/chunks/wy-rGcs9.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js')),
			__memo(() => import('./nodes/10.js')),
			__memo(() => import('./nodes/11.js')),
			__memo(() => import('./nodes/12.js')),
			__memo(() => import('./nodes/13.js')),
			__memo(() => import('./nodes/14.js')),
			__memo(() => import('./nodes/15.js')),
			__memo(() => import('./nodes/16.js')),
			__memo(() => import('./nodes/17.js')),
			__memo(() => import('./nodes/18.js')),
			__memo(() => import('./nodes/19.js')),
			__memo(() => import('./nodes/20.js')),
			__memo(() => import('./nodes/21.js')),
			__memo(() => import('./nodes/22.js')),
			__memo(() => import('./nodes/23.js')),
			__memo(() => import('./nodes/24.js')),
			__memo(() => import('./nodes/25.js')),
			__memo(() => import('./nodes/26.js')),
			__memo(() => import('./nodes/27.js')),
			__memo(() => import('./nodes/28.js')),
			__memo(() => import('./nodes/29.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/api/auth/login",
				pattern: /^\/api\/auth\/login\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/auth/login/_server.ts.js'))
			},
			{
				id: "/api/auth/logout",
				pattern: /^\/api\/auth\/logout\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/auth/logout/_server.ts.js'))
			},
			{
				id: "/api/auth/me",
				pattern: /^\/api\/auth\/me\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/auth/me/_server.ts.js'))
			},
			{
				id: "/api/auth/refresh",
				pattern: /^\/api\/auth\/refresh\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/auth/refresh/_server.ts.js'))
			},
			{
				id: "/api/auth/totp/enroll",
				pattern: /^\/api\/auth\/totp\/enroll\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/auth/totp/enroll/_server.ts.js'))
			},
			{
				id: "/api/auth/totp/verify",
				pattern: /^\/api\/auth\/totp\/verify\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/auth/totp/verify/_server.ts.js'))
			},
			{
				id: "/api/health",
				pattern: /^\/api\/health\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/health/_server.ts.js'))
			},
			{
				id: "/api/labs",
				pattern: /^\/api\/labs\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/labs/_server.ts.js'))
			},
			{
				id: "/api/labs/[labId]",
				pattern: /^\/api\/labs\/([^/]+?)\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/labs/_labId_/_server.ts.js'))
			},
			{
				id: "/api/[labId]/alerts",
				pattern: /^\/api\/([^/]+?)\/alerts\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/alerts/_server.ts.js'))
			},
			{
				id: "/api/[labId]/alerts/[id]/acknowledge",
				pattern: /^\/api\/([^/]+?)\/alerts\/([^/]+?)\/acknowledge\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/alerts/_id_/acknowledge/_server.ts.js'))
			},
			{
				id: "/api/[labId]/audit",
				pattern: /^\/api\/([^/]+?)\/audit\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/audit/_server.ts.js'))
			},
			{
				id: "/api/[labId]/authorizations",
				pattern: /^\/api\/([^/]+?)\/authorizations\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/authorizations/_server.ts.js'))
			},
			{
				id: "/api/[labId]/authorizations/[id]",
				pattern: /^\/api\/([^/]+?)\/authorizations\/([^/]+?)\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/authorizations/_id_/_server.ts.js'))
			},
			{
				id: "/api/[labId]/borrows",
				pattern: /^\/api\/([^/]+?)\/borrows\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/borrows/_server.ts.js'))
			},
			{
				id: "/api/[labId]/borrows/[id]",
				pattern: /^\/api\/([^/]+?)\/borrows\/([^/]+?)\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/borrows/_id_/_server.ts.js'))
			},
			{
				id: "/api/[labId]/borrows/[id]/approve-extension",
				pattern: /^\/api\/([^/]+?)\/borrows\/([^/]+?)\/approve-extension\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/borrows/_id_/approve-extension/_server.ts.js'))
			},
			{
				id: "/api/[labId]/borrows/[id]/pdf",
				pattern: /^\/api\/([^/]+?)\/borrows\/([^/]+?)\/pdf\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/borrows/_id_/pdf/_server.ts.js'))
			},
			{
				id: "/api/[labId]/borrows/[id]/print",
				pattern: /^\/api\/([^/]+?)\/borrows\/([^/]+?)\/print\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/borrows/_id_/print/_server.ts.js'))
			},
			{
				id: "/api/[labId]/borrows/[id]/reject-extension",
				pattern: /^\/api\/([^/]+?)\/borrows\/([^/]+?)\/reject-extension\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/borrows/_id_/reject-extension/_server.ts.js'))
			},
			{
				id: "/api/[labId]/borrows/[id]/request-extension",
				pattern: /^\/api\/([^/]+?)\/borrows\/([^/]+?)\/request-extension\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/borrows/_id_/request-extension/_server.ts.js'))
			},
			{
				id: "/api/[labId]/borrows/[id]/return",
				pattern: /^\/api\/([^/]+?)\/borrows\/([^/]+?)\/return\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/borrows/_id_/return/_server.ts.js'))
			},
			{
				id: "/api/[labId]/borrows/[id]/signature/[role]",
				pattern: /^\/api\/([^/]+?)\/borrows\/([^/]+?)\/signature\/([^/]+?)\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false},{"name":"role","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/borrows/_id_/signature/_role_/_server.ts.js'))
			},
			{
				id: "/api/[labId]/incident-reports",
				pattern: /^\/api\/([^/]+?)\/incident-reports\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/incident-reports/_server.ts.js'))
			},
			{
				id: "/api/[labId]/incident-reports/[id]",
				pattern: /^\/api\/([^/]+?)\/incident-reports\/([^/]+?)\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/incident-reports/_id_/_server.ts.js'))
			},
			{
				id: "/api/[labId]/items",
				pattern: /^\/api\/([^/]+?)\/items\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/items/_server.ts.js'))
			},
			{
				id: "/api/[labId]/items/barcode/[code]",
				pattern: /^\/api\/([^/]+?)\/items\/barcode\/([^/]+?)\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"code","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/items/barcode/_code_/_server.ts.js'))
			},
			{
				id: "/api/[labId]/items/bulk-import",
				pattern: /^\/api\/([^/]+?)\/items\/bulk-import\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/items/bulk-import/_server.ts.js'))
			},
			{
				id: "/api/[labId]/items/[id]",
				pattern: /^\/api\/([^/]+?)\/items\/([^/]+?)\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/items/_id_/_server.ts.js'))
			},
			{
				id: "/api/[labId]/items/[id]/accessories",
				pattern: /^\/api\/([^/]+?)\/items\/([^/]+?)\/accessories\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/items/_id_/accessories/_server.ts.js'))
			},
			{
				id: "/api/[labId]/items/[id]/assets/fetch",
				pattern: /^\/api\/([^/]+?)\/items\/([^/]+?)\/assets\/fetch\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/items/_id_/assets/fetch/_server.ts.js'))
			},
			{
				id: "/api/[labId]/items/[id]/availability",
				pattern: /^\/api\/([^/]+?)\/items\/([^/]+?)\/availability\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/items/_id_/availability/_server.ts.js'))
			},
			{
				id: "/api/[labId]/items/[id]/image",
				pattern: /^\/api\/([^/]+?)\/items\/([^/]+?)\/image\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/items/_id_/image/_server.ts.js'))
			},
			{
				id: "/api/[labId]/items/[id]/label",
				pattern: /^\/api\/([^/]+?)\/items\/([^/]+?)\/label\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/items/_id_/label/_server.ts.js'))
			},
			{
				id: "/api/[labId]/items/[id]/units",
				pattern: /^\/api\/([^/]+?)\/items\/([^/]+?)\/units\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/items/_id_/units/_server.ts.js'))
			},
			{
				id: "/api/[labId]/kits",
				pattern: /^\/api\/([^/]+?)\/kits\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/kits/_server.ts.js'))
			},
			{
				id: "/api/[labId]/kits/[id]",
				pattern: /^\/api\/([^/]+?)\/kits\/([^/]+?)\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/kits/_id_/_server.ts.js'))
			},
			{
				id: "/api/[labId]/locations",
				pattern: /^\/api\/([^/]+?)\/locations\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/locations/_server.ts.js'))
			},
			{
				id: "/api/[labId]/locations/diagram",
				pattern: /^\/api\/([^/]+?)\/locations\/diagram\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/locations/diagram/_server.ts.js'))
			},
			{
				id: "/api/[labId]/locations/[id]",
				pattern: /^\/api\/([^/]+?)\/locations\/([^/]+?)\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/locations/_id_/_server.ts.js'))
			},
			{
				id: "/api/[labId]/reservations",
				pattern: /^\/api\/([^/]+?)\/reservations\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/reservations/_server.ts.js'))
			},
			{
				id: "/api/[labId]/reservations/calendar",
				pattern: /^\/api\/([^/]+?)\/reservations\/calendar\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/reservations/calendar/_server.ts.js'))
			},
			{
				id: "/api/[labId]/reservations/[id]",
				pattern: /^\/api\/([^/]+?)\/reservations\/([^/]+?)\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/reservations/_id_/_server.ts.js'))
			},
			{
				id: "/api/[labId]/reservations/[id]/convert-to-borrow",
				pattern: /^\/api\/([^/]+?)\/reservations\/([^/]+?)\/convert-to-borrow\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/reservations/_id_/convert-to-borrow/_server.ts.js'))
			},
			{
				id: "/api/[labId]/reservations/[id]/instructor-approve",
				pattern: /^\/api\/([^/]+?)\/reservations\/([^/]+?)\/instructor-approve\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/reservations/_id_/instructor-approve/_server.ts.js'))
			},
			{
				id: "/api/[labId]/reservations/[id]/instructor-reject",
				pattern: /^\/api\/([^/]+?)\/reservations\/([^/]+?)\/instructor-reject\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/reservations/_id_/instructor-reject/_server.ts.js'))
			},
			{
				id: "/api/[labId]/reservations/[id]/manager-approve",
				pattern: /^\/api\/([^/]+?)\/reservations\/([^/]+?)\/manager-approve\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/reservations/_id_/manager-approve/_server.ts.js'))
			},
			{
				id: "/api/[labId]/reservations/[id]/manager-reject",
				pattern: /^\/api\/([^/]+?)\/reservations\/([^/]+?)\/manager-reject\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/reservations/_id_/manager-reject/_server.ts.js'))
			},
			{
				id: "/api/[labId]/units/[id]",
				pattern: /^\/api\/([^/]+?)\/units\/([^/]+?)\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/units/_id_/_server.ts.js'))
			},
			{
				id: "/api/[labId]/units/[id]/label",
				pattern: /^\/api\/([^/]+?)\/units\/([^/]+?)\/label\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/units/_id_/label/_server.ts.js'))
			},
			{
				id: "/api/[labId]/users",
				pattern: /^\/api\/([^/]+?)\/users\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/users/_server.ts.js'))
			},
			{
				id: "/api/[labId]/users/rfid/[tag]",
				pattern: /^\/api\/([^/]+?)\/users\/rfid\/([^/]+?)\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"tag","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/users/rfid/_tag_/_server.ts.js'))
			},
			{
				id: "/api/[labId]/users/[id]",
				pattern: /^\/api\/([^/]+?)\/users\/([^/]+?)\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/users/_id_/_server.ts.js'))
			},
			{
				id: "/api/[labId]/users/[id]/export",
				pattern: /^\/api\/([^/]+?)\/users\/([^/]+?)\/export\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_labId_/users/_id_/export/_server.ts.js'))
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/[lab]/(protected)",
				pattern: /^\/([^/]+?)\/?$/,
				params: [{"name":"lab","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/[lab]/(protected)/audit",
				pattern: /^\/([^/]+?)\/audit\/?$/,
				params: [{"name":"lab","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/[lab]/(protected)/borrows",
				pattern: /^\/([^/]+?)\/borrows\/?$/,
				params: [{"name":"lab","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/[lab]/(protected)/borrows/new",
				pattern: /^\/([^/]+?)\/borrows\/new\/?$/,
				params: [{"name":"lab","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/[lab]/(protected)/borrows/[id]",
				pattern: /^\/([^/]+?)\/borrows\/([^/]+?)\/?$/,
				params: [{"name":"lab","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/[lab]/(protected)/borrows/[id]/return",
				pattern: /^\/([^/]+?)\/borrows\/([^/]+?)\/return\/?$/,
				params: [{"name":"lab","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/[lab]/catalog",
				pattern: /^\/([^/]+?)\/catalog\/?$/,
				params: [{"name":"lab","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 28 },
				endpoint: null
			},
			{
				id: "/[lab]/catalog/[id]",
				pattern: /^\/([^/]+?)\/catalog\/([^/]+?)\/?$/,
				params: [{"name":"lab","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 29 },
				endpoint: null
			},
			{
				id: "/[lab]/(protected)/inventory",
				pattern: /^\/([^/]+?)\/inventory\/?$/,
				params: [{"name":"lab","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/[lab]/(protected)/inventory/new",
				pattern: /^\/([^/]+?)\/inventory\/new\/?$/,
				params: [{"name":"lab","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/[lab]/(protected)/inventory/[id]",
				pattern: /^\/([^/]+?)\/inventory\/([^/]+?)\/?$/,
				params: [{"name":"lab","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/[lab]/(protected)/inventory/[id]/edit",
				pattern: /^\/([^/]+?)\/inventory\/([^/]+?)\/edit\/?$/,
				params: [{"name":"lab","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/[lab]/(protected)/inventory/[id]/units/new",
				pattern: /^\/([^/]+?)\/inventory\/([^/]+?)\/units\/new\/?$/,
				params: [{"name":"lab","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/[lab]/(protected)/kits",
				pattern: /^\/([^/]+?)\/kits\/?$/,
				params: [{"name":"lab","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/[lab]/(protected)/kits/new",
				pattern: /^\/([^/]+?)\/kits\/new\/?$/,
				params: [{"name":"lab","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/[lab]/(protected)/kits/[id]",
				pattern: /^\/([^/]+?)\/kits\/([^/]+?)\/?$/,
				params: [{"name":"lab","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 18 },
				endpoint: null
			},
			{
				id: "/[lab]/(protected)/locations",
				pattern: /^\/([^/]+?)\/locations\/?$/,
				params: [{"name":"lab","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 19 },
				endpoint: null
			},
			{
				id: "/[lab]/(protected)/locations/diagram",
				pattern: /^\/([^/]+?)\/locations\/diagram\/?$/,
				params: [{"name":"lab","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 20 },
				endpoint: null
			},
			{
				id: "/[lab]/(protected)/reservations",
				pattern: /^\/([^/]+?)\/reservations\/?$/,
				params: [{"name":"lab","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 21 },
				endpoint: null
			},
			{
				id: "/[lab]/(protected)/reservations/calendar",
				pattern: /^\/([^/]+?)\/reservations\/calendar\/?$/,
				params: [{"name":"lab","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 22 },
				endpoint: null
			},
			{
				id: "/[lab]/(protected)/reservations/new",
				pattern: /^\/([^/]+?)\/reservations\/new\/?$/,
				params: [{"name":"lab","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 23 },
				endpoint: null
			},
			{
				id: "/[lab]/(protected)/reservations/pending",
				pattern: /^\/([^/]+?)\/reservations\/pending\/?$/,
				params: [{"name":"lab","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 24 },
				endpoint: null
			},
			{
				id: "/[lab]/(protected)/reservations/[id]",
				pattern: /^\/([^/]+?)\/reservations\/([^/]+?)\/?$/,
				params: [{"name":"lab","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 25 },
				endpoint: null
			},
			{
				id: "/[lab]/(protected)/users",
				pattern: /^\/([^/]+?)\/users\/?$/,
				params: [{"name":"lab","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 26 },
				endpoint: null
			},
			{
				id: "/[lab]/(protected)/users/[id]",
				pattern: /^\/([^/]+?)\/users\/([^/]+?)\/?$/,
				params: [{"name":"lab","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 27 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
