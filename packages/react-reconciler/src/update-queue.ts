import type { Action } from '@plasticine-react/shared'

interface Update<State> {
  action: Action<State>
}

interface UpdateQueue<State> {
  shared: {
    pending: Update<State> | null
  }
}

function createUpdate<State>(action: Action<State>): Update<State> {
  return {
    action,
  }
}

function createUpdateQueue<State>(): UpdateQueue<State> {
  return {
    shared: {
      pending: null,
    },
  }
}

function enqueueUpdate<State>(
  updateQueue: UpdateQueue<State>,
  update: Update<State>,
): void {
  updateQueue.shared.pending = update
}

type ProcessUpdateQueueReturnType<State> = {
  memoizedState: State
}
/**
 * @description 消费一个 Update 对象 -- 将 baseState 交给 Update 消费后返回新的 state
 */
function processUpdateQueue<State>(
  baseState: State,
  pendingUpdate: Update<State> | null,
): ProcessUpdateQueueReturnType<State> {
  const result: ProcessUpdateQueueReturnType<State> = {
    memoizedState: baseState,
  }

  if (pendingUpdate !== null) {
    const action = pendingUpdate.action
    if (action instanceof Function) {
      // baseState -- 1 | update -- (x) => x + 1 --> memoizedState -- 2
      result.memoizedState = action(baseState)
    } else {
      // baseState -- 1 | update -- 6 --> memoizedState -- 6
      result.memoizedState = action
    }
  }

  return result
}

export type { Update, UpdateQueue }

export { createUpdate, createUpdateQueue, enqueueUpdate, processUpdateQueue }
