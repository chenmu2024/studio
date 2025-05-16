import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/i18n-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(lang);
  return {
    title: `${dictionary.footerTermsOfService} | ${dictionary.siteName}`,
    description: `Conditions d'utilisation de ${dictionary.siteName}.`,
  };
}

export default async function TermsOfServicePage({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(lang);

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">{dictionary.footerTermsOfService}</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none dark:prose-invert">
          <p>Dernière mise à jour : 29 Juillet 2024</p>
          <p>
            Bienvenue sur CodeBarreGenerator.com (le "Site"). En accédant ou en utilisant le Site, vous acceptez d'être lié par ces Conditions d'Utilisation ("Conditions").
            Si vous n'êtes pas d'accord avec une partie de ces conditions, vous ne pouvez pas accéder au Site.
          </p>
          <h2 className="text-xl font-semibold mt-4 mb-2">Utilisation du Service</h2>
          <p>
            CodeBarreGenerator.com fournit un outil en ligne gratuit pour générer divers types de codes-barres (le "Service").
            Le Service est fourni "tel quel" et "tel que disponible" sans aucune garantie.
          </p>
          <p>
            Vous acceptez d'utiliser le Service uniquement à des fins légales et conformément à toutes les lois applicables.
            Vous êtes seul responsable des données que vous saisissez pour générer des codes-barres et de l'utilisation que vous faites des codes-barres générés.
          </p>
          <h2 className="text-xl font-semibold mt-4 mb-2">Propriété Intellectuelle</h2>
          <p>
            Le Site et son contenu original, ses caractéristiques et ses fonctionnalités sont et resteront la propriété exclusive de CodeBarreGenerator.com et de ses concédants de licence.
            Le Service est protégé par le droit d'auteur, les marques commerciales et d'autres lois.
          </p>
          <h2 className="text-xl font-semibold mt-4 mb-2">Limitation de Responsabilité</h2>
          <p>
            En aucun cas CodeBarreGenerator.com, ni ses administrateurs, employés, partenaires, agents, fournisseurs ou affiliés, ne pourront être tenus responsables
            des dommages indirects, accessoires, spéciaux, consécutifs ou punitifs, y compris, sans limitation, la perte de profits, de données, d'utilisation,
            de clientèle ou d'autres pertes incorporelles, résultant de (i) votre accès ou utilisation ou incapacité d'accéder ou d'utiliser le Service ;
            (ii) toute conduite ou contenu d'un tiers sur le Service ; (iii) tout contenu obtenu à partir du Service ; et (iv) l'accès non autorisé,
            l'utilisation ou l'altération de vos transmissions ou de votre contenu, que ce soit sur la base d'une garantie, d'un contrat, d'un délit (y compris la négligence)
            ou de toute autre théorie juridique, que nous ayons été informés ou non de la possibilité de tels dommages.
          </p>
          <h2 className="text-xl font-semibold mt-4 mb-2">Modifications</h2>
          <p>
            Nous nous réservons le droit, à notre seule discrétion, de modifier ou de remplacer ces Conditions à tout moment.
            Si une révision est importante, nous essaierons de fournir un préavis d'au moins 30 jours avant l'entrée en vigueur des nouvelles conditions.
            Ce qui constitue un changement important sera déterminé à notre seule discrétion.
          </p>
          <h2 className="text-xl font-semibold mt-4 mb-2">Nous Contacter</h2>
          <p>
            Si vous avez des questions concernant ces Conditions, veuillez nous contacter à [Votre Email de Contact Ici].
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
