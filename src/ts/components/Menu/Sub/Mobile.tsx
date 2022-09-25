import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import menu_data from 'utils/menu/menu.json';

import * as data from 'utils/data';

import Hamburger from './Hamburger';

interface PropsContent {
  close: Function;
}

export default function Mobile() {
  const [state, setState] = React.useState({
    top: false
  });

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, ["top"]: open });
  };

  return (
    <div>
      <React.Fragment key={'top'}>
        <Hamburger open={toggleDrawer} />
        <Drawer
          sx={{
            zIndex: 99999999
          }}
          anchor={'top'}
          open={state['top']}
          onClose={toggleDrawer(false)}
        >
          <div className="close-mobile">
            <IconButton color="primary" aria-label="Close menu" onClick={toggleDrawer(false)}>
              <CloseIcon sx={{ fontSize: 25, color: "white" }} />
            </IconButton>
          </div>
          <Content close={toggleDrawer} />
        </Drawer>
      </React.Fragment>
    </div>
  );
}

function Content(props: PropsContent) {
  return (
    <div className="mobile">
      <div className="title">Finance</div>
      <Finance close={props.close} />
      <Divider />
      <div className="title">Games</div>
      <Games close={props.close} />
      <Divider />
      <div className="title">Socials</div>
      <Socials close={props.close} />
      <Divider />
      <div className="title">More</div>
      <More close={props.close} />
    </div>
  );
}

function Finance(props: { close: Function; }) {
  function list(): Array<JSX.Element> {
    let list: Array<JSX.Element> = [];
    const array = data.get_array_sorted_by_order(menu_data.finance);
    const dispatch = useDispatch();

    for (const index in array) {
      const finance = array[index];

      if (finance.active) list.push(
        <Link
          to={finance.url}
          key={finance.order}
          onClick={() => dispatch(props.close())}>
          <ListItem key={0} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {finance.name}
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        </Link>
      );
    }

    return list;
  }

  return (
    <List>
      {list()}
    </List>
  );
}

function Games(props: { close: Function; }) {
  function list(): Array<JSX.Element> {
    let list: Array<JSX.Element> = [];
    const array = data.get_array_sorted_by_order(menu_data.games);
    const dispatch = useDispatch();

    for (const index in array) {
      const game = array[index];

      if (game.active) list.push(
        <Link
          to={game.url}
          key={game.order}
          onClick={() => dispatch(props.close())}>
          <ListItem key={0} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {game.name}
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        </Link>
      );
    }

    return list;
  }

  return (
    <List>
      {list()}
    </List>
  );
}

function More(props: { close: Function; }) {
  const dispatch = useDispatch();

  function list(): Array<JSX.Element> {
    let list: Array<JSX.Element> = [];
    const array = data.get_array_sorted_by_order(menu_data.more);

    for (const index in array) {
      const more = array[index];

      if (more.active) {
        if (more.external) list.push(
          <a
            href={more.url}
            key={more.order}
            target="_blank"
            onClick={() => dispatch(props.close())}>
            <ListItem key={0} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {more.name}
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          </a>
        );
        else list.push(
          <Link
            to={more.url}
            key={more.order}
            onClick={() => dispatch(props.close())}>
            <ListItem key={0} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {more.name}
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          </Link>
        );
      }

    }

    return list;
  }

  return (
    <List>
      {list()}
    </List>
  );
}

function Socials(props: { close: Function; }) {
  const dispatch = useDispatch();
  function list(): Array<JSX.Element> {
    let list: Array<JSX.Element> = [];

    const array = data.get_array_sorted_by_order(menu_data.socials);

    for (const index in array) {
      const social = array[index];

      list.push(
        <a
          href={social.url}
          key={social.order}
          target="_blank"
          onClick={() => dispatch(props.close())}>
          <ListItem key={0} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {social.name}
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        </a>
      );
    }

    return list;
  }

  return (
    <List>
      {list()}
    </List>
  );
}