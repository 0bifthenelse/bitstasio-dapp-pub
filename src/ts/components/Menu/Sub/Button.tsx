import React from 'react';
import { Link } from 'react-router-dom';

interface Props {
  dist?: boolean;
  svg?: boolean;
  icon: string;
  external: boolean;
  url: string;
  title: string;
  description: string;
}

export default function Button(props: Props) {
  if (props.external) return (
    <a href={props.url} target="_blank">
      <div className="menu-button">
        <Content icon={props.icon} title={props.title} description={props.description} dist={props.dist} svg={props.svg} />
      </div>
    </a>
  ); else return (
    <Link to={props.url}>
      <div className="menu-button">
        <Content icon={props.icon} title={props.title} description={props.description} dist={props.dist} svg={props.svg} />
      </div>
    </Link>
  );
}

function Content(props: { icon: string, title: string, description: string, dist?: boolean, svg?: boolean }) {
  function icon(): JSX.Element {
    if (props.dist || props.svg) return (
      <div className="icon-dist"><img src={props.icon} alt="Icon" /></div>
    ); else return (
      <i className={`icon bi ${props.icon}`} />
    );
  }

  return (
    <div className="content">
      {icon()}
      <div className="title">{props.title}</div>
      <div className="description">{props.description}</div>
    </div>
  );
}