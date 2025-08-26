function TermsAndConditions() {
  return (
    <div className="space-y-3">
      <p>
        By using Realm Chat you agree to use the service lawfully and respectfully.
        You are solely responsible for the content you share.
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Do not use the service for illegal activities or harassment.</li>
        <li>We are not accountable for user‑generated content or misuse.</li>
        <li>
          Service is provided “as is” without warranties; availability and features
          may change at any time.
        </li>
        <li>
          Messages are end‑to‑end encrypted in your browser (AES‑256‑GCM via PBKDF2
          SHA‑256 key derivation). Keep your realm code secret.
        </li>
      </ul>
      <p>
        Violations may result in suspension or termination of access at our
        discretion.
      </p>
    </div>
  );
}

export default TermsAndConditions;


