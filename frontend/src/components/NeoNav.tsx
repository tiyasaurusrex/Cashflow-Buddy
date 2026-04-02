import React from 'react';
import { useLocation } from 'react-router-dom';
import './NeoNav.css';

interface NavItem {
    label: string;
    href: string;
}

interface NeoNavProps {
    items: NavItem[];
    onItemClick?: (item: NavItem) => void;
}

const NeoNav: React.FC<NeoNavProps> = ({ items, onItemClick }) => {
    const location = useLocation();

    const handleItemClick = (item: NavItem, e: React.MouseEvent) => {
        e.preventDefault();
        if (onItemClick) {
            onItemClick(item);
        }
    };

    return (
        <nav className="neo-nav">
            <div className="neo-nav__container">
                <ul className="neo-nav__menu">
                    {items.map((item) => {
                        const isCta = item.label === 'Log Expense';
                        const isActiveRoute = item.href !== '#logout' && location.pathname === item.href;
                        const className = `neo-nav__link ${
                            isCta
                                ? 'neo-nav__link--cta'
                                : isActiveRoute
                                ? 'neo-nav__link--active'
                                : ''
                        }`;

                        return (
                            <li key={item.label} className="neo-nav__item">
                                <a
                                    href={item.href}
                                    className={className}
                                    onClick={(e) => handleItemClick(item, e)}
                                >
                                    {item.label}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
};

export default NeoNav;
