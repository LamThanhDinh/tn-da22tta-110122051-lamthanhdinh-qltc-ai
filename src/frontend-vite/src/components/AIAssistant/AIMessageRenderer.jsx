import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getIconObject } from "../../utils/iconMap";
import styles from "./AIMessageRenderer.module.css";

// Regex detect pattern: "fa-iconname Text" ở đầu dòng hoặc sau số thứ tự
const FA_ICON_REGEX = /(fa-[\w-]+)/g;

// Thay thế "fa-motorcycle" trong text bằng <FontAwesomeIcon>
const renderLineWithIcons = (text, lineKey) => {
  const parts = [];
  let lastIndex = 0;
  let match;

  FA_ICON_REGEX.lastIndex = 0; // Reset regex state
  while ((match = FA_ICON_REGEX.exec(text)) !== null) {
    const iconName = match[1];
    const iconObj = getIconObject(iconName);

    // Chỉ render icon nếu không phải fallback mặc định (bullseye)
    // hay nếu tên icon thực sự tồn tại trong map
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    parts.push(
      <span
        key={`icon-${lineKey}-${match.index}`}
        className={styles.inlineIcon}
        title={iconName}
      >
        <FontAwesomeIcon icon={iconObj} />
      </span>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
};

const AIMessageRenderer = ({ content }) => {
  // Parse HTML-like tags và convert thành React elements
  const parseMessage = (text) => {
    if (!text) return "";

    // Replace HTML-like tags với React styling
    let parsedText = text
      // Strong tags
      .replace(/<strong>(.*?)<\/strong>/g, '<span class="ai-strong">$1</span>')
      .replace(/<em>(.*?)<\/em>/g, '<span class="ai-emphasis">$1</span>')

      // Income/Expense spans với colors
      .replace(
        /<span class="income">(.*?)<\/span>/g,
        '<span class="ai-income">$1</span>'
      )
      .replace(
        /<span class="expense">(.*?)<\/span>/g,
        '<span class="ai-expense">$1</span>'
      )
      .replace(
        /<span class="balance">(.*?)<\/span>/g,
        '<span class="ai-balance">$1</span>'
      )
      .replace(
        /<span class="balance positive">(.*?)<\/span>/g,
        '<span class="ai-positive">$1</span>'
      )
      .replace(
        /<span class="balance negative">(.*?)<\/span>/g,
        '<span class="ai-negative">$1</span>'
      )
      .replace(
        /<span class="remaining positive">(.*?)<\/span>/g,
        '<span class="ai-positive">$1</span>'
      )
      .replace(
        /<span class="remaining negative">(.*?)<\/span>/g,
        '<span class="ai-negative">$1</span>'
      )
      .replace(
        /<span class="progress">(.*?)<\/span>/g,
        '<span class="ai-progress">$1</span>'
      );

    // Split theo newlines và tạo paragraphs
    const lines = parsedText.split("\n").filter((line) => line.trim());

    return lines.map((line, index) => {
      // Check if line has emoji at start (statistics headers)
      const isHeader = /^[📊💰💸🏦📈✅❌🎯]/u.test(line.trim());

      // Check if line is a dash divider
      const isDashLine =
        /^[\s─-]+$/.test(line.trim()) && line.trim().length > 10;

      // Parse individual line for HTML span tags
      const parts = [];
      let currentIndex = 0;

      // Regex để tìm các span tags
      const tagRegex = /<span class="([\w-]+)">(.*?)<\/span>/g;
      let match;

      while ((match = tagRegex.exec(line)) !== null) {
        // Add text before the tag (with icon rendering)
        if (match.index > currentIndex) {
          const textBefore = line.substring(currentIndex, match.index);
          const withIcons = renderLineWithIcons(textBefore, `${index}-pre-${match.index}`);
          if (Array.isArray(withIcons)) {
            parts.push(...withIcons);
          } else {
            parts.push(withIcons);
          }
        }

        // Add the styled span (also render icons inside span)
        const className = match[1];
        const spanContent = match[2];
        const spanWithIcons = renderLineWithIcons(spanContent, `${index}-span-${match.index}`);
        parts.push(
          <span
            key={`${index}-${match.index}`}
            className={styles[className.replace("-", "_")]}
          >
            {Array.isArray(spanWithIcons) ? spanWithIcons : spanContent}
          </span>
        );

        currentIndex = match.index + match[0].length;
      }

      // Add remaining text (with icon rendering)
      if (currentIndex < line.length) {
        const remaining = line.substring(currentIndex);
        const withIcons = renderLineWithIcons(remaining, `${index}-tail`);
        if (Array.isArray(withIcons)) {
          parts.push(...withIcons);
        } else {
          parts.push(withIcons);
        }
      }

      // Special handling for dash lines
      if (isDashLine) {
        return (
          <div key={index} className={styles.dashLine}>
            ──────────────────────────────────────
          </div>
        );
      }

      return (
        <div
          key={index}
          className={`${styles.messageLine} ${isHeader ? styles.headerLine : ""}`}
        >
          {parts.length > 0 ? parts : line}
        </div>
      );
    });
  };

  return <div className={styles.messageContainer}>{parseMessage(content)}</div>;
};

export default AIMessageRenderer;