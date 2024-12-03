import { createContext, useContext, useState } from 'react';

const PageContext = createContext();

export function PageProvider({children}) {
  const [currentPage, setPage] = useState(null);

  return (
    <PageContext.Provider value={{ currentPage, setPage }}>
      {children}
    </PageContext.Provider>
  );
}

export function usePage() {
  return useContext(PageContext);
}