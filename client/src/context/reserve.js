import { useState, useContext, createContext, useEffect } from "react";

const ReserveContext = createContext();
const ReserveProvider = ({ children }) => {
  const [reserve, setReserve] = useState([]);

  useEffect(() => {
    let existingReserveItem = localStorage.getItem("reserve");
    if (existingReserveItem) setReserve(JSON.parse(existingReserveItem));
  }, []);

  return (
    <ReserveContext.Provider value={[reserve, setReserve]}>
      {children}
    </ReserveContext.Provider>
  );
};

// custom hook
const useReserve = () => useContext(ReserveContext);

export { useReserve, ReserveProvider };