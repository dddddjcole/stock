<script lang="ts">
  import { api } from '$lib/api';
  import { goto } from '$app/navigation';
  let username='', password='', confirm='', display_name='', err='';
  async function submit(e: Event){
    e.preventDefault();
    if(password!==confirm){ err='两次密码不一致'; return; }
    try{
      await api('/api/auth/register',{method:'POST', body: JSON.stringify({username,password,display_name})});
      await goto('/login');
    }catch{
      err='用户名已存在';
    }
  }
</script>

<div class="min-h-[70vh] grid place-items-center">
  <form class="w-full max-w-sm bg-white border rounded-xl shadow p-6" on:submit={submit}>
    <h1 class="text-xl font-semibold mb-4">注册</h1>
    {#if err}<div class="text-red-600 text-sm mb-2">{err}</div>{/if}
    <input class="w-full mb-2 border rounded px-3 py-2" placeholder="用户名（≥3）" bind:value={username}/>
    <input class="w-full mb-2 border rounded px-3 py-2" placeholder="显示名（可选）" bind:value={display_name}/>
    <input class="w-full mb-2 border rounded px-3 py-2" type="password" placeholder="密码（≥6）" bind:value={password}/>
    <input class="w-full mb-4 border rounded px-3 py-2" type="password" placeholder="确认密码" bind:value={confirm}/>
    <button class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">注册</button>
    <p class="text-sm text-slate-500 mt-3"><a href="/login" class="text-blue-600">返回登录</a></p>
  </form>
</div>

