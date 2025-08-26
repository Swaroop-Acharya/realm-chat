function PrivacyPolicy() {
  return (
    <div className="space-y-3">
      <p>
        We value your privacy. Realm Chat does not require an account and does not
        store your message contents on the server beyond what is needed to relay
        messages in real time.
      </p>
      <p>
        Messages are end‑to‑end encrypted locally in your browser using AES‑256‑GCM.
        The encryption key is derived from your realm code via PBKDF2 with SHA‑256
        and 100,000 iterations, with a 12‑byte IV per message. Only participants who
        know the realm code can decrypt messages.
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>No profiling or sale of personal data.</li>
        <li>Minimal logs for operational and abuse prevention purposes.</li>
        <li>You may clear your browser data to remove any cached information.</li>
      </ul>
      <p>
        Security best practices are followed, but no system is perfect. Use at your
        own risk.
      </p>
    </div>
  );
}

export default PrivacyPolicy;


