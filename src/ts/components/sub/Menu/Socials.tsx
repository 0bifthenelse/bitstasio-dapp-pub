import React from 'react';
import { useSelector } from 'react-redux';

import menu_data from '../../../utils/menu/menu.json';

function Social(props: SocialProps) {
  return (
    <a href={props.data.url} target="_blank">
      <div className="social">
        <div className="icon"><img src={`/img/socials/${props.data.name.toLowerCase()}.svg`} alt="Icon" /></div>
        <div className="social-wrapper">
          <div className="title">{props.data.name}</div>
          <div className="detail">{props.data.description}</div>
        </div>
      </div>
    </a>
  );
}

export default function Socials() {
  const active = useSelector((state: any) => state.menu.box_active) == "socials";

  function list(): Array<JSX.Element> {
    let list: Array<JSX.Element> = [];

    for (const index in menu_data.socials) {
      const social = menu_data.socials[index];
      const data = {
        name: social.name,
        description: social.description,
        url: social.url
      };

      list.push(
        <Social key={social.name} data={data} />
      );
    }

    return list;
  }

  return (
    <div
      className="menu-content"
      style={{
        opacity: active ? 1 : 0,
        zIndex: active ? 9999 : 0
      }}
    >
      <div className="socials-wrapper">
        {list()}
      </div>
    </div>
  );
}