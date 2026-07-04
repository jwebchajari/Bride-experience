import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import "./globals.css";

const display = Bodoni_Moda({
	subsets: ["latin"],
	weight: ["400", "500", "600"],
	variable: "--font-display",
});

const body = Jost({
	subsets: ["latin"],
	weight: ["300", "400", "500"],
	variable: "--font-body",
});

const SITE_URL =
	process.env.NEXT_PUBLIC_SITE_URL ?? "https://bride-experience.vercel.app";

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: "Bride Experience · Evento Exclusivo para Novias",
		template: "%s · Bride Experience",
	},
	description:
		"Una experiencia creada para inspirarte en uno de los momentos más especiales de tu vida. Una tarde para disfrutar, conectar y vivir experiencias únicas junto a profesionales del rubro, con la posibilidad de probarte distintos estilos de vestidos junto a Atelier Privé.",
	keywords: [
		"Bride Experience",
		"evento para novias",
		"novias",
		"vestidos de novia",
		"Atelier Privé",
		"casamiento",
		"boda",
		"inspiración novias",
	],
	alternates: { canonical: "/" },
	robots: { index: true, follow: true },
	openGraph: {
		type: "website",
		url: SITE_URL,
		siteName: "Bride Experience",
		locale: "es_AR",
		title: "Bride Experience · Evento Exclusivo para Novias",
		description:
			"Una experiencia creada para inspirarte en uno de los momentos más especiales de tu vida. Reservá tu lugar.",
		images: [
			{
				url: "/logo.jpg",
				width: 1206,
				height: 515,
				alt: "Bride Experience — Evento Exclusivo para Novias",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Bride Experience · Evento Exclusivo para Novias",
		description:
			"Una experiencia creada para inspirarte en uno de los momentos más especiales de tu vida. Reservá tu lugar.",
		images: ["/logo.jpg"],
	},
	icons: {
		icon: "/logo.jpg",
		apple: "/logo.jpg",
	},
};

export const viewport: Viewport = {
	themeColor: "#F2EEE6",
	width: "device-width",
	initialScale: 1,
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="es" className={`${display.variable} ${body.variable}`}>
			<body>{children}</body>
		</html>
	);
}
