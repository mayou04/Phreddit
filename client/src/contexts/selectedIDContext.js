import { createContext, useContext, useState } from "react";

const SelectedIDContext = createContext();
export const useSelectedID = () => useContext(SelectedIDContext);

export const SelectedIDProvider = ({children}) => {
    const [selectedID, setSelectedID] = useState("home");

    return (
        <SelectedIDContext.Provider value={{selectedID, setSelectedID}}>
            {children}
        </SelectedIDContext.Provider>
    );
};