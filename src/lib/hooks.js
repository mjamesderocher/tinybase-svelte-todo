import { writable, derived } from 'svelte/store'

/**
 * @param { * } thing
 * @returns { string }
 */
export const getTypeOf = (thing) => typeof thing

/**
 * 
 * @param { * } thing 
 * @returns { boolean }
 */
export const isUndefined = (thing) => thing == undefined

/**
 * 
 * @param { Value | undefined } value 
 * @param { (value: Value) => * } then 
 * @param { () => * } [otherwise] 
 * @returns { * | undefined }
 */
export const ifNotUndefined = (
  value,
  then,
  otherwise,
) => (isUndefined(value) ? otherwise?.() : then(value))

/**
 * 
 * @param { * } thing 
 * @returns { boolean }
 */
export const isString = (thing) => getTypeOf(thing) == STRING

/**
 * 
 * @param { *[] } array 
 * @returns { number }
 */
export const arrayLength = (array) => array.length

/**
 * 
 * @param {*[]} array 
 * @returns { boolean }
 */
export const arrayIsEmpty = (array) =>
  arrayLength(array) == 0

export const TINYBASE = 'tinybase';
export const EMPTY_STRING = '';
export const COMMA = ',';

export const STRING = getTypeOf(EMPTY_STRING);
export const BOOLEAN = getTypeOf(true);
export const NUMBER = getTypeOf(0);
export const FUNCTION = getTypeOf(getTypeOf);

export const TYPE = 'type';
export const DEFAULT = 'default';

export const UTF8 = 'utf8';

export const SUM = 'sum';
export const AVG = 'avg';
export const MIN = 'min';
export const MAX = 'max';

export const LISTENER = 'Listener';
export const RESULT = 'Result';
export const GET = 'get';
export const SET = 'set';
export const ADD = 'add';

export const IDS = 'Ids';
export const TABLE = 'Table';
export const TABLES = TABLE + 's';
export const TABLE_IDS = TABLE + IDS;
export const ROW = 'Row';
export const ROW_IDS = ROW + IDS;
export const SORTED_ROW_IDS = 'Sorted' + ROW + IDS;
export const CELL = 'Cell';
export const CELL_IDS = CELL + IDS;
export const VALUE = 'Value';
export const VALUES = VALUE + 's';
export const VALUE_IDS = VALUE + IDS;
/**
 * @typedef { import('tinybase/common').IdOrNull | boolean | number | undefined } ListenerArgument
 * @typedef { import('tinybase/common').Id } Id
 * @typedef { import('tinybase/common').Ids } Ids
 * @typedef { import('tinybase/store').Store } Store
 * @typedef { import('tinybase/store').Cell } Cell
 * @typedef { import('tinybase/store').Value } Value
 * @typedef { import('tinybase/indexes').Index } Index
 * @typedef { import('tinybase/indexes').Indexes } Indexes
 * @typedef { import('tinybase/metrics').Metrics } Metrics
 * @typedef { import('tinybase/checkpoints').Checkpoints } Checkpoints
 * @typedef { import('tinybase/checkpoints').CheckpointIds } CheckpointIds
 * @typedef { import('tinybase/common').Callback } Callback
 * @typedef { Store 
 * 						| Metrics 
 * 						| Indexes 
 * 						| import('tinybase/relationships').Relationships 
 * 						| import('tinybase/queries').Queries 
 * 						| Checkpoints } Thing
 * @typedef { Store | Id } StoreOrStoreId
 * @typedef { Index | Id } IndexesOrIndexesId
 * @typedef { Metrics | Id } MetricsOrMetricsId
 * @typedef { Checkpoints | Id } CheckpointsOrCheckpointsId
 * @typedef { [boolean, Callback, Id | undefined, string] } UndoOrRedoInformation
 */

/**
 * 
 * @param {string} listenable 
 * @param {*} thing 
 * @param {*} defaulted 
 * @param { ListenerArgument[] } [args]
 * @param {number} [getFromListenerArg] 
 * @returns { any }
 */
