import React, { useState } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import menu_data from 'utils/menu/menu.json';
import Button from './Button';

import * as data from 'utils/data';

export default function Computer() {
  return (
    <div className="computer">
      <Category name="Finance" component={<Finance />} />
      <Category name="Games" component={<Games />} />
      <Category name="Socials" component={<Socials />} />
      <Category name="More" component={<More />} />
    </div>
  );
}

function Category(props: { name: string, component: JSX.Element; }) {
  const [hover, setHover] = useState(false);
  const [hoverDD, setHoverDD] = useState(false);

  const active = hover || hoverDD;

  return (
    <div
      className="category"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseDown={() => setHover(!hover)}
    >
      {props.name}

      <Arrow active={active} />
      <Dropdown active={active} width={200} height={400} component={props.component} setHoverDD={setHoverDD} />
    </div>
  );
}

function Arrow(props: { active: boolean; }) {
  return (
    <div className="arrow">
      <ArrowDropDownIcon
        className="arrow-icon"
        sx={{
          transform: props.active ? "rotate(180deg)" : "rotate(0deg)"
        }}
      />
    </div>
  );
}

function Dropdown(props: { active: boolean, width: number, height: number, component: JSX.Element, setHoverDD: Function; }) {
  return (
    <div
      className="dropdown"
      onMouseEnter={() => props.setHoverDD(true)}
      onMouseLeave={() => props.setHoverDD(false)}
      style={{
        display: props.active ? "block" : "none"
      }}
    >
      <div className="wrap">
        {props.component}
      </div>
    </div>
  );
}

function Finance() {
  function list(): Array<JSX.Element> {
    let list: Array<JSX.Element> = [];
    const array = data.get_array_sorted_by_order(menu_data.finance);

    for (const index in array) {
      const finance = array[index];

      if (finance.active) list.push(
        <Button
          key={finance.order}
          icon={finance.icon}
          external={false}
          url={finance.url}
          title={finance.name}
          description={finance.description}
        />
      );
    }

    return list;
  }

  return (
    <div className="products">
      {list()}
    </div>
  );
}

function Games() {
  function list(): Array<JSX.Element> {
    let list: Array<JSX.Element> = [];

    for (const index in menu_data.games) {
      const game = menu_data.games[index];

      if (game.active) list.push(
        <Button
          key={game.order}
          icon={game.icon}
          external={false}
          url={game.url}
          title={game.name}
          description={game.description}
        />
      );
    }

    return list;
  }

  return (
    <div className="products">
      {list()}
    </div>
  );
}

function More() {
  function list(): Array<JSX.Element> {
    let list: Array<JSX.Element> = [];
    const array = data.get_array_sorted_by_order(menu_data.more);

    for (const index in array) {
      const more = array[index];
      const icon = more.svg ? `/img/links/${more.name.toLowerCase()}.svg` : more.icon;

      if (more.active) list.push(
        <Button
          key={more.order}
          icon={icon}
          external={more.external}
          svg={more.svg}
          url={more.url}
          title={more.name}
          description={more.description}
        />
      );
    }

    return list;
  }

  return (
    <div className="more">
      {list()}
    </div>
  );
}

function Socials() {
  function list(): Array<JSX.Element> {
    let list: Array<JSX.Element> = [];
    const array = data.get_array_sorted_by_order(menu_data.socials);

    for (const index in array) {
      const social = array[index];
      const icon = `/img/socials/${social.name.toLowerCase()}.svg`;

      list.push(
        <Button
          key={social.order}
          icon={icon}
          dist={true}
          external={true}
          url={social.url}
          title={social.name}
          description={social.description}
        />
      );
    }

    return list;
  }

  return (
    <div className="socials">
      {list()}
    </div>
  );
}