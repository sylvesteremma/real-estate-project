import { MessageCircleMore } from "lucide-react";
import { company } from "@/lib/company";

export function FloatingWhatsApp() {
  return (
    <a
      href={company.whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#D4AF37] text-[#0F2C59] shadow-lg transition hover:scale-105"
    >
      <MessageCircleMore size={24} />
    </a>
  );
}
