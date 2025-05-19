"use client";
const GitHistory = () => {
  return (
    <div className="p-2">
      <div className="font-semibold text-xs text-muted-foreground mb-1">Commit Geçmişi</div>
      <ul className="text-xs text-foreground space-y-1">
        <li>• Fix: Hata düzeltildi</li>
        <li>• Feat: Yeni özellik eklendi</li>
        <li>• Refactor: Kod iyileştirildi</li>
      </ul>
    </div>
  );
};
export default GitHistory;