"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Download, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Person, Role } from "@/lib/types";

// React-PDF is heavy. Lazy-load both the link and the document so the rest of
// the booth bundle stays small. ssr:false because the library touches `document`.
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFDownloadLink),
  { ssr: false }
);
const RoadmapPDF = dynamic(() => import("./RoadmapPDF"), { ssr: false });

interface Props {
  person: Person;
  role: Role;
}

export default function PdfDownload({ person, role }: Props) {
  const [showQr, setShowQr] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.search = "";
    url.searchParams.set("p", person.id);
    url.searchParams.set("r", role.id);
    url.searchParams.set("view", "roadmap");
    setShareUrl(url.toString());
  }, [person.id, role.id]);

  const filename = `skill-tree-${person.id}-${role.id}.pdf`;

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg-elev)] p-4">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-xl bg-brand-500/15 text-brand-600 dark:text-brand-300 grid place-items-center flex-shrink-0">
          <Download size={18} strokeWidth={2.25} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold">Take it with you</div>
          <div className="text-xs opacity-70 mt-0.5 leading-relaxed">
            Download a clean PDF of your roadmap, or scan the QR to open it on
            another phone.
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <PDFDownloadLink
          document={<RoadmapPDF person={person} role={role} />}
          fileName={filename}
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-500 text-white text-xs font-semibold px-3 py-2 active:scale-95 transition shadow no-underline"
        >
          {/* @react-pdf returns a render-prop variant we can use for loading text. */}
          {({ loading }: { loading: boolean }) =>
            loading ? (
              <>
                <Download size={13} strokeWidth={2.5} />
                <span>Preparing…</span>
              </>
            ) : (
              <>
                <Download size={13} strokeWidth={2.5} />
                <span>Download PDF</span>
              </>
            )
          }
        </PDFDownloadLink>

        <button
          onClick={() => setShowQr((s) => !s)}
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--bg)] text-xs font-semibold px-3 py-2 active:scale-95 transition hover:border-lavender-400"
        >
          <QrCode size={13} strokeWidth={2.5} />
          <span>{showQr ? "Hide QR" : "Show QR"}</span>
        </button>
      </div>

      {showQr && shareUrl && (
        <div className="mt-3 p-3 rounded-xl bg-white border border-[var(--line)] flex items-center gap-3 animate-fade-in">
          <div className="flex-shrink-0">
            <QRCodeSVG
              value={shareUrl}
              size={104}
              level="M"
              fgColor="#1f1a1a"
              bgColor="#ffffff"
            />
          </div>
          <div className="min-w-0 flex-1 text-[11px] text-[#1f1a1a]">
            <div className="font-semibold mb-1">Scan to open</div>
            <div className="opacity-70 leading-relaxed">
              Point another phone's camera at this code. The roadmap will load
              with this person and goal pre-selected — ready to download.
            </div>
            {person.custom && (
              <div className="mt-2 text-[10px] text-orange-600">
                Note: custom people live only on this phone, so the QR can't
                share them. Use the Download button above instead.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
