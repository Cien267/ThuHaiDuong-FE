import { Outlet } from "react-router-dom"
import logo from "../assets/images/logo.png"

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <img src={logo} alt="" className="h-10 w-auto" />
      </div>

      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <Outlet />
      </div>
    </div>
  )
}
