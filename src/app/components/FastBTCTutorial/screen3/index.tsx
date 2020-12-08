import React from 'react';

export function Screen3(props) {
  return (
    <>
      <h2 className="mt-3">Transaction Details</h2>
      <p className="m-3">Transaction hash: </p>
      <div className="row m-1">
        <div className="col-6">
          <p>
            From wallet: <br /> address...
          </p>
          <p>
            To wallet: <br /> address...
          </p>
          <p>
            Amount transacted: <br /> amount...
          </p>
          <p>
            Fee: <br /> 1.00 USD
          </p>
        </div>
        <div className="col-6">
          <p>
            Initiated:<span className="float-right">time...</span>
          </p>
          <p>
            Status:<span className="float-right">status...</span>
          </p>
          <p>
            Estimated Time:<span className="float-right">time...</span>
          </p>
        </div>
      </div>
      <div className="create-button text-right position-absolute">
        <button type="button" className="btn">
          <div>Close</div>
        </button>
      </div>
    </>
  );
}