export const useListenable = (
	listenable, // internal & stable
  thing,
  defaulted, // internal & stable
  args,
  getFromListenerArg,
) => {
  const getResult = () => thing?.[GET + listenable]?.(...args) ?? defaulted
  const setValue = (v) => thing?.[SET + listenable]?.(...args, v) ?? defaulted
  let initialResult = getResult()

  const sync = (value) => {
		setStore(value)
		initialResult = value
	}

	const set = (value) => {
    setValue(value)
		sync(value)
	}

	const update = (fn) => {
		set(fn(initialResult))
	}

  const { set: setStore, subscribe } = writable(initialResult, (_set) => {
  //const listener = readable(initialResult, (set) => {
		const listenerId = thing?.[ADD + listenable + LISTENER]?.(
      ...args,
      () => {
        sync(getResult())
      },
    )

		return () => thing?.delListener(listenerId)
	})

  return { subscribe, set, update }
}

/**
 * 
 * @param { Id } metricId 
 * @param { MetricsOrMetricsId } [metricsOrMetricsId] 
 * @returns { number | undefined }
 */
export const useMetric = (
  metricId,
  metricsOrMetricsId,
) =>
  useListenable(
    'Metric',
    useMetricsOrMetricsId(metricsOrMetricsId),
    undefined,
    [metricId],
  )

/**
 * 
 * @param { Id } indexId 
 * @param { Id } sliceId
 * @param { IndexesOrIndexesId } [indexesOrIndexesId]
 * @returns { Ids }
 */
export const useSliceRowIds = (
  indexId,
  sliceId,
  indexesOrIndexesId,
) =>
  useListenable(
    'SliceRowIds',
    useIndexesOrIndexesId(indexesOrIndexesId),
    [],
    [indexId, sliceId],
  )

/**
 * 
 * @param { Id } valueId 
 * @param { StoreOrStoreId } [storeOrStoreId] 
 * @returns { Value }
 */
export const useValue = (
  valueId,
  storeOrStoreId,
) =>
  useListenable(VALUE, useStoreOrStoreId(storeOrStoreId), undefined, [valueId])

/**
 * 
 * @param { CheckpointsOrCheckpointsId } [checkpointsOrCheckpointsId] 
 * @returns { Callback }
 */
export const useGoBackwardCallback = (
  checkpointsOrCheckpointsId,
) => useCheckpointAction(checkpointsOrCheckpointsId, 'goBackward')

/**
 * 
 * @param { CheckpointsOrCheckpointsId } [checkpointsOrCheckpointsId] 
 * @returns { Callback }
 */
export const useGoForwardCallback = (
  checkpointsOrCheckpointsId,
) => useCheckpointAction(checkpointsOrCheckpointsId, 'goForward')

/**
 * 
 * @param { CheckpointsOrCheckpointsId | undefined } checkpointsOrCheckpointsId 
 * @param { string } action 
 * @param { string } [arg] 
 * @returns 
 */
const useCheckpointAction = (
  checkpointsOrCheckpointsId,
  action,
  arg,
) => {
  const checkpoints = useCheckpointsOrCheckpointsId(
    checkpointsOrCheckpointsId,
  )
  return () => checkpoints?.[action](arg)
}

/**
 * 
 * @param { CheckpointsOrCheckpointsId } [checkpointsOrCheckpointsId]
 * @returns { UndoOrRedoInformation }
 */
export const useUndoInformation = (
  checkpointsOrCheckpointsId,
) => {
  const checkpoints = useCheckpointsOrCheckpointsId(checkpointsOrCheckpointsId)
  const checkpointIds = useCheckpointIds(checkpoints)
  const undoInformation = derived(checkpointIds, (checkpointIds)=> {
    const [backwardIds, currentId] = checkpointIds
    return [
      !arrayIsEmpty(backwardIds),
      useGoBackwardCallback(checkpoints),
      currentId,
      ifNotUndefined(currentId, (id) => checkpoints?.getCheckpoint(id)) ??
        EMPTY_STRING,
    ]
  })

  return undoInformation
}

/**
 * 
 * @param { CheckpointsOrCheckpointsId } [checkpointsOrCheckpointsId] 
 * @returns { UndoOrRedoInformation }
 */
