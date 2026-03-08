import { useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import Routes from "@routes";
import { useDispatch } from "react-redux";
import { setTheme } from "@features";
import { readLocalStorage } from "@utils";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedTheme = readLocalStorage('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const appliedTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');

    dispatch(setTheme(appliedTheme));

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const switchTheme = (e) => {
      if (!readLocalStorage('theme')) {
        dispatch(setTheme(e.matches ? 'dark' : 'light'));
      }
    };
    media.addEventListener('change', switchTheme);

    return () => media.removeEventListener('change', switchTheme);
  }, [dispatch]);


  return (
    <HelmetProvider >
      <Routes />
      <Toaster position="top-right"
        toastOptions={{
          className: "bg-primary"
        }}
      />
    </HelmetProvider>
  );
}

export default App;
