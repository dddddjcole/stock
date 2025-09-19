// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

// 让 SvelteKit 识别 .svelte 文件与 Vite 的环境
declare module '*.svelte' {
  export { SvelteComponent as default } from 'svelte';
}

export {};

