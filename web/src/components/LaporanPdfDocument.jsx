import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
} from "@react-pdf/renderer";

// Note: Web project may not have custom font; fallback to default.

const styles = StyleSheet.create({
    page: {
        padding: 28,
        fontSize: 11,
        fontFamily: "Times-Roman",
    },
    header: {
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 700,
        marginBottom: 6,
    },
    metaRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    metaItem: {
        width: "48%",
    },
    section: {
        marginTop: 12,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: 700,
        marginBottom: 6,
    },
    label: {
        fontWeight: 700,
        marginBottom: 2,
    },
    text: {
        marginBottom: 6,
        lineHeight: 1.4,
    },
    box: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 8,
        padding: 12,
        marginTop: 6,
    },
    grid2: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 6,
    },
    col: {
        width: "48%",
    },
});

function formatTanggal(date) {
    if (!date) return "-";
    try {
        return new Date(date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    } catch {
        return String(date);
    }
}

export default function LaporanPdfDocument({ laporan }) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>Laporan Pengaduan</Text>
                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <Text style={styles.label}>Judul</Text>
                            <Text style={styles.text}>{laporan?.title || "-"}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Text style={styles.label}>Tanggal Pembuatan</Text>
                            <Text style={styles.text}>{formatTanggal(laporan?.created_at)}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informasi Laporan</Text>
                    <View style={styles.box}>
                        <View style={styles.grid2}>
                            <View style={styles.col}>
                                <Text style={styles.label}>Kategori</Text>
                                <Text style={styles.text}>{laporan?.category_name || "-"}</Text>
                            </View>
                            <View style={styles.col}>
                                <Text style={styles.label}>Status</Text>
                                <Text style={styles.text}>{laporan?.status || "-"}</Text>
                            </View>
                        </View>

                        <View style={styles.grid2}>
                            <View style={styles.col}>
                                <Text style={styles.label}>Pelapor</Text>
                                <Text style={styles.text}>{laporan?.user_name || "-"}</Text>
                            </View>
                            <View style={styles.col}>
                                <Text style={styles.label}>Tanggal Proses</Text>
                                <Text style={styles.text}>{formatTanggal(laporan?.process_at || laporan?.resolved_at)}</Text>
                            </View>
                        </View>

                        <View style={{ marginTop: 10 }}>
                            <Text style={styles.label}>Deskripsi</Text>
                            <Text style={[styles.text, { lineHeight: 1.5 }]}>{laporan?.description || "-"}</Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
}

