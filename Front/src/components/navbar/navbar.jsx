import Cart from "./modalcart"
import AuthButtons from "./AuthButtons"
import UserDropDown from "./UserDropDown"

const Navbar = () => {
  return (
   <header> 
      <AuthButtons />
     <nav className="navbar bg-base-100 shadow-sm lg:rounded-box w-full">
        <div className="navbar-start">     
            <a className="btn btn-ghost text-xl" to="/"> SABINA MEDICINA</a>
        </div>
       
        <div className="navbar-end gap-3">
          <a className="btn btn-primary"> dashboard</a>
           <Cart />
           <UserDropDown />
        </div>
        
     </nav> 
   </header>
  )
}
export default Navbar 