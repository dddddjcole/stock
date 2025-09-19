<script lang="ts">
  import { api } from '$lib/api';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  let username = '', password = '', err = '';
  $: if ($page.url.searchParams.get('logout')) {
    api('/api/auth/logout', { method: 'POST' }).catch(() => {});
  }

  async function submit(e: Event) {
    e.preventDefault();
    try {
      await api('/api/auth/login', { method:'POST', body: JSON.stringify({ username, password }) });
      await goto('/dashboard');
    } catch (e) {
      err = '用户名或密码错误';
    }
  }
</script>

<div class="min-h-[70vh] grid place-items-center">
  <form class="w-full max-w-sm bg-white border rounded-xl shadow p-6" on:submit={submit}>
    <h1 class="text-xl font-semibold mb-4">登录</h1>
    {#if err}<div class="text-red-600 text-sm mb-2">{err}</div>{/if}
    <input class="w-full mb-2 border rounded px-3 py-2" placeholder="用户名" bind:value={username} />
    <input class="w-full mb-4 border rounded px-3 py-2" type="password" placeholder="密码" bind:value={password} />
    <button class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">登录</button>
    <p class="text-sm text-slate-500 mt-3">没有账号？<a href="/register" class="text-blue-600">去注册</a></p>
  </form>
</div>

