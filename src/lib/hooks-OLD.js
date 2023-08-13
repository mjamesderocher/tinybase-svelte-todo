import { readable, writable, derived } from 'svelte/store'

/**
 * 
 * @param { import('tinybase/store').Store } store 
 * @param { import('tinybase/common').Id } tableId 
 * @returns 
 */
export function useTable(store, tableId) {
	const rowIds = readable(store.getTable(tableId), (set) => {
		const listenerId = store.addRowIdsListener(tableId, () => {
			set(store.getTable(tableId))
		})

		return () => store.delListener(listenerId)
	})

	return rowIds
}

/**
 * 
 * @param { import('tinybase/indexes').Indexes } indexes 
 * @param { import('tinybase/common').Id } indexId 
 * @param { import('tinybase/common').Id } sliceId 
 * @returns 
 */
export function useSlice(indexes, indexId, sliceId) {
	const rowIds = readable(indexes.getSliceRowIds(indexId, sliceId), (set) => {
		const listenerId = indexes.addSliceRowIdsListener(indexId, sliceId, () => {
			set(indexes.getSliceRowIds(indexId, sliceId))
		})

		return () => indexes.delListener(listenerId)
	})

  const store = indexes.getStore()

	return derived(rowIds, (rowIds) => Object.fromEntries(
		rowIds.map(rowId => [rowId, useRow(store, 'todos', rowId)])
	))
}

/**
 * 
 * @param { import('tinybase/common').Id } metricId 
 * @param { import('tinybase/metrics').Metrics } metricsOrMetricsId
 **/
export const useMetric = (metricId, metricsOrMetricsId) => readable(metricsOrMetricsId.getMetric(metricId), (set) => {

  const listenerId = metricsOrMetricsId.addMetricListener(metricId, (metrics, id, newMetric) => {
		set(metricsOrMetricsId.getMetric(id) || 0)
	})

	return () => metricsOrMetricsId.delListener(listenerId)
})

/**
 * 
 * @param { import('tinybase/store').Store } store 
 * @param { import('tinybase/common').Id } tableId 
 * @param { import('tinybase/common').Id } rowId 
 * @returns 
 */
export function useRow(store, tableId, rowId) {
	const cellIds = readable(store.getCellIds(tableId, rowId), (set) => {
		const listenerId = store.addCellIdsListener(tableId, rowId, () => {
			set(store.getCellIds(tableId, rowId))
		})

		return () => store.delListener(listenerId)
	})

	return derived(cellIds, (cellIds) => Object.fromEntries(
		cellIds.map(cellId => [cellId, useCell(store, tableId, rowId, cellId)])
	))
}

export useRowIds = () => {
	
}

/**
 * 
 * @param { import('tinybase/store').Store } store 
 * @param { import('tinybase/common').Id } tableId 
 * @param { import('tinybase/common').Id } rowId 
 * @param { import('tinybase/common').Id } cellId 
 */ 
export function useCell(store, tableId, rowId, cellId) {
	let currentValue = store.getCell(tableId, rowId, cellId)

	const sync = (value) => {
		setStore(value)
		currentValue = value
	}

	const set = (value) => {
		sync(value)
		store.setCell(tableId, rowId, cellId, value)
	}

	const update = (fn) => {
		set(fn(currentValue))
	}

	const { set: setStore, subscribe } = writable(currentValue, (_set) => {
		const listenerId = store.addCellListener(
			tableId,
			rowId,
			cellId,
			(_store, _tableId, _rowId, _cellId, newCell) => {
				sync(newCell)
			}
		)

		return () => store.delListener(listenerId)
	})


	return { subscribe, set, update }
}

/**
 * 
 * @param { import('tinybase/common').Id } valueId
 * @param { import('tinybase/store').Store } store 
 */ 
export function useValue(valueId, store) {
  let currentValue = store.getValue(valueId)

  /**
   * If the value is changed through Svelte,
   * sync the value back to Tinybase
   * @param {string} value
   */
  const sync = (value) => {
    setStore(value)
    currentValue = value
  }

  /**
   * 
   * @param {string} value
   */
  const set = (value) => store.setValue(valueId, value)

  const { set: setStore, subscribe } = writable(currentValue, (_set) => {
    const listenerId = store.addValueListener(
      valueId,
      (newCell) => {
        const cellValue = newCell.getValue(valueId)
        sync(cellValue)
      }
    )

    return () => store.delListener(listenerId)
  })

  return { subscribe, set }
}
