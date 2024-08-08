import {Space_Mono} from "next/font/google";
import "./globals.css";

const spaceMono = Space_Mono({
    subsets: ["latin"],
    weight: ["400", "700"],
});

export const metadata = {
    title: "100 Audio Player",
    description: "Sail the 7even seas?",
};

export default function RootLayout({children}) {
    return (
        <html lang="en">
        <body className={spaceMono.className}>{children}</body>
        </html>
    );
}
