import React, { useEffect, useState } from 'react';
import { contractReader } from '../../../utils/sovryn/contract-reader';

type Props = {
  tokenId: string;
};

const urlCreator = window.URL || window.webkitURL;

const SovNftToken: React.FC<Props> = ({ tokenId }) => {
  const [name, setName] = useState<string>(null!);
  const [image, setImage] = useState<string>(null!);

  useEffect(() => {
    const abortController = new AbortController();
    let tempObjectUrl: string;
    async function run() {
      const tokenUri = await contractReader.call<string>(
        'sovrynNFT',
        'tokenURI',
        [tokenId],
      );
      if (tokenUri) {
        const metadata = await fetch(tokenUri, {
          signal: abortController.signal,
        }).then(response => response.json());
        if (metadata?.name) {
          setName(metadata.name);
        }
        if (metadata?.image) {
          const blob = await fetch(metadata.image).then(response =>
            response.blob(),
          );
          tempObjectUrl = urlCreator.createObjectURL(blob);
          setImage(tempObjectUrl);
        }
      }
    }

    run().catch();

    return () => {
      if (abortController) {
        abortController.abort();
      }

      if (tempObjectUrl) {
        urlCreator.revokeObjectURL(tempObjectUrl);
      }
    };
  }, [tokenId]);

  if (!image) {
    return null;
  }

  return (
    <>
      <div className="md:tw-mr-5 sm:tw-mb-5 tw-mb-12 tw-ml-4 tw-mr-4 tw-relative tw-inline-block">
        <div className="image-bordered">
          <img
            src={image}
            alt={name || `SovNFT #${tokenId}`}
            title={name || `SovNFT #${tokenId}`}
          />
        </div>
      </div>
    </>
  );
};

export default SovNftToken;
