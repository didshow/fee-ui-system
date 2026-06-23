import { useNavigate } from "react-router-dom";
import { Avatar } from "antd-mobile";
import {
  ClockCircleOutline,
  SmileOutline,
  SetOutline,
  GiftOutline,
  PhonebookOutline,
  SendOutline,
} from "antd-mobile-icons";
import { useAuthStore } from "@/store/auth";
import styles from "./Profile.module.css";

export default function Profile() {
  const navigate = useNavigate();
  const userId = useAuthStore((s) => s.userId);
  const logout = useAuthStore((s) => s.logout);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  // ── 未登录态 ──────────────────────────────────────────────────
  if (!userId) {
    return (
      <div className={styles.root}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "60px 32px 40px",
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: "var(--color-bg-input)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              marginBottom: 20,
            }}
          >
            👤
          </div>
          <p
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "var(--color-text-primary)",
              marginBottom: 6,
            }}
          >
            登录后享受全部服务
          </p>
          <p
            style={{
              fontSize: 13,
              color: "var(--color-text-tertiary)",
              marginBottom: 32,
              textAlign: "center",
            }}
          >
            缴费记录、金币余额、邀请好友等功能需登录后使用
          </p>
          <button
            onClick={() => navigate("/login")}
            style={{
              width: "100%",
              padding: "14px 0",
              background: "var(--color-primary)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              marginBottom: 12,
            }}
          >
            立即登录
          </button>
          <button
            onClick={() => navigate("/register")}
            style={{
              width: "100%",
              padding: "13px 0",
              background: "var(--color-primary-light)",
              color: "var(--color-primary)",
              border: "1px solid var(--color-primary)",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            注册账号
          </button>
        </div>
        <p className={styles.version}>版本 v1.0.0</p>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      {/* 用户信息头部 */}
      <div className={styles.header}>
        <Avatar
          src=""
          className={styles.avatar}
          fallback={<span>{userId ? userId.slice(-2) : "用"}</span>}
        />
        <div className={styles.userInfo}>
          <div className={styles.headerTop}>
            <p className={styles.headerTopTitle}>我的</p>
            <button className={styles.settingsBtn}>
              <SetOutline />
            </button>
          </div>
          <p className={styles.headerSubtitle}>
            欢迎回来，***{userId ? userId.slice(-4) : ""}
          </p>
        </div>
      </div>

      {/* 余额卡片 */}
      <div className={styles.balanceCard}>
        <div className={styles.balanceInner}>
          <span className={styles.balanceLabel}>账户余额</span>
          <span className={styles.balanceAmount}>--</span>
        </div>
        <div className={styles.balanceActions}>
          <button
            className={styles.balanceBtn}
            onClick={() => navigate("/recharge")}
          >
            <span>充值</span>
          </button>
          <div className={styles.balanceDivider} />
          <button className={styles.balanceBtn}>
            <span>提现</span>
          </button>
        </div>
      </div>

      {/* 账户中心 */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>账户中心</p>
        <div className={styles.iconGrid}>
          <div
            className={styles.iconGridItem}
            onClick={() => navigate("/profile")}
          >
            <div
              className={styles.iconGridIcon}
              style={{ background: "#e8f3ff", color: "#1677ff" }}
            >
              <SmileOutline />
            </div>
            <span>个人资料</span>
          </div>
          <div className={styles.iconGridItem}>
            <div
              className={styles.iconGridIcon}
              style={{ background: "#e8ffea", color: "#00b42a" }}
            >
              <SetOutline />
            </div>
            <span>安全中心</span>
          </div>
          <div
            className={styles.iconGridItem}
            onClick={() => navigate("/records")}
          >
            <div
              className={styles.iconGridIcon}
              style={{ background: "#fff7e8", color: "#fa8c16" }}
            >
              <ClockCircleOutline />
            </div>
            <span>我的订单</span>
          </div>
        </div>
      </div>

      {/* 资金管理 */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>资金管理</p>
        <div className={styles.iconGrid}>
          <div
            className={styles.iconGridItem}
            onClick={() => navigate("/records")}
          >
            <div
              className={styles.iconGridIcon}
              style={{ background: "#e8f3ff", color: "#1677ff" }}
            >
              <ClockCircleOutline />
            </div>
            <span>资金记录</span>
          </div>
          <div
            className={styles.iconGridItem}
            onClick={() => navigate("/recharge")}
          >
            <div
              className={styles.iconGridIcon}
              style={{ background: "#e8ffea", color: "#00b42a" }}
            >
              <GiftOutline />
            </div>
            <span>充值记录</span>
          </div>
          <div className={styles.iconGridItem}>
            <div
              className={styles.iconGridIcon}
              style={{ background: "#fff0f0", color: "#f5222d" }}
            >
              <SendOutline />
            </div>
            <span>提现记录</span>
          </div>
        </div>
      </div>

      {/* 推广中心 */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>推广中心</p>
        <div className={styles.iconGrid}>
          <div
            className={styles.iconGridItem}
            onClick={() => navigate("/invite")}
          >
            <div
              className={styles.iconGridIcon}
              style={{ background: "#f9f0ff", color: "#722ed1" }}
            >
              <SendOutline />
            </div>
            <span>我的推广链接</span>
          </div>
          <div className={styles.iconGridItem}>
            <div
              className={styles.iconGridIcon}
              style={{ background: "#fff7e8", color: "#fa8c16" }}
            >
              <PhonebookOutline />
            </div>
            <span>我的团队</span>
          </div>
          <div
            className={styles.iconGridItem}
            onClick={() => navigate("/customer-service")}
          >
            <div
              className={styles.iconGridIcon}
              style={{ background: "#e8f3ff", color: "#1677ff" }}
            >
              <PhonebookOutline />
            </div>
            <span>联系客服</span>
          </div>
        </div>
      </div>

      {/* 退出登录 */}
      <div className={styles.logoutWrap}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          退出登录
        </button>
      </div>

      <p className={styles.version}>版本 v1.0.0</p>
    </div>
  );
}
