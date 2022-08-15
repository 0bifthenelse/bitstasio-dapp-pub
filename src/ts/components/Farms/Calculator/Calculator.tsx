import React from 'react';
import Investment from './Sub/Investment';
import APR from './Sub/APR';
import Days from './Sub/Days';
import Result from './Sub/Result';

export default function Calculator() {
  return (
    <div className="farms">
      <div className="calculator">
        <div className="row">
          <div className="col-xxl-6 col-sm-12">
            <Investment />
            <APR />
            <Days />
          </div>
          <div className="col-xxl-6 col-sm-12">
            <Result />
          </div>
        </div>
      </div>
    </div>
  );
}