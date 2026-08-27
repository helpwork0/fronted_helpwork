import { Instagram, Linkedin, Youtube, Mail, Phone } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Logo } from './Logo'
import { FOOTER_COLUMNS, SITE } from '@/config/site.config'
import { Reveal } from '@/components/motion/Reveal'

export function Footer() {
  return (
    <footer className="bg-brand-800 text-white">
      <Container className="py-14">
        <Reveal>
          <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)_1.2fr]">
            <div>
              <Logo light />
              <p className="mt-4 max-w-[260px] text-sm leading-relaxed text-brand-100/80">
                Conectamos talento con oportunidades reales, para que ambos logren algo increíble.
              </p>
              <div className="mt-5 flex gap-3">
                {[Instagram, Linkedin, Youtube].map((Icon, i) => (
                  <a key={i} href="#" aria-label="Red social"
                     className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition hover:-translate-y-0.5 hover:bg-white/20">
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {FOOTER_COLUMNS.map(col => (
              <div key={col.titulo}>
                <h4 className="mb-4 text-sm font-bold">{col.titulo}</h4>
                <ul className="space-y-2.5">
                  {col.links.map(l => (
                    <li key={l}>
                      <a href="#" className="text-sm text-brand-100/75 transition hover:text-white">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h4 className="mb-4 text-sm font-bold">Contacto</h4>
              <ul className="space-y-2.5 text-sm text-brand-100/75">
                <li className="flex items-center gap-2"><Mail size={14} /> {SITE.email}</li>
                <li className="flex items-center gap-2"><Phone size={14} /> {SITE.telefono}</li>
              </ul>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-6 sm:flex-row">
          <p className="text-xs text-brand-100/60">© {new Date().getFullYear()} {SITE.nombre}. Todos los derechos reservados.</p>
          <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs">🇪🇨 {SITE.pais}</span>
        </div>
      </Container>
    </footer>
  )
}
