import { NavLink } from "react-router-dom";

const Menu = () => {
  return (
    <nav>
      <NavLink to="/tabela-kursowa" style={{ marginRight: "10px" }}>
        Tabela kursowa
      </NavLink>
      <NavLink to="/cena-zlota" style={{ marginRight: "10px" }}>
        Cena złota
      </NavLink>
      <NavLink to="/autor">
        Autor
      </NavLink>
    </nav>
  );
};

export default Menu;