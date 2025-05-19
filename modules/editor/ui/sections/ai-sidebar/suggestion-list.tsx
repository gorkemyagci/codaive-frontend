"use client";
const SuggestionList = () => {
  return (
    <div className="p-2">
      <div className="font-semibold text-xs text-muted-foreground mb-1">AI Öneriler</div>
      <ul className="text-xs text-foreground space-y-1">
        <li>• Kodunuzu optimize edin</li>
        <li>• Hata analizi yapın</li>
        <li>• Test fonksiyonu oluşturun</li>
      </ul>
    </div>
  );
};
export default SuggestionList;