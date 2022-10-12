import { CacheCallResponse } from 'app/hooks/useCacheCall';
import { hashMessage } from 'ethers/lib/utils';
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

export type CacheCallOptions = {
  // time to live in miliseconds
  ttl: number;
  force: boolean;
  // when data expires or needs to be refreshed forcely, show previous successful result while loading
  fallbackToPreviousResult: boolean;
};

const INITIAL_STATE: SubjectMap = {};
const DEFAULT_TTL = 1000 * 60 * 2; // 2 minutes

const store = new BehaviorSubject<SubjectMap>(INITIAL_STATE);

export const startCall = <T>(
  id: string,
  promise: () => Promise<T>,
  options: Partial<CacheCallOptions> = {
    fallbackToPreviousResult: true,
    ttl: DEFAULT_TTL,
    force: false,
  },
) => {
  const state = store.getValue();

  const now = Date.now();

  if (state.hasOwnProperty(id) && state[id].ttl > now && !options.force) {
    log.log('cache HIT', id);
    return;
  }

  log.log('cache MISS', id);

  const promise$ = promise()
    .then(result => {
      completeCall(id, result, null);
      return result;
    })
    .catch(error => {
      completeCall(id, null, error);
      return error;
    });

  let result: CacheCallResponse = {
    value: null,
    loading: true,
    error: null,
  };

  if (options.fallbackToPreviousResult) {
    const cached = state[id];
    if (cached && !cached.result?.error) {
      result = cached.result;
    }
  }

  store.next({
    ...state,
    [id]: {
      pending: true,
      timestamp: now,
      ttl: now + (options?.ttl ?? DEFAULT_TTL),
      promise: promise$,
      result,
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

  store.next({
    ...state,
    [id]: {
      ...state[id],
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

export const idHash = (args: any[]) => {
  const params = args.map(item => item.toString().toLowerCase());
  const json = JSON.stringify(params);
  return hashMessage(json);
};
