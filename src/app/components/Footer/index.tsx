/**
 *
 * Footer
 *
 */
import React, { useEffect, useState } from 'react';

export function Footer() {
  const [hasMatomo, setHasMatomo] = useState(false);

  useEffect(() => {
    setHasMatomo(window.hasOwnProperty('Matomo'));
  }, []);

  return (
    <footer className="mt-3">
      <div className="container py-3">
        <div className="d-flex flex-row justify-content-between align-items-center text-lightGrey">
          <h6>
            Powered by <strong>Bitcoin</strong>
          </h6>
        </div>
        {hasMatomo && (
          <div className="d-flex flex-row justify-content-between align-items-center text-lightGrey mt-5">
            <iframe
              title="MatomoOptout"
              style={{ width: '100%', border: 'none', marginLeft: '-5px' }}
              src="https://sovrynapp.matomo.cloud/index.php?module=CoreAdminHome&action=optOut&language=en&backgroundColor=171717&fontColor=ffffff&fontSize=14px&fontFamily=system-ui"
            />
          </div>
        )}
      </div>
    </footer>
  );
}
