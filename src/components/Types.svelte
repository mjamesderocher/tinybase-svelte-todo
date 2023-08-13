<script>
  import Type from '../components/Type.svelte'

  export let types

  export let viewStore

  export let metrics

</script>
<ul id="types">
  {#each types as type}
    <Type type={type} {viewStore} {metrics} />
  {/each}
</ul>

<style>
  #types {
    margin: 0;
  }
</style>