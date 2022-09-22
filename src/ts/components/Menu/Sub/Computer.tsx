import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import menu_data from 'utils/menu/menu.json';
import Button from './Button';


export default function Computer() {
  return (
    <div className="computer">
      <Category name="Products" component={<Products />} />
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

function Products() {
  function list(): Array<JSX.Element> {
    let list: Array<JSX.Element> = [];

    for (const index in menu_data.products) {
      const product = menu_data.products[index];

      if (product.active) list.push(
        <Button
          key={product.order}
          icon={product.icon}
          external={false}
          url={product.url}
          title={product.name}
          description={product.description}
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

    for (const index in menu_data.more) {
      const more = menu_data.more[index];
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

    for (const index in menu_data.socials) {
      const social = menu_data.socials[index];
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