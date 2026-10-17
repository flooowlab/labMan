const manifest = (() => {
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
			__memo(() => import('./chunks/0-CXgXjDdH.js')),
			__memo(() => import('./chunks/1-CD-i-LRb.js')),
			__memo(() => import('./chunks/2-BsyZ6sly.js')),
			__memo(() => import('./chunks/3-CXkfyYF9.js')),
			__memo(() => import('./chunks/4-0nIrgHJm.js')),
			__memo(() => import('./chunks/5-5SrZTt1D.js')),
			__memo(() => import('./chunks/6-p-4Sh1BX.js')),
			__memo(() => import('./chunks/7-q9FV1Exq.js')),
			__memo(() => import('./chunks/8-C5WIR-E8.js')),
			__memo(() => import('./chunks/9-BaoTWIAW.js')),
			__memo(() => import('./chunks/10-C6-XbTsJ.js')),
			__memo(() => import('./chunks/11-CN6FsWp5.js')),
			__memo(() => import('./chunks/12-Cx9D6pwt.js')),
			__memo(() => import('./chunks/13-Nv1JT1uW.js')),
			__memo(() => import('./chunks/14-BLMdY1cv.js')),
			__memo(() => import('./chunks/15-DXYcRoYE.js')),
			__memo(() => import('./chunks/16-u4bou2OD.js')),
			__memo(() => import('./chunks/17-jewrHpFT.js')),
			__memo(() => import('./chunks/18-BNIrnE-k.js')),
			__memo(() => import('./chunks/19-t3nV-XfQ.js')),
			__memo(() => import('./chunks/20-Dpxk50lZ.js')),
			__memo(() => import('./chunks/21-C0h26Bp0.js')),
			__memo(() => import('./chunks/22-C0youoXZ.js')),
			__memo(() => import('./chunks/23-BZ0FEi_1.js')),
			__memo(() => import('./chunks/24-MUQWoz1T.js')),
			__memo(() => import('./chunks/25-Dx4kKf37.js')),
			__memo(() => import('./chunks/26-BKvouhX7.js')),
			__memo(() => import('./chunks/27-BhC7QGos.js')),
			__memo(() => import('./chunks/28-bVo0O2GM.js')),
			__memo(() => import('./chunks/29-DmnEkmXT.js'))
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
				endpoint: __memo(() => import('./chunks/_server.ts-B7MXc8St.js'))
			},
			{
				id: "/api/auth/logout",
				pattern: /^\/api\/auth\/logout\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-DjcTiLr6.js'))
			},
			{
				id: "/api/auth/me",
				pattern: /^\/api\/auth\/me\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-bLkJFzZF.js'))
			},
			{
				id: "/api/auth/refresh",
				pattern: /^\/api\/auth\/refresh\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-JkaZxOR_.js'))
			},
			{
				id: "/api/auth/totp/enroll",
				pattern: /^\/api\/auth\/totp\/enroll\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-B1GwvAlt.js'))
			},
			{
				id: "/api/auth/totp/verify",
				pattern: /^\/api\/auth\/totp\/verify\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-B2CRsCmb.js'))
			},
			{
				id: "/api/health",
				pattern: /^\/api\/health\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-zfS6rvKE.js'))
			},
			{
				id: "/api/labs",
				pattern: /^\/api\/labs\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-vHK9CsCi.js'))
			},
			{
				id: "/api/labs/[labId]",
				pattern: /^\/api\/labs\/([^/]+?)\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-DI1fl7-o.js'))
			},
			{
				id: "/api/[labId]/alerts",
				pattern: /^\/api\/([^/]+?)\/alerts\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-BZVdVAqv.js'))
			},
			{
				id: "/api/[labId]/alerts/[id]/acknowledge",
				pattern: /^\/api\/([^/]+?)\/alerts\/([^/]+?)\/acknowledge\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-ZFsBjan3.js'))
			},
			{
				id: "/api/[labId]/audit",
				pattern: /^\/api\/([^/]+?)\/audit\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-B3DlFpQo.js'))
			},
			{
				id: "/api/[labId]/authorizations",
				pattern: /^\/api\/([^/]+?)\/authorizations\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-CdjJ4yHm.js'))
			},
			{
				id: "/api/[labId]/authorizations/[id]",
				pattern: /^\/api\/([^/]+?)\/authorizations\/([^/]+?)\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-BEJ9wvr-.js'))
			},
			{
				id: "/api/[labId]/borrows",
				pattern: /^\/api\/([^/]+?)\/borrows\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-CPM5mbi-.js'))
			},
			{
				id: "/api/[labId]/borrows/[id]",
				pattern: /^\/api\/([^/]+?)\/borrows\/([^/]+?)\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-56kBopbv.js'))
			},
			{
				id: "/api/[labId]/borrows/[id]/approve-extension",
				pattern: /^\/api\/([^/]+?)\/borrows\/([^/]+?)\/approve-extension\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-Dh-4r7Wn.js'))
			},
			{
				id: "/api/[labId]/borrows/[id]/pdf",
				pattern: /^\/api\/([^/]+?)\/borrows\/([^/]+?)\/pdf\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-BUWTBhno.js'))
			},
			{
				id: "/api/[labId]/borrows/[id]/print",
				pattern: /^\/api\/([^/]+?)\/borrows\/([^/]+?)\/print\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-sBeo26Nb.js'))
			},
			{
				id: "/api/[labId]/borrows/[id]/reject-extension",
				pattern: /^\/api\/([^/]+?)\/borrows\/([^/]+?)\/reject-extension\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-BcdQk_FD.js'))
			},
			{
				id: "/api/[labId]/borrows/[id]/request-extension",
				pattern: /^\/api\/([^/]+?)\/borrows\/([^/]+?)\/request-extension\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-vlBYFThe.js'))
			},
			{
				id: "/api/[labId]/borrows/[id]/return",
				pattern: /^\/api\/([^/]+?)\/borrows\/([^/]+?)\/return\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-Bwg1xNB_.js'))
			},
			{
				id: "/api/[labId]/borrows/[id]/signature/[role]",
				pattern: /^\/api\/([^/]+?)\/borrows\/([^/]+?)\/signature\/([^/]+?)\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false},{"name":"role","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-CFGRbH2A.js'))
			},
			{
				id: "/api/[labId]/incident-reports",
				pattern: /^\/api\/([^/]+?)\/incident-reports\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-DcFq258m.js'))
			},
			{
				id: "/api/[labId]/incident-reports/[id]",
				pattern: /^\/api\/([^/]+?)\/incident-reports\/([^/]+?)\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-DHvloE_G.js'))
			},
			{
				id: "/api/[labId]/items",
				pattern: /^\/api\/([^/]+?)\/items\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-BmvqRD-W.js'))
			},
			{
				id: "/api/[labId]/items/barcode/[code]",
				pattern: /^\/api\/([^/]+?)\/items\/barcode\/([^/]+?)\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"code","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-bkkN6UCN.js'))
			},
			{
				id: "/api/[labId]/items/bulk-import",
				pattern: /^\/api\/([^/]+?)\/items\/bulk-import\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-ChdR6JTg.js'))
			},
			{
				id: "/api/[labId]/items/[id]",
				pattern: /^\/api\/([^/]+?)\/items\/([^/]+?)\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-DHSg8zO8.js'))
			},
			{
				id: "/api/[labId]/items/[id]/accessories",
				pattern: /^\/api\/([^/]+?)\/items\/([^/]+?)\/accessories\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-Si-LTqtb.js'))
			},
			{
				id: "/api/[labId]/items/[id]/assets/fetch",
				pattern: /^\/api\/([^/]+?)\/items\/([^/]+?)\/assets\/fetch\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-DPgbays1.js'))
			},
			{
				id: "/api/[labId]/items/[id]/availability",
				pattern: /^\/api\/([^/]+?)\/items\/([^/]+?)\/availability\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-BUvphOkn.js'))
			},
			{
				id: "/api/[labId]/items/[id]/image",
				pattern: /^\/api\/([^/]+?)\/items\/([^/]+?)\/image\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-BTxi3fbl.js'))
			},
			{
				id: "/api/[labId]/items/[id]/label",
				pattern: /^\/api\/([^/]+?)\/items\/([^/]+?)\/label\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-DnHtPA5k.js'))
			},
			{
				id: "/api/[labId]/items/[id]/units",
				pattern: /^\/api\/([^/]+?)\/items\/([^/]+?)\/units\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-uOnsNwh3.js'))
			},
			{
				id: "/api/[labId]/kits",
				pattern: /^\/api\/([^/]+?)\/kits\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-DmhkAW8C.js'))
			},
			{
				id: "/api/[labId]/kits/[id]",
				pattern: /^\/api\/([^/]+?)\/kits\/([^/]+?)\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-DLcwVG6H.js'))
			},
			{
				id: "/api/[labId]/locations",
				pattern: /^\/api\/([^/]+?)\/locations\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-CPryowV3.js'))
			},
			{
				id: "/api/[labId]/locations/diagram",
				pattern: /^\/api\/([^/]+?)\/locations\/diagram\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-w6QaRZ-z.js'))
			},
			{
				id: "/api/[labId]/locations/[id]",
				pattern: /^\/api\/([^/]+?)\/locations\/([^/]+?)\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-Cp62GgO0.js'))
			},
			{
				id: "/api/[labId]/reservations",
				pattern: /^\/api\/([^/]+?)\/reservations\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-76PjJyg_.js'))
			},
			{
				id: "/api/[labId]/reservations/calendar",
				pattern: /^\/api\/([^/]+?)\/reservations\/calendar\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-CWpYPef1.js'))
			},
			{
				id: "/api/[labId]/reservations/[id]",
				pattern: /^\/api\/([^/]+?)\/reservations\/([^/]+?)\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-DZ8mAH_4.js'))
			},
			{
				id: "/api/[labId]/reservations/[id]/convert-to-borrow",
				pattern: /^\/api\/([^/]+?)\/reservations\/([^/]+?)\/convert-to-borrow\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-B3VFUl6O.js'))
			},
			{
				id: "/api/[labId]/reservations/[id]/instructor-approve",
				pattern: /^\/api\/([^/]+?)\/reservations\/([^/]+?)\/instructor-approve\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-Cu3y_UM4.js'))
			},
			{
				id: "/api/[labId]/reservations/[id]/instructor-reject",
				pattern: /^\/api\/([^/]+?)\/reservations\/([^/]+?)\/instructor-reject\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-pj6o8OB8.js'))
			},
			{
				id: "/api/[labId]/reservations/[id]/manager-approve",
				pattern: /^\/api\/([^/]+?)\/reservations\/([^/]+?)\/manager-approve\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-DCVxgGRM.js'))
			},
			{
				id: "/api/[labId]/reservations/[id]/manager-reject",
				pattern: /^\/api\/([^/]+?)\/reservations\/([^/]+?)\/manager-reject\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-9h3E9UCO.js'))
			},
			{
				id: "/api/[labId]/units/[id]",
				pattern: /^\/api\/([^/]+?)\/units\/([^/]+?)\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-CYU8mR44.js'))
			},
			{
				id: "/api/[labId]/units/[id]/label",
				pattern: /^\/api\/([^/]+?)\/units\/([^/]+?)\/label\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-NDMvheCH.js'))
			},
			{
				id: "/api/[labId]/users",
				pattern: /^\/api\/([^/]+?)\/users\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-CoWJOpC6.js'))
			},
			{
				id: "/api/[labId]/users/rfid/[tag]",
				pattern: /^\/api\/([^/]+?)\/users\/rfid\/([^/]+?)\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"tag","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-C3UF_t_s.js'))
			},
			{
				id: "/api/[labId]/users/[id]",
				pattern: /^\/api\/([^/]+?)\/users\/([^/]+?)\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-DS0S1pqn.js'))
			},
			{
				id: "/api/[labId]/users/[id]/export",
				pattern: /^\/api\/([^/]+?)\/users\/([^/]+?)\/export\/?$/,
				params: [{"name":"labId","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-CB1v4huB.js'))
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

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
