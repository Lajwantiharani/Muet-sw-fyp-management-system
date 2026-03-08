import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '@features';
import { FaMoon, FaSun } from 'react-icons/fa';
import { writeLocalStorage } from '@utils';

const ThemeSwitcher = () => {
    const dispatch = useDispatch();
    const { theme } = useSelector((state) => state.ui);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        writeLocalStorage('theme', newTheme);
        dispatch(setTheme(newTheme));
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    return (
        <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="relative w-12 h-7 flex items-center bg-primary-hover border border-primary rounded-full transition-colors duration-300 shadow-inner"
        >
            <span
                className={`absolute top-[1px] left-[2px] w-6 h-6 flex items-center justify-center rounded-full border border-primary bg-primary text-primary text-[10px] transition-transform duration-300 ${theme === 'dark' ? 'translate-x-[1.2rem]' : 'translate-x-0'
                    }`}
            >
                {theme === 'dark' ? <FaMoon /> : <FaSun />}
            </span>
        </button>
    );
};

export default ThemeSwitcher;
