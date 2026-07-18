import { Link } from "react-router-dom";
import {
  Scale,
  Users,
  BookOpen,
  FileText,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/i18n";

const Index = () => {
  const { t } = useLanguage();

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative flex min-h-[min(600px,90vh)] items-center justify-center overflow-hidden py-16 sm:py-0">
        <div className="absolute inset-0 gradient-hero" />
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=2000&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white sm:px-6">
          <div className="mb-4 inline-block sm:mb-6">
            <Scale className="h-14 w-14 text-secondary sm:h-20 sm:w-20" />
          </div>
          <h1 className="mb-4 font-serif text-3xl font-bold tracking-tight sm:mb-6 sm:text-5xl md:text-6xl">
            {t("home.hero.title")}
          </h1>
          <p className="mb-6 font-sans text-base text-white/90 sm:mb-8 sm:text-xl md:text-2xl">
            {t("home.hero.subtitle")}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/dashboard">
              <Button
                size="lg"
                variant="secondary"
                className="shadow-glow font-sans"
              >
                {t("home.hero.admin")}
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 font-sans"
            >
              {t("home.hero.more")}
            </Button>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-primary mb-4">
              {t("home.mission.title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-sans">
              {t("home.mission.text")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 shadow-card hover:shadow-elegant transition-shadow">
              <div className="mb-4 text-secondary">
                <Scale className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-primary mb-3">
                {t("home.mission.card1.title")}
              </h3>
              <p className="text-muted-foreground font-sans">
                {t("home.mission.card1.text")}
              </p>
            </Card>

            <Card className="p-8 shadow-card hover:shadow-elegant transition-shadow">
              <div className="mb-4 text-secondary">
                <Users className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-primary mb-3">
                {t("home.mission.card2.title")}
              </h3>
              <p className="text-muted-foreground font-sans">
                {t("home.mission.card2.text")}
              </p>
            </Card>

            <Card className="p-8 shadow-card hover:shadow-elegant transition-shadow">
              <div className="mb-4 text-secondary">
                <BookOpen className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-primary mb-3">
                {t("home.mission.card3.title")}
              </h3>
              <p className="text-muted-foreground font-sans">
                {t("home.mission.card3.text")}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6 bg-muted">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-primary mb-4">
              {t("home.services.title")}
            </h2>
            <p className="text-lg text-muted-foreground font-sans">
              {t("home.services.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Link to="/lawyers">
              <Card className="p-8 shadow-card hover:shadow-elegant transition-all cursor-pointer group">
                <div className="flex items-start gap-4">
                  <div className="text-secondary group-hover:scale-110 transition-transform">
                    <Users className="h-10 w-10" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-semibold text-primary mb-2 group-hover:text-secondary transition-colors">
                      {t("home.services.lawyers.title")}
                    </h3>
                    <p className="text-muted-foreground font-sans">
                      {t("home.services.lawyers.text")}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link to="/cases">
              <Card className="p-8 shadow-card hover:shadow-elegant transition-all cursor-pointer group">
                <div className="flex items-start gap-4">
                  <div className="text-secondary group-hover:scale-110 transition-transform">
                    <FileText className="h-10 w-10" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-semibold text-primary mb-2 group-hover:text-secondary transition-colors">
                      {t("home.services.cases.title")}
                    </h3>
                    <p className="text-muted-foreground font-sans">
                      {t("home.services.cases.text")}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-primary mb-4">
              {t("home.contact.title")}
            </h2>
            <p className="text-lg text-muted-foreground font-sans">
              {t("home.contact.subtitle")}
            </p>
          </div>

          <Card className="p-10 shadow-elegant">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-secondary/10 text-secondary mb-4">
                  <Phone className="h-6 w-6" />
                </div>
                <h3 className="font-serif font-semibold text-primary mb-2">
                  {t("home.contact.phone")}
                </h3>
                <p className="text-muted-foreground font-sans">+216 XX XXXXX X</p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-secondary/10 text-secondary mb-4">
                  <Mail className="h-6 w-6" />
                </div>
                <h3 className="font-serif font-semibold text-primary mb-2">
                  {t("home.contact.email")}
                </h3>
                <p className="text-muted-foreground font-sans">contact@onat.tn</p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-secondary/10 text-secondary mb-4">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="font-serif font-semibold text-primary mb-2">
                  {t("home.contact.address")}
                </h3>
                <p className="text-muted-foreground font-sans">Tunis, Tunisie</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="gradient-primary text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Scale className="h-8 w-8 text-secondary" />
                <span className="text-xl font-serif font-bold">ONAT</span>
              </div>
              <p className="text-white/80 font-sans text-sm">
                {t("home.footer.about")}
              </p>
            </div>

            <div>
              <h4 className="font-serif font-semibold mb-4">
                {t("home.footer.links")}
              </h4>
              <ul className="space-y-2 text-sm font-sans">
                <li>
                  <a
                    href="#"
                    className="text-white/80 hover:text-secondary transition-colors"
                  >
                    {t("home.footer.aboutLink")}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/80 hover:text-secondary transition-colors"
                  >
                    {t("home.footer.news")}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/80 hover:text-secondary transition-colors"
                  >
                    {t("home.footer.publications")}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/80 hover:text-secondary transition-colors"
                  >
                    {t("home.footer.contact")}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif font-semibold mb-4">
                {t("home.footer.legal")}
              </h4>
              <ul className="space-y-2 text-sm font-sans">
                <li>
                  <a
                    href="#"
                    className="text-white/80 hover:text-secondary transition-colors"
                  >
                    {t("home.footer.terms")}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/80 hover:text-secondary transition-colors"
                  >
                    {t("home.footer.privacy")}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/80 hover:text-secondary transition-colors"
                  >
                    {t("home.footer.mentions")}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-sm text-white/60 font-sans">
            <p>
              {t("home.footer.copyright", {
                year: currentYear,
              })}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
