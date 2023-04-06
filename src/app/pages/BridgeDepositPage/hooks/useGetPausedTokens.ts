import { useMemo } from 'react';
import { babelfishClient } from 'utils/clients';
import { useGetPausedBassetListQuery } from 'utils/graphql/babelfish/generated';

export const useGetPausedTokens = () => {
  const { data } = useGetPausedBassetListQuery({ client: babelfishClient });

  const pausedTokens = useMemo(() => data?.bassets.map(item => item.id) || [], [
    data,
  ]);

  return pausedTokens;
};
