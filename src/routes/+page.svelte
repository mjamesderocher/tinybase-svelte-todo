<script>
  import { createStore, createIndexes, createMetrics, createCheckpoints } from 'tinybase'
  import { createLocalPersister, createSessionPersister } from 'tinybase/persisters/persister-browser'
  import Title from '../components/Title.svelte'
  import Todos from '../components/Todos.svelte'
  import Types from '../components/Types.svelte'
  import NewTodo from '../components/NewTodo.svelte'
  import UndoRedo from '../components/UndoRedo.svelte'
  import { useValue, useMetric } from '$lib/hooks'
  import { browser } from '$app/environment'

  const TYPES = ['Home', 'Work', 'Archived']
  const INITIAL_TODOS = {
    todos: {
      0: {text: 'Clean the floor', type: 'Home'},
      1: {text: 'Install TinyBase', type: 'Work'},
      2: {text: 'Book holiday', type: 'Archived', done: true},
    },
  }

  const SCHEMA = {
    todos: {
      text: {type: 'string'},
      done: {type: 'boolean', default: false},
      type: {type: 'string', default: 'Home', allow: TYPES},
    },
  }

  //const store = createStore().setTables(INITIAL_TODOS)
  const store = createStore().setTablesSchema(SCHEMA)

  const viewStore = createStore().setValue('type', 'Work')

  const indexes = createIndexes(store).setIndexDefinition('types', 'todos', 'type')

  const currentType = useValue('type', viewStore)

  const metrics = createMetrics(store)
  metrics.setMetricDefinition('pending', 'todos', 'sum', (getCell) =>
    !getCell('done') ? 1 : 0,
  )
  TYPES.forEach((type) => {
    metrics.setMetricDefinition(type, 'todos', 'sum', (getCell) =>
      getCell('type') == type && !getCell('done') ? 1 : 0,
    )
  })

  const pending = useMetric('pending', metrics)

  const checkpoints = createCheckpoints(store)

  if (browser) {
    (async () => {
      const persister = createLocalPersister(store, 'todos/store')
      await persister.startAutoLoad(INITIAL_TODOS)
      checkpoints.clear()
      await persister.startAutoSave()

      const viewPersister = createSessionPersister(viewStore, 'todos/viewStore')
      await viewPersister.startAutoLoad({}, {type: 'Home'})
      await viewPersister.startAutoSave()
    })()
  }

</script>

<main>
  <Title {pending} />
  <NewTodo {store} types={TYPES} {checkpoints} />
  <Types types={TYPES} {metrics} {viewStore} />
  <Todos {indexes} {currentType} />
  <UndoRedo {checkpoints} />
</main>

<style>
  /* @media (prefers-color-scheme: dark) {
    :global(body) {
      background-color: black;
      color: white;
    }
  } */

  @font-face {
    font-family: Inter;
    src: url(https://tinybase.org/fonts/inter.woff2) format('woff2');
  }

  main {
    --accent-color: #d81b60;
    --spacing: 0.5rem;
    --border: 1px solid #ccc;
    display: grid;
    grid-template-columns: 35% minmax(0, 1fr);
    grid-template-rows: auto 1fr;
    box-sizing: border-box;
    font-family: Inter, sans-serif;
    letter-spacing: -0.04rem;
    grid-gap: calc(var(--spacing) * 2) var(--spacing);
    margin: 0;
    min-height: 100vh;
    padding: calc( var(--spacing) * 2 );
  }

  :global(*) {
    box-sizing: border-box;
    outline-color: var(--accentColor);
  }

  :global(.screen-reader) {
    border: 0;
    clip: rect(1px, 1px, 1px, 1px);
    clip-path: inset(50%);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
    word-wrap: normal !important;
  }

  :global(button) {
    border: 0;
    color: inherit;
    background-color: transparent;
    appearance: none;
    text-align: inherit;
  }
</style>
