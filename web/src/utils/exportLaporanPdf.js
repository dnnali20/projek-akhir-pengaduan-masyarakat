import { pdf } from "@react-pdf/renderer";
import LaporanPdfDocument from "../components/LaporanPdfDocument";

export async function exportLaporanPdf({ laporan }) {
    // @react-pdf/renderer supports JSX here, but Vite parser can fail if JSX is used
    // inside .js utility files. We call the component as a function instead.
    const instance = pdf(LaporanPdfDocument({ laporan }));



    const blob = await instance.toBlob();

    const fileName = `laporan-${laporan?.id || ""}-${new Date(
        Date.now()
    )
        .toISOString()
        .slice(0, 10)}.pdf`;

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

