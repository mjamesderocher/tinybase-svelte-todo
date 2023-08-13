<script>
  import { useValue, useMetric } from "$lib/hooks"

  export let metrics

  export let type = ''

  export let viewStore

  const currentType = useValue('type', viewStore)

  const handleClick = () => $currentType = type

  const pending = useMetric(type, metrics)

</script>


<li class="type {type == $currentType ? ' current' : ''}">
  <button 
    on:click={()=> handleClick()} disabled={type == $currentType}>
    {type} {$pending}
  </button>
</li>

<style>
  .type {
    margin-bottom: var(--spacing);
  }

  .current {
    color: var(--accent-color);
  }
</style>
