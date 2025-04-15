<header className={classes.header}>
  <nav className={classes.navContainer}>
    <div>
      <img className={classes.logo} src={Avatar1} />
    </div>
    <div className={classes.listContainer}>
      <ul className={classes.list}>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? classes.active : undefined
            }
            end
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/coaching"
            className={({ isActive }) =>
              isActive ? classes.active : undefined
            }
          >
            Coaching
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/yoga"
            className={({ isActive }) =>
              isActive ? classes.active : undefined
            }
          >
            Yoga
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? classes.active : undefined
            }
          >
            About
          </NavLink>
        </li>
        <BookingSignup />
      </ul>
    </div>
  </nav>
</header>;
