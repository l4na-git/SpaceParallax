export function App() {
  return (
    <main className="maintenance-shell">
      <div className="maintenance-orbit maintenance-orbit-one" />
      <div className="maintenance-orbit maintenance-orbit-two" />

      <section className="maintenance-card">
        <div className="maintenance-kicker">SpaceParallax</div>
        <h1>現在メンテナンス中です</h1>
        <p className="maintenance-copy">
          サービス品質向上のため、一時的にメンテナンスを実施しています。
          復旧までしばらくお待ちください。
        </p>

        <div className="maintenance-status">
          <span className="maintenance-status-dot" />
          <span>Maintenance in progress</span>
        </div>
      </section>
    </main>
  );
}
