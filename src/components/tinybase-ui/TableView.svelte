<script>
  import RowView from "./RowView.svelte"
  import { useRowIds } from '$lib/hooks'

  /** @type { import('tinybase/store').Store } */
  export let store

  /** @type { import('tinybase/common').Id } */
  export let tableId

  /** @type { import('tinybase/common').Ids } */
  export let rowIds = useRowIds(tableId, store)

  /** @type { import('svelte').SvelteComponent } */
  export let rowComponent = RowView

</script>

{#each $rowIds as rowId}
  <svelte:component this={rowComponent} {store} {tableId} {rowId} />
{/each}