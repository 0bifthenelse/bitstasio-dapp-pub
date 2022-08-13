import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {
  update_box_hover
} from '../../../redux/slice/menu';
import menu_data from '../../../utils/menu/menu.json';

import Wallet from './Wallet';

interface PropsContent {
  close: Function;
}

function Product(props: ProductProps) {
  const dispatch = useDispatch();
  const close = props.data.close ? props.data.close() : null;

  return (
    <Link
      to={props.data.active ? props.data.url : "/"}
      className={props.data.active ? "" : "disabled"}
      onClick={() => dispatch(close)}>
      <ListItem key={0} disablePadding>
        <ListItemButton>
          <ListItemIcon>
            {props.data.name}
          </ListItemIcon>
        </ListItemButton>
      </ListItem>
    </Link>
  );
}

function Products(props: { close: Function; }) {
  function list(): Array<JSX.Element> {
    let list: Array<JSX.Element> = [];

    for (const index in menu_data.products) {
      const product = menu_data.products[index];
      const data = {
        name: product.name,
        url: product.url,
        active: product.active,
        description: product.description,
        icon: product.icon,
        close: props.close
      };

      if (data.active) list.push(<Product key={product.name} data={data} />);
    }

    return list;
  }

  return (
    <List>
      {list()}
    </List>
  );
}

function Tool(props: ToolProps) {
  const dispatch = useDispatch();
  const close = props.data.close ? props.data.close() : null;

  return (
    <Link
      to={props.data.active ? props.data.url : "/"}
      className={props.data.active ? "" : "disabled"}
      onClick={() => dispatch(close)}>
      <ListItem key={0} disablePadding>
        <ListItemButton>
          <ListItemIcon>
            {props.data.name}
          </ListItemIcon>
        </ListItemButton>
      </ListItem>
    </Link>
  );
}

function Tools(props: { close: Function; }) {
  function list(): Array<JSX.Element> {
    let list: Array<JSX.Element> = [];

    for (const index in menu_data.tools) {
      const tool = menu_data.tools[index];
      const data = {
        name: tool.name,
        url: tool.url,
        active: tool.active,
        external: tool.external,
        close: props.close
      };

      if (data.active) list.push(<Tool key={tool.name} data={data} />);
    }

    return list;
  }

  return (
    <List>
      {list()}
    </List>
  );
}

function Social(props: SocialProps) {
  const dispatch = useDispatch();
  const close = props.data.close ? props.data.close() : null;

  return (
    <a
      href={props.data.url}
      target="_blank"
      onClick={() => dispatch(close)}>
      <ListItem key={0} disablePadding>
        <ListItemButton>
          <ListItemIcon>
            {props.data.name}
          </ListItemIcon>
        </ListItemButton>
      </ListItem>
    </a>
  );
}

function Socials(props: { close: Function; }) {
  function list(): Array<JSX.Element> {
    let list: Array<JSX.Element> = [];

    for (const index in menu_data.socials) {
      const social = menu_data.socials[index];
      const data = {
        name: social.name,
        description: social.description,
        url: social.url,
        close: props.close
      };

      list.push(<Social key={social.name} data={data} />);
    }

    return list;
  }

  return (
    <List>
      {list()}
    </List>
  );
}

export default function Content_Mobile(props: PropsContent) {
  return (
    <>
      <div className="title-mobile">Wallet</div>
      <Wallet mobile={true} close={props.close} />
      <br />
      <Divider />
      <div className="title-mobile">Products</div>
      <Products close={props.close} />
      <Divider />
      <div className="title-mobile">Tools</div>
      <Tools close={props.close} />
      <Divider />
      <div className="title-mobile">Socials</div>
      <Socials close={props.close} />
    </>
  );
}