<script>
  import { useCell } from '$lib/hooks'

  /** @type { import('tinybase/store').Store } */
  export let store

  /** @type { import('tinybase/common').Id } */
  export let cellId

  /** @type { import('tinybase/common').Id } */
  export let tableId

  /** @type { import('tinybase/common').Id } */
  export let rowId

  $: cell = useCell(tableId, rowId, cellId, store)
</script>

{$cell}
