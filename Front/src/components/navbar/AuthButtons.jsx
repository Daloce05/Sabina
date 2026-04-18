const AuthButtons = () => {
  return (
    <div className="py-4  flex justify-center items-center gap-4 flex-wrap">
      <button className="btn btn-neutral btn-outline"> crear cuenta</button>
      <div className="hidden lg:block">|</div>
      <button className="btn bg-neutral btn-outline"> iniciar sesion</button>
    </div>
  )
}
export default AuthButtons