import { Link } from "@tanstack/react-router";
import { MapPin, Phone, Mail } from "lucide-react";
import logo from "@/assets/daphbrio-logo.jpeg";

export function SiteFooter() {
  return (
    <footer className="bg-[var(--slate-deep)] text-slate-200 mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid gap-12 lg:grid-cols-4">
        <div>
          <img
            src={logo}
            alt="Daph Brio Cabling and Trading Project logo"
            className="h-14 w-auto rounded-sm object-cover"
          />
          <p className="mt-4 text-sm text-slate-400 leading-relaxed">
            100% black-owned IT infrastructure and industrial cabling firm. Reg: 2019/309218/07.
          </p>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.18em] text-slate-400">Navigate</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-[var(--safety)]">About</Link></li>
            <li><Link to="/services" className="hover:text-[var(--safety)]">Services</Link></li>
            <li><Link to="/gallery" className="hover:text-[var(--safety)]">Projects</Link></li>
            <li><Link to="/insights" className="hover:text-[var(--safety)]">Insights</Link></li>
            <li><Link to="/contact" className="hover:text-[var(--safety)]">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.18em] text-slate-400">Capabilities</h4>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            <li>IT Networking Cables — CAT6A / UTP</li>
            <li>Fibre Optic Splicing & Termination</li>
            <li>Cable Trays, Trunking, OBO</li>
            <li>CCTV & Security Systems</li>
            <li>LV / MV / HV Electrical</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.18em] text-slate-400">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-2.5"><MapPin className="h-4 w-4 mt-0.5 text-[var(--safety)] shrink-0" /> 3210 Block B, New Eersterus, Hammanskraal, 0400</li>
            <li className="flex gap-2.5"><Phone className="h-4 w-4 mt-0.5 text-[var(--safety)] shrink-0" /> 067 060 4608 / 060 469 3694</li>
            <li className="flex gap-2.5"><Mail className="h-4 w-4 mt-0.5 text-[var(--safety)] shrink-0" /> daphney@daphbrio.co.za</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 text-xs text-slate-500 flex flex-col sm:flex-row gap-2 justify-between">
          <p>© {new Date().getFullYear()} Daph Brio Cabling Trading and Projects (PTY) LTD. All rights reserved.</p>
          <p>OHS Act compliant • Honesty • Integrity • Trust</p>
        </div>
      </div>
    </footer>
  );
}
