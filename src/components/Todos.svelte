<script>
  import Todo from '../components/Todo.svelte'
  import SliceView from '../components/tinybase-ui/SliceView.svelte'

  export let indexes

  export let currentType
</script>

<ul id="todos">
  <SliceView indexId="types" rowComponent={Todo} {indexes} sliceId={$currentType}/>
</ul>

<style>
  #todos {
    grid-column: 2;
    grid-row: 2 / span 2;
    margin: 0;
    padding: 0;
  }
</style>