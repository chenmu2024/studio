
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/i18n-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(lang);
  return {
    title: dictionary.pageTitleTermsOfService,
    description: dictionary.metaDescriptionTermsOfService,
  };
}

export default async function TermsOfServicePage({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(lang);
  const lastUpdatedDate = dictionary.privacyPolicyLastUpdated.replace('{date}', new Intl.DateTimeFormat(lang, { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(2025, 4, 16))); // Using privacyPolicyLastUpdated key as it shares the same format
  const siteName = "CodeBarreGenerator.com";
  const contactEmail = "info@codebarregenerator.com";


  if (lang === 'fr') {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">{dictionary.footerTermsOfService}</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none dark:prose-invert">
            <p>{lastUpdatedDate}</p>
            <p>
              Bienvenue sur {siteName} (le "Site"). En accédant ou en utilisant le Site et son générateur de code barre, vous acceptez d'être lié par ces Conditions d'Utilisation ("Conditions").
              Si vous n'êtes pas d'accord avec une partie de ces conditions, vous ne pouvez pas accéder au Site.
            </p>
            <h2 className="text-xl font-semibold mt-4 mb-2">Utilisation du Service</h2>
            <p>
              {siteName} fournit un outil en ligne gratuit pour générer divers types de codes-barres (le "Service" ou "générateur de code barre").
              Le Service est fourni "tel quel" et "tel que disponible" sans aucune garantie. Notre objectif est de fournir un generateur code barre fiable et facile à utiliser.
            </p>
            <p>
              Vous acceptez d'utiliser le Service uniquement à des fins légales et conformément à toutes les lois applicables.
              Vous êtes seul responsable des données que vous saisissez pour générer des codes-barres (par exemple, les données pour un QR Code ou un Code 128) et de l'utilisation que vous faites des codes-barres générés par notre code barre generator.
              {siteName} n'assume aucune responsabilité quant à l'exactitude des données encodées ou à l'adéquation d'un type de code-barres particulier à votre usage spécifique.
            </p>
            <h2 className="text-xl font-semibold mt-4 mb-2">Propriété Intellectuelle</h2>
            <p>
              Le Site et son contenu original (à l'exclusion des codes-barres générés par les utilisateurs), ses caractéristiques et ses fonctionnalités, y compris le design et le code du générateur de code barre, sont et resteront la propriété exclusive de {siteName} et de ses concédants de licence.
              Le Service est protégé par le droit d'auteur, les marques commerciales et d'autres lois. Les codes-barres que vous générez sont les vôtres ; nous ne revendiquons aucun droit sur les images de codes-barres que vous créez avec notre generateur de code barre gratuit.
            </p>
             <h2 className="text-xl font-semibold mt-4 mb-2">Comportement de l'Utilisateur</h2>
            <p>
              Vous acceptez de ne pas utiliser le service de générateur code barre pour :
            </p>
            <ul className="list-disc pl-5">
              <li>Encoder des informations illégales, nuisibles, menaçantes, abusives, harcelantes, diffamatoires, vulgaires, obscènes, portant atteinte à la vie privée d'autrui, haineuses ou répréhensibles sur le plan racial, ethnique ou autre.</li>
              <li>Usurper l'identité d'une personne ou d'une entité, ou déclarer faussement ou déformer votre affiliation avec une personne ou une entité.</li>
              <li>Interférer avec ou perturber le Service ou les serveurs ou réseaux connectés au Service.</li>
            </ul>
            <h2 className="text-xl font-semibold mt-4 mb-2">Limitation de Responsabilité</h2>
            <p>
              En aucun cas {siteName}, ni ses administrateurs, employés, partenaires, agents, fournisseurs ou affiliés, ne pourront être tenus responsables
              des dommages indirects, accessoires, spéciaux, consécutifs ou punitifs, y compris, sans limitation, la perte de profits, de données, d'utilisation,
              de clientèle ou d'autres pertes incorporelles, résultant de (i) votre accès ou utilisation ou incapacité d'accéder ou d'utiliser le Service de générateur de code barre ;
              (ii) toute conduite ou contenu d'un tiers sur le Service ; (iii) tout contenu (codes-barres) obtenu à partir du Service ; et (iv) l'accès non autorisé,
              l'utilisation ou l'altération de vos transmissions ou de votre contenu, que ce soit sur la base d'une garantie, d'un contrat, d'un délit (y compris la négligence)
              ou de toute autre théorie juridique, que nous ayons été informés ou non de la possibilité de tels dommages, même si un recours énoncé dans les présentes s'avère avoir échoué dans son objectif essentiel.
              Notre responsabilité maximale pour toute réclamation découlant de votre utilisation de notre generateur code barre sera limitée au montant que vous nous avez payé, le cas échéant, pour l'utilisation du service.
            </p>
            <h2 className="text-xl font-semibold mt-4 mb-2">Modifications</h2>
            <p>
              Nous nous réservons le droit, à notre seule discrétion, de modifier ou de remplacer ces Conditions à tout moment.
              Si une révision est importante, nous essaierons de fournir un préavis d'au moins 30 jours avant l'entrée en vigueur des nouvelles conditions.
              Ce qui constitue un changement important sera déterminé à notre seule discrétion. En continuant d'accéder ou d'utiliser notre générateur de code barre après l'entrée en vigueur de ces révisions, vous acceptez d'être lié par les conditions révisées.
            </p>
            <h2 className="text-xl font-semibold mt-4 mb-2">Résiliation</h2>
            <p>
              Nous pouvons résilier ou suspendre l'accès à notre Service immédiatement, sans préavis ni responsabilité, pour quelque raison que ce soit, y compris, sans limitation, si vous ne respectez pas les Conditions.
            </p>
            <h2 className="text-xl font-semibold mt-4 mb-2">Droit Applicable</h2>
            <p>
             Ces Conditions seront régies et interprétées conformément aux lois de la juridiction dans laquelle {siteName} opère, sans égard à ses dispositions relatives aux conflits de lois.
            </p>
            <h2 className="text-xl font-semibold mt-4 mb-2">Nous Contacter</h2>
            <p>
              Si vous avez des questions concernant ces Conditions d'utilisation de notre générateur de code barre, veuillez nous contacter à {contactEmail}.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Portuguese version
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">{dictionary.footerTermsOfService}</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none dark:prose-invert">
          <p>{lastUpdatedDate}</p>
          <p>
            Bem-vindo ao {siteName} (o "Site"). Ao aceder ou utilizar o Site e o seu gerador de código de barras, concorda em ficar vinculado por estes Termos de Serviço ("Termos").
            Se não concordar com qualquer parte destes termos, não poderá aceder ao Site.
          </p>
          <h2 className="text-xl font-semibold mt-4 mb-2">Utilização do Serviço</h2>
          <p>
            {siteName} fornece uma ferramenta online gratuita para gerar vários tipos de códigos de barras (o "Serviço" ou "gerador de código de barras").
            O Serviço é fornecido "tal como está" e "conforme disponível" sem qualquer garantia. O nosso objetivo é fornecer um gerador de codigo de barras fiável e fácil de usar.
          </p>
          <p>
            Concorda em utilizar o Serviço apenas para fins legais e de acordo com todas as leis aplicáveis.
            É o único responsável pelos dados que insere para gerar códigos de barras (por exemplo, dados para um QR Code ou um Code 128) e pela utilização que faz dos códigos de barras gerados pelo nosso código de barras gerador.
            {siteName} não assume qualquer responsabilidade pela exatidão dos dados codificados ou pela adequação de um tipo de código de barras específico para o seu uso particular.
          </p>
          <h2 className="text-xl font-semibold mt-4 mb-2">Propriedade Intelectual</h2>
          <p>
            O Site e o seu conteúdo original (excluindo os códigos de barras gerados pelos utilizadores), características e funcionalidades, incluindo o design e o código do gerador de código de barras, são e continuarão a ser propriedade exclusiva de {siteName} e dos seus licenciadores.
            O Serviço é protegido por direitos de autor, marcas registadas e outras leis. Os códigos de barras que gera são seus; não reivindicamos quaisquer direitos sobre as imagens de códigos de barras que cria com o nosso gerador de codigo de barras gratuito.
          </p>
          <h2 className="text-xl font-semibold mt-4 mb-2">Conduta do Utilizador</h2>
          <p>
            Concorda em não utilizar o serviço de gerador código de barras para:
          </p>
          <ul className="list-disc pl-5">
            <li>Codificar informações ilegais, prejudiciais, ameaçadoras, abusivas, assediantes, difamatórias, vulgares, obscenas, que invadam a privacidade de outrem, odiosas ou racialmente, etnicamente ou de outra forma censuráveis.</li>
            <li>Fazer-se passar por qualquer pessoa ou entidade, ou declarar falsamente ou deturpar a sua afiliação com uma pessoa ou entidade.</li>
            <li>Interferir ou interromper o Serviço ou servidores ou redes conectadas ao Serviço.</li>
          </ul>
          <h2 className="text-xl font-semibold mt-4 mb-2">Limitação de Responsabilidade</h2>
          <p>
            Em nenhuma circunstância {siteName}, nem os seus diretores, funcionários, parceiros, agentes, fornecedores ou afiliados, serão responsáveis
            por quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos, incluindo, sem limitação, perda de lucros, dados, uso,
            goodwill ou outras perdas intangíveis, resultantes de (i) o seu acesso ou uso ou incapacidade de aceder ou usar o Serviço de gerador de código de barras;
            (ii) qualquer conduta ou conteúdo de terceiros no Serviço; (iii) qualquer conteúdo (códigos de barras) obtido do Serviço; e (iv) acesso não autorizado,
            uso ou alteração das suas transmissões ou conteúdo, seja com base em garantia, contrato, delito (incluindo negligência)
            ou qualquer outra teoria legal, tenhamos ou não sido informados da possibilidade de tais danos, e mesmo que uma solução aqui estabelecida se revele ter falhado no seu propósito essencial.
            A nossa responsabilidade máxima por qualquer reclamação decorrente da sua utilização do nosso gerador de codigo de barras será limitada ao montante que nos pagou, se aplicável, pela utilização do serviço.
          </p>
          <h2 className="text-xl font-semibold mt-4 mb-2">Modificações</h2>
          <p>
            Reservamo-nos o direito, a nosso exclusivo critério, de modificar ou substituir estes Termos a qualquer momento.
            Se uma revisão for material, tentaremos fornecer um aviso prévio de pelo menos 30 dias antes de quaisquer novos termos entrarem em vigor.
            O que constitui uma alteração material será determinado a nosso exclusivo critério. Ao continuar a aceder ou a utilizar o nosso gerador de código de barras após essas revisões entrarem em vigor, concorda em ficar vinculado pelos termos revistos.
          </p>
          <h2 className="text-xl font-semibold mt-4 mb-2">Rescisão</h2>
          <p>
            Podemos rescindir ou suspender o acesso ao nosso Serviço imediatamente, sem aviso prévio ou responsabilidade, por qualquer motivo, incluindo, sem limitação, se violar os Termos.
          </p>
          <h2 className="text-xl font-semibold mt-4 mb-2">Lei Aplicável</h2>
          <p>
            Estes Termos serão regidos e interpretados de acordo com as leis da jurisdição em que {siteName} opera, sem consideração pelas suas disposições sobre conflitos de leis.
          </p>
          <h2 className="text-xl font-semibold mt-4 mb-2">Contacte-nos</h2>
          <p>
            Se tiver alguma dúvida sobre estes Termos de Serviço do nosso gerador de código de barras, por favor contacte-nos em {contactEmail}.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

