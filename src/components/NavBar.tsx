import IconBtn from "./IconBtn";

interface NavBarTools {
  onSettingsClick: () => void;
}

function NavBar({ onSettingsClick }: NavBarTools) {
  return (
    <nav className="navbar navbar-expand-md align-items-end">
      <a className="navbar-brand px-3 py-2 rounded-4" id="titleBrand" href="">
        <span className="h1">BFDIweather</span>
      </a>
      <IconBtn color="dark" onClick={onSettingsClick}>
        settings
      </IconBtn>
    </nav>
  );
}

export default NavBar;
