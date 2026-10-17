export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20'),
	() => import('./nodes/21'),
	() => import('./nodes/22'),
	() => import('./nodes/23'),
	() => import('./nodes/24'),
	() => import('./nodes/25'),
	() => import('./nodes/26'),
	() => import('./nodes/27'),
	() => import('./nodes/28'),
	() => import('./nodes/29'),
	() => import('./nodes/30')
];

export const server_loads = [2];

export const dictionary = {
		"/": [~3],
		"/login": [~4],
		"/[lab]/(protected)": [~5,[2]],
		"/[lab]/(protected)/audit": [~6,[2]],
		"/[lab]/(protected)/borrows": [~7,[2]],
		"/[lab]/(protected)/borrows/new": [~8,[2]],
		"/[lab]/(protected)/borrows/[id]": [~9,[2]],
		"/[lab]/(protected)/borrows/[id]/return": [~10,[2]],
		"/[lab]/catalog": [~29],
		"/[lab]/catalog/[id]": [~30],
		"/[lab]/(protected)/inventory": [~11,[2]],
		"/[lab]/(protected)/inventory/new": [~12,[2]],
		"/[lab]/(protected)/inventory/[id]": [~13,[2]],
		"/[lab]/(protected)/inventory/[id]/edit": [~14,[2]],
		"/[lab]/(protected)/inventory/[id]/units/new": [~15,[2]],
		"/[lab]/(protected)/inventory/[id]/units/[unitId]/edit": [~16,[2]],
		"/[lab]/(protected)/kits": [~17,[2]],
		"/[lab]/(protected)/kits/new": [~18,[2]],
		"/[lab]/(protected)/kits/[id]": [~19,[2]],
		"/[lab]/(protected)/locations": [~20,[2]],
		"/[lab]/(protected)/locations/diagram": [~21,[2]],
		"/[lab]/(protected)/reservations": [~22,[2]],
		"/[lab]/(protected)/reservations/calendar": [~23,[2]],
		"/[lab]/(protected)/reservations/new": [~24,[2]],
		"/[lab]/(protected)/reservations/pending": [~25,[2]],
		"/[lab]/(protected)/reservations/[id]": [~26,[2]],
		"/[lab]/(protected)/users": [~27,[2]],
		"/[lab]/(protected)/users/[id]": [~28,[2]]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));
export const encoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.encode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.js';