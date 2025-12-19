import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../Context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { ROLE_MENUS } from "../../Data/Role_menus";
import { MENU_TRANSITION_DURATION_IN, MENU_TRANSITION_DURATION_OUT } from "../../Data/Global_variables"

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false); 
    
    const { isAuthenticated, logout, user } = useAuth(); 
    const role = user?.accountType || "Guest";
    const menuData = ROLE_MENUS[role] || []; 

    const menuVariants = {
        hidden: { opacity: 0, height: 0 },
        visible: {
            opacity: 1,
            height: "auto",
            transition: { duration: MENU_TRANSITION_DURATION_IN, ease: "easeInOut" },
        },
        exit: {
            opacity: 0,
            height: 0,
            transition: { duration: MENU_TRANSITION_DURATION_OUT, ease: "easeOut" },
        },
    };

    return (
        <header className="fixed top-0 left-0 z-50 w-full bg-[var(--nav-bg)] shadow-md text-xl">
            <div className="flex items-center justify-between p-4">
                <div className="text-2xl font-bold text-[var(--nav-text)] duration-300 transition-colors">EasyBank</div>
                <button
                    className="text-3xl text-[var(--nav-text)] focus:outline-none lg:hidden"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    ☰
                </button>

                {/* Desktop Menu */}
                <nav className="hidden lg:block">
                    <ul className="flex space-x-8 font-medium text-[var(--nav-text-sec)]">

                        {isAuthenticated ? (
                            <>
                                {menuData.map((menu) => (
                                    <li key={menu.label}>
                                        <a href={menu.href} className="hover:text-[var(--nav-hover)] duration-300 transition-colors">
                                            {menu.label}
                                        </a>
                                    </li>
                                ))}
                                <li>
                                    <button onClick={logout} className="text-[var(--nav-text)] hover:hover:text-[var(--danger-hover-bg)] duration-300 transition-colors">
                                        <FontAwesomeIcon icon={faSignOutAlt} />
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <a href="/" className="hover:text-[var(--nav-hover)] duration-300 transition-colors">Home</a>
                                </li>
                                <li>
                                    <a href="/auth-page" className="hover:text-[var(--nav-hover)] duration-300 transition-colors">Login</a>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>

            {/* Mobile Menu Section */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.nav
                        key="mobileMenu"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={menuVariants}
                        className="overflow-hidden border-t border-[var(--nav-text-sec)] bg-[var(--nav-bg)] shadow-md lg:hidden"
                    >
                        <ul className="flex flex-col px-6 py-4 font-medium text-[var(--nav-text)]">
                            {isAuthenticated ? (
                                <>
                                    {menuData.map((menu) => (
                                        <li key={menu.label} className="py-2">
                                            <a
                                                href={menu.href}
                                                onClick={() => setMenuOpen(false)}
                                                className="block text-lg hover:text-[var(--nav-hover)] duration-300 transition-colors"
                                            >
                                                {menu.label}
                                            </a>
                                        </li>
                                    ))}

                                    <li className="mt-4 border-t border-[var(--nav-hover)] pt-3">
                                        <button
                                            onClick={() => { logout(); setMenuOpen(false); }}
                                            className="w-full text-left text-lg font-semibold duration-300 transition-colors text-[var(--nav-text)] hover:hover:text-[var(--danger-hover-bg)]"
                                        >
                                            Logout <FontAwesomeIcon icon={faSignOutAlt} />
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="py-2 border-b border-[var(--nav-text)]">
                                        <a
                                            href="/"
                                            onClick={() => setMenuOpen(false)}
                                            className="block text-lg hover:text-[var(--nav-hover)] duration-300 transition-colors"
                                        >Home</a>
                                    </li>
                                    <li className="py-2">
                                        <a
                                            href="/auth-page"
                                            onClick={() => setMenuOpen(false)}
                                            className="block text-lg font-semibold text-[var(--nav-text-sec)] hover:text-[var(--nav-hover)] duration-300 transition-colors"
                                        >Login</a>
                                    </li>
                                </>
                            )}
                        </ul>
                    </motion.nav>
                )}
            </AnimatePresence>
        </header>
    );
}

export default Navbar;