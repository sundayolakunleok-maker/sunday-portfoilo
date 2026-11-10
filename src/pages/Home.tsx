import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import SoftwareShowcase from '../components/SoftwareShowcase';
import ProgramPortfolio from '../components/ProgramPortfolio';
import YouTubeSection from '../components/YouTubeSection';
import Experience from '../components/Experience';
import Certifications from '../components/Certifications';
import ResumeSection from '../components/ResumeSection';
import Contact from '../components/Contact';

interface HomeProps {
  onNavigateToCourse?: () => void;
}

export default function Home({ onNavigateToCourse }: HomeProps) {
  return (
    <div className="flex flex-col gap-24 pb-20">
      <Hero />
      <About />
      <Skills />
      <Projects />
      <SoftwareShowcase />
      <ProgramPortfolio onNavigateToCourse={onNavigateToCourse} />
      <YouTubeSection />
      <Experience />
      <Certifications />
      <ResumeSection />
      <Contact />
    </div>
  );
}
