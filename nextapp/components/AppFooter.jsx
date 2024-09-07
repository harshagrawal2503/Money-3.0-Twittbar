export default function AppFooter() {
  return (
    <footer className="border-top">
      <div className="d-flex justify-content-end">
        <img className="mt-5" src="/built-on-hedera.png" alt="" width="100" />
      </div>
      <div className="d-flex justify-content-end mt-1">
        <small>Contract: {process.env.CONTRACT_ID}</small>
      </div>
    </footer>
  );
}