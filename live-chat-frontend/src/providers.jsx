/* eslint-disable react/prop-types */
import {BrowserRouter} from "react-router-dom";
import UserContextProvider from "./contexts/UserContext";
import ToastContextProvider from "./contexts/ToastContext";


function Providers({children}) {

    
  return (
    <BrowserRouter>
    <UserContextProvider  >
      <ToastContextProvider>
        {children}
      </ToastContextProvider>
    </UserContextProvider>
      
    </BrowserRouter>
  );
}

export default Providers;