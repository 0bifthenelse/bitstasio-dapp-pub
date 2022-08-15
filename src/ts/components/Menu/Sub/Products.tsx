import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import menu_data from 'utils/menu/menu.json';
import store from 'store';
import {
  reset_box_active
} from 'slice/menu';
import { get_url } from 'utils/referral';

function Product(props: ProductProps) {
  const dispatch = useDispatch();

  return (
    <Link to={props.data.active ? get_url(props.data.url) : "/"} className={props.data.active ? "" : "disabled"} onClick={() => props.data.active ? dispatch(reset_box_active()) : null}>
      <div className="product">
        <div className="product-wrap">
          <div className="icon"><i className={`bi ${props.data.icon}`}></i></div>
          <div className="content-wrap">
            <div className="title">{props.data.name}</div>
            <div className="description">{props.data.description}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function Tool(props: ToolProps) {
  if (props.data.external) return (
    <a href={props.data.url} target="_blank" onClick={() => store.dispatch(reset_box_active())}><div className="link"><ArrowRightIcon /> {props.data.name}</div></a>
  );
  else return (
    <Link className="link-tool" to={get_url(props.data.url)} onClick={() => store.dispatch(reset_box_active())}><div className="link"><ArrowRightIcon /> {props.data.name}</div></Link>
  );
}

function Tools() {
  function list(): Array<JSX.Element> {
    let list: Array<JSX.Element> = [];

    for (const index in menu_data.tools) {
      const tool = menu_data.tools[index];
      const data = {
        name: tool.name,
        external: tool.external,
        url: tool.url,
        active: tool.active
      };

      if (data.active) list.push(<Tool key={tool.name} data={data} />);
    }

    return list;
  }

  return (
    <>
      <div className="title">More</div>
      {list()}
    </>
  );
}

export default function Products() {
  const active = useSelector((state: any) => state.menu.box_active) == "products";

  function list(): Array<JSX.Element> {
    let list: Array<JSX.Element> = [];

    for (const index in menu_data.products) {
      const product = menu_data.products[index];
      const data = {
        name: product.name,
        url: product.url,
        active: product.active,
        description: product.description,
        icon: product.icon
      };

      if (data.active) list.push(<Product key={product.name} data={data} />);
    }

    return list;
  }

  return (
    <div
      className="content"
      style={{
        opacity: active ? 1 : 0,
        zIndex: active ? 9999 : 0
      }}
    >
      <div className="products">
        <div className="left">
          {list()}
        </div>
        <div className="right">
          <Tools />
        </div>
      </div>
    </div>
  );
}