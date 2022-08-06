import React from 'react';
import { useSelector } from 'react-redux';
import Investment from './Utils/Investment';
import APR from './Utils/APR';
import Days from './Utils/Days';
import Result from './Utils/Result';

export default function Calculator() {
  return (
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
  );
}