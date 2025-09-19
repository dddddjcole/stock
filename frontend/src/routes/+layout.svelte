<script lang="ts">
  import '../app.css';
  export let data: { user: any };
</script>

<nav class="bg-white border-b">
  <div class="container mx-auto px-4 py-3 flex justify-between items-center">
    <a href="/" class="font-extrabold text-xl">xcontract</a>
    <div class="text-sm space-x-4">
      {#if data.user}
        <a href="/dashboard" class="text-slate-600 hover:text-slate-900">主页</a>
        {#if ['owner','admin'].includes(data.user.role)}
          <a href="/admin/users" class="text-slate-600 hover:text-slate-900">用户管理</a>
        {/if}
        <a href="/login?logout=1" class="text-slate-600 hover:text-slate-900">退出</a>
      {:else}
        <a href="/login" class="text-blue-600">登录</a>
        <a href="/register" class="text-slate-600">注册</a>
      {/if}
    </div>
  </div>
</nav>

<slot />

