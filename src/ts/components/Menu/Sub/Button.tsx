import React from 'react';
import { Link } from 'react-router-dom';

interface Props {
  dist?: boolean;
  svg?: boolean;
  icon: string;
  external: boolean;
  url: string;
  title: string;
  description?: string;
}

export default function Button(props: Props) {
  const className = props.description ? "menu-button" : "menu-button menu-button-no-description";
  if (props.external) return (
    <a href={props.url} target="_blank">
      <div className={className}>
        <Content icon={props.icon} title={props.title} description={props.description} dist={props.dist} svg={props.svg} />
      </div>
    </a>
  ); else return (
    <Link to={props.url}>
      <div className={className}>
        <Content icon={props.icon} title={props.title} description={props.description} dist={props.dist} svg={props.svg} />
      </div>
    </Link>
  );
}

function Content(props: { icon: string, title: string, description?: string, dist?: boolean, svg?: boolean; }) {
  function icon(): JSX.Element {
    if (props.dist || props.svg) return (
      <div className="icon-dist"><img src={props.icon} alt="Icon" /></div>
    );

    return (
      <i className={`icon bi ${props.icon}`} />
    );
  }

  return (
    <div className="content">
      {icon()}
      <div className="title">{props.title}</div>
      {props.description &&
        <div className="description">{props.description}</div>
      }
    </div>
  );
}