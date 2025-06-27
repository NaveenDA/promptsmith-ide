"use client";
import FeatureSections from "./(website)/feature-sections";
import CTASections from "./(website)/cta-sections";
import HeroSections from "./(website)/hero-sections";
import FooterSections from "./(website)/footer-sections";

export default function Home() {
	return (
		<>
			<HeroSections />
			<FeatureSections />
			<CTASections />
			<FooterSections />
		</>
	);
}
