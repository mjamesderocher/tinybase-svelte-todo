<script>
  import { useUndoInformation, useRedoInformation } from "$lib/hooks"

  export let checkpoints

  const undoInformation = useUndoInformation(checkpoints)
  const redoInformation = useRedoInformation(checkpoints)
  
  $: [canUndo, handleUndo, , undoLabel] = $undoInformation
  $: [canRedo, handleRedo, , redoLabel] = $redoInformation

  //console.log(handleUndo)

</script>
<div id="undoRedo">
  {#if canUndo}
    <button class="history-button" id="undo" on:click={handleUndo}>
      undo {undoLabel}
    </button>
  {:else}
    <div id="undo" class="disabled history-button" />
  {/if}

  {#if canRedo}
    <button class="history-button" id="redo" on:click={handleRedo}>
      redo {redoLabel}
    </button>
  {:else}
    <div id="redo" class="disabled history-button" />
  {/if}
</div>

<style>
  #undoRedo {
    grid-column: 1;
    grid-row: 3;
  }

  .history-button {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    user-select: none;
  }

  .history-button::before {
    padding-right: 0.5rem;
    vertical-align: middle;
  }
  
  .history-button.disabled {
    cursor: default;
    opacity: 0.3;
  }

  #undo::before {
    content: '\21A9';
  }

  #redo::before {
    content: '\21AA';
  }

</style>
