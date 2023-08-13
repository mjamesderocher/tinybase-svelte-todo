<script>
  import CellView from "./CellView.svelte"

  /** @type { import('tinybase/common').Id } */
  export let rowId

  /** @type { import('tinybase/common').Id } */
  export let tableId

  /** @type { import('tinybase/store').Store } */
  export let store

  export let cellComponent = CellView

  export let rowElement = 'div'

</script>

<svelte:element this={rowElement} class="row">
  <p>{rowId}</p>
</svelte:element>

<style>
  .row {
    display: flex;
  }
</style>