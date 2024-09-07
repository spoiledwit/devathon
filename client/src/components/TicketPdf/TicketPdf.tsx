// @ts-nocheck
import React from "react";
import {
    Document,
    Page,
    PDFDownloadLink,
    StyleSheet,
    Text,
    View,
} from "@react-pdf/renderer";
import { toReadableDate } from "@/lib/utils";

const ticket = {
    id: 1,
    title: 'Concert Ticket',
    description: 'Live concert with your favorite artist',
    boughtDate: '2024-08-30',
    imageUrl: 'https://via.placeholder.com/150',
};

// Create styles for the PDF
const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 12,
    },
    section: {
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    description: {
        marginBottom: 5,
    },
    flexRow: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    date: {
        marginBottom: 5,
        fontStyle: 'italic',
    },
    image: {
        width: 150,
        height: 100,
        marginBottom: 10,
    },
    ticketContainer: {
        marginBottom: 20,
        padding: 10,
        border: '1pt solid #ccc',
        borderRadius: 5,
    },
});

// Create Document Component
const TicketPdf = ({ ticket }: { ticket: any }) => (
    <>
        <Document>
            <Page style={styles.page}>
                <View style={styles.ticketContainer}>
                    <Text style={styles.title}>{ticket.eventId.title}</Text>
                    <Text style={styles.description}>{ticket.eventId.description}</Text>
                    <View style={styles.flexRow}>
                        <Text style={styles.description}>{ticket.userId.name}</Text>
                        <Text style={styles.description}>{ticket.userId.email}</Text>
                    </View>
                    <Text style={styles.date}>Event Date: {toReadableDate(new Date(ticket.eventId.eventDate))}</Text>
                </View>
            </Page>
        </Document>
    </>
);

export default TicketPdf;
