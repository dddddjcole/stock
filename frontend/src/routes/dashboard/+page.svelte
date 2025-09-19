<script lang="ts">
  export let data: any;
</script>

<div class="container mx-auto px-4 py-6">
  <div class="bg-white border rounded-xl shadow p-6">
    <h2 class="text-xl font-semibold mb-2">欢迎，{data?.user?.display_name ?? ''} 👋</h2>
    <p class="text-slate-600">这里是用户主页（占位）。</p>
  </div>
</div>