export const useRedoInformation = (
  checkpointsOrCheckpointsId,
) => {
  const checkpoints = useCheckpointsOrCheckpointsId(checkpointsOrCheckpointsId)
  const checkpointIds = useCheckpointIds(checkpoints)
  const redoInformation = derived(checkpointIds, (checkpointIds)=> {
    const [, , [forwardId]] = checkpointIds
    return [
      !isUndefined(forwardId),
      useGoForwardCallback(checkpoints),
      forwardId,
      ifNotUndefined(forwardId, (id) => checkpoints?.getCheckpoint(id)) ??
        EMPTY_STRING,
    ]
  })

  return redoInformation
}

/**
 * 
 * @param { CheckpointsOrCheckpointsId } [checkpointsOrCheckpointsId] 
 * @returns { CheckpointIds }
 */
export const useCheckpointIds = (
  checkpointsOrCheckpointsId,
) =>
  useListenable(
    'CheckpointIds',
    useCheckpointsOrCheckpointsId(checkpointsOrCheckpointsId),
    [[], undefined, []],
    []
  )

/**
 * 
 * @param { Id } tableId 
 * @param { Id } rowId 
 * @param { Id } cellId 
 * @param { StoreOrStoreId } [storeOrStoreId] 
 * @returns { Cell | undefined }
 */
export const useCell = (
  tableId,
  rowId,
  cellId,
  storeOrStoreId,
) =>
  useListenable(
    CELL,
    useStoreOrStoreId(storeOrStoreId),
    undefined,
    [tableId, rowId, cellId],
    // @todo Need to figure out what this does and implement it...
    4,
  )


/**
 * 
 * @param { Id } tableId 
 * @param { StoreOrStoreId } [storeOrStoreId]
 * @returns { Ids }
 */
export const useRowIds = (
  tableId,
  storeOrStoreId,
) => useListenable(ROW_IDS, useStoreOrStoreId(storeOrStoreId), [], [tableId])

/**
 * 
 * @param { Id } indexId 
 * @param { IndexesOrIndexesId } [indexesOrIndexesId]
 * @returns { Ids }
 */
export const useSliceIds = (
  indexId,
  indexesOrIndexesId,
) =>
  useListenable(
    'SliceIds',
    useIndexesOrIndexesId(indexesOrIndexesId),
    [],
    [indexId],
  )

/**
 * 
 * @param { StoreOrStoreId } [storeOrStoreId]
 * @returns { Store | undefined }
 */
export const useStoreOrStoreId = (
	storeOrStoreId
) => useThingOrThingId(storeOrStoreId, 0)

/**
 * 
 * @param { MetricsOrMetricsId } metricsOrMetricsId 
 * @returns { Metrics | undefined }
 */
export const useMetricsOrMetricsId = (
  metricsOrMetricsId,
) => useThingOrThingId(metricsOrMetricsId, 2)

/**
 * 
 * @param { CheckpointsOrCheckpointsId } [checkpointsOrCheckpointsId] 
 * @returns { Checkpoints | undefined }
 */
export const useCheckpointsOrCheckpointsId = (
  checkpointsOrCheckpointsId,
) => useThingOrThingId(checkpointsOrCheckpointsId, 10)

/**
 * 
 * @param { IndexesOrIndexesId } [indexesOrIndexesId]
 * @returns { Indexes | undefined }
 */
export const useIndexesOrIndexesId = (
  indexesOrIndexesId,
) => useThingOrThingId(indexesOrIndexesId, 4);

/**
 * 
 * @param { Thing | Id | undefined } thingOrThingId
 * @param { number } offset
 * @returns { Thing | undefined } 
 */
export const useThingOrThingId = (
	thingOrThingId,
	offset
) => {
	const thing = useThing(thingOrThingId, offset)
  return isUndefined(thingOrThingId) || isString(thingOrThingId) 
		? (thing)
    : (thingOrThingId)
}

/**
 * 
 * @param { Thing | Id | undefined } id 
 * @param { number } offset 
 * @returns { Thing | undefined }
 */
export const useThing = (
	id,
  offset,
) => {
	//const contextValue = useContext(Context);
  return (
    id
    //isUndefined(id)
      // ? contextValue[offset]
      // : isString(id)
      // ? objGet(contextValue[offset + 1] as IdObj<Thing>, id)
      // : id
  ) 
}

