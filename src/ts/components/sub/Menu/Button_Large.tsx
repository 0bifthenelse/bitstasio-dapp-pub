import React from 'react';
import {
  update_position,
  update_box_active
} from '../../../redux/slice/menu';
import store from '../../../redux/store';

import {
  menu_routine
} from '../../../constants';

interface Props {
  menu: string;
  text: string;
}

export default function Button_Large(props: Props) {
  return (
    <span className="link" ref={el => {
      if (!el) return;


      setInterval(() => {
        const data = el.getBoundingClientRect();

        store.dispatch(update_position({
          menu: props.menu,
          position: {
            top: data.top,
            left: data.left
          }
        }));

      }, menu_routine);
    }}
      onMouseEnter={() => store.dispatch(update_box_active(props.menu))}
    >
      {props.text}
    </span>
  );
}