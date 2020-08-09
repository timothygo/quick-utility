import React, { createContext, useState, useContext } from "react";
import Media from "react-media";

const media = createContext(null);

const mediaQueries = {
  "tablet-p": "(min-width: 640px) and (orientation: portrait)",
  "tablet-l": "(min-width: 1024px) and (orientation: landscape)",
  desktop: "(min-width: 1200px)",
};

const MediaProvider = ({ children }) => {
  const [matches, setMatches] = useState({});
  return (
    <>
      <Media
        queries={mediaQueries}
        onChange={(matches) => setMatches(matches)}
      />
      <media.Provider value={{ ...matches }}>{children}</media.Provider>
    </>
  );
};

const useMediaQuery = () => {
  const value = useContext(media);
  return value;
};

export { useMediaQuery };
export default MediaProvider;
