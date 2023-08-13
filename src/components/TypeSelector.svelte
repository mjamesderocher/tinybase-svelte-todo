<script>
  export let selectedType

  export let types
</script>

<select class="type-selector" bind:value={selectedType} required>
  <option value="" disabled selected hidden>Select list</option>
  {#each types as type}
    <option>{type}</option>
  {/each}
</select>

<style>
  .type-selector {
    border: none;
    outline: none;
    color: #777;
    font: inherit;
    font-size: 0.8rem;
    margin-top: 0.1rem;
  }
</style>