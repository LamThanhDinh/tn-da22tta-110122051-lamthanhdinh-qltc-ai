import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLayerGroup,
  faBullseye,
  faRedoAlt,
  faUser,
  faTimes,
  faChartBar,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./MoreMenu.module.css";

const moreItems = [
  {
    name: "Thống kê",
    path: "/statistics",
    icon: faChartBar,
    desc: "Phân tích chi tiêu",
    color: "#0ea5e9",
    bg: "#e0f2fe",
  },
  {
    name: "Nguồn tiền",
    path: "/accounts",
    icon: faWallet,
    desc: "Quản lý tài khoản",
    color: "#8b5cf6",
    bg: "#ede9fe",
  },
  {
    name: "Danh mục",
    path: "/categories",
    icon: faLayerGroup,
    desc: "Quản lý danh mục",
    color: "#6366f1",
    bg: "#eef2ff",
  },
  {
    name: "Mục tiêu",
    path: "/goals",
    icon: faBullseye,
    desc: "Theo dõi tiết kiệm",
    color: "#f59e0b",
    bg: "#fef3c7",
  },
  {
    name: "Cố định",
    path: "/recurring-transactions",
    icon: faRedoAlt,
    desc: "Giao dịch định kỳ",
    color: "#10b981",
    bg: "#d1fae5",
  },
  {
    name: "Cá nhân",
    path: "/profile",
    icon: faUser,
    desc: "Tài khoản & cài đặt",
    color: "#3f51b5",
    bg: "#e8eaf6",
  },
];

const MoreMenu = ({ isOpen, onClose }) => {
  const location = useLocation();

  // Lock body scroll khi sheet mở
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={styles.backdrop}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet */}
      <div
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-label="Menu mở rộng"
      >
        {/* Handle bar */}
        <div className={styles.handle} />

        {/* Header */}
        <div className={styles.sheetHeader}>
          <p className={styles.sheetTitle}>Khám phá thêm</p>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Đóng menu"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Nav Grid */}
        <div className={styles.grid}>
          {moreItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`${styles.item} ${isActive ? styles.active : ""}`}
                onClick={onClose}
                style={{
                  "--item-color": item.color,
                  "--item-bg": item.bg,
                }}
              >
                <div className={styles.iconWrap}>
                  <FontAwesomeIcon icon={item.icon} />
                </div>
                <div className={styles.itemText}>
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={styles.itemDesc}>{item.desc}</span>
                </div>
                {isActive && <span className={styles.activeDot} />}
              </NavLink>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MoreMenu;
