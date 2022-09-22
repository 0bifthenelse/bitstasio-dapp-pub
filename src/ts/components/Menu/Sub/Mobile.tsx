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
      <div className="title">Products</div>
      <Products close={props.close} />
      <Divider />
      <div className="title">Socials</div>
      <Socials close={props.close} />
      <Divider />
      <div className="title">More</div>
      <Tools close={props.close} />
    </div>
  );
}

function Product(props: ProductProps) {
  const dispatch = useDispatch();
  const close = props.data.close ? props.data.close() : null;

  return (
    <Link
      to={props.data.url}
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

  if (props.data.external) return (
    <a
      href={props.data.url}
      className={props.data.active ? "" : "disabled"}
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

  else return (
    <Link
      to={props.data.url}
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

    for (const index in menu_data.more) {
      const tool = menu_data.more[index];
      const data = {
        name: tool.name,
        url: tool.url,
        active: tool.active,
        external: tool.external,
        close: props.close
      };

      if (data.active) list.push(<Tool key={tool.order} data={data} />);
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