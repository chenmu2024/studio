import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/i18n-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(lang);
  return {
    title: `${dictionary.footerPrivacyPolicy} | ${dictionary.siteName}`,
    description: `Politique de confidentialité de ${dictionary.siteName}.`,
  };
}

export default async function PrivacyPolicyPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(lang);

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">{dictionary.footerPrivacyPolicy}</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none dark:prose-invert">
          <p>Dernière mise à jour : 29 Juillet 2024</p>
          <p>
            Bienvenue sur CodeBarreGenerator.com. Nous respectons votre vie privée et nous nous engageons à la protéger.
            Cette politique de confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations
            lorsque vous visitez notre site Web.
          </p>
          <h2 className="text-xl font-semibold mt-4 mb-2">Collecte d'Informations</h2>
          <p>
            Nous ne collectons aucune information personnelle identifiable lorsque vous utilisez notre générateur de code-barres.
            Les données que vous saisissez pour générer des codes-barres sont traitées localement dans votre navigateur et ne sont jamais envoyées à nos serveurs.
          </p>
          <p>
            Nous pouvons collecter des informations non personnelles identifiables concernant votre visite, telles que le type de navigateur,
            le système d'exploitation, les pages visitées et l'heure de la visite. Ces informations sont utilisées pour améliorer
            notre site Web et analyser les tendances d'utilisation. Nous utilisons des outils d'analyse standards pour cette collecte.
          </p>
          <h2 className="text-xl font-semibold mt-4 mb-2">Utilisation des Cookies</h2>
          <p>
            Notre site peut utiliser des cookies pour améliorer l'expérience utilisateur, par exemple pour mémoriser vos préférences linguistiques.
            Vous pouvez configurer votre navigateur pour refuser tous les cookies ou pour vous alerter lorsque des cookies sont envoyés.
          </p>
          <h2 className="text-xl font-semibold mt-4 mb-2">Sécurité</h2>
          <p>
            Nous prenons des mesures raisonnables pour protéger les informations que nous collectons. Cependant, aucune transmission de données
            sur Internet ou méthode de stockage électronique n'est sécurisée à 100 %.
          </p>
          <h2 className="text-xl font-semibold mt-4 mb-2">Liens Vers des Sites Tiers</h2>
          <p>
            Notre site peut contenir des liens vers d'autres sites Web. Nous ne sommes pas responsables des pratiques de confidentialité
            de ces autres sites.
          </p>
          <h2 className="text-xl font-semibold mt-4 mb-2">Modifications de cette Politique</h2>
          <p>
            Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. Nous vous notifierons de tout changement
            en publiant la nouvelle politique sur cette page.
          </p>
          <h2 className="text-xl font-semibold mt-4 mb-2">Nous Contacter</h2>
          <p>
            Si vous avez des questions concernant cette politique de confidentialité, veuillez nous contacter à [Votre Email de Contact Ici].
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
