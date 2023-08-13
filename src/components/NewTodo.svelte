<script>
  import TypeSelector from './TypeSelector.svelte'

  /** @type {import('tinybase/store').Store} */
  export let store

  export let checkpoints

  /** @type {string[]} */
  export let types = []
  
  let text = ''
  let selectedType = ''
  
  const handleSubmit = ()=> {
    store.addRow('todos', { text: text, type: selectedType })
    checkpoints.addCheckpoint(`adding '${text}'`)
    text = ''
    selectedType = ''
  }
</script>

<form id="newTodo" on:submit|preventDefault={handleSubmit}>
  <input
    class="text"
    placeholder="New Todo"
    bind:value={text}
    required
  />
  <TypeSelector {types} bind:selectedType={selectedType} />
  <input class="screen-reader" type="submit" value="save" />
</form>

<style>
  #newTodo {
    border: var(--border);
    display: flex;
    font: inherit;
    letter-spacing: inherit;
    padding: var(--spacing);
  }

  #newTodo:focus-within {
    border-color: var(--accent-color);
  }

  .text {
    flex: 1;
  }

  input {
    appearance: none;
    border: 0;
    outline: none;
  }

</style>
