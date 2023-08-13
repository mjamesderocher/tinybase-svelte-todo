<script>
  import RowView from "./RowView.svelte"
  import { useSliceRowIds, useIndexesOrIndexesId } from '$lib/hooks'

  /** @type { import('tinybase/indexes').Indexes } */
  export let indexes

  /** @type { import('tinybase/common').Id } */
  export let indexId

  /** @type { import('tinybase/common').Id } */
  export let sliceId

  /** @type { import('svelte').SvelteComponent } */
  export let rowComponent = RowView

  const resolvedIndexes = useIndexesOrIndexesId(indexes)
  const store = resolvedIndexes?.getStore()
  const tableId = resolvedIndexes?.getTableId(indexId)

  let rowIds = useSliceRowIds(indexId, sliceId, resolvedIndexes)

  $: rowIds = useSliceRowIds(indexId, sliceId, resolvedIndexes)

</script>

{#each $rowIds as rowId}
  <svelte:component this={rowComponent} {store} {tableId} {rowId} key={rowId}/>
{/each}