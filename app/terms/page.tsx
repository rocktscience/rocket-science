'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from '@/app/providers/TranslationProvider';
import LanguageSelector from '@/components/LanguageSelector';
import Logo from '@/components/icons/Logo';

export default function TermsPage() {
  const { t, locale } = useTranslations();

  const termsContent = locale === 'es' ? {
    sections: [
      {
        title: "A. Contenido del Cliente",
        subsections: [
          {
            subtitle: "1. Definición:",
            content: `Se entenderá como "Contenido del Cliente" cualquier grabación sonora, audiovisual, ilustración, metadato, carátula, material gráfico y promocional que sea propiedad o esté bajo el control legal del Cliente, ya sea directamente o mediante sus afiliadas, empresas adquiridas o con las que haya fusionado, en cualquier momento durante la vigencia del presente Acuerdo.`
          },
          {
            subtitle: "2. Entrega:",
            content: `El Cliente deberá enviar su Contenido siguiendo las instrucciones y especificaciones técnicas vigentes proporcionadas por Rocket Science. Todo material deberá cumplir con los requisitos técnicos especificados, incluyendo calidad profesional y metadatos precisos. El Cliente será responsable de incluir los avisos de derechos de autor aplicables.

El Cliente es el único responsable de enviar el Contenido correctamente y con todos los elementos requeridos dentro del plazo establecido. Rocket Science no será responsable de ningún contenido mal entregado o incompleto.

Requisitos Técnicos Mínimos:
• Audio: Archivos WAV o FLAC, 16-bit/44.1kHz mínimo
• Artwork: 3000x3000 píxeles, formato JPG o PNG, RGB
• Metadatos: Completos y precisos según estándares de la industria`
          },
          {
            subtitle: "3. Almacenamiento:",
            content: `El Cliente reconoce que es el único responsable de almacenar su Contenido en sus propios sistemas. Rocket Science no está obligada a conservar copias ni a proporcionar al Cliente archivos previamente entregados.`
          }
        ]
      },
      {
        title: "B. Edición Musical",
        content: `Este Acuerdo no transfiere derechos editoriales a Rocket Science. Las regalías editoriales deberán ser pagadas directamente a los compositores por las Sociedades de Gestión Colectiva (PRO) correspondientes (por ejemplo, BMI, ASCAP), sin intermediación de Rocket Science.`
      },
      {
        title: "C. Propiedad Intelectual y Garantías",
        content: `El Cliente declara y garantiza que:

• Posee todos los derechos necesarios sobre el Contenido proporcionado.
• Ha obtenido las autorizaciones, licencias o renuncias necesarias de cualquier tercero involucrado.
• El Contenido no infringe derechos de propiedad intelectual, privacidad, publicidad, personalidad ni otros derechos de terceros.
• El Contenido no viola ninguna ley o regulación aplicable.
• Tiene capacidad legal para otorgar los derechos aquí descritos.

El Cliente se compromete a no entregar material no autorizado, falsificado o que haya sido obtenido sin el debido consentimiento. Rocket Science quedará libre de toda responsabilidad en caso de reclamos relacionados con el Contenido, y el Cliente acuerda indemnizar a Rocket Science por cualquier daño o perjuicio que resulte del incumplimiento de estas garantías.

Rocket Science no será responsable por acciones de terceros distribuidores fuera de su control directo, incluyendo pero no limitado a rechazos de contenido, retrasos en publicación, o errores en los servicios de terceros.

Licencias Otorgadas:

El Cliente otorga a Rocket Science una licencia no exclusiva, mundial y libre de regalías para:

• Usar, reproducir y distribuir el Contenido a través de canales digitales
• Usar el nombre del artista, ilustraciones, títulos de obras y demás elementos asociados, exclusivamente para fines de promoción, marketing y distribución
• Crear clips promocionales de hasta 30 segundos
• Proporcionar el Contenido a terceros distribuidores y plataformas digitales`
      },
      {
        title: "D. Proceso de Distribución",
        subsections: [
          {
            subtitle: "1. Lanzamiento y Aprobación:",
            content: `Al enviar contenido a Rocket Science, el Cliente confirma que dicho lanzamiento ha sido aprobado internamente y está listo para distribución comercial. El Cliente acepta seguir las directrices proporcionadas para evitar demoras o rechazos por parte de los socios de distribución.

Una vez recibido el Contenido, Rocket Science procederá a ingresarlo en los sistemas de distribución. El Cliente entiende que Rocket Science depende de la aceptación y procesamiento por parte de terceros distribuidores.`
          },
          {
            subtitle: "2. Fecha de Lanzamiento:",
            content: `El Cliente seleccionará la fecha de salida para cada lanzamiento. Rocket Science requiere un mínimo de 10 días hábiles antes de la fecha de lanzamiento deseada. Rocket Science no garantiza que todos los socios reciban o publiquen el contenido en la fecha elegida si hay demoras causadas por entregas tardías, errores de metadatos o incumplimiento de requisitos.`
          },
          {
            subtitle: "3. Diseño de Portada:",
            content: `Toda carátula entregada debe ser final, estar libre de logotipos no autorizados, direcciones web o símbolos de terceros, y cumplir con las políticas de los canales de distribución. Rocket Science podrá rechazar o solicitar la modificación de portadas que no cumplan con estas normas.`
          }
        ]
      },
      {
        title: "E. Distribución y Recaudación de Ingresos",
        content: `Rocket Science actuará como intermediario de distribución, utilizando plataformas de distribución autorizadas para hacer disponible el Contenido del Cliente en todos los canales relevantes, incluyendo pero no limitado a plataformas digitales, transmisiones en vivo y servicios interactivos.

Rocket Science se compromete a:

• Codificar el contenido en los formatos requeridos.
• Entregar el contenido a los socios aprobados.
• Gestionar y consolidar los ingresos generados por dicho contenido.
• Transferir al Cliente las cantidades correspondientes, descontando cualquier tarifa aplicable y sujeto a los mínimos de pago establecidos por el sistema.

Rocket Science no garantiza:

• Aceptación del contenido por parte de terceros
• Tiempos específicos de publicación en cada plataforma
• Disponibilidad continua en todas las plataformas

El Cliente entiende que cada plataforma tiene sus propias políticas y puede rechazar o remover contenido a su discreción.`
      },
      {
        title: "F. Actividad Fraudulenta y Cumplimiento",
        content: `El Cliente se compromete a no participar (ni permitir que terceros participen) en prácticas fraudulentas como el uso de bots, clics falsos, transmisiones automatizadas, compras simuladas u otras acciones que tengan como objetivo manipular artificialmente los ingresos o estadísticas del contenido.

Rocket Science se reserva el derecho de:

• Retener ingresos sospechosos de haber sido generados mediante tales prácticas
• Suspender o cancelar el acceso a los servicios si se determina una violación
• Reportar actividades sospechosas a las autoridades correspondientes
• Solicitar documentación adicional para verificar la legitimidad de streams o ventas`
      },
      {
        title: "G. Limitación de Responsabilidad",
        content: `EN LA MÁXIMA MEDIDA PERMITIDA POR LA LEY, ROCKET SCIENCE NO SERÁ RESPONSABLE POR:

• Pérdidas de ingresos o ganancias
• Daños indirectos, incidentales, especiales o consecuenciales
• Pérdida de datos o interrupción del negocio

La responsabilidad máxima de Rocket Science bajo estos términos no excederá los fees cobrados al Cliente en los últimos 12 meses.`
      },
      {
        title: "H. Derechos Reservados",
        content: `Rocket Science se reserva el derecho de rechazar o solicitar la remoción de cualquier contenido que:

• Viole políticas de terceros distribuidores
• Pueda generar responsabilidad legal
• Contenga material fraudulento o engañoso
• No cumpla con las especificaciones técnicas requeridas
• Contenga contenido ofensivo, difamatorio o inapropiado`
      },
      {
        title: "I. Política de Copyright/DMCA",
        content: `Si Rocket Science recibe una notificación válida de infracción de copyright respecto al Contenido del Cliente, Rocket Science podrá:

• Remover inmediatamente el contenido infractor
• Notificar al Cliente de la reclamación
• Proporcionar la información del Cliente al reclamante si es requerido legalmente

Para reportar infracciones: copyright@rocketscience.com`
      },
      {
        title: "J. Terminación",
        content: `Estos términos permanecerán vigentes mientras exista una relación comercial entre las partes. Cualquiera de las partes puede terminar el envío de contenido con 30 días de aviso previo. En caso de violación material de estos términos, Rocket Science puede terminar inmediatamente.

Efectos de la terminación:

• El Contenido permanecerá en las plataformas hasta que sea removido
• Las obligaciones de pago por ingresos generados continuarán
• Las cláusulas de indemnización y limitación de responsabilidad sobrevivirán`
      },
      {
        title: "K. Fuerza Mayor",
        content: `Ninguna de las partes será responsable por retrasos o incumplimientos causados por circunstancias fuera de su control razonable, incluyendo pero no limitado a: desastres naturales, pandemias, actos de gobierno, fallas de sistemas de terceros, o interrupciones de internet.`
      },
      {
        title: "L. Jurisdicción y Ley Aplicable",
        content: `Este Acuerdo se regirá por las leyes del Estado de Florida, Estados Unidos. Las partes acuerdan que cualquier disputa será resuelta exclusivamente en los tribunales ubicados en el Condado de Miami-Dade, Florida.`
      },
      {
        title: "M. Modificaciones al Acuerdo",
        content: `Rocket Science puede modificar estos términos con 30 días de notificación previa. El uso continuado del servicio después de las modificaciones constituye aceptación de los nuevos términos.`
      },
      {
        title: "N. Manejo de Información",
        content: `La información del lanzamiento (metadatos, audio y portada) será utilizada únicamente para fines de distribución digital. No se compartirá con terceros excepto lo necesario para publicar el contenido en las plataformas digitales.`
      },
      {
        title: "O. Disposiciones Generales",
        content: `1. Divisibilidad: Si cualquier disposición es declarada inválida, las demás permanecerán en pleno vigor.

2. Acuerdo Completo: Estos términos, junto con el acuerdo de distribución principal, constituyen el acuerdo completo entre las partes.

3. No Renuncia: La falta de ejercicio de cualquier derecho no constituye una renuncia al mismo.

4. Supervivencia: Las obligaciones de confidencialidad, indemnización, limitación de responsabilidad y propiedad intelectual sobrevivirán a la terminación.

5. Notificaciones: Todas las comunicaciones deberán ser por escrito a: legal@rocketscience.com`
      }
    ]
  } : {
    sections: [
      {
        title: "A. Client Content",
        subsections: [
          {
            subtitle: "1. Definition:",
            content: `"Client Content" shall mean any sound recording, audiovisual recording, artwork, metadata, cover art, graphic and promotional material that is owned or legally controlled by the Client, whether directly or through its affiliates, acquired companies or companies with which it has merged, at any time during the term of this Agreement.`
          },
          {
            subtitle: "2. Delivery:",
            content: `Client shall submit their Content following the current instructions and technical specifications provided by Rocket Science. All material must meet the specified technical requirements, including professional quality and accurate metadata. Client shall be responsible for including applicable copyright notices.

Client is solely responsible for submitting Content correctly and with all required elements within the established timeframe. Rocket Science shall not be responsible for any incorrectly delivered or incomplete content.

Minimum Technical Requirements:
• Audio: WAV or FLAC files, 16-bit/44.1kHz minimum
• Artwork: 3000x3000 pixels, JPG or PNG format, RGB
• Metadata: Complete and accurate according to industry standards`
          },
          {
            subtitle: "3. Storage:",
            content: `Client acknowledges that they are solely responsible for storing their Content on their own systems. Rocket Science is not obligated to retain copies or provide Client with previously delivered files.`
          }
        ]
      },
      {
        title: "B. Music Publishing",
        content: `This Agreement does not transfer publishing rights to Rocket Science. Publishing royalties must be paid directly to composers by the corresponding Collective Management Organizations (PROs) (e.g., BMI, ASCAP), without Rocket Science intermediation.`
      },
      {
        title: "C. Intellectual Property and Warranties",
        content: `Client represents and warrants that:

• They possess all necessary rights to the Content provided.
• They have obtained necessary authorizations, licenses or waivers from any third parties involved.
• The Content does not infringe intellectual property, privacy, publicity, personality or other third-party rights.
• The Content does not violate any applicable law or regulation.
• They have legal capacity to grant the rights described herein.

Client agrees not to deliver unauthorized, counterfeit material or material obtained without proper consent. Rocket Science shall be held harmless from any claims related to the Content, and Client agrees to indemnify Rocket Science for any damages resulting from breach of these warranties.

Rocket Science shall not be responsible for actions of third-party distributors outside its direct control, including but not limited to content rejections, publication delays, or errors in third-party services.

Licenses Granted:

Client grants Rocket Science a non-exclusive, worldwide, royalty-free license to:

• Use, reproduce and distribute the Content through digital channels
• Use the artist name, artwork, work titles and other associated elements, exclusively for promotion, marketing and distribution purposes
• Create promotional clips of up to 30 seconds
• Provide the Content to third-party distributors and digital platforms`
      },
      {
        title: "D. Distribution Process",
        subsections: [
          {
            subtitle: "1. Release and Approval:",
            content: `By submitting content to Rocket Science, Client confirms that such release has been internally approved and is ready for commercial distribution. Client agrees to follow the guidelines provided to avoid delays or rejections by distribution partners.

Once Content is received, Rocket Science will proceed to enter it into distribution systems. Client understands that Rocket Science depends on acceptance and processing by third-party distributors.`
          },
          {
            subtitle: "2. Release Date:",
            content: `Client shall select the release date for each release. Rocket Science requires a minimum of 10 business days before the desired release date. Rocket Science does not guarantee that all partners will receive or publish content on the chosen date if there are delays caused by late deliveries, metadata errors or non-compliance with requirements.`
          },
          {
            subtitle: "3. Cover Design:",
            content: `All cover art delivered must be final, free of unauthorized logos, web addresses or third-party symbols, and comply with distribution channel policies. Rocket Science may reject or request modification of covers that do not meet these standards.`
          }
        ]
      },
      {
        title: "E. Distribution and Revenue Collection",
        content: `Rocket Science will act as a distribution intermediary, using authorized distribution platforms to make Client Content available on all relevant channels, including but not limited to digital platforms, live streams and interactive services.

Rocket Science commits to:

• Encode content in required formats.
• Deliver content to approved partners.
• Manage and consolidate revenue generated by said content.
• Transfer corresponding amounts to Client, deducting any applicable fees and subject to system-established payment minimums.

Rocket Science does not guarantee:

• Content acceptance by third parties
• Specific publication times on each platform
• Continuous availability on all platforms

Client understands that each platform has its own policies and may reject or remove content at its discretion.`
      },
      {
        title: "F. Fraudulent Activity and Compliance",
        content: `Client agrees not to participate (or allow third parties to participate) in fraudulent practices such as the use of bots, fake clicks, automated streams, simulated purchases or other actions aimed at artificially manipulating content revenue or statistics.

Rocket Science reserves the right to:

• Withhold revenue suspected of being generated through such practices
• Suspend or cancel service access if a violation is determined
• Report suspicious activities to appropriate authorities
• Request additional documentation to verify legitimacy of streams or sales`
      },
      {
        title: "G. Limitation of Liability",
        content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, ROCKET SCIENCE SHALL NOT BE LIABLE FOR:

• Loss of revenue or profits
• Indirect, incidental, special or consequential damages
• Data loss or business interruption

Rocket Science's maximum liability under these terms shall not exceed the fees charged to Client in the last 12 months.`
      },
      {
        title: "H. Reserved Rights",
        content: `Rocket Science reserves the right to reject or request removal of any content that:

• Violates third-party distributor policies
• May generate legal liability
• Contains fraudulent or misleading material
• Does not meet required technical specifications
• Contains offensive, defamatory or inappropriate content`
      },
      {
        title: "I. Copyright/DMCA Policy",
        content: `If Rocket Science receives a valid copyright infringement notification regarding Client Content, Rocket Science may:

• Immediately remove the infringing content
• Notify Client of the claim
• Provide Client information to claimant if legally required

To report infringements: copyright@rocketscience.com`
      },
      {
        title: "J. Termination",
        content: `These terms shall remain in effect while a commercial relationship exists between the parties. Either party may terminate content submission with 30 days prior notice. In case of material breach of these terms, Rocket Science may terminate immediately.

Effects of termination:

• Content will remain on platforms until removed
• Payment obligations for generated revenue will continue
• Indemnification and limitation of liability clauses survive`
      },
      {
        title: "K. Force Majeure",
        content: `Neither party shall be responsible for delays or non-performance caused by circumstances beyond their reasonable control, including but not limited to: natural disasters, pandemics, acts of government, third-party system failures, or internet interruptions.`
      },
      {
        title: "L. Jurisdiction and Applicable Law",
        content: `This Agreement shall be governed by the laws of the State of Florida, United States. The parties agree that any dispute shall be resolved exclusively in the courts located in Miami-Dade County, Florida.`
      },
      {
        title: "M. Agreement Modifications",
        content: `Rocket Science may modify these terms with 30 days prior notice. Continued use of the service after modifications constitutes acceptance of the new terms.`
      },
      {
        title: "N. Information Handling",
        content: `Release information (metadata, audio and cover art) will be used solely for digital distribution purposes. It will not be shared with third parties except as necessary to publish content on digital platforms.`
      },
      {
        title: "O. General Provisions",
        content: `1. Severability: If any provision is declared invalid, the others shall remain in full force.

2. Entire Agreement: These terms, together with the main distribution agreement, constitute the entire agreement between the parties.

3. No Waiver: Failure to exercise any right does not constitute a waiver thereof.

4. Survival: Confidentiality, indemnification, limitation of liability and intellectual property obligations survive termination.

5. Notices: All communications must be in writing to: legal@rocketscience.com`
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {t.nav.back}
            </Link>
            <Link href="/" className="flex items-center">
              <Logo className="h-8 w-auto" />
            </Link>
            <LanguageSelector />
          </div>
        </div>
      </nav>

      {/* Content */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl mb-2">
              <span className="bg-gradient-to-b from-gray-600 to-black bg-clip-text text-transparent">
                {t.terms.title}
              </span>
            </h1>
            <p className="text-xl font-medium text-gray-800 mb-4">
              {t.terms.subtitle}
            </p>
            <p className="text-sm text-gray-600">
              {t.terms.lastUpdated}: {locale === 'es' ? '1 agosto 2025' : 'August 1, 2025'}
            </p>
          </div>

          <div className="prose prose-gray max-w-none">
            {termsContent.sections.map((section, idx) => (
              <div key={idx} className="mb-8">
                <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                
                {section.content && (
                  <div className="whitespace-pre-line text-gray-700">
                    {section.content}
                  </div>
                )}
                
                {section.subsections && section.subsections.map((sub, subIdx) => (
                  <div key={subIdx} className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">{sub.subtitle}</h3>
                    <div className="whitespace-pre-line text-gray-700">
                      {sub.content}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center font-medium">
              {t.terms.acceptanceText}
            </p>
          </div>

          <div className="mt-8 text-center text-sm text-gray-600">
            <p className="font-semibold">ROCKET SCIENCE LLC</p>
            <p>PO Box 451793</p>
            <p>Fort Lauderdale, FL 33345</p>
            <p>786.620.0220</p>
          </div>
        </div>
      </section>
    </div>
  );
}