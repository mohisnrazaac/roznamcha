import React, { createContext, useContext, useMemo } from 'react';

const ZiggyContext = createContext({ Ziggy: null });

function ZiggyProvider({ value, children }) {
    const memoized = useMemo(() => value, [value]);

    return (
        <ZiggyContext.Provider value={memoized}>
            {children}
        </ZiggyContext.Provider>
    );
}

function useZiggy() {
    return useContext(ZiggyContext);
}

export const ZiggyReact = {
    Context: ZiggyContext,
    Provider: ZiggyProvider,
    useZiggy,
};

export default ZiggyReact;
