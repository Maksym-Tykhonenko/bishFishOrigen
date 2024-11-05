import React, { createContext, useState, useContext } from 'react';

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
    const [createPressed, setCreatePressed] = useState(false);
    return (
        <NotesContext.Provider value={{ createPressed, setCreatePressed }}>
            {children}
        </NotesContext.Provider>
    );
};

export const useNotesContext = () => useContext(NotesContext);
