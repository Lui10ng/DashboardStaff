<script lang="ts">
  export let code: string;
  export let discount: number;
  export let status: 'active' | 'expired' | 'deactivated';
  export let used: number;
  export let total: number;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'deactivated':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
</script>

<div class="bg-white rounded-lg border border-gray-200 p-4">
  <div class="flex items-center justify-between mb-2">
    <p class="text-sm font-medium text-gray-900">{code}</p>
    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium {getStatusColor(status)}">
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  </div>
  <p class="text-2xl font-bold text-primary">-{discount}%</p>
  <div class="mt-4">
    <div class="bg-gray-100 rounded-full h-1">
      <div 
        class="bg-primary rounded-full h-1" 
        style="width: {(used / total) * 100}%"
      ></div>
    </div>
    <p class="text-xs text-gray-500 mt-1">{used}/{total}</p>
  </div>
</div>