import { Button } from "@/components/ui/button";

function LegalModal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-background border p-4 sm:p-6 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>✕</Button>
        </div>
        <div className="text-sm text-muted-foreground space-y-3 max-h-[60vh] overflow-y-auto">
          {children}
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}

export default LegalModal;


