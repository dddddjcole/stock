<script lang="ts">
  export let data: { user: any, users: any[] };
</script>

<div class="container mx-auto px-4 py-6">
  <div class="bg-white border rounded-xl shadow p-6">
    <h2 class="text-xl font-semibold mb-3">用户管理</h2>
    {#if data.users?.length === 0}
      <p class="text-slate-500">暂无用户</p>
    {:else}
      <table class="min-w-full text-sm">
        <thead><tr class="border-b">
          <th class="text-left py-2">ID</th><th class="text-left">用户名</th>
          <th class="text-left">角色</th><th class="text-left">显示名</th>
          <th class="text-left">状态</th><th class="text-left">创建时间</th>
        </tr></thead>
        <tbody>
          {#each data.users as r}
          <tr class="border-b hover:bg-slate-50">
            <td class="py-2">{r.id}</td><td>{r.username}</td>
            <td>{r.role}</td><td>{r.display_name}</td>
            <td>{r.is_active === 1 ? '启用':'停用'}</td><td>{r.created_at}</td>
          </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
</div>

