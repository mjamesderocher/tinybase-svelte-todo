<script>
  import { useCell } from "$lib/hooks"
  import CellView from "./tinybase-ui/CellView.svelte"
  import TypeSelector from "./TypeSelector.svelte"

  /** @type { import('tinybase/store').Store } */
  export let store

  /** @type { import('tinybase/common').Id } */
  export let tableId

  /** @type { import('tinybase/common').Id } */
  export let rowId

  const types = ['Home', 'Work', 'Archived']

  $: done = useCell(tableId, rowId, 'done', store)

  $: selectedType = useCell(tableId, rowId, 'type', store)

</script>

<li class="todo">
  <button class="text {$done ? 'done' : ''}" on:click={()=> $done = !$done}>
    <span class="screen-reader">{$done ? 'Uncomplete ' : 'Complete'}</span>
    <CellView cellId='text' {tableId} {rowId} {store}/>
  </button>
  <TypeSelector {types} bind:selectedType={$selectedType} />
</li>

<style>
  .todo {
    background: #fff;
    border: var(--border);
    display: flex;
    margin-bottom: var(--spacing);
    padding: var(--spacing);
  }
  
  .text {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    user-select: none;
    white-space: nowrap;
  }
  
  .text::before {
    content: '\1F7E0';
    padding: 0 0.5rem 0 0.25rem;
  }

  .text.done {
    color: #ccc;
  }

  .text.done::before {
    content: '\2705';
  }

</style>
