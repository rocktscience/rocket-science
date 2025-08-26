'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from '@/app/providers/TranslationProvider';
import LanguageSelector from '@/components/LanguageSelector';
import Logo from '@/components/icons/Logo';

export default function PrivacyPage() {
  const { t, locale } = useTranslations();

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
            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl mb-4">
              <span className="bg-gradient-to-b from-gray-600 to-black bg-clip-text text-transparent">
                {t.privacy.title}
              </span>
            </h1>
            <p className="text-sm text-gray-600">
              {t.privacy.lastUpdated}: {locale === 'es' ? '1 agosto 2025' : 'August 1, 2025'}
            </p>
          </div>

          <div className="prose prose-gray max-w-none space-y-8">
            <div>
              <p className="text-lg text-gray-700">
                {t.privacy.sections.intro}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">{t.privacy.sections.dataCollection}</h2>
              <p className="text-gray-700 mb-4">
                {locale === 'es' 
                  ? 'Recopilamos información que usted nos proporciona directamente, como:'
                  : 'We collect information you provide directly to us, such as:'}
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>{locale === 'es' ? 'Información de la cuenta (nombre, correo electrónico, contraseña)' : 'Account information (name, email, password)'}</li>
                <li>{locale === 'es' ? 'Información del perfil (nombre de artista, biografía, enlaces sociales)' : 'Profile information (artist name, bio, social links)'}</li>
                <li>{locale === 'es' ? 'Contenido que sube (música, artwork, metadatos)' : 'Content you upload (music, artwork, metadata)'}</li>
                <li>{locale === 'es' ? 'Comunicaciones con nosotros' : 'Communications with us'}</li>
                <li>{locale === 'es' ? 'Información de pago y facturación' : 'Payment and billing information'}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">{t.privacy.sections.dataUse}</h2>
              <p className="text-gray-700 mb-4">
                {locale === 'es' 
                  ? 'Usamos la información recopilada para:'
                  : 'We use the information we collect to:'}
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>{locale === 'es' ? 'Proporcionar, mantener y mejorar nuestros servicios' : 'Provide, maintain and improve our services'}</li>
                <li>{locale === 'es' ? 'Procesar y completar transacciones' : 'Process and complete transactions'}</li>
                <li>{locale === 'es' ? 'Enviar información técnica y actualizaciones del servicio' : 'Send technical information and service updates'}</li>
                <li>{locale === 'es' ? 'Responder a sus comentarios y preguntas' : 'Respond to your comments and questions'}</li>
                <li>{locale === 'es' ? 'Monitorear y analizar tendencias y uso' : 'Monitor and analyze trends and usage'}</li>
                <li>{locale === 'es' ? 'Detectar, investigar y prevenir actividades fraudulentas' : 'Detect, investigate and prevent fraudulent activities'}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">{t.privacy.sections.dataSharing}</h2>
              <p className="text-gray-700 mb-4">
                {locale === 'es' 
                  ? 'Podemos compartir su información en las siguientes situaciones:'
                  : 'We may share your information in the following situations:'}
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>{locale === 'es' ? 'Con plataformas de distribución para publicar su contenido' : 'With distribution platforms to publish your content'}</li>
                <li>{locale === 'es' ? 'Con proveedores de servicios que nos ayudan a operar nuestro negocio' : 'With service providers who help us operate our business'}</li>
                <li>{locale === 'es' ? 'Para cumplir con obligaciones legales' : 'To comply with legal obligations'}</li>
                <li>{locale === 'es' ? 'Con su consentimiento o bajo su dirección' : 'With your consent or at your direction'}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">{t.privacy.sections.dataSecurity}</h2>
              <p className="text-gray-700">
                {locale === 'es' 
                  ? 'Tomamos medidas razonables para ayudar a proteger la información sobre usted de pérdida, robo, mal uso y acceso no autorizado, divulgación, alteración y destrucción. Sin embargo, ningún sistema es 100% seguro y no podemos garantizar la seguridad absoluta de su información.'
                  : 'We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction. However, no system is 100% secure and we cannot guarantee the absolute security of your information.'}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">{t.privacy.sections.yourRights}</h2>
              <p className="text-gray-700 mb-4">
                {locale === 'es' 
                  ? 'Usted tiene ciertos derechos con respecto a su información personal:'
                  : 'You have certain rights regarding your personal information:'}
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>{locale === 'es' ? 'Acceder y recibir una copia de su información personal' : 'Access and receive a copy of your personal information'}</li>
                <li>{locale === 'es' ? 'Actualizar o corregir información inexacta' : 'Update or correct inaccurate information'}</li>
                <li>{locale === 'es' ? 'Solicitar la eliminación de su información personal' : 'Request deletion of your personal information'}</li>
                <li>{locale === 'es' ? 'Oponerse o restringir ciertos procesamientos' : 'Object to or restrict certain processing'}</li>
                <li>{locale === 'es' ? 'Portabilidad de datos' : 'Data portability'}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">{t.privacy.sections.contact}</h2>
              <p className="text-gray-700">
                {locale === 'es' 
                  ? 'Si tiene preguntas sobre esta Política de Privacidad, contáctenos en:'
                  : 'If you have questions about this Privacy Policy, please contact us at:'}
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold">Rocket Science LLC</p>
                <p>Email: privacy@rocketscience.com</p>
                <p>PO Box 451793</p>
                <p>Fort Lauderdale, FL 33345</p>
              </div>
            </div>

            <div className="mt-12 p-6 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                {locale === 'es' 
                  ? 'Nos reservamos el derecho de modificar esta Política de Privacidad en cualquier momento. Si realizamos cambios materiales, se lo notificaremos por correo electrónico o mediante un aviso en este sitio web antes de que el cambio entre en vigencia.'
                  : 'We reserve the right to modify this Privacy Policy at any time. If we make material changes, we will notify you by email or by a notice on this website prior to the change becoming effective.'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}