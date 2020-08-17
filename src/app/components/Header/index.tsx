/**
 *
 * Header
 *
 */
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import logoSvg from 'assets/images/sovryn-logo-white.svg';

interface Props {
  location: string;
}

export function Header(props: Props) {
  const pages = ['Lend', 'Trade', 'Stats', 'FAQs'];

  const pageNavs = pages.map((item, index) => {
    const styles =
      props.location === `/${item}`
        ? 'text-white border-bottom'
        : 'text-customTeal';

    return (
      <li
        key={index}
        className="nav-item list-group-item border-0 text-customTeal bg-transparent font-size-larger"
      >
        <NavLink
          className={'text-decoration-none nav-link ' + styles}
          to={`/${item}`}
        >
          <h4>{item}</h4>
        </NavLink>
      </li>
    );
  });

  return (
    <header className="mb-2 shadow d-flex">
      <div className="container">
        <nav className="navbar navbar-expand-lg px-0">
          <Link to="/">
            <img className="navbar-brand" src={logoSvg} alt="Logo" />
          </Link>
          <button
            className="navbar-toggler custom-toggler navbar-dark "
            type="button"
            data-toggle="collapse"
            data-target="#navbar-collaps"
          >
            <span className="navbar-toggler-icon custom-toggler"></span>
          </button>

          <div className="collapse navbar-collapse w-100 " id="navbar-collaps">
            <ul className="nav navbar-nav list-unstyled list-group list-group-horizontal w-100 flex-row-reverse">
              {pageNavs}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}
