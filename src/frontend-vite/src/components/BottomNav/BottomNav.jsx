import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./BottomNav.module.css";
import MoreMenu from "./MoreMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faExchangeAlt,
  faWallet,
  faUsers,
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";

// 4 mục cốt lõi + "Khác" để truy cập các trang còn lại
const navItems = [
  { name: "Trang chủ", path: "/homepage", icon: faHome },
  { name: "Giao dịch", path: "/transactions", icon: faExchangeAlt },
  { name: "Ngân sách", path: "/budgets", icon: faWallet },
  { name: "Gia đình", path: "/families", icon: faUsers },
];

// Các trang thuộc "Khác" — dùng để highlight nút khi đang ở những trang này
const morePaths = ["/categories", "/goals", "/recurring-transactions", "/profile"];

const BottomNav = () => {
  const location = useLocation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const isMoreActive = morePaths.includes(location.pathname);

  return (
    <>
      <nav className={styles.bottomNav} id="bottom-navigation">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={`${styles.navItem} ${isActive ? styles.active : ""}`}
              aria-label={item.name}
            >
              <div className={styles.iconWrapper}>
                <FontAwesomeIcon icon={item.icon} className={styles.navIcon} />
                {isActive && <span className={styles.activeIndicator} />}
              </div>
              <span className={styles.navLabel}>{item.name}</span>
            </NavLink>
          );
        })}

        {/* Nút "Khác" — mở MoreMenu bottom sheet */}
        <button
          className={`${styles.navItem} ${styles.moreButton} ${isMoreActive || isMoreOpen ? styles.active : ""}`}
          onClick={() => setIsMoreOpen((v) => !v)}
          aria-label="Khác"
          aria-expanded={isMoreOpen}
        >
          <div className={`${styles.iconWrapper} ${isMoreOpen ? styles.moreOpen : ""}`}>
            <FontAwesomeIcon icon={faEllipsisH} className={styles.navIcon} />
            {isMoreActive && !isMoreOpen && <span className={styles.activeIndicator} />}
          </div>
          <span className={styles.navLabel}>Khác</span>
        </button>
      </nav>

      {/* More Menu bottom sheet */}
      <MoreMenu
        isOpen={isMoreOpen}
        onClose={() => setIsMoreOpen(false)}
      />
    </>
  );
};

export default BottomNav;
