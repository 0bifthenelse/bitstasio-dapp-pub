import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  update_box_hover
} from '../../../redux/slice/menu';

import Wallet from './Wallet';
import Products from './Products';
import Socials from './Socials';

export default function Content_Large() {
  const dispatch = useDispatch();
  const box_visible: boolean = useSelector((state: any) => state.menu.box_visible);
  const position = useSelector((state: any) => state.menu.box_position);
  const dimensions = useSelector((state: any) => state.menu.box_dimensions);

  return (
    <div
      className="menu-box"
      style={{
        transform: `
        scale(${box_visible ? 1 : 0})
        `
      }}
    >
      <div
        className="arrow"
        style={{
          left: (position.left ?? 0) + 50
        }}
      ></div>
      <div
        className="content"
        onMouseEnter={() => dispatch(update_box_hover(true))}
        onMouseLeave={() => dispatch(update_box_hover(false))}
        style={{
          width: dimensions.width,
          height: dimensions.height,
          minHeight: dimensions.height
        }}>

        <Wallet />
        <Products />
        <Socials />
      </div>
    </div>
  );
}