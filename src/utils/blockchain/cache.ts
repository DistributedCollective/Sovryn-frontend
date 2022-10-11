import { CacheCallResponse } from 'app/hooks/useCacheCall';
import { BehaviorSubject, distinctUntilKeyChanged, map, filter } from 'rxjs';
import { Nullable } from 'types';
import { debug } from 'utils/debug';

const log = debug('blockchain:cache');

type SubjectState = {
  pending: boolean;
  timestamp: number;
  ttl: number;
  promise: Promise<any>;
  result: CacheCallResponse;
};

type SubjectMap = {
  [id: string]: SubjectState;
};

type CallOptions = {
  ttl?: number;
  force?: boolean;
};

const INITIAL_STATE: SubjectMap = {};
const DEFAULT_TTL = 1000 * 60 * 2; // 2 minutes

const store = new BehaviorSubject<SubjectMap>(INITIAL_STATE);

export const startCall = <T>(
  id: string,
  promise: () => Promise<T>,
  options?: CallOptions,
) => {
  const state = store.getValue();

  const now = Date.now();
  const ttl = options?.ttl ?? DEFAULT_TTL;

  if (state.hasOwnProperty(id) && state[id].ttl > now && !options?.force) {
    log.log('cache HIT', id);
    return;
  }

  log.log('cache MISS', id);

  const promise$ = promise()
    .then(result => completeCall(id, result, null))
    .catch(error => completeCall(id, null, error));

  store.next({
    ...state,
    [id]: {
      pending: true,
      timestamp: now,
      ttl: now + ttl,
      promise: promise$,
      result: {
        value: null,
        loading: true,
        error: null,
      },
    },
  });
};

export const completeCall = (
  id: string,
  result: Nullable<any>,
  error: Nullable<string>,
) => {
  const state = store.getValue();
  log.log('cache COMPLETE', id);

  if (!state.hasOwnProperty(id)) {
    return;
  }

  const item = state[id];

  store.next({
    ...state,
    [id]: {
      ...item,
      pending: false,
      result: {
        loading: false,
        value: result,
        error,
      },
    },
  });
};

export const observeCall = (id: string) => {
  return store.asObservable().pipe(
    distinctUntilKeyChanged(id),
    map(state => state[id]),
    filter(state => state !== undefined),
  );
};

export const getCall = (id: string) => {
  const state = store.getValue();
  return state[id];
};
