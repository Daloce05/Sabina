const UserDropDown = () => {
  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        <div className="w-10 rounded-full">
          <img
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            alt="avatar"
          />
        </div>
      </div>
      <ul tabIndex={0} 
      className=" menu menu-sm dropdown-content bg-base-100 rounded-box
       z-1 w-52 mt-3 p-2 shadow"
       >
        <li> 
            <a className=" justify-between"> 
                perfil
                <span className="badge "> nuevo</span>

            </a>
        </li>
        <li> 
            <a className=" justify-between"> configuracion  </a>
        </li>
        <li> 
            <a className=" justify-between"> cerra sesion </a>
        </li>

      </ul>
    </div>
  );
};
export default UserDropDown;
