
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/i18n-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(lang);
  return {
    title: dictionary.pageTitlePrivacyPolicy,
    description: dictionary.metaDescriptionPrivacyPolicy,
  };
}

export default async function PrivacyPolicyPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(lang);
  const lastUpdatedDate = dictionary.privacyPolicyLastUpdated.replace('{date}', new Intl.DateTimeFormat(lang, { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(2025, 4, 16)));
  const siteName = "CodeBarreGenerator.com";
  const contactEmail = "info@codebarregenerator.com";

  if (lang === 'fr') {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">{dictionary.footerPrivacyPolicy}</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none dark:prose-invert">
            <p>{lastUpdatedDate}</p>
            <p>
              Bienvenue sur {siteName}. Nous respectons votre vie privée et nous nous engageons à la protéger.
              Cette politique de confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations
              lorsque vous visitez notre site Web et utilisez notre générateur de code barre.
            </p>
            <h2 className="text-xl font-semibold mt-4 mb-2">Collecte d'Informations</h2>
            <p>
              Nous ne collectons aucune information personnelle identifiable lorsque vous utilisez notre {dictionary.siteName.toLowerCase()}.
              Les données que vous saisissez pour générer des codes-barres (par exemple, le texte pour un QR code ou les chiffres pour un code EAN) sont traitées exclusivement localement dans votre navigateur.
              Ces données ne sont jamais envoyées, stockées ou traitées sur nos serveurs. L'ensemble du processus de génération de code barre se déroule côté client.
            </p>
            <p>
              Nous pouvons collecter des informations non personnelles identifiables concernant votre visite, telles que le type de navigateur,
              le système d'exploitation, les pages visitées (par exemple, si vous utilisez notre generateur de code barre pour différents types comme Code 128 ou EAN-13),
              et l'heure de la visite. Ces informations sont utilisées pour améliorer notre site Web et analyser les tendances d'utilisation. Nous utilisons des outils d'analyse standards pour cette collecte.
            </p>
            <h2 className="text-xl font-semibold mt-4 mb-2">Utilisation des Cookies</h2>
            <p>
              {siteName} peut utiliser des cookies pour améliorer l'expérience utilisateur. Par exemple, des cookies peuvent être utilisés pour mémoriser vos préférences linguistiques ou les derniers paramètres utilisés sur notre code barre generator.
              Un cookie est un petit fichier de données stocké sur votre appareil. Vous pouvez configurer votre navigateur pour refuser tous les cookies ou pour vous alerter lorsque des cookies sont envoyés.
              Si vous désactivez les cookies, certaines fonctionnalités de notre générateur code barre pourraient ne pas fonctionner de manière optimale.
            </p>
            <h2 className="text-xl font-semibold mt-4 mb-2">Sécurité des Données</h2>
            <p>
              Étant donné que les données que vous saisissez dans le générateur de code barre ne sont pas transmises à nos serveurs, le principal aspect de sécurité concerne la protection de votre propre appareil.
              Nous prenons des mesures raisonnables pour protéger les informations non personnelles que nous collectons (données d'analyse). Cependant, aucune transmission de données
              sur Internet ou méthode de stockage électronique n'est sécurisée à 100 %.
            </p>
            <h2 className="text-xl font-semibold mt-4 mb-2">Liens Vers des Sites Tiers</h2>
            <p>
              Notre site peut contenir des liens vers d'autres sites Web. Nous ne sommes pas responsables des pratiques de confidentialité
              de ces autres sites. Nous vous encourageons à lire les politiques de confidentialité de chaque site que vous visitez.
            </p>
            <h2 className="text-xl font-semibold mt-4 mb-2">Vie Privée des Enfants</h2>
            <p>
              Notre service de générateur code barre ne s'adresse pas aux personnes de moins de 13 ans. Nous ne collectons pas sciemment
              d'informations personnelles identifiables auprès d'enfants de moins de 13 ans.
            </p>
            <h2 className="text-xl font-semibold mt-4 mb-2">Modifications de cette Politique</h2>
            <p>
              Nous pouvons mettre à jour cette politique de confidentialité de temps à autre pour refléter, par exemple, des changements dans nos pratiques ou pour d'autres raisons opérationnelles, légales ou réglementaires.
              Nous vous notifierons de tout changement en publiant la nouvelle politique sur cette page et en mettant à jour la date de "Dernière mise à jour" en haut de cette politique.
              Nous vous conseillons de consulter régulièrement cette politique de confidentialité pour prendre connaissance de toute modification.
            </p>
            <h2 className="text-xl font-semibold mt-4 mb-2">Nous Contacter</h2>
            <p>
              Si vous avez des questions concernant cette politique de confidentialité ou nos pratiques en matière de données pour le {dictionary.siteName.toLowerCase()}, veuillez nous contacter à {contactEmail}.
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
          <CardTitle className="text-2xl">{dictionary.footerPrivacyPolicy}</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none dark:prose-invert">
          <p>{lastUpdatedDate}</p>
          <p>
            Bem-vindo ao {siteName}. Respeitamos a sua privacidade e estamos empenhados em protegê-la.
            Esta política de privacidade explica como recolhemos, usamos, divulgamos e protegemos as suas informações
            quando visita o nosso website e utiliza o nosso gerador de código de barras.
          </p>
          <h2 className="text-xl font-semibold mt-4 mb-2">Recolha de Informações</h2>
          <p>
            Não recolhemos qualquer informação pessoal identificável quando utiliza o nosso {dictionary.siteName.toLowerCase()}.
            Os dados que insere para gerar códigos de barras (por exemplo, o texto para um QR code ou os números para um código EAN) são processados exclusivamente localmente no seu navegador.
            Estes dados nunca são enviados, armazenados ou processados nos nossos servidores. Todo o processo do gerador de codigo de barras ocorre do lado do cliente.
          </p>
          <p>
            Podemos recolher informações não pessoais identificáveis sobre a sua visita, como o tipo de navegador,
            o sistema operativo, as páginas visitadas (por exemplo, se utiliza o nosso gerador de codigo de barras gratuito para diferentes tipos como Code 128 ou EAN-13),
            e a hora da visita. Estas informações são usadas para melhorar o nosso website e analisar tendências de utilização. Usamos ferramentas de análise padrão para esta recolha.
          </p>
          <h2 className="text-xl font-semibold mt-4 mb-2">Uso de Cookies</h2>
          <p>
            {siteName} pode usar cookies para melhorar a experiência do utilizador. Por exemplo, cookies podem ser usados para lembrar as suas preferências de idioma ou as últimas configurações usadas no nosso código de barras gerador.
            Um cookie é um pequeno ficheiro de dados armazenado no seu dispositivo. Pode configurar o seu navegador para recusar todos los cookies ou para o alertar quando cookies estão a ser enviados.
            Se desativar os cookies, algumas funcionalidades do nosso gerador código de barras poderão não funcionar de forma otimizada.
          </p>
          <h2 className="text-xl font-semibold mt-4 mb-2">Segurança dos Dados</h2>
          <p>
            Dado que os dados que insere no gerador de código de barras não são transmitidos para os nossos servidores, o principal aspeto de segurança diz respeito à proteção do seu próprio dispositivo.
            Tomamos medidas razoáveis para proteger as informações não pessoais que recolhemos (dados de análise). No entanto, nenhuma transmissão de dados
            pela Internet ou método de armazenamento eletrónico é 100% seguro.
          </p>
          <h2 className="text-xl font-semibold mt-4 mb-2">Links para Sites de Terceiros</h2>
          <p>
            O nosso site pode conter links para outros websites. Não somos responsáveis pelas práticas de privacidade
            desses outros sites. Incentivamo-lo a ler as políticas de privacidade de cada site que visita.
          </p>
          <h2 className="text-xl font-semibold mt-4 mb-2">Privacidade Infantil</h2>
          <p>
            O nosso serviço de gerador código de barras não se destina a menores de 13 anos. Não recolhemos intencionalmente
            informações pessoalmente identificáveis de crianças menores de 13 anos.
          </p>
          <h2 className="text-xl font-semibold mt-4 mb-2">Alterações a esta Política</h2>
          <p>
            Podemos atualizar esta política de privacidade periodicamente para refletir, por exemplo, alterações nas nossas práticas ou por outras razões operacionais, legais ou regulamentares.
            Notificá-lo-emos de quaisquer alterações publicando a nova política nesta página e atualizando a data de "Última atualização" no topo desta política.
            Aconselhamo-lo a rever esta política de privacidade regularmente para quaisquer alterações.
          </p>
          <h2 className="text-xl font-semibold mt-4 mb-2">Contacte-nos</h2>
          <p>
            Se tiver alguma dúvida sobre esta política de privacidade ou as nossas práticas de dados para o {dictionary.siteName.toLowerCase()}, por favor contacte-nos em {contactEmail}.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

