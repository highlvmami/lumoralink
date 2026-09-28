// QR kod üretimi. Aynı ayarları hem sayfadaki önizleme hem indirme kullanır.
import QRCode from "qrcode";

const options = {
  // "M" seviyesi: kodun ~%15'i hasar görse (leke, katlanma) bile okunur
  errorCorrectionLevel: "M" as const,
  margin: 2, // okuyucuların kodu ayırt etmesi için etrafta boşluk ("quiet zone")
  color: { dark: "#000000", light: "#ffffff" }, // en güvenilir okuma: beyaz üstüne siyah
};

export function qrSvg(text: string) {
  return QRCode.toString(text, { ...options, type: "svg" });
}

export function qrPng(text: string, size = 1024) {
  return QRCode.toBuffer(text, { ...options, type: "png", width: size });
}
