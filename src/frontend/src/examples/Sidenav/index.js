import { useEffect } from "react";
import { useLocation, NavLink } from "react-router-dom";
import PropTypes from "prop-types";

import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import SidenavCollapse from "examples/Sidenav/SidenavCollapse";
import SidenavRoot from "examples/Sidenav/SidenavRoot";
import sidenavLogoLabel from "examples/Sidenav/styles/sidenav";

import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from "context";

function Sidenav({ color, brand, brandName, routes, ...rest }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller;
  const location = useLocation();
  const collapseName = location.pathname.replace("/", "");

  let textColor = "white";

  if (transparentSidenav || (whiteSidenav && !darkMode)) textColor = "dark";
  else if (whiteSidenav && darkMode) textColor = "inherit";

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  useEffect(() => {
    const handleMiniSidenav = () => {
      const isMini = window.innerWidth < 1200;

      if (miniSidenav !== isMini) setMiniSidenav(dispatch, isMini);
      if (transparentSidenav !== !isMini) setTransparentSidenav(dispatch, !isMini);
      if (whiteSidenav !== !isMini) setWhiteSidenav(dispatch, !isMini);
    };

    window.addEventListener("resize", handleMiniSidenav);
    handleMiniSidenav();

    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, miniSidenav, transparentSidenav, whiteSidenav]);

  const renderNavItems = (filterType) =>
    routes.map(({ type, name, icon, title, noCollapse, key, href, route }) => {
      if (type !== filterType) return null;

      const commonProps = {
        name,
        icon,
        active: key === collapseName,
        noCollapse,
      };

      return href ? (
        <Link key={key} href={href} target="_blank" rel="noreferrer" sx={{ textDecoration: "none" }}>
          <SidenavCollapse {...commonProps} />
        </Link>
      ) : (
        <NavLink key={key} to={route}>
          <SidenavCollapse {...commonProps} />
        </NavLink>
      );
    }).filter(Boolean);

  return (
    <SidenavRoot {...rest} variant="permanent" ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}>
      <MDBox pt={3} pb={1} px={4} textAlign="center">
        <MDBox
          display={{ xs: "block", xl: "none" }}
          position="absolute"
          top={0}
          right={0}
          p={1.625}
          onClick={closeSidenav}
          sx={{ cursor: "pointer" }}
        >
          <Icon sx={{ fontWeight: "bold" }}>close</Icon>
        </MDBox>
        <MDBox component={NavLink} to="/" display="flex" alignItems="center">
          {brand && <MDBox component="img" src={brand} alt="Brand" width="2rem" />}
          <MDBox width={!brandName && "100%"} sx={(theme) => sidenavLogoLabel(theme, { miniSidenav })}>
            <MDTypography component="h6" variant="button" fontWeight="medium" color={textColor}>
              {brandName}
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>

      <Divider light={!darkMode || (darkMode && whiteSidenav)} />

      <List>
        <MDBox display="flex" flexDirection="column" alignItems="center">
          <MDTypography color={textColor} variant="body2" fontWeight="medium" pl="1.5rem">
            Examples
          </MDTypography>
          {renderNavItems("examples")}
        </MDBox>

        <Divider light={!darkMode || (darkMode && whiteSidenav)} />

        {renderNavItems("collapse")}
      </List>

      <MDBox p={2} mt="auto">
        <MDButton
          component="a"
          href="https://www.creative-tim.com/product/material-dashboard-pro-react-nodejs"
          target="_blank"
          rel="noreferrer"
          variant="gradient"
          color={sidenavColor}
          fullWidth
        >
          Upgrade to Pro
        </MDButton>
      </MDBox>
    </SidenavRoot>
  );
}

Sidenav.defaultProps = {
  color: "info",
  brand: "",
};

Sidenav.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
