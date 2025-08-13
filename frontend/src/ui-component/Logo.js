// assets
import logo from 'assets/images/logo-big.png';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
  return <img src={logo} alt="SwiftShip" width="100" />;
};

export default Logo;
