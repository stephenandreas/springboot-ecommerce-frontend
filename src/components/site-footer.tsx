import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-12 bg-muted/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <p className="font-semibold">SpringCommerce</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Marketplace multi-penjual yang ditenagai Spring Boot.
          </p>
        </div>
        <FooterCol title="Belanja" links={[["Semua Produk", "/"], ["Kategori", "/"], ["Keranjang", "/cart"]]} />
        <FooterCol title="Penjual" links={[["Jadi Penjual", "/seller"], ["Dashboard", "/seller"]]} />
        <FooterCol title="Akun" links={[["Masuk", "/login"], ["Daftar", "/register"], ["Pesanan", "/orders"]]} />
      </div>
      <div className="py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} SpringCommerce
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="text-sm font-medium">{title}</p>
      <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link href={href} className="hover:text-foreground">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
